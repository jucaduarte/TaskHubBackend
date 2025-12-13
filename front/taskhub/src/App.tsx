import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './layouts/Header';
import AppRoutes from './routes/AppRoutes';

/**
 * Componente principal da aplicação.
 * Mantém o cabeçalho fixo e delega as rotas para AppRoutes.
 */
function App() {
    return (
        <Router>
            <Header />
            <AppRoutes />
        </Router>
    );
}

export default App;
