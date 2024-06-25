import React, { useEffect, useState } from "react";
import clienteAxios from "../../api/axios";
import "./css/documents-instructores.css";
import { FaDownload } from "react-icons/fa";

const ITEMS_PER_PAGE = 20;

function InstructorDocuments() {
  const [documentosAprendiz, setDocumentosAprendiz] = useState([]);
  const [numeroFicha, setNumeroFicha] = useState("");
  const [nombreAprendiz, setNombreAprendiz] = useState("");
  const [aprendizInfo, setAprendizInfo] = useState({});
  const [fichaAprendizInfo, setFichaAprendizInfo] = useState({});
  const [hoveredButton, setHoveredButton] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDocumentosAprendiz = async () => {
      try {
        const response = await clienteAxios.get(`/documentos-aprendiz-getAll`);
        const documentosData = response.data.documentos;
        setDocumentosAprendiz(documentosData);

        const aprendizPromises = documentosData.map(async (documento) => {
          const aprendizRes = await clienteAxios.get(
            `/aprendiz/id/${documento.id_aprendiz}`
          );
          const aprendizData = aprendizRes.data;

          const fichaRes = await clienteAxios.get(
            `/ficha-aprendiz/ficha/${aprendizData.numero_ficha}`
          );
          const fichaData = fichaRes.data.ficha;

          setAprendizInfo((prevState) => ({
            ...prevState,
            [documento.id_aprendiz]: aprendizData,
          }));

          setFichaAprendizInfo((prevState) => ({
            ...prevState,
            [aprendizData.numero_ficha]: fichaData,
          }));
        });

        await Promise.all(aprendizPromises);
      } catch (error) {
        console.error("Error al obtener los documentos del aprendiz:", error);
      }
    };

    fetchDocumentosAprendiz();
  }, []);

  const handleDownload = async (archivo) => {
    try {
      const response = await clienteAxios.get(
        `/documentos-download/${archivo}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", archivo);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  const handleNumeroFichaChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setNumeroFicha(value);
      setCurrentPage(1);  // Resetear a la primera página cuando se cambia el filtro
    }
  };

  const handleNombreAprendizChange = (event) => {
    const value = event.target.value;
    if (!/\d/.test(value)) {
      setNombreAprendiz(value);
      setCurrentPage(1);  // Resetear a la primera página cuando se cambia el filtro
    }
  };

  const documentosFiltrados = documentosAprendiz.filter((documento) => {
    const aprendiz = aprendizInfo[documento.id_aprendiz];
    if (!aprendiz) return false;

    if (
      numeroFicha &&
      !aprendiz.numero_ficha.toString().includes(numeroFicha.toString())
    ) {
      return false;
    }

    if (
      nombreAprendiz &&
      !aprendiz.nombres.toLowerCase().includes(nombreAprendiz.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Ordenar los documentos por el nombre del aprendiz
  const documentosOrdenados = documentosFiltrados.sort((a, b) => {
    const aprendizA = aprendizInfo[a.id_aprendiz] || {};
    const aprendizB = aprendizInfo[b.id_aprendiz] || {};
    const nombreA = (aprendizA.nombres || "").toLowerCase();
    const nombreB = (aprendizB.nombres || "").toLowerCase();
    if (nombreA < nombreB) return -1;
    if (nombreA > nombreB) return 1;
    return 0;
  });

  const totalPages = Math.ceil(documentosOrdenados.length / ITEMS_PER_PAGE);

  const documentosPaginados = documentosOrdenados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleMouseEnter = (id) => {
    setHoveredButton(id);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="div-docs-instruc">
      <h2 className="text-center" style={{ color: "#39a900" }}>
        Documentos de los Aprendices
      </h2>
      <div className="Search-documents-box">
        <p className="pr-4">
          Buscar por número de ficha:
          <input
            type="text"
            placeholder="Número de ficha"
            value={numeroFicha}
            onChange={handleNumeroFichaChange}
            className="pl-2"
          />
        </p>
        <p className="pr-4">
          Buscar por nombres del Aprendiz:
          <input
            type="text"
            placeholder="Nombres del aprendiz"
            value={nombreAprendiz}
            onChange={handleNombreAprendizChange}
            className="pl-2"
          />
        </p>
      </div>
      <table className="docsTab">
        <thead className="Thead">
          <tr className="tr">
            <th className="th-docs">Tipo de Archivo</th>
            <th className="th-docs">N° Documento De Identidad</th>
            <th className="th-docs">Nombres</th>
            <th className="th-docs">Apellidos</th>
            <th className="th-docs">N° de Ficha</th>
            <th className="th-docs">Programa de Formación</th>
            <th className="th-docs">Acciones</th>
          </tr>
        </thead>
        <tbody className="tbody">
          {documentosPaginados.map((documento) => {
            const aprendiz = aprendizInfo[documento.id_aprendiz] || {};
            const ficha = fichaAprendizInfo[aprendiz.numero_ficha] || {};

            return (
              <tr key={documento.id_documento} className="tr">
                <td className="td">{documento.tipo_documento}</td>
                <td className="td">{aprendiz.numero_documento}</td>
                <td className="td">{aprendiz.nombres}</td>
                <td className="td">{aprendiz.apellidos}</td>
                <td className="td">{aprendiz.numero_ficha}</td>
                <td className="td">{ficha.programa_formacion}</td>
                <td className="td text-center">
                  <button
                    onClick={() => handleDownload(documento.archivo)}
                    className="btnDownloadInstruc"
                    onMouseEnter={() =>
                      handleMouseEnter(documento.id_documento)
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    <FaDownload />
                    {hoveredButton === documento.id_documento && (
                      <span className="download-tooltip">
                        Descargar documento
                      </span>
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default InstructorDocuments;
