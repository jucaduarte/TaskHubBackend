import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import WeatherAPI from '../features/weather/components/WeatherAPI';


const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/tasks', { replace: true });
        } catch {
            setError('Email ou senha inválidos');
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="card shadow p-4" style={{ maxWidth: 400, width: '100%' }}>
                <h2 className="mb-4 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                </form>
                <div className="d-grid mt-3">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleRegister}
                    >
                        Criar conta
                    </button>
                </div>
            </div>
            <div style={{ marginTop: '2rem', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                <WeatherAPI />
            </div>
        </div>
        
    );
};

export default Login;