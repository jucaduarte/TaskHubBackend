import { useCallback, useEffect, useState } from 'react';
import { taskService } from '../services/taskService';
import type { Task } from '../models/task';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Buscar todas as tasks
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await taskService.fetchTasks();
            setTasks(data);
        } catch {
            setError('Erro ao carregar as tarefas.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Buscar uma task por id
    const fetchTaskById = useCallback(async (id: number) => {
        setLoading(true);
        setError('');
        try {
            const data = await taskService.fetchTaskById(id);
            return data;
        } catch {
            setError('Erro ao carregar a tarefa.');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Criar uma nova task
    const createTask = useCallback(async (task: Omit<Task, 'id'>) => {
        setLoading(true);
        setError('');
        try {
            const data = await taskService.createTask(task);
            setTasks(prev => [...prev, data]);
            return data;
        } catch {
            setError('Erro ao criar a tarefa.');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Atualizar uma task existente
    const updateTask = useCallback(async (id: number, task: Partial<Task>) => {
        setLoading(true);
        setError('');
        try {
            const data = await taskService.updateTask(id, task);
            setTasks(prev =>
                prev.map(t => (t.id === id ? data : t))
            );
            return data;
        } catch {
            setError('Erro ao atualizar a tarefa.');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Excluir uma task
    const deleteTask = useCallback(async (id: number) => {
        setLoading(true);
        setError('');
        try {
            await taskService.deleteTask(id);
            setTasks(prev => prev.filter(t => t.id !== id));
            return true;
        } catch {
            setError('Erro ao excluir a tarefa.');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        fetchTaskById,
        createTask,
        updateTask,
        deleteTask,
        setTasks,
        setError,
    };
}