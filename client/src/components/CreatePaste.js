import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPaste } from '../api/pasteApi';
// Styles are in App.css, make sure they are loaded

const CreatePaste = () => {
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('plaintext');
    const [expiration, setExpiration] = useState('never');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Improved auto-detection with better heuristics
    useEffect(() => {
        if (content.trim().length < 10) return; // Skip very short content
        
        const lines = content.split('\n');
        const firstLine = lines[0].trim();
        const allContent = content.toLowerCase();
        
        // Python detection
        if (allContent.includes('def ') || 
            allContent.includes('import ') || 
            allContent.includes('from ') ||
            allContent.includes('print(') ||
            (firstLine.startsWith('#!') && firstLine.includes('python'))) {
            setLanguage('python');
            return;
        }
        
        // JavaScript detection
        if (allContent.includes('function ') || 
            allContent.includes('const ') || 
            allContent.includes('let ') ||
            allContent.includes('var ') ||
            allContent.includes('console.log') ||
            allContent.includes('=>') ||
            allContent.includes('require(') ||
            allContent.includes('import ')) {
            setLanguage('javascript');
            return;
        }
        
        // HTML detection
        if ((allContent.includes('<html') || allContent.includes('<!doctype')) ||
            ((allContent.includes('<div') && allContent.includes('</div>')) ||
            (allContent.includes('<p>') && allContent.includes('</p>')))) {
            setLanguage('html');
            return;
        }
        
        // CSS detection
        if (allContent.includes('{') && allContent.includes('}') && 
            (allContent.includes(':') && allContent.includes(';'))) {
            setLanguage('css');
            return;
        }
        
        // JSON detection
        if ((firstLine.startsWith('{') || firstLine.startsWith('[')) &&
            allContent.includes('"') && allContent.includes(':')) {
            setLanguage('json');
            return;
        }
        
        // Bash/Shell detection
        if (firstLine.startsWith('#!/bin/bash') || 
            firstLine.startsWith('#!/bin/sh') ||
            allContent.includes('echo ') ||
            allContent.includes('sudo ') ||
            allContent.includes('chmod ')) {
            setLanguage('bash');
            return;
        }
        
        // SQL detection
        if (allContent.includes('select ') || 
            allContent.includes('insert ') || 
            allContent.includes('update ') ||
            allContent.includes('delete ') ||
            allContent.includes('create table')) {
            setLanguage('sql');
            return;
        }
    }, [content]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Basic validation
            if (!content.trim()) {
                throw new Error('Paste content cannot be empty.');
            }

            const data = await createPaste(content, language, password, expiration);
            
            // Store delete token in localStorage for user's convenience
            if (data.deleteToken) {
                localStorage.setItem(`deleteToken_${data.id}`, data.deleteToken);
            }
            
            navigate(`/paste/${data.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const availableLanguages = [
        { value: 'plaintext', label: 'Plain Text' },
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'csharp', label: 'C#' },
        { value: 'php', label: 'PHP' },
        { value: 'ruby', label: 'Ruby' },
        { value: 'go', label: 'Go' },
        { value: 'swift', label: 'Swift' },
        { value: 'kotlin', label: 'Kotlin' },
        { value: 'rust', label: 'Rust' },
        { value: 'sql', label: 'SQL' },
        { value: 'html', label: 'HTML' },
        { value: 'css', label: 'CSS' },
        { value: 'xml', label: 'XML' },
        { value: 'json', label: 'JSON' },
        { value: 'markdown', label: 'Markdown' },
        { value: 'bash', label: 'Bash/Shell' },
    ];

    return (
        <div className="container">
            <h2>✨ Create New Paste</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="input-area"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="✍️ Paste your text or code here... 

💡 Tips:
• Use Ctrl+A to select all
• Language will be auto-detected
• Add password for privacy
• Set expiration for temporary shares"
                    rows={15}
                />
                <div className="options-panel">
                    <label>
                        🎨 Syntax Highlighting:
                        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                            {availableLanguages.map(lang => (
                                <option key={lang.value} value={lang.value}>{lang.label}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        ⏰ Expiration Time:
                        <select value={expiration} onChange={(e) => setExpiration(e.target.value)}>
                            <option value="never">♾️ Never</option>
                            <option value="1hour">⏱️ 1 Hour</option>
                            <option value="1day">📅 1 Day</option>
                            <option value="1week">🗓️ 1 Week</option>
                        </select>
                    </label>
                    <label>
                        🔐 Password (Optional):
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="🛡️ Protect your paste"
                        />
                    </label>
                </div>
                <button type="submit" className="button" disabled={isLoading}>
                    {isLoading ? '✨ Creating Magic...' : '🚀 Create Paste'}
                </button>
                {error && <p className="error-message">❌ {error}</p>}
            </form>
        </div>
    );
};

export default CreatePaste;
