import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './../pages/Login';
import { vi } from 'vitest';

// Mock do useAuth
const mockLogin = vi.fn();
vi.mock('../services/useAuth', () => ({
    useAuth: () => ({
        login: mockLogin,
    }),
}));

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Login de usuário', () => {
    beforeEach(() => {
        mockLogin.mockReset();
        mockNavigate.mockReset();
    });

    it('deve impedir envio se campos estiverem vazios', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const submitButton = screen.getByRole('button', { name: /login/i });
        fireEvent.click(submitButton);

        expect(mockLogin).not.toHaveBeenCalled();
    });

    it('deve chamar login ao submeter formulário preenchido', async () => {
        mockLogin.mockResolvedValueOnce(undefined);

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@tjin.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123456' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('user@tjin.com', '123456');
        });
    });

    it('deve exibir mensagem de erro se login falhar', async () => {
        mockLogin.mockRejectedValueOnce(new Error());

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@tjin.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        expect(await screen.findByText('Email ou senha inválidos')).toBeInTheDocument();
    });

    it('deve redirecionar para /tasks após login bem-sucedido', async () => {
        mockLogin.mockResolvedValueOnce(undefined);

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@tjin.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123456' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/tasks', { replace: true });
        });
    });

    it('deve redirecionar para /register ao clicar em Criar conta', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));

        expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    it('deve associar labels corretamente aos campos', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('deve focar no campo de email ao abrir a tela', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(screen.getByLabelText('Email')).toHaveFocus();
    });
});