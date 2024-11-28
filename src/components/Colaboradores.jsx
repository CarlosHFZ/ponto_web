import React, { useEffect, useState } from "react";
import axios from "axios";
import Relogio from "./Relogio"; // Importando o componente do relógio

const Colaboradores = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [nome, setNome] = useState("");
  const [registrosPorColaborador, setRegistrosPorColaborador] = useState({});
  const [visibilidadeRegistros, setVisibilidadeRegistros] = useState({});

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
        setRegistrosPorColaborador((prev) => ({
          ...prev,
          [colaboradorId]: response.data,
        }));
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

  return (
    <div>
      <h1>Colaboradores</h1>

      {/* Adicionando o relógio */}
      <Relogio className="Relogio" />

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
              <ul>
                {registrosPorColaborador[colab.id].map((registro) => (
                  <li key={registro.id_registro}>{registro.hora}</li>
                ))}
              </ul>
            )}

            <button onClick={() => removerColaborador(colab.id)}>Remover</button>
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
