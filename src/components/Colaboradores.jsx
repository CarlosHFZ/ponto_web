import React, { useState, useEffect } from "react";
import axios from "axios";
import Relogio from "./Relogio"; // Importando o componente Relógio

const Colaboradores = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [nome, setNome] = useState("");
  const [registrosPorColaborador, setRegistrosPorColaborador] = useState({});
  const [visibilidadeRegistros, setVisibilidadeRegistros] = useState({});
  const [mensagemLimite, setMensagemLimite] = useState("");

  // Buscar Colaboradores
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/colaboradores")
      .then((response) => setColaboradores(response.data))
      .catch((error) => console.error("Erro ao buscar colaboradores:", error));
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

  // Buscar registros para um colaborador específico
  const buscarRegistrosPorColaborador = async (colaboradorId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/registros/${colaboradorId}`);
      const registrosLimitados = response.data.slice(0, 4); // Mostrar no máximo 4 registros
      setRegistrosPorColaborador((prev) => ({
        ...prev,
        [colaboradorId]: registrosLimitados,
      }));
    } catch (err) {
      console.error(`Erro ao buscar registros para colaborador ${colaboradorId}:`, err);
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

  return (
    <div>
      <h1>Colaboradores</h1>
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
                {registrosPorColaborador[colab.id].map((registro, index) => (
                  <span key={index} className="hora-registro">
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
