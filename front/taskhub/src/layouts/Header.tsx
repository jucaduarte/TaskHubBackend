import React, { useContext } from 'react';
import ThemeToggle from '../components/ThemeToogle';
import { AuthContext } from '../contexts/AuthContext';
import WeatherAPI from '../features/weather/components/WeatherAPI';

const Header: React.FC = () => {
    const auth = useContext(AuthContext);

    const isAuthenticated = Boolean(auth?.user);
    const handleLogout = () => {
        auth?.logout();
        window.location.href = '/login';
    };

    return (
        <header className="navbar navbar-expand-lg bg-body-tertiary shadow-sm fixed-top" role="banner">
            <div className="container-fluid">
                <a className="navbar-brand fw-bold" href="/" onClick={handleLogout} aria-label="Página inicial TaskHub">
                    TaskHub
                </a>
                <WeatherAPI />
                <nav className="ms-auto" aria-label="Ações do usuário">
                    <div className="d-flex align-items-center gap-2">
                        <ThemeToggle />
                        {isAuthenticated && (
                            <div className="d-flex align-items-center gap-2">
                                <span>
                                    <strong>{auth?.user?.name}</strong>
                                </span>
                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={handleLogout}
                                    aria-label="Sair da conta"
                                >
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;