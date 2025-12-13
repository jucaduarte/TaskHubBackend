import { taskService } from '../services/taskService';
import api from '../../../services/api';

vi.mock('../../../services/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    }
}));

const mockTasks = [
    { id: 1, title: 'Task 1', description: 'Desc 1', userId: 1, done: false, createdAt: '', updatedAt: '' },
    { id: 2, title: 'Task 2', description: 'Desc 2', userId: 2, done: false, createdAt: '', updatedAt: '' }
];

describe('taskService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetchTasks retorna lista de tarefas', async () => {
        api.get.mockResolvedValueOnce({ data: mockTasks });
        const result = await taskService.fetchTasks();
        expect(api.get).toHaveBeenCalledWith('/tasks');
        expect(result).toEqual(mockTasks);
    });

    it('fetchTaskById retorna uma tarefa', async () => {
        api.get.mockResolvedValueOnce({ data: mockTasks[0] });
        const result = await taskService.fetchTaskById(1);
        expect(api.get).toHaveBeenCalledWith('/tasks/1');
        expect(result).toEqual(mockTasks[0]);
    });

    it('createTask cria uma nova tarefa', async () => {
        const newTask = { title: 'Nova', description: 'Desc', userId: 1, done: false, createdAt: '', updatedAt: '' };
        const createdTask = { ...newTask, id: 3 };
        api.post.mockResolvedValueOnce({ data: createdTask });
        const result = await taskService.createTask(newTask);
        expect(api.post).toHaveBeenCalledWith('/tasks', newTask);
        expect(result).toEqual(createdTask);
    });

    it('updateTask atualiza uma tarefa', async () => {
        const updatedTask = { ...mockTasks[0], title: 'Atualizada' };
        api.put.mockResolvedValueOnce({ data: updatedTask });
        const result = await taskService.updateTask(1, { title: 'Atualizada' });
        expect(api.put).toHaveBeenCalledWith('/tasks/1', { title: 'Atualizada' });
        expect(result).toEqual(updatedTask);
    });

    it('deleteTask remove uma tarefa', async () => {
        api.delete.mockResolvedValueOnce({});
        await taskService.deleteTask(1);
        expect(api.delete).toHaveBeenCalledWith('/tasks/1');
    });
});