import { useEffect, useState } from 'react';
import { getUsers } from '../services/userService';
import type { User } from '../models/user';

/**
 * Hook para recuperar e gerenciar a lista de usuários do sistema.
 * @returns Objeto contendo usuários, estado de carregamento e erro.
 */
export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        getUsers()
            .then((data) => {
                if (isMounted) setUsers(data);
            })
            .catch(() => {
                if (isMounted) setError('Erro ao carregar usuários.');
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    return { users, loading, error };
}