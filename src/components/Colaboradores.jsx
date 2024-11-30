import React, { useState, useEffect } from "react";
import axios from "axios";
import Relogio from "./Relogio"; // Importando o componente Relógio

const Colaboradores = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [nome, setNome] = useState("");
  const [registrosPorColaborador, setRegistrosPorColaborador] = useState({});
  const [visibilidadeRegistros, setVisibilidadeRegistros] = useState({});
  const [dataFiltro, setDataFiltro] = useState(""); // Estado para o filtro de data
  const [mensagemLimite, setMensagemLimite] = useState("");
  const [filtroAplicado, setFiltroAplicado] = useState(false);  // Estado para verificar se o filtro foi aplicado


  useEffect(() => {
    // Função para carregar colaboradores e registros
    const fetchData = async () => {
      // Carregar colaboradores e registros de algum endpoint
    };

    fetchData();
  }, [dataFiltro]);

  // Função que será chamada quando o botão de "Filtrar por data" for pressionado
  const aplicarFiltro = () => {
    setFiltroAplicado(true);
    console.log("Data selecionada para filtro:", dataFiltro); // Verificando o valor de dataFiltro
    filtrarPorData(); // Chama a função de filtragem
  };

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

  // Buscar registros para um colaborador específico (com data opcional)
  const buscarRegistrosPorColaborador = async (colaboradorId, data = '') => {
    try {
      // Se a data não for fornecida, formate a data atual como uma string no formato 'YYYY-MM-DD'
      const dataFormatada = data ? new Date(data).toISOString().split('T')[0] : '';
  
      console.log(`Buscando registros para o colaborador ${colaboradorId} com data ${dataFormatada}`); // Verifica a data formatada
  
      // Envia a data formatada na query string
      const response = await axios.get(`http://127.0.0.1:5000/registros/${colaboradorId}`, {
        params: { data: dataFormatada }
      });
  
      setRegistrosPorColaborador((prev) => ({
        ...prev,
        [colaboradorId]: response.data,
      }));
    } catch (err) {
      console.error(`Erro ao buscar registros para colaborador ${colaboradorId}:`, err);
    }
  };
  

  // Função para filtrar registros pela data
  const filtrarPorData = () => {
    if (dataFiltro) { // Verifica se a dataFiltro não está vazia
      colaboradores.forEach((colaborador) => {
        buscarRegistrosPorColaborador(colaborador.id, dataFiltro); // Passa a dataFiltro para a busca
      });
    } else {
    }
  };

  return (
    <div>
      <div className="div_topo">
        <h1>Painel Colaboradores</h1>
        <Relogio className="Relogio" />
      </div>

      <div className="controle-colaborador">
        <input
          type="text"
          placeholder="Nome do Colaborador"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <button onClick={adicionarColaborador}>Adicionar Colaborador</button>
      </div>

      {/* Adicionando o calendário e o botão de filtro */}
      <div>
        <input
          type="date"
          value={dataFiltro}
          onChange={(e) => setDataFiltro(e.target.value)} // Atualiza o estado da data
        />
        <button onClick={aplicarFiltro}>Filtrar por data</button>
      </div>

      {/* Exibir colaboradores e registros somente após aplicar o filtro */}
      {filtroAplicado && (
        <ul>
          {colaboradores.map((colab) => (
            <li key={colab.id}>
              <div className="colaborador-linha">
                <span className="colaborador_nome">{colab.nome}</span>
                <button
                  onClick={() => removerColaborador(colab.id)}
                  className="botao-remover"
                >
                  Remover Colaborador
                </button>
              </div>

              {/* Exibir os registros diretamente */}
              <div className="registros">
                {registrosPorColaborador[colab.id]?.length > 0 ? (
                  registrosPorColaborador[colab.id].map((registro, index) => (
                    <span key={index} className="hora-registro">
                      {registro.hora}
                    </span>
                  ))
                ) : (
                  <span className="sem-registro">Sem registro</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Colaboradores;
