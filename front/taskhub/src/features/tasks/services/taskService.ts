import api from '../../../services/api';
import type { Task } from '../models/task';

export const taskService = {
    fetchTasks: async (): Promise<Task[]> => {
        const response = await api.get<Task[]>('/tasks');
        return response.data;
    },
    fetchTaskById: async (id: number): Promise<Task> => {
        const response = await api.get<Task>(`/tasks/${id}`);
        return response.data;
    },
    createTask: async (task: Omit<Task, 'id'>): Promise<Task> => {
        const response = await api.post<Task>('/tasks', task);
        return response.data;
    },
    updateTask: async (id: number, task: Partial<Task>): Promise<Task> => {
        const response = await api.put<Task>(`/tasks/${id}`, task);
        return response.data;
    },
    deleteTask: async (id: number): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    }
};