
/**
 * Dados retornados após o registro ou login do usuário.
 */
export interface AuthUser {
    /**
     * ID do usuário.
     */
    readonly id: string;
    /**
     * Nome do usuário.
     */
    readonly name: string;
    /**
     * E-mail do usuário.
     */
    readonly email: string;
    /**
     * Token de autenticação.
     */
    readonly token: string;
}