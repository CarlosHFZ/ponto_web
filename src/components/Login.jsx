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

  return (
    <div>
      <h1>Sistema de Ponto Online</h1>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
