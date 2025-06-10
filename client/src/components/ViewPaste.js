import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { getPaste, verifyPaste, deletePaste, isValidPasteId, sanitizeForDisplay } from '../api/pasteApi';
import { sanitizePlainText } from '../utils/sanitizer';
import hljs from 'highlight.js';
// Ensure App.css is imported in App.js or here if specific styles are needed

const ViewPaste = () => {
    const { id } = useParams();
    const { theme } = useContext(ThemeContext);
    const [paste, setPaste] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');
    const [deleteToken, setDeleteToken] = useState('');
    const codeRef = useRef(null);

    useEffect(() => {
        const fetchPaste = async () => {
            if (!isValidPasteId(id)) {
                setError('Invalid paste ID format');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError('');
            
            try {
                const data = await getPaste(id);

                if (data.hasPassword) {
                    setShowPasswordPrompt(true);
                    setPaste({ id: data.id, language: data.language, expiresAt: data.expiresAt, hasPassword: true });
                } else {
                    setPaste(data);
                    setShowPasswordPrompt(false);
                }
            } catch (err) {
                setError(err.message);
                setPaste(null);
            } finally {
                setIsLoading(false);
            }
        };

        // Check if we have a delete token for this paste
        const storedDeleteToken = localStorage.getItem(`deleteToken_${id}`);
        if (storedDeleteToken) {
            setDeleteToken(storedDeleteToken);
        }

        fetchPaste();
    }, [id]);

    useEffect(() => {
        // Update highlight.js theme based on current theme
        const lightTheme = document.getElementById('hljs-light-theme');
        const darkTheme = document.getElementById('hljs-dark-theme');
        
        if (theme === 'dark') {
            if (lightTheme) lightTheme.disabled = true;
            if (darkTheme) darkTheme.disabled = false;
        } else {
            if (lightTheme) lightTheme.disabled = false;
            if (darkTheme) darkTheme.disabled = true;
        }
        
        // Re-highlight code if paste content exists
        if (paste && paste.content && codeRef.current) {
            const lang = paste.language && hljs.getLanguage(paste.language) ? paste.language : 'plaintext';
            // Sanitize content before highlighting
            const sanitizedContent = sanitizePlainText(paste.content);
            const highlighted = hljs.highlight(sanitizedContent, { language: lang }).value;
            // Sanitize the highlighted HTML before setting innerHTML
            codeRef.current.innerHTML = sanitizeForDisplay(highlighted);
        }
    }, [theme, paste]);

    useEffect(() => {
        if (paste && paste.content && codeRef.current) {
            // Check if hljs has the language, otherwise default to plaintext
            const lang = paste.language && hljs.getLanguage(paste.language) ? paste.language : 'plaintext';
            // Sanitize content before highlighting
            const sanitizedContent = sanitizePlainText(paste.content);
            const highlighted = hljs.highlight(sanitizedContent, { language: lang }).value;
            // Sanitize the highlighted HTML before setting innerHTML
            codeRef.current.innerHTML = sanitizeForDisplay(highlighted);
        }
    }, [paste]);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setIsPasswordIncorrect(false);
        setError('');

        try {
            const data = await verifyPaste(id, password);
            setPaste(data);
            setShowPasswordPrompt(false);
        } catch (err) {
            if (err.message.includes('Incorrect password')) {
                setIsPasswordIncorrect(true);
            } else {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePaste = async () => {
        if (!deleteToken) {
            alert('No delete token available for this paste');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this paste? This action cannot be undone.')) {
            return;
        }

        try {
            await deletePaste(id, deleteToken);
            localStorage.removeItem(`deleteToken_${id}`);
            alert('Paste deleted successfully');
            window.location.href = '/';
        } catch (err) {
            alert('Failed to delete paste: ' + err.message);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess('URL Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, (err) => {
            setCopySuccess('Failed to copy!');
            console.error('Could not copy text: ', err);
        });
    };

    const getFormattedExpiration = () => {
        if (!paste || !paste.expiresAt) return null;
        const expirationDate = new Date(paste.expiresAt);
        return `Expires on: ${expirationDate.toLocaleString()}`;
    };

    if (isLoading && !paste) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '60px 40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                <h3 style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Loading your paste...</h3>
                <div style={{ 
                    width: '60px', 
                    height: '4px', 
                    background: 'var(--border-color)', 
                    borderRadius: '2px', 
                    margin: '20px auto',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: '30px',
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--button-primary), var(--accent-color))',
                        borderRadius: '2px',
                        animation: 'loading 1.5s ease-in-out infinite'
                    }}></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '60px 40px' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>😵</div>
                <h3 style={{ color: 'var(--error-color)', marginBottom: '10px' }}>Oops! Something went wrong</h3>
                <p className="error-message" style={{ textAlign: 'center', border: 'none', background: 'none', padding: '0' }}>{error}</p>
                <button className="button button-secondary" onClick={() => window.location.reload()} style={{ marginTop: '20px' }}>
                    🔄 Try Again
                </button>
            </div>
        );
    }

    if (showPasswordPrompt && paste && paste.hasPassword) {
        return (
            <div className="container password-prompt">
                <h2>🔐 Password Protected Paste</h2>
                <p>🛡️ This paste requires a password to view its contents.</p>
                <form onSubmit={handlePasswordSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="🔑 Enter password"
                        autoFocus
                    />
                    <button type="submit" className="button" disabled={isLoading}>
                        {isLoading ? '🔓 Unlocking...' : '🔓 Unlock Paste'}
                    </button>
                </form>
                {isPasswordIncorrect && <p className="error-message">❌ Incorrect password. Please try again.</p>}
            </div>
        );
    }

    if (!paste || !paste.content) { // Should not happen if logic is correct, but as a fallback
        return <div className="container"><p>Paste content is not available.</p></div>;
    }

    const currentUrl = window.location.href;
    // Sanitize paste content for safe operations
    const safePasteContent = paste && paste.content ? sanitizePlainText(paste.content) : '';

    return (
        <div className="container paste-view">
            <div className="info-bar">
                <span>🎨 {paste.language || 'Plain Text'}</span>
                {paste.expiresAt && <span>⏰ {getFormattedExpiration()}</span>}
            </div>
            <div className="paste-content">
                <pre><code ref={codeRef} className={`hljs ${paste.language}`}></code></pre>
            </div>
            <div className="actions-bar">
                <button className="button" onClick={() => copyToClipboard(currentUrl)}>
                    📋 Copy URL
                </button>
                <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(safePasteContent)}`} download={`${paste.id}_raw.txt`} className="button button-secondary" style={{textDecoration: 'none', display: 'inline-flex', alignItems: 'center'}}>
                    📄 Download Raw
                </a>
                <button className="button button-secondary" onClick={() => copyToClipboard(safePasteContent)}>
                    📝 Copy Code
                </button>
                {deleteToken && (
                    <button className="button" style={{background: 'var(--error-color)', marginLeft: '10px'}} onClick={handleDeletePaste}>
                        🗑️ Delete Paste
                    </button>
                )}
            </div>
            {copySuccess && <p className="success-message">✅ {copySuccess}</p>}
        </div>
    );
};

export default ViewPaste;
