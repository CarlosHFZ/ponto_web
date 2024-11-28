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
    <h2 style={{ fontSize: '28px'}}>
      {dataHora.toLocaleDateString()} - {dataHora.toLocaleTimeString()}
    </h2>
  );
};

export default Relogio;
