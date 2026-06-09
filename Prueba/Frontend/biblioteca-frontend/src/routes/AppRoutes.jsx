import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LibrosPage from '../pages/LibrosPage';
import SociosPage from '../pages/SociosPage';

const Home = () => <h2>Biblioteca</h2>;

const AppRoutes = () => {
    return (
        <div>
            <nav style={{ padding: '10px', backgroundColor: '#2c3e50', marginBottom: '20px' }}>
                <Link to="/" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Inicio</Link>
                <Link to="/libros" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Libros</Link>
                <Link to="/socios" style={{ color: 'white', textDecoration: 'none' }}>Socios</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/libros" element={<LibrosPage />} />
                <Route path="/socios" element={<SociosPage />} />
                <Route path="*" element={<h2>Erro 404-Página no encontrada</h2>} />
            </Routes>
        </div>
    );
};

export default AppRoutes;