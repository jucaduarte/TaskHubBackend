import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskEdit from '../pages/TaskEdit';
import { vi } from 'vitest';

// Mocks
const mockFetchTaskById = vi.fn();
const mockUpdateTask = vi.fn();
const mockSetError = vi.fn();
const mockNavigate = vi.fn();
const mockUsers = [
    { id: 1, name: 'User One' },
    { id: 2, name: 'User Two' }
];

vi.mock('../hooks/useTasks', () => ({
    useTasks: () => ({
        fetchTaskById: mockFetchTaskById,
        updateTask: mockUpdateTask,
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
        useParams: () => ({ id: '1' }),
    };
});

describe('TaskEdit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve exibir o formulário com valores iniciais da tarefa', async () => {
        mockFetchTaskById.mockResolvedValueOnce({
            id: 1,
            title: 'Tarefa Teste',
            description: 'Descrição da tarefa',
            userId: 2,
        });

        render(
            <MemoryRouter initialEntries={['/tasks/edit/1']}>
                <Routes>
                    <Route path="/tasks/edit/:id" element={<TaskEdit />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/carregando/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByDisplayValue('Tarefa Teste')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Descrição da tarefa')).toBeInTheDocument();
        });
    });

    it('deve chamar updateTask ao submeter o formulário', async () => {
        mockFetchTaskById.mockResolvedValueOnce({
            id: 1,
            title: 'Tarefa Teste',
            description: 'Descrição da tarefa',
            userId: 2,
        });
        mockUpdateTask.mockResolvedValueOnce(true);

        render(
            <MemoryRouter initialEntries={['/tasks/edit/1']}>
                <Routes>
                    <Route path="/tasks/edit/:id" element={<TaskEdit />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('Tarefa Teste')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Novo Título' } });
        fireEvent.change(screen.getByLabelText(/descrição/i), { target: { value: 'Nova descrição' } });
        fireEvent.change(screen.getByLabelText(/responsável/i), { target: { value: '1' } });

        fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

        await waitFor(() => {
            expect(mockUpdateTask).toHaveBeenCalledWith(1, expect.objectContaining({
                title: 'Novo Título',
                description: 'Nova descrição',
                userId: 1,
                updatedAt: expect.any(String),
            }));
            expect(mockNavigate).toHaveBeenCalledWith('/tasks');
        });
    });

    it('deve exibir mensagem de erro se tarefa não for encontrada', async () => {
        mockFetchTaskById.mockResolvedValueOnce(null);

        render(
            <MemoryRouter initialEntries={['/tasks/edit/1']}>
                <Routes>
                    <Route path="/tasks/edit/:id" element={<TaskEdit />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockSetError).toHaveBeenCalledWith('Tarefa não encontrada.');
        });
    });

    it('deve exibir mensagem de carregando enquanto busca dados', async () => {
        // Simula loading inicial
        let resolveTask: any;
        mockFetchTaskById.mockReturnValue(new Promise((resolve) => { resolveTask = resolve; }));

        render(
            <MemoryRouter initialEntries={['/tasks/edit/1']}>
                <Routes>
                    <Route path="/tasks/edit/:id" element={<TaskEdit />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/carregando/i)).toBeInTheDocument();

        // Resolve a promise para simular fim do loading
        resolveTask({
            id: 1,
            title: 'Tarefa Teste',
            description: 'Descrição da tarefa',
            userId: 2,
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Tarefa Teste')).toBeInTheDocument();
        });
    });
});