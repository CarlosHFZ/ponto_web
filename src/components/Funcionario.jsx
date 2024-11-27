import React, { useState, useEffect } from "react";
import axios from "axios";
import Relogio from "./Relogio"; // Importando o componente Relogio

const Funcionario = () => {
  const [pontos, setPontos] = useState([]);
  const [nome, setNome] = useState("");

  const colaboradorId = localStorage.getItem("colaboradorId");

  useEffect(() => {
    // Verifica se o colaborador está logado
    if (!colaboradorId) {
      alert("Colaborador não encontrado. Faça login novamente.");
      return;
    }

    // Obter nome do colaborador se necessário
    axios.get(`http://127.0.0.1:5000/colaboradores/${colaboradorId}`)
      .then(response => {
        setNome(response.data.nome);  // Supondo que a API retorne o nome
      })
      .catch(error => console.error("Erro ao obter dados do colaborador:", error));
  }, [colaboradorId]);

  const handleRegistrarPonto = async () => {
    if (!colaboradorId) {
      alert("Colaborador não encontrado. Faça login novamente.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/registrar_ponto", {
        colaborador_id: colaboradorId, // Enviar colaborador_id
      });
      alert(response.data.message);
      // Atualiza a lista de pontos com o novo ponto registrado
      setPontos([...pontos, response.data.horario]); // Supondo que a resposta contenha o horário
    } catch (error) {
      console.error("Erro ao registrar ponto:", error);
      alert("Erro ao registrar ponto.");
    }
  };

  return (
    <div>
      <h1>Bem-vindo, {nome || "Funcionário"}</h1>
      
      {/* Relógio com a hora atual */}
      <Relogio />

      <button onClick={handleRegistrarPonto}>Registrar Ponto</button>

      
      <h2>Meus Horários de Ponto</h2>

      
    </div>
  );
};


export default Funcionario;
