const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult, param } = require('express-validator');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false
}));

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200
}));

// Rate Limiting
const createPasteLimit = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.MAX_PASTES_PER_IP) || 10, // production rate limit
    message: {
        error: 'Too many pastes created from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const generalLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // production rate limit
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});

app.use(generalLimit);

// Body parsing with size limits
app.use(express.json({ 
    limit: process.env.MAX_PASTE_SIZE || '1mb',
    type: 'application/json'
}));

// Database setup with better security
const dbPath = process.env.DB_PATH || './data/pastes.db';
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true, mode: 0o750 });
}

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        process.exit(1);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Enhanced database schema with security fields
        db.run(`CREATE TABLE IF NOT EXISTS pastes (
            id TEXT PRIMARY KEY,
            content TEXT NOT NULL,
            language TEXT DEFAULT 'plaintext',
            password TEXT,
            expiresAt INTEGER,
            createdAt INTEGER,
            ipHash TEXT,
            userAgent TEXT,
            accessCount INTEGER DEFAULT 0,
            lastAccessed INTEGER,
            isDeleted INTEGER DEFAULT 0,
            deleteToken TEXT
        )`);
        
        // Create indexes for better performance
        db.run(`CREATE INDEX IF NOT EXISTS idx_expires ON pastes(expiresAt)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_created ON pastes(createdAt)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_ip ON pastes(ipHash)`);
    }
});

// Utility Functions
const hashIP = (ip) => {
    return crypto.createHash('sha256').update(ip + process.env.JWT_SECRET).digest('hex');
};

const sanitizeUserAgent = (userAgent) => {
    return userAgent ? userAgent.substring(0, 200) : '';
};

const isValidLanguage = (language) => {
    const validLanguages = [
        'plaintext', 'javascript', 'python', 'java', 'csharp', 'php', 'ruby', 
        'go', 'swift', 'kotlin', 'rust', 'sql', 'html', 'css', 'xml', 'json', 
        'markdown', 'bash', 'typescript', 'cpp', 'c'
    ];
    return validLanguages.includes(language);
};

// Validation Middleware
const validatePaste = [
    body('content')
        .isLength({ min: 1, max: parseInt(process.env.MAX_PASTE_SIZE) || 1048576 })
        .withMessage('Content must be between 1 and 1MB')
        .trim(),
    body('language')
        .optional()
        .custom(value => {
            if (value && !isValidLanguage(value)) {
                throw new Error('Invalid language specified');
            }
            return true;
        }),
    body('password')
        .optional({ nullable: true })
        .custom(value => {
            if (value !== null && value !== undefined) {
                if (typeof value !== 'string' || value.length < 1 || value.length > 128) {
                    throw new Error('Password must be between 1 and 128 characters');
                }
            }
            return true;
        }),
    body('expiration')
        .optional({ nullable: true })
        .custom(value => {
            if (value !== null && !['1hour', '1day', '1week'].includes(value)) {
                throw new Error('Invalid expiration time');
            }
            return true;
        })
        .withMessage('Invalid expiration time')
];

const validatePasteId = [
    param('id')
        .isLength({ min: 1, max: 50 })
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Invalid paste ID format')
];

// API Endpoints

