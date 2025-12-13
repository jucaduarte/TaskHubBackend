/**
 * Representa um usuário do sistema.
 */
export interface User {
    /**
     * Identificador único do usuário.
     */
    readonly id: number;

    /**
     * E-mail do usuário.
     */
    readonly email: string;

    /**
     * Nome do usuário. Pode ser uma string vazia se não informado.
     */
    readonly name: string;
}