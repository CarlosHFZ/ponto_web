import React, { useState, useEffect } from "react";
import axios from "axios";
import Relogio from "./Relogio"; // Importando o componente Relógio

const Funcionario = () => {
  const [pontos, setPontos] = useState([]);
  const [nome, setNome] = useState("");
  const [colaboradorNome, setColaboradorNome] = useState("");
  const [mensagem, setMensagem] = useState({exto:"", tipo: ""});

  const colaboradorId = localStorage.getItem("colaboradorId");

  useEffect(() => {
    if (!colaboradorId) {
      setMensagem({texto: "Colaborador não encontrado. Faça login novamente.", tipo: "error"});
      return;
    }

    // Obter nome do colaborador se necessário
    axios
      .get(`http://127.0.0.1:5000/colaboradores/${colaboradorId}`)
      .then((response) => {
        setNome(response.data.nome);
      })
      .catch(()=>
      setMensagem({texto:"Erro ao buscar informações do colaborador.", tipo: "error"})
    );
  }, [colaboradorId]);

  const handleRegistrarPonto = async () => {
    if (!colaboradorId) {
      setMensagem({texto: "Colaborador não encontrado. Faça login novamente.", tipo: "error"});
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

      setMensagem({texto: response.data.message || "Ponto registrado com sucesso!", tipo: "success"});
    } catch {
      setMensagem({texto:"Erro ao registrar ponto.", tipo: "error"});
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
        setMensagem("Erro ao conectar com o servidor.");
      }
    };

    mostrarColaborador();
  }, []); // Executa apenas quando o componente é montado


    // Função para remover a mensagem
    const removerMensagem = () => {
      setMensagem({ texto: "", tipo: "" });
    };
    
  return (
    <div>
      <h1>Bem-vindo, {colaboradorNome || "Carregando..."}</h1>

      {/* Relógio com a hora atual */}
      <Relogio />
      
      {/*Exibir a mensagem formatada*/}
      {mensagem.texto && (
        <div className={`alert ${mensagem.tipo}`}>
          {mensagem.texto}
          <button onClick={removerMensagem} className="botao-ok">OK</button>
        </div>
      )}

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
