import { renderHook, act } from '@testing-library/react';
import { useUsers } from '../hooks/useUsers';
import * as userService from '../services/userService';

vi.mock('../services/userService', () => ({
    getUsers: vi.fn(),
}));

const mockUsers = [
    { id: 1, name: 'User One' },
    { id: 2, name: 'User Two' },
];

describe('useUsers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve carregar usuários com sucesso', async () => {
        userService.getUsers.mockResolvedValueOnce(mockUsers);

        const { result } = renderHook(() => useUsers());

        // loading true logo após o mount
        expect(result.current.loading).toBe(true);

        await act(async () => {});

        expect(result.current.users).toEqual(mockUsers);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('deve lidar com erro ao carregar usuários', async () => {
        userService.getUsers.mockRejectedValueOnce(new Error('fail'));

        const { result } = renderHook(() => useUsers());

        await act(async () => {});

        expect(result.current.users).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Erro ao carregar usuários.');
    });
});