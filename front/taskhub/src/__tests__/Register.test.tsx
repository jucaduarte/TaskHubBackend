import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './../pages/Register';
import { vi } from 'vitest';

const mockRegister = vi.fn();
vi.mock('../services/useAuth', () => ({
    useAuth: () => ({
        register: mockRegister,
    }),
}));

describe('Registro de usuário', () => {
    it('deve impedir envio do formulário se campos estiverem vazios', () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        const submitButton = screen.getByRole('button', { name: /registrar/i });
        fireEvent.click(submitButton);

        // Validado por loading, nesse caso se o loading não for ativado, o submit foi impedido
        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('deve chamar register ao submeter formulário preenchido', async () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'user_teste_' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@tjin.com' } });
        fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '123456' } });

        fireEvent.click(screen.getByRole('button', { name: /registrar/i }));

        expect(mockRegister).toHaveBeenCalledWith({
            name: 'user_teste_',
            email: 'user@tjin.com',
            password: '123456',
        });
    });
});