// Create a new paste
app.post('/api/pastes', createPasteLimit, validatePaste, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        console.log('Request body:', req.body);
        return res.status(400).json({ 
            error: 'Validation failed', 
            details: errors.array()
        });
    }

    const { content, language = 'plaintext', password, expiration } = req.body;
    const ipHash = hashIP(req.ip);
    const userAgent = sanitizeUserAgent(req.get('User-Agent'));

    // Generate secure ID
    const id = nanoid(12); // More secure than shortid
    const deleteToken = nanoid(32); // Token for deletion
    const createdAt = Date.now();
    let expiresAt = null;

    if (expiration) {
        switch (expiration) {
            case '1hour': expiresAt = createdAt + 60 * 60 * 1000; break;
            case '1day': expiresAt = createdAt + 24 * 60 * 60 * 1000; break;
            case '1week': expiresAt = createdAt + 7 * 24 * 60 * 60 * 1000; break;
        }
    }

    let hashedPassword = null;
    if (password) {
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const sql = `INSERT INTO pastes (
        id, content, language, password, expiresAt, createdAt, 
        ipHash, userAgent, deleteToken
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [
        id, content, language, hashedPassword, expiresAt, 
        createdAt, ipHash, userAgent, deleteToken
    ], function(err) {
        if (err) {
            console.error('Error inserting paste', err.message);
            return res.status(500).json({ error: 'Failed to create paste' });
        }
        
        res.status(201).json({ 
            id,
            deleteToken: deleteToken,
            expiresAt: expiresAt
        });
    });
});

// Get a paste
app.get('/api/pastes/:id', validatePasteId, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid paste ID' });
    }

    const { id } = req.params;
    const ipHash = hashIP(req.ip);
    const now = Date.now();
    
    const sql = `SELECT id, content, language, password IS NOT NULL as hasPassword, 
                 expiresAt, createdAt, accessCount FROM pastes 
                 WHERE id = ? AND isDeleted = 0`;

    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Error fetching paste', err.message);
            return res.status(500).json({ error: 'Failed to retrieve paste' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Paste not found' });
        }

        if (row.expiresAt && row.expiresAt < now) {
            // Mark as deleted instead of actually deleting
            db.run(`UPDATE pastes SET isDeleted = 1 WHERE id = ?`, [id]);
            return res.status(410).json({ error: 'Paste has expired' });
        }

        // Update access statistics
        db.run(`UPDATE pastes SET accessCount = accessCount + 1, lastAccessed = ? WHERE id = ?`, 
               [now, id]);

        // If paste has password, don't return content yet
        if (row.hasPassword) {
            return res.json({ 
                id: row.id, 
                language: row.language, 
                hasPassword: true, 
                expiresAt: row.expiresAt 
            });
        }

        res.json(row);
    });
});

// Verify password and get paste content
app.post('/api/pastes/:id/verify', validatePasteId, [
    body('password').isLength({ min: 1, max: 128 }).withMessage('Password required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Password is required' });
    }

    const { id } = req.params;
    const { password } = req.body;
    const now = Date.now();

    const sql = `SELECT * FROM pastes WHERE id = ? AND isDeleted = 0`;
    db.get(sql, [id], async (err, row) => {
        if (err) {
            console.error('Error fetching paste for verification', err.message);
            return res.status(500).json({ error: 'Failed to retrieve paste' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Paste not found' });
        }

        if (row.expiresAt && row.expiresAt < now) {
            db.run(`UPDATE pastes SET isDeleted = 1 WHERE id = ?`, [id]);
            return res.status(410).json({ error: 'Paste has expired' });
        }

        try {
            const match = await bcrypt.compare(password, row.password);
            if (match) {
                // Update access statistics
                db.run(`UPDATE pastes SET accessCount = accessCount + 1, lastAccessed = ? WHERE id = ?`, 
                       [now, id]);
                
                // Exclude sensitive data from the response
                const { password: _, ipHash, userAgent, deleteToken, ...pasteData } = row;
                res.json(pasteData);
            } else {
                res.status(401).json({ error: 'Incorrect password' });
            }
        } catch (error) {
            console.error('Password verification error:', error);
            res.status(500).json({ error: 'Verification failed' });
        }
    });
});

// Delete paste endpoint (with delete token)
app.delete('/api/pastes/:id', validatePasteId, [
    body('deleteToken').isLength({ min: 1, max: 64 }).withMessage('Delete token required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Delete token is required' });
    }

    const { id } = req.params;
    const { deleteToken } = req.body;

    const sql = `UPDATE pastes SET isDeleted = 1 WHERE id = ? AND deleteToken = ? AND isDeleted = 0`;
    db.run(sql, [id, deleteToken], function(err) {
        if (err) {
            console.error('Error deleting paste', err.message);
            return res.status(500).json({ error: 'Failed to delete paste' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Paste not found or invalid delete token' });
        }
        
        res.json({ message: 'Paste deleted successfully' });
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Cleanup expired pastes (run every hour)
function cleanupExpiredPastes() {
    const now = Date.now();
    db.run(`UPDATE pastes SET isDeleted = 1 WHERE expiresAt IS NOT NULL AND expiresAt < ? AND isDeleted = 0`, 
           [now], function(err) {
        if (err) {
            console.error('Error cleaning up expired pastes:', err.message);
        } else if (this.changes > 0) {
            console.log(`Cleaned up ${this.changes} expired pastes.`);
        }
    });
}

// Schedule cleanup every hour
setInterval(cleanupExpiredPastes, 60 * 60 * 1000);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Secure server running on http://0.0.0.0:${port}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
});
