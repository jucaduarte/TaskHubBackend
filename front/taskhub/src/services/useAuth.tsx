import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('Não há um contexto registrado. Verifique a codificação.');
    return context;
}
