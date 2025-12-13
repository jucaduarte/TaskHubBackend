import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const PrivateRoute = () => {
    const auth = useContext(AuthContext);

    if (auth?.loading) {
        return <div>Carregando...</div>;
    }

    return auth?.user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;