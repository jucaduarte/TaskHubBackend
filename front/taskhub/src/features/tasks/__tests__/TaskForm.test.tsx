import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import TaskForm from '../components/TaskForm';
import type { User } from './../../../models/user';

describe('TaskForm', () => {
    const users: User[] = [
        { id: '1', name: 'Juca', email: 'juca@email.com' },
        { id: '2', name: 'Rebeca', email: 'rebeca@email.com' },
    ];

    const setup = (props = {}) => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        const onCancel = vi.fn();
        const container = render(
            <TaskForm
                onSubmit={onSubmit}
                loading={false}
                users={users}
                onCancel={onCancel}
                {...props}
            />
        );
        return { onSubmit, onCancel, container };
    };

    it('deve impedir envio se campos obrigatórios estiverem vazios', async () => {
        const { onSubmit } = setup();

        fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

        const allTitleErrors = screen.getAllByText('O título é obrigatório.');
        const errorFeedback = allTitleErrors.find(
            el => el.classList.contains('invalid-feedback')
        );
        expect(errorFeedback).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('deve exibir erro se usuário não for selecionado', async () => {
        const { onSubmit } = setup();

        fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Nova tarefa' } });
        fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

        await waitFor(() => {
            expect(screen.getByText('Selecione um usuário responsável.')).toBeInTheDocument();
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    it('deve chamar onSubmit com dados corretos', async () => {
        const { onSubmit } = setup();

        fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Nova tarefa' } });
        fireEvent.change(screen.getByLabelText(/descrição/i), { target: { value: 'Detalhes da tarefa' } });
        fireEvent.change(screen.getByLabelText(/usuário responsável/i), { target: { value: users[1].id } });

        fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                title: 'Nova tarefa',
                description: 'Detalhes da tarefa',
                userId: users[1].id,
            });
        });
    });

    it('deve exibir mensagem de erro geral', () => {
        setup({ error: 'Erro ao salvar' });

        expect(screen.getByText('Erro ao salvar')).toBeInTheDocument();
    });

    it('deve exibir erro de usuários', () => {
        setup({ errorUsers: 'Erro ao carregar usuários' });

        expect(screen.getByText('Erro ao carregar usuários')).toBeInTheDocument();
    });

    it('deve chamar onCancel ao clicar em cancelar', () => {
        const { onCancel } = setup();

        fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

        expect(onCancel).toHaveBeenCalled();
    });
});