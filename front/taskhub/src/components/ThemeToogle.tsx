import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ThemeToggle: React.FC = () => {
    const getInitialTheme = (): boolean => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme === 'dark';
        }
        return document.body.getAttribute('data-bs-theme') === 'dark';
    };

    const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

    useEffect(() => {
        const theme = isDark ? 'dark' : 'light';
        document.body.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    }, [isDark]);

    const toggleTheme = useCallback((): void => {
        setIsDark((prev) => !prev);
    }, []);

    return (
        <button
            className="btn btn-outline-secondary"
            type="button"
            aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            title={isDark ? 'Alternar tema claro' : 'Ativar tema escuro'}
            onClick={toggleTheme}
        >
            {isDark ? (
                <i className="bi bi-moon-fill" aria-hidden="true"></i>
            ) : (
                <i className="bi bi-sun-fill" aria-hidden="true"></i>
            )}
        </button>
    );
};

export default ThemeToggle;