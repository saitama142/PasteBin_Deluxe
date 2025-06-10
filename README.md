# PasteBin Deluxe

A secure, modern, and feature-rich pastebin application built with React and Node.js. Perfect for self-hosting and sharing code snippets, text, or any content with advanced security features and a beautiful user interface.

## Features

### Core Functionality
- **Easy Paste Creation**: Simple interface for pasting text or code
- **Syntax Highlighting**: Support for 20+ programming languages with automatic detection
- **Expiration Control**: Set pastes to expire after 1 hour, 1 day, 1 week, or never
- **Password Protection**: Secure your pastes with encrypted passwords
- **Unique URLs**: Each paste gets a cryptographically secure shareable URL
- **Delete Management**: Secure paste deletion with delete tokens
- **Theme Support**: Beautiful dark and light themes with smooth transitions

### Security Features
- **XSS Protection**: Multi-layer content sanitization with DOMPurify
- **Rate Limiting**: IP-based request throttling to prevent abuse
- **Input Validation**: Comprehensive server-side validation
- **Secure Headers**: Full security header implementation
- **Password Encryption**: bcrypt hashing for password protection
- **IP Privacy**: User IP addresses are hashed for privacy
- **Container Security**: Hardened Docker setup with security constraints

### User Experience
- **Modern Design**: Clean, Apple-inspired interface with glassmorphism effects
- **Responsive**: Optimized for desktop, tablet, and mobile devices
- **Fast Loading**: Optimized performance with efficient caching
- **Error Handling**: User-friendly error messages and recovery options
- **Copy Functions**: Easy URL copying and content downloading

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Docker (optional, for containerized deployment)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/saitama142/PasteBin_Deluxe.git
   cd PasteBin_Deluxe
   ```

2. **Backend setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

3. **Frontend setup**
   ```bash
   cd ../client
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Docker Deployment

For production deployment with Docker:

```bash
# Copy environment configuration
cp .env.production .env

# Edit .env with your production settings
nano .env

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## Configuration

### Environment Variables

Create a `.env` file in the server directory:

```bash
# Server Configuration
PORT=3001
NODE_ENV=production

# Security
JWT_SECRET=your-super-secret-jwt-key-here
BCRYPT_ROUNDS=12

# Database
DATABASE_PATH=./data/pastes.db

# Rate Limiting
MAX_PASTES_PER_IP=10
RATE_LIMIT_WINDOW=15

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Production Configuration

For production deployment, update the `.env` file with:

```bash
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com
```

## Self-Hosting Guide

### Using Your Own Domain

1. **DNS Configuration**
   ```bash
   # Add an A record in your DNS provider:
   Type: A
   Name: @ (or subdomain like 'paste')
   Value: [Your server IP]
   ```

2. **SSL Certificate**
   The Docker setup includes automatic SSL certificate generation via Let's Encrypt.

3. **Deploy**
   ```bash
   # Clone on your server
   git clone https://github.com/saitama142/PasteBin_Deluxe.git
   cd PasteBin_Deluxe
   
   # Configure environment
   cp .env.production .env
   nano .env  # Edit with your domain
   
   # Deploy
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Security

### Built-in Security Features

- **Content Sanitization**: All user input is sanitized to prevent XSS attacks
- **Rate Limiting**: Prevents abuse with configurable IP-based limits
- **Secure Headers**: Comprehensive security headers via Helmet.js
- **Password Protection**: bcrypt encryption for sensitive pastes
- **Input Validation**: Server-side validation for all inputs
- **Container Security**: Hardened Docker containers with minimal privileges

### Security Best Practices

1. **Change default secrets** in environment variables
2. **Use HTTPS** in production (included in Docker setup)
3. **Regular updates** of dependencies
4. **Monitor logs** for suspicious activity
5. **Backup data** regularly

## API Documentation

### Create Paste
```http
POST /api/pastes
Content-Type: application/json

{
  "content": "Your paste content",
  "language": "javascript",
  "password": "optional-password",
  "expiration": "1day"
}
```

### Get Paste
```http
GET /api/pastes/:id
```

### Verify Password-Protected Paste
```http
POST /api/pastes/:id/verify
Content-Type: application/json

{
  "password": "paste-password"
}
```

## Development

### Project Structure
```
PasteBin_Deluxe/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── utils/          # Utilities (including sanitizer)
│   │   └── api/            # API integration
│   └── public/
├── server/                 # Node.js backend
│   ├── server.js           # Main server file
│   └── data/               # SQLite database (created automatically)
├── docker-compose.yml      # Development Docker setup
├── docker-compose.prod.yml # Production Docker setup
└── deploy.sh              # Deployment script
```

### Testing

Run the security test suite:
```bash
./test-security.sh
```

Run the deployment verification:
```bash
./verify-deployment.sh
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, questions, or feature requests, please open an issue on GitHub.

