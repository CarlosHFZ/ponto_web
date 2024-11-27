import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Colaboradores from './components/Colaboradores';
import Funcionario from './components/Funcionario';

function App(){
  return (
    <Router>
      <Routes>
        {/* Página de login */}
        <Route path="/" element={<Login />} />

        {/* Tela de colaboradores (admin) */}
        <Route path="/admin" element={<Colaboradores />} />

        {/* Tela de funcionários */}
        <Route path="/funcionario" element={<Funcionario />} />

        {/* Redirecionar para login se a rota não existir */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
