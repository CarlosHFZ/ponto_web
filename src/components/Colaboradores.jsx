import React, { useEffect, useState } from "react";
import axios from "axios";
import Relogio from "./Relogio"; // Importando o componente do relógio

const Colaboradores = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [nome, setNome] = useState("");
  const [registrosPorColaborador, setRegistrosPorColaborador] = useState({});
  const [visibilidadeRegistros, setVisibilidadeRegistros] = useState({});
  const [mensagemLimite, setMensagemLimite] = useState("");

  // Buscar Colaboradores
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/colaboradores")
      .then(response => setColaboradores(response.data))
      .catch(error => console.error("Erro ao buscar colaboradores:", error));
  }, []);

  // Adicionar Colaborador
  const adicionarColaborador = () => {
    axios.post("http://127.0.0.1:5000/colaboradores", { nome })
      .then(response => {
        alert(response.data.message);
        setColaboradores([...colaboradores, { id: Date.now(), nome }]);
        setNome("");
      })
      .catch(error => console.error("Erro ao adicionar colaborador:", error));
  };

  // Remover Colaborador
  const removerColaborador = (id) => {
    axios.delete(`http://127.0.0.1:5000/colaboradores/${id}`)
      .then(response => {
        alert(response.data.message);
        setColaboradores(colaboradores.filter(colab => colab.id !== id));
      })
      .catch(error => console.error("Erro ao remover colaborador:", error));
  };

  // Buscar Registros por Colaborador
  const buscarRegistrosPorColaborador = async (colaboradorId) => {
    if (!registrosPorColaborador[colaboradorId]) {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/registros/${colaboradorId}`);
        // Exibir somente os 4 primeiros registros
        const registrosLimitados = response.data.slice(0, 4);

        if (registrosLimitados.length < 4) {
          setRegistrosPorColaborador((prev) => ({
            ...prev,
            [colaboradorId]: registrosLimitados,
          }));
        } else {
          setRegistrosPorColaborador((prev) => ({
            ...prev,
            [colaboradorId]: registrosLimitados,
          }));
        }
      } catch (err) {
        console.error(`Erro ao buscar registros para colaborador ${colaboradorId}:`, err);
      }
    }
  };

  // Alternar visibilidade dos registros
  const alternarVisibilidadeRegistros = (colaboradorId) => {
    setVisibilidadeRegistros((prev) => ({
      ...prev,
      [colaboradorId]: !prev[colaboradorId],
    }));
    buscarRegistrosPorColaborador(colaboradorId);
  };

  // Adicionar um novo registro
  const adicionarRegistro = async (colaboradorId, hora) => {
    try {
      // Verificar se já existem 4 registros
      if (registrosPorColaborador[colaboradorId] && registrosPorColaborador[colaboradorId].length >= 4) {
        setMensagemLimite("Limite de 4 horários atingido.");
        return;
      }
      
      // Adicionar o novo registro
      const response = await axios.post("http://127.0.0.1:5000/registros", {
        colaboradorId,
        hora,
      });

      // Atualiza a lista de registros
      setRegistrosPorColaborador((prev) => ({
        ...prev,
        [colaboradorId]: [...(prev[colaboradorId] || []), response.data],
      }));
    } catch (err) {
      console.error(`Erro ao adicionar registro para colaborador ${colaboradorId}:`, err);
    }
  };

  return (
    <div>
      <h1>Colaboradores</h1>

      {/* Adicionando o relógio */}
      <Relogio className="Relogio" />

      {/* Mensagem de alerta para o limite de 4 registros */}
      {mensagemLimite && <div className="alerta-limite">{mensagemLimite}</div>}

      <ul>
        {colaboradores.map((colab) => (
          <li key={colab.id}>
            <span>{colab.nome}</span>

            {/* Botão para buscar e mostrar registros do colaborador */}
            <button onClick={() => alternarVisibilidadeRegistros(colab.id)}>
              {visibilidadeRegistros[colab.id] ? "Esconder Registros" : "Mostrar Registros"}
            </button>

            {/* Exibir os registros se existirem */}
            {visibilidadeRegistros[colab.id] && registrosPorColaborador[colab.id] && (
              <div className="registros">
                {registrosPorColaborador[colab.id].map((registro) => (
                  <span key={registro.id_registro} className="hora-registro">
                    {registro.hora}
                  </span>
                ))}
              </div>
            )}

            {/* Botão de remover com classe para estilo */}
            <button onClick={() => removerColaborador(colab.id)} className="botao-remover">Remover</button>
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Nome do Colaborador"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <button onClick={adicionarColaborador}>Adicionar</button>
    </div>
  );
};

export default Colaboradores;
