import React, { useState, useEffect } from "react";
import axios from "axios";
import Relogio from "./Relogio"; // Importando o componente Relogio

const Funcionario = () => {
  const [pontos, setPontos] = useState([]);
  const [nome, setNome] = useState("");
  const [colaboradorNome, setColaboradorNome] = useState("");

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

  useEffect(() => {
    // Função para buscar o colaborador
    const mostrarColaborador = async () => {
      const colaboradorId = localStorage.getItem("colaboradorId");

      if (!colaboradorId) {
        alert("Colaborador não encontrado. Faça login novamente.");
        return;
      }

      try {
        // Fazer requisição à API para buscar o colaborador
        const response = await axios.get(`http://127.0.0.1:5000/colaboradores/${colaboradorId}`);


        // Definir o nome do colaborador no state
        setColaboradorNome(response.data.nome); // Atualiza o state com o nome
      } catch (error) {
        console.error("Erro ao buscar colaborador:", error);

        if (error.response) {
          alert(`Erro: ${error.response.data.erro}`);
        } else {
          alert("Erro ao conectar com o servidor.");
        }
      }
    };

    // Chamar a função de buscar colaborador ao montar o componente
    mostrarColaborador();
  }, []); // Executa apenas quando o componente é montado

  
  

  return (
    <div>
      <h1>Bem-vindo, {colaboradorNome || "Carregando..."}</h1>
      
      {/* Relógio com a hora atual */}
      <Relogio />

      <button onClick={handleRegistrarPonto}>Registrar Ponto</button>

    </div>
  );
};


export default Funcionario;
