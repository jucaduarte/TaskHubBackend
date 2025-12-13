import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../models/user';
import api from './../services/api';
import type { AuthContextType } from '../models/authContextType';
import type { RegisterData } from '../models/registerData';

// Contexto

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Funções auxiliares para localStorage
function storeUserAndToken(user: User, token: string) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
}

function clearUserAndToken() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Carrega usuário do localStorage ao iniciar
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                // Se o JSON estiver inválido, limpe o localStorage e não defina o usuário
                clearUserAndToken();
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    // Login
    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/login', { email, password });
            const userData: User = { id: response.data.id, email: response.data.email };
            const token: string = response.data.token;
            setUser(userData);
            storeUserAndToken(userData, token);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Falha no login. Verifique suas credenciais.');
            setUser(null);
            clearUserAndToken();
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Registro
    const register = useCallback(async (data: RegisterData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/register', data);
            const userData: User = { id: response.data.userId, email: response.data.email };
            const token: string = response.data.token;
            setUser(userData);
            storeUserAndToken(userData, token);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Falha no registro. Tente novamente.');
            setUser(null);
            clearUserAndToken();
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Logout
    const logout = useCallback(() => {
        setUser(null);
        setError(null);
        clearUserAndToken();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
}