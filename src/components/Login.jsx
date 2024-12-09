import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", { nome, senha });
      const { id, tipo, colaborador_id } = response.data;

      // Salvar dados no localStorage
      localStorage.setItem("userId", id);
      localStorage.setItem("userType", tipo);

      if (colaborador_id) {
        localStorage.setItem("colaboradorId", colaborador_id);
      }

      console.log("id --->", id);
      console.log("tipo --->", tipo);
      console.log("colaborador_id --->", colaborador_id);

      // Redirecionar com base no tipo de usuário
      if (tipo === "admin") {
        navigate("/admin");
      } else if (tipo === "colaborador") {
        navigate("/funcionario");
      }
    } catch (error) {
      setError("Usuário ou senha incorretos");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="div_ponto login-container">
        <h1>Sistema de Ponto Online</h1>
        <h2>Login</h2>
        <form className="login-form">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleLogin} type="button">
            Entrar
          </button>
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );

};

export default Login;
