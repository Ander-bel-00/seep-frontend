// PageNavigation.js
import React from 'react';
import './css/PageNavigation.css';

function PageNavigation({ totalPaginas, paginaActual, cambiarPagina }) {
  const paginaAnterior = () => {
    if (paginaActual > 1) {
      cambiarPagina(paginaActual - 1);
    }
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      cambiarPagina(paginaActual + 1);
    }
  };

  return (
    <div className="page-navigation">
      <button className="anterior" onClick={paginaAnterior} disabled={paginaActual === 1}>
        <i className="fas fa-chevron-left"></i> {/* Icono de flecha hacia la izquierda */}
      </button>
      <span>{paginaActual} de {totalPaginas}</span>
      <button className="siguiente" onClick={paginaSiguiente} disabled={paginaActual === totalPaginas}>
        <i className="fas fa-chevron-right"></i> {/* Icono de flecha hacia la derecha */}
      </button>
    </div>
  );
}

export default PageNavigation;
