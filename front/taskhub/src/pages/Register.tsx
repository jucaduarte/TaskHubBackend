import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../services/useAuth";

const Register: React.FC = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!form.name || !form.email || !form.password) {
            setError('Todos os campos são obrigatórios.');
            setLoading(false);
            return;
        }

        try {
            await register(form);
            navigate('/login');
        } catch (err: any) {
            setError(err?.message || 'Falha na registro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="card shadow p-4" style={{ maxWidth: 400, width: '100%' }}>
                <h2 className="mb-4 text-center">Registrar</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nome</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            value={form.name}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Senha</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <div className="d-grid">
                        <button type="submit" name="bt_registrar" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Registrando...' : 'Registrar'}
                        </button>

                    </div>
                    <div className="d-grid mt-3">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => navigate('/login')}
                        >
                            Voltar para Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;