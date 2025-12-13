import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from './../hooks/useTasks';
import { useUsers } from '../../../hooks/useUsers';
import DialogBoxModal from '../../../components/DialogBoxModal';
import TaskTable from '../components/TaskTable';
import TablePagination from '../components/TablePagination';

const PAGE_SIZE = 10;

const Tasks: React.FC = () => {
    const navigate = useNavigate();
    const { tasks, loading, error, deleteTask, updateTask } = useTasks();
    const { users } = useUsers();

    const [filterTitle, setFilterTitle] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'done' | 'not_done'>('all');
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; taskId?: number; taskTitle?: string }>({ show: false });
    const [currentPage, setCurrentPage] = useState(1);

    const handleEdit = useCallback((id: number) => {
        navigate(`/tasks/edit/${id}`);
    }, [navigate]);

    const handleDeleteClick = useCallback((id: number, title: string) => {
        setDeleteModal({ show: true, taskId: id, taskTitle: title });
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (deleteModal.taskId !== undefined) {
            await deleteTask(deleteModal.taskId);
        }
        setDeleteModal({ show: false });
    }, [deleteModal, deleteTask]);

    const handleCancelDelete = useCallback(() => {
        setDeleteModal({ show: false });
    }, []);

    const handleNewTask = useCallback(() => {
        navigate('/tasks/add');
    }, [navigate]);

    const handleMarkAsDone = useCallback(async (taskId: number) => {
        const task = tasks.find(t => t.id === taskId);
        if (task && !task.done) {
            await updateTask(taskId, { ...task, done: true });
        }
    }, [tasks, updateTask]);

    const handleMarkAsUndone = useCallback(async (taskId: number) => {
        const task = tasks.find(t => t.id === taskId);
        if (task && task.done) {
            await updateTask(taskId, { ...task, done: false });
        }
    }, [tasks, updateTask]);

    const filteredTasks = useMemo(() => tasks.filter(task => {
        const matchesTitle = task.title.toLowerCase().includes(filterTitle.toLowerCase());
        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'done' && task.done) ||
            (filterStatus === 'not_done' && !task.done);
        return matchesTitle && matchesStatus;
    }), [tasks, filterTitle, filterStatus]);

    const totalPages = Math.ceil(filteredTasks.length / PAGE_SIZE);
    const paginatedTasks = filteredTasks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterTitle, filterStatus]);

    return (
        <>
            <main className="container my-4 d-flex justify-content-center" aria-label="Lista de tarefas">
                <section className="row justify-content-center w-100">
                    <div className="col-12">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                            <h2 className="mb-0" tabIndex={0}>Tarefas</h2>
                            <button
                                className="btn btn-success"
                                onClick={handleNewTask}
                                type="button"
                                aria-label="Adicionar nova tarefa"
                            >
                                <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
                                Nova tarefa
                            </button>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6 mb-2 mb-md-0">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Filtrar por título"
                                    value={filterTitle}
                                    onChange={e => setFilterTitle(e.target.value)}
                                    aria-label="Filtrar por título"
                                />
                            </div>
                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    value={filterStatus}
                                    onChange={e => setFilterStatus(e.target.value as 'all' | 'done' | 'not_done')}
                                    aria-label="Filtrar por status"
                                >
                                    <option value="all">Todos os status</option>
                                    <option value="done">Concluídas</option>
                                    <option value="not_done">Não concluídas</option>
                                </select>
                            </div>
                        </div>
                        {error && <div className="alert alert-danger" role="alert">{error}</div>}
                        {loading ? (
                            <div aria-busy="true" aria-live="polite">Carregando...</div>
                        ) : (
                            <div
                                className="table-responsive"
                                style={{
                                    minWidth: 900,
                                    maxWidth: 1200,
                                    margin: '0 auto',
                                    height: 500,
                                    overflowY: 'auto'
                                }}
                            >
                                <TaskTable
                                    tasks={paginatedTasks}
                                    users={users}
                                    currentPage={currentPage}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteClick}
                                    onMarkAsDone={handleMarkAsDone}
                                    onMarkAsUndone={handleMarkAsUndone}
                                />
                            </div>
                        )}
                        {totalPages > 1 && (
                            <TablePagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </section>
            </main>
            <DialogBoxModal
                show={deleteModal.show}
                title="Confirmar exclusão"
                confirmText="Excluir"
                cancelText="Cancelar"
                showCancel
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                loading={loading}
            >
                Tem certeza que deseja excluir a tarefa <strong>{deleteModal.taskTitle}</strong>?
            </DialogBoxModal>
        </>
    );
};

export default Tasks;