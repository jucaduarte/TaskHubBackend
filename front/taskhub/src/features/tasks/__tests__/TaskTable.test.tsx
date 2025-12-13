import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskTable from '../components/TaskTable';

const mockTasks = [
    {
        id: 1,
        title: 'Tarefa 1',
        description: 'Descrição 1',
        userId: 1,
        done: false,
    },
    {
        id: 2,
        title: 'Tarefa 2',
        description: 'Descrição 2',
        userId: 2,
        done: true,
    },
];

const mockUsers = [
    { id: 1, name: 'Usuário Um', email: 'um@email.com' },
    { id: 2, name: 'Usuário Dois', email: 'dois@email.com' },
];

describe('TaskTable', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onMarkAsDone = vi.fn();
    const onMarkAsUndone = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve exibir as tarefas corretamente', () => {
        render(
            <TaskTable
                tasks={mockTasks}
                users={mockUsers}
                currentPage={1}
                onEdit={onEdit}
                onDelete={onDelete}
                onMarkAsDone={onMarkAsDone}
                onMarkAsUndone={onMarkAsUndone}
            />
        );

        expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
        expect(screen.getByText('Tarefa 2')).toBeInTheDocument();
        expect(screen.getByText('Descrição 1')).toBeInTheDocument();
        expect(screen.getByText('Descrição 2')).toBeInTheDocument();
        expect(screen.getByText('Usuário Um')).toBeInTheDocument();
        expect(screen.getByText('Usuário Dois')).toBeInTheDocument();
    });

    it('deve exibir badge de status correto', () => {
        render(
            <TaskTable
                tasks={mockTasks}
                users={mockUsers}
                currentPage={1}
                onEdit={onEdit}
                onDelete={onDelete}
                onMarkAsDone={onMarkAsDone}
                onMarkAsUndone={onMarkAsUndone}
            />
        );

        expect(screen.getAllByLabelText(/tarefa concluída/i)).toHaveLength(1);
        expect(screen.getAllByLabelText(/tarefa não concluída/i)).toHaveLength(1);
    });

    it('deve chamar onEdit ao clicar no botão de editar', () => {
        render(
            <TaskTable
                tasks={mockTasks}
                users={mockUsers}
                currentPage={1}
                onEdit={onEdit}
                onDelete={onDelete}
                onMarkAsDone={onMarkAsDone}
                onMarkAsUndone={onMarkAsUndone}
            />
        );

        const editButtons = screen.getAllByLabelText(/editar tarefa/i);
        fireEvent.click(editButtons[0]);
        expect(onEdit).toHaveBeenCalledWith(1);
    });

    it('deve chamar onDelete ao clicar no botão de excluir', () => {
        render(
            <TaskTable
                tasks={mockTasks}
                users={mockUsers}
                currentPage={1}
                onEdit={onEdit}
                onDelete={onDelete}
                onMarkAsDone={onMarkAsDone}
                onMarkAsUndone={onMarkAsUndone}
            />
        );

        const deleteButtons = screen.getAllByLabelText(/excluir tarefa/i);
        fireEvent.click(deleteButtons[1]);
        expect(onDelete).toHaveBeenCalledWith(2, 'Tarefa 2');
    });

    it('deve chamar onMarkAsDone ao clicar no botão de concluir', () => {
        render(
            <TaskTable
                tasks={mockTasks}
                users={mockUsers}
                currentPage={1}
                onEdit={onEdit}
                onDelete={onDelete}
                onMarkAsDone={onMarkAsDone}
                onMarkAsUndone={onMarkAsUndone}
            />
        );

        const doneButton = screen.getByLabelText(/marcar tarefa tarefa 1 como concluída/i);
        fireEvent.click(doneButton);
        expect(onMarkAsDone).toHaveBeenCalledWith(1);
    });

    it('deve chamar onMarkAsUndone ao clicar no botão de reverter', () => {
        render(
            <TaskTable
                tasks={mockTasks}
                users={mockUsers}
                currentPage={1}
                onEdit={onEdit}
                onDelete={onDelete}
                onMarkAsDone={onMarkAsDone}
                onMarkAsUndone={onMarkAsUndone}
            />
        );

        const undoneButton = screen.getByLabelText(/reverter conclusão da tarefa tarefa 2/i);
        fireEvent.click(undoneButton);
        expect(onMarkAsUndone).toHaveBeenCalledWith(2);
    });

    it('deve exibir mensagem quando não houver tarefas', () => {
        render(
            <TaskTable
                tasks={[]}
                users={mockUsers}
                currentPage={1}
                onEdit={onEdit}
                onDelete={onDelete}
                onMarkAsDone={onMarkAsDone}
                onMarkAsUndone={onMarkAsUndone}
            />
        );

        expect(screen.getByText(/nenhuma tarefa encontrada/i)).toBeInTheDocument();
    });
});