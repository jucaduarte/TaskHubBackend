import React, { useCallback } from 'react';
import type { User } from '../../../models/user';

/**
 * Representa uma tarefa.
 */
interface Task {
    id: number;
    title: string;
    description: string;
    userId: number | string;
    done: boolean;
}

/**
 * Props para o componente TaskTable.
 */
interface TaskTableProps {
    tasks: Task[];
    users: User[];
    currentPage: number;
    onEdit: (id: number) => void;
    onDelete: (id: number, title: string) => void;
    onMarkAsDone: (id: number) => void;
    onMarkAsUndone: (id: number) => void;
}

const PAGE_SIZE = 10;

/**
 * Retorna o nome do usuário responsável pela tarefa.
 */
const getUserName = (users: User[], userId: number | string): string => {
    const user = users.find(u => String(u.id) === String(userId));
    return user ? user.name || user.email : '—';
};

/**
 * Tabela de tarefas com paginação e ações.
 * Segue boas práticas de acessibilidade, tipagem e usabilidade.
 */
const TaskTable: React.FC<TaskTableProps> = ({
    tasks,
    users,
    currentPage,
    onEdit,
    onDelete,
    onMarkAsDone,
    onMarkAsUndone
}) => {
    // Handlers extraídos para evitar funções inline
    const handleEdit = useCallback((id: number) => onEdit(id), [onEdit]);
    const handleDelete = useCallback((id: number, title: string) => onDelete(id, title), [onDelete]);
    const handleMarkAsDone = useCallback((id: number) => onMarkAsDone(id), [onMarkAsDone]);
    const handleMarkAsUndone = useCallback((id: number) => onMarkAsUndone(id), [onMarkAsUndone]);

    // Preenche linhas vazias para manter altura fixa
    const emptyRows = Array.from({ length: Math.max(0, PAGE_SIZE - tasks.length) });

    return (
        <table
            className="table table-striped align-middle mb-0"
            aria-label="Tabela de tarefas"
            style={{
                tableLayout: 'fixed',
                width: '100%',
                minWidth: 900
            }}
        >
            <thead>
                <tr>
                    <th scope="col" style={{ width: 60 }}>#</th>
                    <th scope="col" style={{ width: 180 }}>Título</th>
                    <th scope="col" style={{ width: 260 }}>Descrição</th>
                    <th scope="col" style={{ width: 160 }}>Responsável</th>
                    <th scope="col" style={{ width: 120 }}>Status</th>
                    <th scope="col" style={{ width: 200 }}>Ações</th>
                </tr>
            </thead>
            <tbody>
                {tasks.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="text-center">Nenhuma tarefa encontrada.</td>
                    </tr>
                ) : (
                    <>
                        {tasks.map((task, idx) => (
                            <tr key={task.id}>
                                <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                                <td className="text-truncate" style={{ maxWidth: 170 }}>{task.title}</td>
                                <td className="text-truncate" style={{ maxWidth: 250 }}>{task.description}</td>
                                <td className="text-truncate" style={{ maxWidth: 150 }}>{getUserName(users, task.userId)}</td>
                                <td>
                                    {task.done
                                        ? <span className="badge bg-success" aria-label="Tarefa concluída">
                                            <i className="bi bi-check-circle-fill me-1" aria-hidden="true"></i>
                                            Sim
                                        </span>
                                        : <span className="badge bg-secondary" aria-label="Tarefa não concluída">
                                            <i className="bi bi-x-circle me-1" aria-hidden="true"></i>
                                            Não
                                        </span>
                                    }
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => handleEdit(task.id)}
                                        type="button"
                                        aria-label={`Editar tarefa ${task.title}`}
                                    >
                                        <i className="bi bi-pencil-square" aria-hidden="true"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger me-2"
                                        onClick={() => handleDelete(task.id, task.title)}
                                        type="button"
                                        aria-label={`Excluir tarefa ${task.title}`}
                                    >
                                        <i className="bi bi-trash" aria-hidden="true"></i>
                                    </button>
                                    {!task.done && (
                                        <button
                                            className="btn btn-sm btn-outline-success me-2"
                                            onClick={() => handleMarkAsDone(task.id)}
                                            type="button"
                                            aria-label={`Marcar tarefa ${task.title} como concluída`}
                                        >
                                            <i className="bi bi-check2-circle" aria-hidden="true"></i>
                                        </button>
                                    )}
                                    {task.done && (
                                        <button
                                            className="btn btn-sm btn-outline-warning"
                                            onClick={() => handleMarkAsUndone(task.id)}
                                            type="button"
                                            aria-label={`Reverter conclusão da tarefa ${task.title}`}
                                        >
                                            <i className="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {emptyRows.map((_, i) => (
                            <tr key={`empty-${i}`}>
                                <td colSpan={6} style={{ height: 48 }}></td>
                            </tr>
                        ))}
                    </>
                )}
            </tbody>
        </table>
    );
};

export default TaskTable;