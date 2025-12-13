/**
 * Dados necessários para registrar um novo usuário.
 */
export interface RegisterData {
    /**
     * Nome do usuário.
     */
    readonly name: string;
    /**
     * E-mail do usuário.
     */
    readonly email: string;
    /**
     * Senha do usuário.
     */
    readonly password: string;
}