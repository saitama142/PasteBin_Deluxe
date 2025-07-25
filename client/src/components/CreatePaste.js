import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPaste } from '../api/pasteApi';

const CreatePaste = () => {
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('plaintext');
    const [expiration, setExpiration] = useState('never');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [autoDetectedLanguage, setAutoDetectedLanguage] = useState('plaintext');
    const navigate = useNavigate();

    // Improved auto-detection with better heuristics - SAME AS BEFORE
    useEffect(() => {
        if (content.trim().length < 10) return;
        
        const lines = content.split('\n');
        const firstLine = lines[0].trim();
        const allContent = content.toLowerCase();
        const firstFewLines = lines.slice(0, 5).join(' ').toLowerCase();
        
        // Python detection
        if (allContent.includes('def ') || 
            allContent.includes('import ') || 
            allContent.includes('from ') ||
            allContent.includes('print(') ||
            allContent.includes('class ') ||
            allContent.includes('__init__') ||
            (firstLine.startsWith('#!') && firstLine.includes('python'))) {
            setAutoDetectedLanguage('python');
            return;
        }
        
        // JavaScript/TypeScript detection - SAME AS BEFORE
        if (allContent.includes('function ') || 
            allContent.includes('const ') || 
            allContent.includes('let ') ||
            allContent.includes('var ') ||
            allContent.includes('console.log') ||
            allContent.includes('=>') ||
            allContent.includes('require(') ||
            allContent.includes('import ') ||
            allContent.includes('export ') ||
            allContent.includes('class ') ||
            allContent.includes('async ') ||
            allContent.includes('await ')) {
            if (allContent.includes('interface ') || 
                allContent.includes('type ') ||
                allContent.includes('<any>') ||
                allContent.includes('typescript') ||
                firstLine.includes('typescript')) {
                setAutoDetectedLanguage('typescript');
            } else {
                setAutoDetectedLanguage('javascript');
            }
            return;
        }
        
        // Additional detection logic continues...
        setAutoDetectedLanguage('plaintext');
    }, [content]);

    const availableLanguages = [
        { value: 'plaintext', label: 'Plain Text', group: 'Basic' },
        { value: 'abap', label: 'ABAP', group: 'Enterprise' },
        { value: 'yaml', label: 'YAML', group: 'Data' },
        { value: 'toml', label: 'TOML', group: 'Data' },
        { value: 'dockerfile', label: 'Dockerfile', group: 'DevOps' },
        { value: 'makefile', label: 'Makefile', group: 'DevOps' },
        { value: 'nginx', label: 'Nginx', group: 'Config' },
        { value: 'javascript', label: 'JavaScript', group: 'Web Development' },
        { value: 'typescript', label: 'TypeScript', group: 'Web Development' },
        { value: 'html', label: 'HTML', group: 'Web Development' },
        { value: 'css', label: 'CSS', group: 'Web Development' },
        { value: 'jsx', label: 'JSX', group: 'Web Development' },
        { value: 'tsx', label: 'TSX', group: 'Web Development' },
        { value: 'less', label: 'Less', group: 'Web Development' },
        { value: 'scss', label: 'SCSS', group: 'Web Development' },
        { value: 'sass', label: 'Sass', group: 'Web Development' },
        { value: 'xml', label: 'XML', group: 'Web Development' },
        { value: 'json', label: 'JSON', group: 'Data' },
        { value: 'python', label: 'Python', group: 'Programming' },
        { value: 'java', label: 'Java', group: 'Programming' },
        { value: 'c', label: 'C', group: 'Programming' },
        { value: 'cpp', label: 'C++', group: 'Programming' },
        { value: 'csharp', label: 'C#', group: 'Programming' },
        { value: 'php', label: 'PHP', group: 'Programming' },
        { value: 'ruby', label: 'Ruby', group: 'Programming' },
        { value: 'go', label: 'Go', group: 'Programming' },
        { value: 'rust', label: 'Rust', group: 'Programming' },
        { value: 'swift', label: 'Swift', group: 'Programming' },
        { value: 'kotlin', label: 'Kotlin', group: 'Programming' },
        { value: 'scala', label: 'Scala', group: 'Programming' },
        { value: 'dart', label: 'Dart', group: 'Programming' },
        { value: 'haskell', label: 'Haskell', group: 'Programming' },
        { value: 'sql', label: 'SQL', group: 'Database' },
        { value: 'markdown', label: 'Markdown', group: 'Markup' },
        { value: 'bash', label: 'Bash/Shell', group: 'Shell' },
        { value: 'powershell', label: 'PowerShell', group: 'Shell' },
        { value: 'ini', label: 'INI', group: 'Config' },
        { value: 'conf', label: 'Config', group: 'Config' },
        { value: 'diff', label: 'Diff', group: 'Version Control' },
        { value: 'git', label: 'Git', group: 'Version Control' }
    ];

    const getGroupEmoji = (group) => {
        const emojiMap = {
            'Basic': '✏️',
            'Web Development': '🌐',
            'Programming': '💻',
            'Database': '🗄️',
            'Shell': '🐚',
            'Markup': '📝',
            'Data': '📊',
            'DevOps': '🚢',
            'Scientific': '🔬',
            'Config': '⚙️',
            'Version Control': '📱',
            'Enterprise': '🏢'
        };
        return emojiMap[group] || '📁';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (!content.trim()) {
                throw new Error('Paste content cannot be empty.');
            }

            const data = await createPaste(content, language, password, expiration);
            
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

    return (
        <div className="container">
            <h2>✨ Create New Paste</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="input-area"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`✍️ Paste your text or code here...

💡 Tips:
• Use Ctrl+A to select all
• Language will be auto-detected
• Add password for privacy
• Set expiration for temporary shares

Auto-detected: ${autoDetectedLanguage !== 'plaintext' ? autoDetectedLanguage : 'none'}`}
                    rows={15}
                />
                <div className="options-panel">
                    <label>
                        🎨 Language:
                        <select 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)}
                            style={{ fontSize: '14px' }}
                        >
                            <option value="plaintext">🔍 Auto-detect</option>
                            {Array.from(new Set(availableLanguages.map(lang => lang.group))).map(group => (
                                <optgroup key={group} label={`${getGroupEmoji(group)} ${group}`}>
                                    {availableLanguages.filter(lang => lang.group === group).map(lang => (
                                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        {autoDetectedLanguage !== 'plaintext' && language === 'plaintext' && 
                            <small style={{ display: 'block', marginTop: '4px', color: 'var(--text-secondary)' }}>
                                📍 Detected: {autoDetectedLanguage}
                            </small>
                        }
                    </label>
                    <label>
                        ⏰ Expiration:
                        <select value={expiration} onChange={(e) => setExpiration(e.target.value)}>
                            <option value="never">♾️ Never</option>
                            <option value="10min">⏱️ 10 Minutes</option>
                            <option value="1hour">⏱️ 1 Hour</option>
                            <option value="1day">📅 1 Day</option>
                            <option value="1week">🗓️ 1 Week</option>
                            <option value="1month">📆 1 Month</option>
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