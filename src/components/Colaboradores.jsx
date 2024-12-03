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
  const [mensagem, setMensagem] = useState({exto:"", tipo: ""});
  const [registroParaAtualizar, setRegistroParaAtualizar] = useState(null);
  const [novoRegistro, setNovoRegistro] = useState("");


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
      .catch(() =>
        setMensagem ({texto: "Erro ao buscar colaboradores.", tipo: "error"})
    ); 
  }, []);

  // Adicionar Colaborador
  const adicionarColaborador = () => {
    axios.post("http://127.0.0.1:5000/colaboradores", { nome })
      .then((response) => {
          setColaboradores([...colaboradores, { id: Date.now(), nome }]);
          setMensagem({texto: "Colaborador adicionado com sucesso!", tipo: "success"});
          setNome("");
      })
      .catch(() =>
        setMensagem ({texto: "Erro ao adicionar colaborador.", tipo: "error"})
    );
  };

  // Remover Colaborador
  const removerColaborador = (id) => {
    axios.delete(`http://127.0.0.1:5000/colaboradores/${id}`)
      .then(response => {

        setColaboradores(colaboradores.filter(colab => colab.id !== id));
        setMensagem({texto: "Colaborador removido com sucesso!", tipo: "success"})
      })
      .catch(() => 
        setMensagem({texto: "Favor atualizar a pagina para remover o colaborador", tipo: "error"})
    );
  };

  const atualizarNomeColaborador = (id, novoNome) => {
    axios.put(`http://127.0.0.1:5000/colaboradores/${id}`, { nome: novoNome })
      .then(response => {
        alert(response.data.message);
        setColaboradores(prevColaboradores => 
          prevColaboradores.map(colab => 
            colab.id === id ? { ...colab, nome: novoNome } : colab
          )
        );
      })
      .catch(error => {
        console.error("Erro ao atualizar nome do colaborador:", error);
        alert("Erro ao atualizar nome do colaborador. Tente novamente.");
      });
  };

  const handleAtualizarNome = (id) => {
    const novoNome = prompt("Digite o novo nome do colaborador:");
    if (novoNome) {
      atualizarNomeColaborador(id, novoNome);
    } else {
      alert("O nome não pode ser vazio!");
    }
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

  // Função para remover a mensagem
  const removerMensagem = () => {
    setMensagem({ texto: "", tipo: "" });
  };


  const atualizarRegistro = (colaboradorId, data, novoRegistro) => {
    axios.put(`http://127.0.0.1:5000/registros/${colaboradorId}`, {
        data: data,           // Data do registro (formato: YYYY-MM-DD)
        registro: novoRegistro // Novo horário do registro (formato: HH:MM:SS)
      })
      .then(response => {
        // Exibe a mensagem de sucesso retornada pelo backend
        alert(response.data.message);
  
        // Atualiza a interface ou recarrega os registros, se necessário
        buscarRegistrosPorColaborador(colaboradorId); // Função já existente no seu frontend
      })
      .catch(error => {
        console.error("Erro ao atualizar registro:", error);
        alert("Erro ao atualizar o registro. Tente novamente.");
      });
  };

  const handleEditarRegistro = (registro) => {
    setRegistroParaAtualizar(registro);
    setNovoRegistro(registro.hora); // Preenche o campo com o horário atual
  };
  
  const handleSalvarRegistro = (colabId) => {
    if (registroParaAtualizar && novoRegistro) {
      atualizarRegistro(colabId, registroParaAtualizar.data, novoRegistro); // Passa colabId ao invés de colaboradorId
      setRegistroParaAtualizar(null); // Limpa a área de edição
      setNovoRegistro(""); // Limpa o campo
    } else {
      alert("Por favor, preencha um novo horário.");
    }
  };
  

  return (
    <div class="container">
      <h1>Painel Colaboradores</h1>
      <div class="relogio">
        <Relogio className="Relogio" />
      </div>

      {/*Exibir a mensagem formatada*/}
      {mensagem.texto && (
        <div className={`alert ${mensagem.tipo}`}>
          {mensagem.texto}
          <button onClick={removerMensagem} className="botao-ok">OK</button>
        </div>
      )}

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
                <button
                  onClick={() => handleAtualizarNome(colab.id)}
                  className="botao-alterar"
                >
                  Alterar Nome
                </button>
              </div>

              {registroParaAtualizar && (
                <div className="editar-registro">
                  <input
                    type="time"
                    value={novoRegistro}
                    onChange={(e) => setNovoRegistro(e.target.value)}
                  />
                  <button onClick={handleSalvarRegistro}>Salvar</button>
                  <button onClick={() => setRegistroParaAtualizar(null)}>Cancelar</button>
                </div>
              )}

              {/* Exibir os registros diretamente */}
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
