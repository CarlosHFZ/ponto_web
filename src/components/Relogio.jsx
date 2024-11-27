import React, { useState, useEffect } from "react";

const Relogio = () => {
  const [dataHora, setDataHora] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDataHora(new Date());
    }, 1000);

    return () => clearInterval(timer); // Limpa o intervalo ao desmontar
  }, []);

  return (
    <div className="relogio">
      {dataHora.toLocaleDateString()} - {dataHora.toLocaleTimeString()}
    </div>
  );
};

export default Relogio;
