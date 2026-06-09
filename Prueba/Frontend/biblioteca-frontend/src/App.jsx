import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
    return (
        <BrowserRouter>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
                <h1>Gestión Biblioteca</h1>
                <hr />
                <AppRoutes />
            </div>
        </BrowserRouter>
    );
}

export default App;