---

**Happy self-hosting!** This application is designed to be easy to deploy and maintain while providing enterprise-level security and features.

### Container Security
- **Non-root Users**: All containers run as non-privileged users
- **Read-only Filesystems**: Containers use read-only root filesystems
- **Capability Dropping**: Minimal Linux capabilities
- **Security Options**: no-new-privileges and other security constraints
- **Resource Limits**: Memory and CPU limits to prevent DoS
- **Health Checks**: Comprehensive health monitoring
- **Network Isolation**: Services run in isolated Docker networks

### Infrastructure Security
- **SSL/TLS**: Automatic SSL certificates via Let's Encrypt
- **Reverse Proxy**: Nginx with security headers and rate limiting
- **Log Management**: Structured logging with rotation
- **Monitoring**: Health checks and status monitoring
- **Backup Strategy**: Automated data backup solutions

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Docker & Docker Compose (for containerized deployment)

### Local Development

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd pastebin-app
   ```

2. **Backend setup:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

3. **Frontend setup:**
   ```bash
   cd ../client
   npm install
   npm start
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🐳 Docker Deployment

### Development Environment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment

1. **Prepare environment:**
   ```bash
   cp .env.production .env
   # Edit .env with your production values
   ```

2. **Deploy using the secure script:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Manual deployment:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Production Configuration

#### Required Environment Variables
```bash
JWT_SECRET=your-super-secure-random-secret-key
DOMAIN=yourapp.com
ACME_EMAIL=admin@yourapp.com
ALLOWED_ORIGINS=https://yourapp.com,https://www.yourapp.com
```

#### Optional Configuration
```bash
BCRYPT_ROUNDS=12                    # Password hashing strength
MAX_PASTE_SIZE=1048576             # Max paste size (1MB)
MAX_PASTES_PER_IP=10               # Rate limit per IP
RATE_LIMIT_WINDOW=15               # Rate limit window (minutes)
FRONTEND_PORT=80                   # Frontend port
```

## 🛡️ Security Recommendations

### Server Hardening
1. **Firewall Configuration:**
   ```bash
   # Allow only necessary ports
   ufw allow 22    # SSH
   ufw allow 80    # HTTP
   ufw allow 443   # HTTPS
   ufw enable
   ```

2. **Automatic Updates:**
   ```bash
   # Ubuntu/Debian
   apt install unattended-upgrades
   dpkg-reconfigure unattended-upgrades
   ```

3. **Fail2Ban Setup:**
   ```bash
   apt install fail2ban
   systemctl enable fail2ban
   ```

4. **Log Monitoring:**
   ```bash
   # Monitor application logs
   docker-compose -f docker-compose.prod.yml logs -f

   # Monitor system logs
   tail -f /var/log/syslog
   ```

### Application Security
1. **Regular Updates:**
   ```bash
   # Update Docker images
   docker-compose -f docker-compose.prod.yml pull
   docker-compose -f docker-compose.prod.yml up -d

   # Update application dependencies
   npm audit fix
   ```

2. **Backup Strategy:**
   ```bash
   # Backup data directory
   tar -czf backup_$(date +%Y%m%d).tar.gz data/

   # Automated backup script
   cat > backup.sh << 'EOF'
   #!/bin/bash
   docker-compose -f docker-compose.prod.yml exec backend \
     sqlite3 /app/data/pastes.db ".backup /app/data/backup_$(date +%Y%m%d).db"
   EOF
   ```

3. **Monitoring:**
   ```bash
   # Check container health
   docker-compose -f docker-compose.prod.yml ps

   # Monitor resource usage
   docker stats

   # Check SSL certificate
   curl -I https://yourapp.com
   ```

## 📊 Database Schema

```sql
CREATE TABLE pastes (
    id TEXT PRIMARY KEY,              -- Unique paste identifier
    content TEXT NOT NULL,            -- Paste content (encrypted at rest)
    language TEXT DEFAULT 'plaintext', -- Syntax highlighting language
    password TEXT,                    -- bcrypt hashed password
    expiresAt INTEGER,               -- Expiration timestamp
    createdAt INTEGER,               -- Creation timestamp
    ipHash TEXT,                     -- Hashed creator IP
    userAgent TEXT,                  -- Sanitized user agent
    accessCount INTEGER DEFAULT 0,   -- Access counter
    lastAccessed INTEGER,            -- Last access timestamp
    isDeleted INTEGER DEFAULT 0,     -- Soft deletion flag
    deleteToken TEXT                 -- Secure deletion token
);

-- Indexes for performance
CREATE INDEX idx_expires ON pastes(expiresAt);
CREATE INDEX idx_created ON pastes(createdAt);
CREATE INDEX idx_ip ON pastes(ipHash);
```

