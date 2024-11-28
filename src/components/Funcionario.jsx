import React, { useState, useEffect } from "react";
import axios from "axios";
import Relogio from "./Relogio";

const Funcionario = () => {
  const [pontos, setPontos] = useState([]);
  const [nome, setNome] = useState("");
  const [colaboradorNome, setColaboradorNome] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const colaboradorId = localStorage.getItem("colaboradorId");

  useEffect(() => {
    if (!colaboradorId) {
      setNotification({ message: "Colaborador não encontrado. Faça login novamente.", type: "error" });
      return;
    }

    axios
      .get(`http://127.0.0.1:5000/colaboradores/${colaboradorId}`)
      .then((response) => {
        setNome(response.data.nome);
      })
      .catch((error) => {
        console.error("Erro ao obter dados do colaborador:", error);
        setNotification({ message: "Erro ao obter dados do colaborador.", type: "error" });
      });
  }, [colaboradorId]);

  const handleRegistrarPonto = async () => {
    if (!colaboradorId) {
      setNotification({ message: "Colaborador não encontrado. Faça login novamente.", type: "error" });
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/registrar_ponto", { colaborador_id: colaboradorId });

      setPontos((prevPontos) => {
        const novosPontos = [...prevPontos, response.data.horario];
        if (novosPontos.length > 4) {
          novosPontos.shift();
        }
        return novosPontos;
      });

      setNotification({ message: response.data.message || "Ponto registrado com sucesso!", type: "success" });
    } catch (error) {
      console.error("Erro ao registrar ponto:", error.response?.data || error.message);
      setNotification({ message: error.response?.data.error || "Erro ao registrar ponto.", type: "error" });
    }
  };

  useEffect(() => {
    const mostrarColaborador = async () => {
      const colaboradorId = localStorage.getItem("colaboradorId");

      if (!colaboradorId) {
        setNotification({ message: "Colaborador não encontrado. Faça login novamente.", type: "error" });
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:5000/colaboradores/${colaboradorId}`);
        setColaboradorNome(response.data.nome);
      } catch (error) {
        console.error("Erro ao buscar colaborador:", error);
        setNotification({ message: "Erro ao conectar com o servidor.", type: "error" });
      }
    };

    mostrarColaborador();
  }, []);

  // Função para fechar a notificação
  const fecharNotificacao = () => {
    setNotification({ message: "", type: "" });
  };

  return (
    <div>
      <h1>Bem-vindo, {colaboradorNome || "Carregando..."}</h1>
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

      {/* Notificação com botão "OK" */}
      {notification.message && (
        <div className={`notification ${notification.type} show`}>
          {notification.message}
          <button onClick={fecharNotificacao} className="notification-close-btn">OK</button>
        </div>
      )}
    </div>
  );
};

export default Funcionario;
