import React, { useState, useCallback } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import type { User } from './../../../models/user';

/**
 * Props para o componente TaskForm.
 */
interface TaskFormProps {
    /**
     * Função chamada ao submeter o formulário.
     */
    onSubmit: (data: { title: string; description: string; userId: string }) => Promise<void>;
    /**
     * Indica se o formulário está em estado de carregamento.
     */
    loading: boolean;
    /**
     * Mensagem de erro geral do formulário.
     */
    error?: string;
    /**
     * Lista de usuários disponíveis para seleção.
     */
    users: User[];
    /**
     * Mensagem de erro ao carregar usuários.
     */
    errorUsers?: string | null;
    /**
     * Valores iniciais do formulário (edição).
     */
    initialValues?: { title?: string; description?: string; userId?: string };
    /**
     * Função chamada ao cancelar o formulário.
     */
    onCancel: () => void;
}

/**
 * Representa um erro de campo específico do formulário.
 */
interface FieldError {
    field: 'title' | 'userId';
    message: string;
}

/**
 * Formulário para criação e edição de tarefas.
 * Segue boas práticas de acessibilidade, validação e usabilidade.
 */
const TaskForm: React.FC<TaskFormProps> = ({
    onSubmit,
    loading,
    error,
    users,
    errorUsers,
    initialValues,
    onCancel,
}) => {
    const [title, setTitle] = useState(initialValues?.title ?? '');
    const [description, setDescription] = useState(initialValues?.description ?? '');
    const [userId, setUserId] = useState(initialValues?.userId ?? '');
    const [fieldError, setFieldError] = useState<FieldError | null>(null);

    /**
     * Valida os campos obrigatórios do formulário.
     */
    const validate = useCallback((): FieldError | null => {
        if (!title.trim()) {
            return { field: 'title', message: 'O título é obrigatório.' };
        }
        if (!userId) {
            return { field: 'userId', message: 'Selecione um usuário responsável.' };
        }
        return null;
    }, [title, userId]);

    /**
     * Manipula o envio do formulário.
     */
    const handleSubmit = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setFieldError(null);

            const validationError = validate();
            if (validationError) {
                setFieldError(validationError);
                // Foca no campo com erro para acessibilidade
                const errorField = document.getElementById(validationError.field);
                if (errorField) errorField.focus();
                return;
            }

            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                userId,
            });
        },
        [onSubmit, title, description, userId, validate]
    );

    /**
     * Manipula alteração do campo título.
     */
    const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (fieldError?.field === 'title') setFieldError(null);
    }, [fieldError]);

    /**
     * Manipula alteração do campo descrição.
     */
    const handleDescriptionChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    }, []);

    /**
     * Manipula alteração do campo usuário responsável.
     */
    const handleUserIdChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setUserId(e.target.value);
        if (fieldError?.field === 'userId') setFieldError(null);
    }, [fieldError]);

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
                <label htmlFor="title" className="form-label">
                    Título <span className="text-danger">*</span>
                </label>
                <input
                    id="title"
                    type="text"
                    className={`form-control${fieldError?.field === 'title' ? ' is-invalid' : ''}`}
                    value={title}
                    onChange={handleTitleChange}
                    required
                    autoFocus
                    aria-required="true"
                    aria-invalid={fieldError?.field === 'title'}
                    aria-describedby="titleHelp titleError"
                />
                <div id="titleHelp" className="form-text">
                    O título é obrigatório.
                </div>
                {fieldError?.field === 'title' && (
                    <div id="titleError" className="invalid-feedback">
                        {fieldError.message}
                    </div>
                )}
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">Descrição</label>
                <textarea
                    id="description"
                    className="form-control"
                    value={description}
                    onChange={handleDescriptionChange}
                    rows={3}
                    aria-describedby="descriptionHelp"
                />
                <div id="descriptionHelp" className="form-text">
                    Descreva detalhes da tarefa (opcional).
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="userId" className="form-label">
                    Usuário responsável <span className="text-danger">*</span>
                </label>
                <select
                    id="userId"
                    className={`form-select${fieldError?.field === 'userId' ? ' is-invalid' : ''}`}
                    value={userId}
                    onChange={handleUserIdChange}
                    required
                    aria-required="true"
                    aria-invalid={fieldError?.field === 'userId'}
                    aria-describedby="userIdError"
                >
                    <option value="">Selecione um usuário</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name || user.email}
                        </option>
                    ))}
                </select>
                {errorUsers && <div className="text-danger">{errorUsers}</div>}
                {fieldError?.field === 'userId' && (
                    <div id="userIdError" className="invalid-feedback">
                        {fieldError.message}
                    </div>
                )}
            </div>
            {error && (
                <div className="alert alert-danger py-2" role="alert">
                    {error}
                </div>
            )}
            <div className="d-grid">
                <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                    aria-disabled={loading}
                >
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
            <div className="d-grid mt-2">
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onCancel}
                    disabled={loading}
                    aria-disabled={loading}
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default TaskForm;