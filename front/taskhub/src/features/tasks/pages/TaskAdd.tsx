import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from './../hooks/useTasks';
import { useUsers } from '../../../hooks/useUsers';
import TaskForm from '../components/TaskForm';

const TaskAdd: React.FC = () => {
    const { createTask, loading, error, setError } = useTasks();
    const { users, loading: loadingUsers, error: errorUsers } = useUsers();
    const navigate = useNavigate();

    const handleSubmit = async (data: { title: string; description: string; userId: string }) => {
        setError('');
        const now = new Date().toISOString();
        const result = await createTask({
            title: data.title,
            description: data.description,
            userId: Number(data.userId),
            done: false,
            createdAt: now,
            updatedAt: now
        });
        if (result) {
            navigate('/tasks');
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex flex-column p-0">
            <div className="content flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="w-100" style={{ maxWidth: '80vw' }}>
                    <div className="card shadow p-4">
                        <h2 className="mb-4 text-center">Nova Tarefa</h2>
                        <TaskForm
                            onSubmit={handleSubmit}
                            loading={loading || loadingUsers}
                            error={error}
                            users={users}
                            errorUsers={errorUsers}
                            onCancel={() => navigate('/tasks')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskAdd;