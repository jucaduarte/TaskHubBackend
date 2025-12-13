/**
 * Representa uma tarefa do sistema.
 */
export interface Task {
    /**
     * Identificador único da tarefa.
     */
    readonly id: number;

    /**
     * Título da tarefa.
     */
    readonly title: string;

    /**
     * Descrição detalhada da tarefa.
     * Pode ser uma string vazia se não houver descrição.
     */
    readonly description: string;

    /**
     * Identificador do usuário responsável.
     */
    readonly userId: number;

    /**
     * Indica se a tarefa está concluída.
     */
    readonly done: boolean;

    /**
     * Data de criação da tarefa (ISO 8601).
     */
    readonly createdAt: string;

    /**
     * Data da última atualização da tarefa (ISO 8601).
     */
    readonly updatedAt: string;
}