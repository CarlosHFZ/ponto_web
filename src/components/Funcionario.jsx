import React, { useState, useEffect } from "react";
import axios from "axios";
import Relogio from "./Relogio"; // Importando o componente Relógio

const Funcionario = () => {
  const [pontos, setPontos] = useState([]);
  const [nome, setNome] = useState("");
  const [colaboradorNome, setColaboradorNome] = useState("");

  const colaboradorId = localStorage.getItem("colaboradorId");

  useEffect(() => {
    if (!colaboradorId) {
      alert("Colaborador não encontrado. Faça login novamente.");
      return;
    }

    // Obter nome do colaborador se necessário
    axios
      .get(`http://127.0.0.1:5000/colaboradores/${colaboradorId}`)
      .then((response) => {
        setNome(response.data.nome);
      })
      .catch((error) => console.error("Erro ao obter dados do colaborador:", error));
  }, [colaboradorId]);

  const handleRegistrarPonto = async () => {
    if (!colaboradorId) {
      alert("Colaborador não encontrado. Faça login novamente.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/registrar_ponto", {
        colaborador_id: colaboradorId,
      });

      // Verifica se o colaborador já tem 4 registros e remove o mais antigo, se necessário
      setPontos((prevPontos) => {
        const novosPontos = [...prevPontos, response.data.horario];
        if (novosPontos.length > 4) {
          novosPontos.shift(); // Remove o primeiro ponto, mantendo apenas 4
        }
        return novosPontos;
      });

      alert(response.data.message || "Ponto registrado com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar ponto:", error.response?.data || error.message);
      alert(error.response?.data.error || "Erro ao registrar ponto.");
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
        const response = await axios.get(`http://127.0.0.1:5000/colaboradores/${colaboradorId}`);
        setColaboradorNome(response.data.nome); // Atualiza o estado com o nome
      } catch (error) {
        console.error("Erro ao buscar colaborador:", error);
        alert("Erro ao conectar com o servidor.");
      }
    };

    mostrarColaborador();
  }, []); // Executa apenas quando o componente é montado

  return (
    <div>
      <h1>Bem-vindo, {colaboradorNome || "Carregando..."}</h1>

      {/* Relógio com a hora atual */}
      <Relogio />

      <button onClick={handleRegistrarPonto}>Registrar Ponto</button>

      <h2>Registros de Ponto:</h2>
      <div className="registros">
        {pontos.length > 0 ? (
          pontos.map((ponto, index) => (
            <span key={index} className="hora-registro">
              {ponto}
            </span>
          ))
        ) : (
          <p>Ainda não há registros de ponto.</p>
        )}
      </div>
    </div>
  );
};

export default Funcionario;
