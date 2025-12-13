import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../contexts/PrivateRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Tasks from '../features/tasks/pages/Tasks';
import TaskEdit from '../features/tasks/pages/TaskEdit';
import TaskAdd from '../features/tasks/pages/TaskAdd';

/**
 * Define as rotas públicas e privadas da aplicação.
 */
const AppRoutes = () => (
    <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas privadas */}
        <Route element={<PrivateRoute />}>
            <Route path="/tasks/" element={<Tasks />} />
            <Route path="/tasks/add" element={<TaskAdd />} />
            <Route path="/tasks/edit/:id" element={<TaskEdit />} />
        </Route>
    </Routes>
);

export default AppRoutes;