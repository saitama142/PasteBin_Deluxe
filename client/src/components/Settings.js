import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Settings = ({ isOpen, onClose }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    if (!isOpen) return null;

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                <div className="settings-header">
                    <h3>Settings</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="settings-content">
                    <div className="setting-item">
                        <label className="setting-label">
                            <span>Dark Theme</span>
                            <div className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={theme === 'dark'}
                                    onChange={toggleTheme}
                                />
                                <span className="toggle-slider"></span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
