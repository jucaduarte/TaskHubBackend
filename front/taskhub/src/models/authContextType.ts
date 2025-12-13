import type { RegisterData } from './registerData';
import type { User } from './user';

/**
 * Define o contrato do contexto de autenticação da aplicação.
 */
export interface AuthContextType {
    /**
     * Usuário autenticado atualmente, ou null se não autenticado.
     */
    user: User | null;

    /**
     * Realiza login com email e senha.
     * @param email Email do usuário.
     * @param password Senha do usuário.
     */
    login: (email: string, password: string) => Promise<void>;

    /**
     * Realiza logout do usuário atual.
     */
    logout: () => void;

    /**
     * Realiza o registro de um novo usuário.
     * @param data Dados de registro.
     */
    register: (data: RegisterData) => Promise<void>;

    /**
     * Indica se uma operação de autenticação está em andamento.
     */
    loading: boolean;

    /**
     * Mensagem de erro de autenticação, ou null se não houver erro.
     */
    error: string | null;
}