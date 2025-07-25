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

    // Complete auto-detection with better heuristics and proper reset
    useEffect(() => {
        // Reset to plaintext if content is empty
        if (content.trim().length === 0) {
            setAutoDetectedLanguage('plaintext');
            return;
        }
        
        // Skip detection for very short content
        if (content.trim().length < 10) {
            setAutoDetectedLanguage('plaintext');
            return;
        }
        
        const lines = content.split('\n');
        const firstLine = lines[0].trim();
        const allContent = content.toLowerCase();
        const firstFewLines = lines.slice(0, 10).join(' ').toLowerCase();
        
        // Rust detection
        if (allContent.includes('fn ') || 
            allContent.includes('let ') || 
            allContent.includes('mut ') ||
            allContent.includes('use ') ||
            allContent.includes('mod ') ||
            allContent.includes('extern crate') ||
            (firstLine.startsWith('#![') || firstLine.startsWith('#!['))) {
            setAutoDetectedLanguage('rust');
            return;
        }
        
        // Kotlin detection
        if (allContent.includes('fun ') || 
            allContent.includes('val ') || 
            allContent.includes('var ') ||
            allContent.includes('package ') ||
            allContent.includes('import kotlin.') ||
            allContent.includes('companion object') ||
            allContent.includes('data class') ||
            allContent.includes('sealed class')) {
            setAutoDetectedLanguage('kotlin');
            return;
        }
        
        // Bash/Shell detection
        if (firstLine.startsWith('#!/bin/bash') || 
            firstLine.startsWith('#!/bin/sh') ||
            firstLine.startsWith('#!/usr/bin/env bash') ||
            firstLine.startsWith('#!/usr/bin/env sh') ||
            allContent.includes('echo ') ||
            allContent.includes('sudo ') ||
            allContent.includes('chmod ') ||
            allContent.includes('ls ') ||
            allContent.includes('cd ') ||
            allContent.includes('mkdir ') ||
            allContent.includes('if [') ||
            allContent.includes('then') ||
            allContent.includes('fi') ||
            allContent.includes('for ') ||
            allContent.includes('done')) {
            setAutoDetectedLanguage('bash');
            return;
        }
        
        // Python detection
        if (allContent.includes('def ') || 
            allContent.includes('import ') || 
            allContent.includes('from ') ||
            allContent.includes('print(') ||
            allContent.includes('class ') ||
            allContent.includes('__init__') ||
            allContent.includes('if __name__') ||
            (firstLine.startsWith('#!') && firstLine.includes('python'))) {
            setAutoDetectedLanguage('python');
            return;
        }
        
        // JavaScript/TypeScript detection
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
            // Check for TypeScript specific keywords
            if (allContent.includes('interface ') || 
                allContent.includes('type ') ||
                allContent.includes('<any>') ||
                allContent.includes('typescript') ||
                firstLine.includes('typescript') ||
                allContent.includes('as const') ||
                allContent.includes('!.')) {
                setAutoDetectedLanguage('typescript');
            } else {
                setAutoDetectedLanguage('javascript');
            }
            return;
        }
        
        // Java detection
        if (allContent.includes('public class') || 
            allContent.includes('private ') ||
            allContent.includes('protected ') ||
            allContent.includes('static ') ||
            allContent.includes('void ') ||
            allContent.includes('import java.') ||
            allContent.includes('new ') ||
            (firstLine.startsWith('package ') && firstLine.includes('.'))) {
            setAutoDetectedLanguage('java');
            return;
        }
        
        // C++ detection
        if (allContent.includes('#include') || 
            (firstLine.startsWith('#include') && firstLine.includes('<')) ||
            allContent.includes('using namespace') ||
            allContent.includes('std::') ||
            allContent.includes('cout') ||
            allContent.includes('cin') ||
            allContent.includes('.h>') ||
            (firstLine.startsWith('using ') && firstLine.includes('namespace'))) {
            setAutoDetectedLanguage('cpp');
            return;
        }
        
        // C detection
        if ((allContent.includes('#include') || firstLine.startsWith('#include')) &&
            (allContent.includes('printf(') || allContent.includes('scanf(')) &&
            !allContent.includes('iostream')) {
            setAutoDetectedLanguage('c');
            return;
        }
        
        // HTML detection
        if ((allContent.includes('<html') || allContent.includes('<!doctype')) ||
            (allContent.includes('<head>') && allContent.includes('</head>')) ||
            (allContent.includes('<body>') && allContent.includes('</body>')) ||
            ((allContent.includes('<div') && allContent.includes('</div>')) ||
            (allContent.includes('<p>') && allContent.includes('</p>')))) {
            setAutoDetectedLanguage('html');
            return;
        }
        
        // CSS detection
        if (allContent.includes('{') && allContent.includes('}') && 
            (allContent.includes(':') && allContent.includes(';')) &&
            !allContent.includes('<')) {
            setAutoDetectedLanguage('css');
            return;
        }
        
        // JSON detection
        if ((firstLine.startsWith('{') || firstLine.startsWith('[')) &&
            allContent.includes('"') && allContent.includes(':')) {
            setAutoDetectedLanguage('json');
            return;
        }
        
        // PHP detection
        if (firstLine.startsWith('<?php') || 
            allContent.includes('<?php') ||
            allContent.includes('echo ') ||
            allContent.includes('$') ||
            allContent.includes('->') ||
            allContent.includes('=>')) {
            setAutoDetectedLanguage('php');
            return;
        }
        
        // Ruby detection
        if (firstLine.startsWith('#!/usr/bin/env ruby') || 
            firstLine.startsWith('#!/usr/bin/ruby') ||
            allContent.includes('def ') ||
            allContent.includes('end') ||
            allContent.includes('puts ') ||
            allContent.includes('.each ') ||
            allContent.includes('require ')) {
            setAutoDetectedLanguage('ruby');
            return;
        }
        
        // C# detection
        if (allContent.includes('using system') || 
            allContent.includes('namespace ') ||
            allContent.includes('public class') ||
            firstLine.startsWith('using ') ||
            allContent.includes('console.writeline') ||
            allContent.includes('system.')) {
            setAutoDetectedLanguage('csharp');
            return;
        }
        
        // Go detection
        if (firstLine.startsWith('package main') || 
            firstLine.startsWith('package ') ||
            allContent.includes('func ') ||
            allContent.includes('import (') ||
            allContent.includes('fmt.') ||
            allContent.includes(':= ')) {
            setAutoDetectedLanguage('go');
            return;
        }
        
        // Markdown detection
        if (firstLine.startsWith('# ') || 
            firstLine.startsWith('## ') ||
            firstLine.startsWith('### ') ||
            firstLine.startsWith('====') ||
            firstLine.startsWith('----') ||
            firstFewLines.includes('**') ||
            firstFewLines.includes('__') ||
            firstFewLines.includes('```')) {
            setAutoDetectedLanguage('markdown');
            return;
        }
        
        // SQL detection
        if (allContent.includes('select ') || 
            allContent.includes('insert ') || 
            allContent.includes('update ') ||
            allContent.includes('delete ') ||
            allContent.includes('create table') ||
            allContent.includes('drop table') ||
            allContent.includes('where ')) {
            setAutoDetectedLanguage('sql');
            return;
        }
        
        // Default to plaintext
        setAutoDetectedLanguage('plaintext');
    }, [content]);

    const availableLanguages = [
        { value: 'plaintext', label: 'Plain Text', group: 'Basic' },
        { value: 'abap', label: 'ABAP', group: 'Enterprise' },
        { value: 'yaml', label: 'YAML', group: 'Data' },
        { value: 'toml', label: 'TOML', group: 'Data' },
        { value: 'json', label: 'JSON', group: 'Data' },
        { value: 'dockerfile', label: 'Dockerfile', group: 'DevOps' },
        { value: 'makefile', label: 'Makefile', group: 'DevOps' },
        { value: 'nginx', label: 'Nginx', group: 'Config' },
        { value: 'apache', label: 'Apache', group: 'Config' },
        { value: 'ini', label: 'INI', group: 'Config' },
        { value: 'javascript', label: 'JavaScript', group: 'Web Development' },
        { value: 'typescript', label: 'TypeScript', group: 'Web Development' },
        { value: 'jsx', label: 'JSX', group: 'Web Development' },
        { value: 'tsx', label: 'TSX', group: 'Web Development' },
        { value: 'html', label: 'HTML', group: 'Web Development' },
        { value: 'css', label: 'CSS', group: 'Web Development' },
        { value: 'less', label: 'Less', group: 'Web Development' },
        { value: 'scss', label: 'SCSS', group: 'Web Development' },
        { value: 'sass', label: 'Sass', group: 'Web Development' },
        { value: 'xml', label: 'XML', group: 'Web Development' },
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
        { value: 'elixir', label: 'Elixir', group: 'Programming' },
        { value: 'clojure', label: 'Clojure', group: 'Programming' },
        { value: 'erlang', label: 'Erlang', group: 'Programming' },
        { value: 'fortran', label: 'Fortran', group: 'Programming' },
        { value: 'matlab', label: 'Matlab', group: 'Programming' },
        { value: 'r', label: 'R', group: 'Programming' },
        { value: 'sql', label: 'SQL', group: 'Database' },
        { value: 'pgsql', label: 'PostgreSQL', group: 'Database' },
        { value: 'mysql', label: 'MySQL', group: 'Database' },
        { value: 'mongodb', label: 'MongoDB', group: 'Database' },
        { value: 'markdown', label: 'Markdown', group: 'Markup' },
        { value: 'bash', label: 'Bash/Shell', group: 'Shell' },
        { value: 'powershell', label: 'PowerShell', group: 'Shell' },
        { value: 'zsh', label: 'Zsh', group: 'Shell' },
        { value: 'fish', label: 'Fish', group: 'Shell' },
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

            // Use auto-detected language if "Auto-detect" is selected
            const finalLanguage = language === 'plaintext' && autoDetectedLanguage !== 'plaintext' 
                ? autoDetectedLanguage 
                : language;

            const data = await createPaste(content, finalLanguage, password, expiration);
            
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
• Language will be auto-detected (select "Auto-detect" to use)
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
                            <option value="1year">📅 1 Year</option>
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