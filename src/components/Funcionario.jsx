import React from "react";
import axios from "axios";

const Funcionario = () => {
  const handleRegistrarPonto = async () => {
    const colaboradorId = localStorage.getItem("colaboradorId");

    if (!colaboradorId) {
      alert("Colaborador não encontrado. Faça login novamente.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/registrar_ponto", {
        colaborador_id: colaboradorId, // Enviar colaborador_id
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Erro ao registrar ponto:", error);
      alert("Erro ao registrar ponto.");
    }
  };

  return (
    <div>
      <h1>Bem-vindo, Funcionário</h1>
      <button onClick={handleRegistrarPonto}>Registrar Ponto</button>
    </div>
  );
};


export default Funcionario;
