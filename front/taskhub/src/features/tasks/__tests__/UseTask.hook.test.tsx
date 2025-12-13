import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../hooks/useTasks';
import { taskService } from '../services/taskService';

vi.mock('../services/taskService', () => ({
    taskService: {
        fetchTasks: vi.fn(),
        fetchTaskById: vi.fn(),
        createTask: vi.fn(),
        updateTask: vi.fn(),
        deleteTask: vi.fn(),
    }
}));

const mockTasks = [
    { id: 1, title: 'Task 1', description: 'Desc 1', userId: 1, done: false, createdAt: '', updatedAt: '' },
    { id: 2, title: 'Task 2', description: 'Desc 2', userId: 2, done: false, createdAt: '', updatedAt: '' }
];

describe('useTasks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetchTasks deve carregar as tarefas', async () => {
        taskService.fetchTasks.mockResolvedValueOnce(mockTasks);

        const { result } = renderHook(() => useTasks());

        // Aguarda o useEffect inicial
        await act(async () => {});

        expect(result.current.tasks).toEqual(mockTasks);
        expect(result.current.error).toBe('');
        expect(result.current.loading).toBe(false);
    });

    it('createTask deve adicionar uma nova tarefa', async () => {
        const newTask = { title: 'New', description: 'Desc', userId: 1, done: false, createdAt: '', updatedAt: '' };
        const createdTask = { ...newTask, id: 3 };
        taskService.fetchTasks.mockResolvedValueOnce([]);
        taskService.createTask.mockResolvedValueOnce(createdTask);

        const { result } = renderHook(() => useTasks());
        await act(async () => {});

        await act(async () => {
            await result.current.createTask(newTask);
        });

        expect(result.current.tasks).toContainEqual(createdTask);
        expect(result.current.error).toBe('');
    });

    it('updateTask deve atualizar uma tarefa', async () => {
        taskService.fetchTasks.mockResolvedValueOnce([mockTasks[0]]);
        const updatedTask = { ...mockTasks[0], title: 'Updated' };
        taskService.updateTask.mockResolvedValueOnce(updatedTask);

        const { result } = renderHook(() => useTasks());
        await act(async () => {});

        await act(async () => {
            await result.current.updateTask(1, { title: 'Updated' });
        });

        expect(result.current.tasks[0].title).toBe('Updated');
    });

    it('deleteTask deve remover uma tarefa', async () => {
        taskService.fetchTasks.mockResolvedValueOnce([...mockTasks]);
        taskService.deleteTask.mockResolvedValueOnce();

        const { result } = renderHook(() => useTasks());
        await act(async () => {});

        await act(async () => {
            await result.current.deleteTask(1);
        });

        expect(result.current.tasks).toHaveLength(1);
        expect(result.current.tasks[0].id).toBe(2);
    });

    it('deve definir erro ao falhar ao buscar tarefas', async () => {
        taskService.fetchTasks.mockRejectedValueOnce(new Error('fail'));

        const { result } = renderHook(() => useTasks());
        await act(async () => {});

        expect(result.current.error).toBe('Erro ao carregar as tarefas.');
    });
});