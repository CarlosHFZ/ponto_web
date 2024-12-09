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
  const [registroSelecionado, setRegistroSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  


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
      const dataFormatada = data ? new Date(data).toISOString().split('T')[0] : '';
      console.log(`Buscando registros para o colaborador ${colaboradorId} com data ${dataFormatada}`);
      const response = await axios.get(`http://127.0.0.1:5000/registros/${colaboradorId}`, {
        params: { data: dataFormatada }
      });
      console.log("Resposta de registros:", response.data);
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


  const editarRegistroPorHorario = (horarioAtual, novoHorario, data) => {
    console.log("Hora atual: ", horarioAtual);
    console.log("Novo horário: ", novoHorario);
    console.log("Data: ", data); // Verifique a data que está sendo passada

    // Verificar o formato da data para garantir que está no formato correto
    const dataFormatada = new Date(data);
    if (isNaN(dataFormatada)) {
        alert("Formato de data inválido. Use o formato YYYY-MM-DD.");
        return;
    }
    const dataString = dataFormatada.toISOString().split("T")[0]; // Formato YYYY-MM-DD

    axios
      .put(`http://127.0.0.1:5000/registros/${horarioAtual}`, {
        registro: novoHorario,
        data: dataString,  // Enviando a data formatada
      })
      .then((response) => {
        alert(response.data.message);
        setRegistrosPorColaborador((prev) => {
          const updatedRegistros = { ...prev };
          for (let colabId in updatedRegistros) {
            const registros = updatedRegistros[colabId];
            const index = registros.findIndex(
              (registro) => registro.hora === horarioAtual
            );
            if (index !== -1) {
              registros[index] = { ...registros[index], hora: novoHorario }; // Atualizando a hora
              break;
            }
          }
          return updatedRegistros;
        });
      })
      .catch((error) => {
        console.error("Erro ao atualizar registro:", error);
        alert("Erro ao atualizar o registro.");
      });
  };

  

  const abrirModal = (registro, colaboradorId) => {
    setRegistroSelecionado({
      ...registro,
      colaboradorId,
      horarioAtual: registro.hora, // Armazena o horário original
    });
    setMostrarModal(true);
  };
  
  const excluirRegistroPorHorario = (horarioAtual) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      axios
        .delete(`http://127.0.0.1:5000/registros/${horarioAtual}`)
        .then((response) => {
          alert(response.data.message);
          setRegistrosPorColaborador((prev) => {
            const updatedRegistros = { ...prev };
            for (let colabId in updatedRegistros) {
              updatedRegistros[colabId] = updatedRegistros[colabId].filter(
                (registro) => registro.hora !== horarioAtual
              );
            }
            return updatedRegistros;
          });
        })
        .catch((error) => {
          console.error("Erro ao excluir registro:", error);
          alert("Erro ao excluir o registro.");
        });
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

              {mostrarModal && (
                <div className="modal">
                  <div className="modal-conteudo">
                    <h3>Editar Registro</h3>
                    <input
                      type="time"
                      value={registroSelecionado.hora || ""}
                      onChange={(e) =>
                        setRegistroSelecionado((prev) => ({
                          ...prev,
                          hora: e.target.value,
                        }))
                      }
                    />
                    <div className="botoes-modal">
                    <button
                      onClick={() => {
                        editarRegistroPorHorario(
                          registroSelecionado.horarioAtual, // Horário original
                          registroSelecionado.hora,        // Novo horário
                          dataFiltro         // Data
                        );
                        setMostrarModal(false);
                      }}
                    >
                      Salvar
                    </button>
                      <button onClick={() => setMostrarModal(false)}>Cancelar</button>
                      <button
                        onClick={() => {
                          excluirRegistroPorHorario(registroSelecionado.hora); // Passa o horário para excluir
                          setMostrarModal(false);
                        }}
                      >
                        Apagar
                      </button>
                    </div>
                  </div>
                </div>
                
                )}

              
              {/* Exibir os registros diretamente */}
              <div className="registros">
              {registrosPorColaborador[colab.id]?.length > 0 ? (
                registrosPorColaborador[colab.id].map((registro) => (
                  <span
                    onClick={() => abrirModal(registro, colab.id)}
                    key={registro.id}  // Use o ID do registro como chave
                    className="hora-registro"
                  >
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
