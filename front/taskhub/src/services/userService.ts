import api from './api';
import type { User } from '../models/user';

/**
 * Recupera a lista de usuários do sistema.
 * @returns Uma Promise com o array de usuários.
 */
export async function getUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
}