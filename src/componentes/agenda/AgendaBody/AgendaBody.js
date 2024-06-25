import React from 'react';
import './css/AgendaBody.css';
import AgendaCell from '../AgendaCell/AgendaCell';

function AgendaBody({ visitas, paginaActual }) {
  // Calcular el índice inicial y final de las visitas a mostrar en la página actual
  const indiceInicial = (paginaActual - 1) * 3;
  const indiceFinal = paginaActual * 3;
  // Obtener las visitas para la página actual
  const visitasPagina = visitas.slice(indiceInicial, indiceFinal);

  return (
    <div className="agenda-body">
      {/* Mapea solo las visitas de la página actual y renderiza un componente AgendaCell por cada una */}
      {visitasPagina.map((visita, index) => (
        <div key={index} className="visit"> {/* Aplica la clase 'visit' a cada visita */}
          <AgendaCell visita={visita} />
        </div>
      ))}
    </div>
  );
}

export default AgendaBody;
