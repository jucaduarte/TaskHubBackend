import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskAdd from '../pages/TaskAdd';
import { vi } from 'vitest';

// Mocks
const mockCreateTask = vi.fn();
const mockSetError = vi.fn();
const mockNavigate = vi.fn();
const mockUsers = [
    { id: 1, name: 'User One' },
    { id: 2, name: 'User Two' }
];

vi.mock('../hooks/useTasks', () => ({
    useTasks: () => ({
        createTask: mockCreateTask,
        loading: false,
        error: '',
        setError: mockSetError,
    }),
}));

vi.mock('../../../hooks/useUsers', () => ({
    useUsers: () => ({
        users: mockUsers,
        loading: false,
        error: '',
    }),
}));

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('TaskAdd', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve exibir o formulário de nova tarefa', () => {
        render(
            <MemoryRouter initialEntries={['/tasks/add']}>
                <Routes>
                    <Route path="/tasks/add" element={<TaskAdd />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/nova tarefa/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/responsável/i)).toBeInTheDocument();
    });

    it('deve chamar createTask ao submeter o formulário', async () => {
        mockCreateTask.mockResolvedValueOnce(true);

        render(
            <MemoryRouter initialEntries={['/tasks/add']}>
                <Routes>
                    <Route path="/tasks/add" element={<TaskAdd />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Nova Tarefa' } });
        fireEvent.change(screen.getByLabelText(/descrição/i), { target: { value: 'Descrição da tarefa' } });
        fireEvent.change(screen.getByLabelText(/responsável/i), { target: { value: '2' } });

        fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

        await waitFor(() => {
            expect(mockSetError).toHaveBeenCalledWith('');
            expect(mockCreateTask).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Nova Tarefa',
                description: 'Descrição da tarefa',
                userId: 2,
                done: false,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }));
            expect(mockNavigate).toHaveBeenCalledWith('/tasks');
        });
    });

    it('deve exibir mensagem de erro se houver erro ao criar tarefa', async () => {
        mockCreateTask.mockResolvedValueOnce(false);

        render(
            <MemoryRouter initialEntries={['/tasks/add']}>
                <Routes>
                    <Route path="/tasks/add" element={<TaskAdd />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Nova Tarefa' } });
        fireEvent.change(screen.getByLabelText(/descrição/i), { target: { value: 'Descrição da tarefa' } });
        fireEvent.change(screen.getByLabelText(/responsável/i), { target: { value: '1' } });

        fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

        await waitFor(() => {
            expect(mockCreateTask).toHaveBeenCalled();
            // Não navega se falhar
            expect(mockNavigate).not.toHaveBeenCalledWith('/tasks');
        });
    });

    it('deve navegar para /tasks ao cancelar', () => {
        render(
            <MemoryRouter initialEntries={['/tasks/add']}>
                <Routes>
                    <Route path="/tasks/add" element={<TaskAdd />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });

    
});