## 🔌 API Endpoints

### Create Paste
```http
POST /api/pastes
Content-Type: application/json

{
  "content": "Your code here",
  "language": "javascript",
  "password": "optional_password",
  "expiration": "1day"
}
```

### Get Paste
```http
GET /api/pastes/:id
```

### Verify Password
```http
POST /api/pastes/:id/verify
Content-Type: application/json

{
  "password": "your_password"
}
```

### Delete Paste
```http
DELETE /api/pastes/:id
Content-Type: application/json

{
  "deleteToken": "your_delete_token"
}
```

### Health Check
```http
GET /api/health
```

## 🔧 Maintenance

### Regular Tasks
1. **Log Rotation**: Automated via Docker logging configuration
2. **Database Cleanup**: Automatic cleanup of expired pastes
3. **SSL Renewal**: Automatic via Let's Encrypt and Traefik
4. **Security Updates**: Weekly review and updates
5. **Backup Verification**: Regular backup testing

### Troubleshooting
1. **Service Status**: `docker-compose -f docker-compose.prod.yml ps`
2. **Logs**: `docker-compose -f docker-compose.prod.yml logs [service]`
3. **Resource Usage**: `docker stats`
4. **SSL Issues**: Check Traefik dashboard at port 8080
5. **Database Issues**: Access SQLite directly in backend container

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper tests
4. Submit a pull request with detailed description

## 🆘 Support

For issues and support:
1. Check the troubleshooting section
2. Review Docker and application logs
3. Open an issue with detailed information
4. Include system info and error messages

## 🛡️ DOMPurify Integration & XSS Protection

### Overview
The application implements comprehensive XSS protection through multi-layer DOMPurify integration, ensuring that all user-generated content is safely sanitized before storage, processing, and display.

### Implementation Details

#### 1. Centralized Sanitization Utility (`/client/src/utils/sanitizer.js`)
```javascript
// Multiple sanitization levels for different use cases
- sanitizeInput()      // Strips all HTML for storage
- sanitizeForDisplay() // Allows safe HTML for syntax highlighting  
- sanitizePlainText()  // Ultra-strict text-only sanitization
- sanitizePasteId()    // Validates and sanitizes paste IDs
```

#### 2. API Layer Protection (`/client/src/api/pasteApi.js`)
- Input sanitization before API calls
- Content validation and length limits
- Secure request headers and CORS handling
- Timeout protection and error handling

#### 3. Component-Level Security
**ViewPaste Component:**
- Sanitizes content before syntax highlighting
- Safe HTML rendering for highlighted code
- Secure copy/download operations
- Protected paste content display

**CreatePaste Component:**
- Client-side input sanitization
- Real-time content validation
- Secure form submission handling

#### 4. Security Configuration
```javascript
// Input sanitization (strips all HTML)
ALLOWED_TAGS: []
ALLOWED_ATTR: []
FORBID_SCRIPT: true
FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe']

// Display sanitization (allows safe highlighting)
ALLOWED_TAGS: ['span', 'div', 'code', 'pre', 'br']
ALLOWED_ATTR: ['class']
FORBID_ATTR: ['onclick', 'onload', 'onerror', 'style', 'href', 'src']
```

#### 5. DOMPurify Hooks
- Custom hooks for additional security
- Automatic removal of script-like content
- Event handler attribute stripping
- Protection against advanced XSS vectors

### Security Testing
```bash
# Run comprehensive security tests
./test-security.sh

# Manual testing with malicious payloads
<script>alert('XSS')</script>
<img src="x" onerror="alert('XSS')">
<div onclick="alert('XSS')">Click me</div>
```

### Verification Steps
1. Create pastes with malicious content
2. Verify no script execution occurs
3. Confirm proper syntax highlighting
4. Check that dangerous attributes are stripped
5. Validate copy/download safety

### Performance Impact
- **Minimal Overhead**: DOMPurify is highly optimized
- **Cached Configuration**: Sanitization rules are pre-configured
- **Efficient Processing**: Only sanitizes when necessary
- **No User Experience Impact**: Transparent security layer
