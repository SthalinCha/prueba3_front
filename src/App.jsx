import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientesView from './components/ClientesView';
import './App.css';  // Importar el archivo CSS

const App = () => {
  return (
    <Router>
      {/* Barra de navegación sin enlaces */}
      <nav className="navbar">
        <div className="container">
          <span className="navbar-brand">Detalle Salario</span>
        </div>
      </nav>

      {/* Rutas */}
      <Routes>
        <Route path="/clientes" element={<ClientesView />} />
      </Routes>
    </Router>
  );
};

export default App;
