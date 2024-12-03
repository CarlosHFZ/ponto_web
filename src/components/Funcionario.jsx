import React, { useState, useEffect } from "react";
import axios from "axios";
import Relogio from "./Relogio"; // Importando o componente Relógio

const Funcionario = () => {
  const [pontos, setPontos] = useState([]);
  const [nome, setNome] = useState("");
  const [colaboradorNome, setColaboradorNome] = useState("");
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  const colaboradorId = localStorage.getItem("colaboradorId");

  useEffect(() => {
    if (!colaboradorId) {
      setMensagem({ texto: "Colaborador não encontrado. Faça login novamente.", tipo: "error" });
      return;
    }

    // Obter nome do colaborador se necessário
    axios
      .get(`http://127.0.0.1:5000/colaboradores/${colaboradorId}`)
      .then((response) => {
        setNome(response.data.nome);
      })
      .catch(() =>
        setMensagem({ texto: "Erro ao buscar informações do colaborador.", tipo: "error" })
      );
  }, [colaboradorId]);

  const handleRegistrarPonto = async () => {
    if (!colaboradorId) {
      setMensagem({ texto: "Colaborador não encontrado. Faça login novamente.", tipo: "error" });
      return;
    }
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/registrar_ponto", {
        colaborador_id: colaboradorId,
      });
  
      // Adiciona o novo ponto ao topo da lista e garante que a lista não ultrapasse 4 pontos
      setPontos((prevPontos) => {
        const novosPontos = [response.data.horario, ...prevPontos]; // Adiciona o novo ponto no início
        if (novosPontos.length > 4) {
          novosPontos.pop(); // Remove o último ponto para garantir que só há 4
        }
        return novosPontos;
      });
  
      setMensagem({ texto: response.data.message || "Ponto registrado com sucesso!", tipo: "success" });
  
      // Chama novamente a função para buscar os registros mais atualizados
      buscarRegistrosPorColaborador(colaboradorId)
        .then((dados) => setPontos(dados)) // Atualiza os pontos com a resposta mais recente
        .catch((err) => console.error("Erro ao buscar registros:", err));
  
    } catch {
      setMensagem({ texto: "Erro ao registrar ponto.", tipo: "error" });
    }
  };

  useEffect(() => {
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

  const buscarRegistrosPorColaborador = async (colaboradorId, data = '') => {
    try {
      const dataFormatada = data ? new Date(data).toISOString().split('T')[0] : '';
      const response = await axios.get(`http://127.0.0.1:5000/registros/${colaboradorId}`, {
        params: { data: dataFormatada },
      });
      return response.data;
    } catch (err) {
      console.error(`Erro ao buscar registros para colaborador ${colaboradorId}:`, err);
      return [];
    }
  };

  useEffect(() => {
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toISOString().split('T')[0];
    
    buscarRegistrosPorColaborador(colaboradorId, dataFormatada)
      .then((dados) => setPontos(dados))
      .catch((err) => console.error("Erro ao buscar registros:", err));
  }, [colaboradorId]);

  return (
    <div className="janela_funcionario">
      <h1>Bem-vindo, {colaboradorNome || "Carregando..."}</h1>

      {/* Relógio com a hora atual */}
      <Relogio />
      
      {/* Exibir a mensagem formatada */}
      {mensagem.texto && (
        <div className={`alert ${mensagem.tipo}`}>
          {mensagem.texto}
          <button onClick={() => setMensagem({ texto: '', tipo: '' })} className="botao-ok">OK</button>
        </div>
      )}

      <button onClick={handleRegistrarPonto}>Registrar Ponto</button>

      <h2>Registros de Ponto:</h2>
      <div className="registros">
        {pontos.length > 0 ? (
          pontos.map((ponto, index) => (
            <span key={index} className="hora-registro">
              {ponto.hora} {/* Renderiza o valor da propriedade "hora" */}
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
