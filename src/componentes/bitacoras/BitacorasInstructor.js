import React, { useEffect, useState } from "react";
import clienteAxios from "../../api/axios";
import "./css/BitacorasInstructor.css";
import Modal from "react-modal";
import { FaClipboardCheck } from "react-icons/fa6";
import { MdAddComment } from "react-icons/md";
import { FaDownload } from "react-icons/fa";

const ITEMS_PER_PAGE = 20;

function BitacorasInstructor() {
  const [bitacoras, setBitacoras] = useState([]);
  const [numeroFicha, setNumeroFicha] = useState("");
  const [nombreAprendiz, setNombreAprendiz] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [bitacoraSeleccionada, setBitacoraSeleccionada] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [aprendizInfo, setAprendizInfo] = useState([]);
  const [fichaAprendizInfo, setFichaAprendizInfo] = useState({});
  const [hoveredButton, setHoveredButton] = useState(null); // Estado para controlar el hover
  const [hoveredObservaciones, setHoveredObservaciones] = useState(null);
  const [hoveredDownload, setHoveredDownload] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBitacoras = async () => {
      try {
        const response = await clienteAxios.get(`/bitacoras-aprendiz-getAll`);
        const bitacorasData = response.data.bitacoras;
        setBitacoras(bitacorasData);

        const aprendizPromises = bitacorasData.map(async (bitacora) => {
          const aprendizRes = await clienteAxios.get(
            `/aprendiz/id/${bitacora.id_aprendiz}`
          );
          const aprendizData = aprendizRes.data;

          const fichaRes = await clienteAxios.get(
            `/ficha-aprendiz/ficha/${aprendizData.numero_ficha}`
          );
          const fichaData = fichaRes.data.ficha;

          setAprendizInfo((prevState) => ({
            ...prevState,
            [bitacora.id_aprendiz]: aprendizData,
          }));

          setFichaAprendizInfo((prevState) => ({
            ...prevState,
            [aprendizData.numero_ficha]: fichaData,
          }));
        });

        await Promise.all(aprendizPromises);
      } catch (error) {
        console.error("Error al obtener las bitácoras:", error);
      }
    };

    fetchBitacoras();
  }, []);

  console.log(aprendizInfo);

  const enviarObservacion = async () => {
    try {
      await clienteAxios.post(
        `/enviar-observacion/${bitacoraSeleccionada.id_bitacora}`,
        { observaciones }
      );
      const response = await clienteAxios.get(`/bitacoras-aprendiz-getAll`);
      setBitacoras(response.data.bitacoras);
      setObservaciones("");
      closeModal();
    } catch (error) {
      console.error("Error al enviar observaciones:", error);
    }
  };

  const aprobarBitacora = async (idBitacora) => {
    try {
      await clienteAxios.put(`/aprobar-bitacora/${idBitacora}`);
      setBitacoras((prevBitacoras) =>
        prevBitacoras.map((bitacora) => {
          if (bitacora.id_bitacora === idBitacora) {
            return { ...bitacora, estado: true, observaciones: "" };
          }
          return bitacora;
        })
      );
    } catch (error) {
      console.error("Error al aprobar la bitácora:", error);
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

  const handleObservacionChange = (event) => {
    setObservaciones(event.target.value);
  };

  const openModal = (bitacora) => {
    setBitacoraSeleccionada(bitacora);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const bitacorasFiltradas = bitacoras.filter((bitacora) => {
    const aprendiz = aprendizInfo[bitacora.id_aprendiz] || {};
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

  const handleDownload = async (archivo) => {
    try {
      const response = await clienteAxios.get(
        `/bitacoras-download/${archivo}`,
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

  // Ordenar los documentos por el nombre del aprendiz
  const bitacorasOrdenadas = bitacorasFiltradas.sort((a, b) => {
    const aprendizA = aprendizInfo[a.id_aprendiz] || {};
    const aprendizB = aprendizInfo[b.id_aprendiz] || {};
    const nombreA = (aprendizA.nombres || "").toLowerCase();
    const nombreB = (aprendizB.nombres || "").toLowerCase();
    if (nombreA < nombreB) return -1;
    if (nombreA > nombreB) return 1;
    // Si los nombres son iguales, ordenar por número de bitácora ascendente
    return a.numero_de_bitacora - b.numero_de_bitacora;
  });
  

  const totalPages = Math.ceil(bitacorasOrdenadas.length / ITEMS_PER_PAGE);

  const bitacorasPaginadas = bitacorasOrdenadas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  const handleMouseEnter = (id) => {
    setHoveredButton(id);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  const handleMosuseObservaciones = (id) => {
    setHoveredObservaciones(id);
  };

  const handleLeaveObservaciones = () => {
    setHoveredObservaciones(null);
  };

  const handleMosuseDownload = (id) => {
    setHoveredDownload(id);
  };

  const handleLeaveDownload = () => {
    setHoveredDownload(null);
  };

  return (
    <div className="instru-bitacoras-box">
      <h2 className="text-center" style={{ color: "#39a900" }}>
        Bitácoras de los aprendices
      </h2>
      <div className="Search-biatcorasInstructor-box">
        <p className="pr-4">
          Buscar por numero de ficha:
          <input
            type="search"
            placeholder="Numero de ficha"
            value={numeroFicha}
            onChange={handleNumeroFichaChange}
            className="pl-2"
          />
        </p>
        <p className="pr-4">
          Buscar por nombres del Aprendiz:
          <input
            type="search"
            placeholder="Nombres del aprendiz"
            value={nombreAprendiz}
            onChange={handleNombreAprendizChange}
            className="pl-2"
          />
        </p>
      </div>
      <table className="docsTab-bitacoras">
        <thead className="Thead">
          <tr className="tr">
            <th className="th text-nowrap">N° bitácora</th>
            <th className="th">N° veces cargada</th>
            <th className="th text-nowrap">N° Documento</th>
            <th className="th">Nombres</th>
            <th className="th">Apellidos</th>
            <th className="th text-nowrap">N° Ficha</th>
            <th className="th">Programa de Formación</th>
            <th className="th">Observaciones</th>
            <th className="th">Estado</th>
            <th className="th">Acciones</th>
          </tr>
        </thead>
        <tbody className="tbody">
          {bitacorasPaginadas.map((bitacora) => {
            const aprendiz = aprendizInfo[bitacora.id_aprendiz] || {};
            const ficha = fichaAprendizInfo[aprendiz.numero_ficha] || {};
            return (
              <tr key={bitacora.id_bitacora} className="tr">
                <td className="td-instru">{bitacora.numero_de_bitacora}</td>
                <td className="td-instru">{bitacora.intentos}</td>
                <td className="td-instru">{aprendiz.numero_documento}</td>
                <td className="td-instru">{aprendiz.nombres}</td>
                <td className="td-instru">{aprendiz.apellidos}</td>
                <td className="td-instru">{aprendiz.numero_ficha}</td>
                <td className="td-instru">{ficha.programa_formacion}</td>
                <td className="td-instru">
                  {bitacora.observaciones
                    ? bitacora.observaciones
                    : "No hay observaciones"}
                </td>
                <td className="td-instru">
                  {bitacora.estado ? "Aprobada" : "No aprobada"}
                </td>
                <td className="td-instru">
                  <div className="bitacoras-actions">
                    <div>
                      {!bitacora.estado && (
                        <button
                          onClick={() => aprobarBitacora(bitacora.id_bitacora)}
                          className="flex btnAprobar"
                          onMouseEnter={() =>
                            handleMouseEnter(bitacora.id_bitacora)
                          }
                          onMouseLeave={handleMouseLeave}
                        >
                          {" "}
                          <FaClipboardCheck />
                          {hoveredButton === bitacora.id_bitacora && (
                            <span className="download-tooltip">
                              Aprobar Bitácora
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                    <div className="">
                      {!bitacora.estado && (
                        <button
                          onClick={() => openModal(bitacora)}
                          className="btnEnviarObservacion"
                          onMouseEnter={() =>
                            handleMosuseObservaciones(bitacora.id_bitacora)
                          }
                          onMouseLeave={handleLeaveObservaciones}
                        >
                          <MdAddComment />
                          {hoveredObservaciones === bitacora.id_bitacora && (
                            <span className="download-tooltip">
                              Añadir Observación
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={() => handleDownload(bitacora.archivo)}
                        className="btnDownloadInstru flex"
                        onMouseEnter={() =>
                          handleMosuseDownload(bitacora.id_bitacora)
                        }
                        onMouseLeave={handleLeaveDownload}
                      >
                        <FaDownload />
                        {hoveredDownload === bitacora.id_bitacora && (
                          <span className="download-tooltip">
                            Descargar bitácora
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Agregar Observación Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <h2 className="text-center">Agregar Observación</h2>
          <textarea
            rows="4"
            placeholder="Escriba aquí sus observaciones"
            value={observaciones}
            onChange={handleObservacionChange} // Actualizar el estado de observacion
          />
          <button onClick={enviarObservacion} className="btnEnviar">
            Enviar Observación
          </button>
        </div>
      </Modal>
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

export default BitacorasInstructor;
