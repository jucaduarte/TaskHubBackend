import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTasks } from './../hooks/useTasks';
import { useUsers } from '../../../hooks/useUsers';
import TaskForm from './../components/TaskForm';

const TaskEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { fetchTaskById, updateTask, loading, error, setError } = useTasks();
    const { users, loading: loadingUsers, error: errorUsers } = useUsers();

    const [initialValues, setInitialValues] = useState<{ title?: string; description?: string; userId?: string }>({});
    const [loadingTask, setLoadingTask] = useState(true);

    useEffect(() => {
        const loadTask = async () => {
            if (!id) {
                setError('ID da tarefa não informado.');
                setLoadingTask(false);
                return;
            }
            setLoadingTask(true);
            setError('');
            const task = await fetchTaskById(Number(id));
            if (task) {
                setInitialValues({
                    title: task.title,
                    description: task.description,
                    userId: String(task.userId)
                });
            } else {
                setError('Tarefa não encontrada.');
            }
            setLoadingTask(false);
        };
        loadTask();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleSubmit = async (data: { title: string; description: string; userId: string }) => {
        setError('');
        if (!id) return;
        const now = new Date().toISOString();
        const result = await updateTask(Number(id), {
            title: data.title,
            description: data.description,
            userId: Number(data.userId),
            updatedAt: now
        });
        if (result) {
            navigate('/tasks');
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex flex-column p-0">
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="w-100" style={{ maxWidth: 520 }}>
                    <div className="card shadow p-4">
                        <h2 className="mb-4 text-center">Editar Tarefa</h2>
                        {loadingTask || loadingUsers ? (
                            <div>Carregando...</div>
                        ) : (
                            <TaskForm
                                onSubmit={handleSubmit}
                                loading={loading || loadingTask || loadingUsers}
                                error={error}
                                users={users}
                                errorUsers={errorUsers}
                                initialValues={initialValues}
                                onCancel={() => navigate('/tasks')}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskEdit;