import React, { useState, useEffect } from "react";
import axios from "axios";
import Relogio from "./Relogio";

const Colaboradores = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [nome, setNome] = useState("");                     
  const [registrosPorColaborador, setRegistrosPorColaborador] = useState({});
  const [dataFiltro, setDataFiltro] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [filtroAplicado, setFiltroAplicado] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/colaboradores")
      .then((response) => setColaboradores(response.data))
      .catch((error) => {
        console.error("Erro ao buscar colaboradores:", error);
        setNotification({ message: "Erro ao carregar colaboradores.", type: "error" });
      });
  }, []);

  const adicionarColaborador = () => {
    axios.post("http://127.0.0.1:5000/colaboradores", { nome })
      .then(response => {
        setNotification({ message: response.data.message, type: "success" });
        setColaboradores([...colaboradores, { id: Date.now(), nome }]);
        setNome("");
      })
      .catch(error => {
        console.error("Erro ao adicionar colaborador:", error);
        setNotification({ message: "Erro ao adicionar colaborador.", type: "error" });
      });
  };

  const removerColaborador = (id) => {
    axios.delete(`http://127.0.0.1:5000/colaboradores/${id}`)
      .then(response => {
        setNotification({ message: response.data.message, type: "success" });
        setColaboradores(colaboradores.filter(colab => colab.id !== id));
      })
      .catch(error => {
        console.error("Erro ao remover colaborador:", error);
        setNotification({ message: "Erro ao remover colaborador.", type: "error" });
      });
  };

  const aplicarFiltro = () => {
    setFiltroAplicado(true);
    if (!dataFiltro) {
      setNotification({ message: "Por favor, selecione uma data para filtrar.", type: "error" });
      return;
    }
    // Implementação do filtro aqui
    setNotification({ message: "Filtro aplicado com sucesso.", type: "success" });
  };

  // Função para fechar a notificação
  const fecharNotificacao = () => {
    setNotification({ message: "", type: "" });
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

      <div>
        <input
          type="date"
          value={dataFiltro}
          onChange={(e) => setDataFiltro(e.target.value)}
        />
        <button onClick={aplicarFiltro}>Filtrar por data</button>
      </div>

      {filtroAplicado && (
        <ul>
          {colaboradores.map((colab) => (
            <li key={colab.id}>
              <div className="colaborador-linha">
                <span className="colaborador_nome">{colab.nome}</span>
                <button onClick={() => removerColaborador(colab.id)} className="botao-remover">
                  Remover Colaborador
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

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

export default Colaboradores;
