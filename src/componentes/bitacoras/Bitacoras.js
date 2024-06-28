import React, { Fragment, useEffect, useState } from "react";
import clienteAxios from "../../api/axios";
import { useParams } from "react-router-dom";
import "./css/BitacorasAprendices.css";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { FaDownload } from "react-icons/fa";
import { FaFileUpload } from "react-icons/fa";

function Bitacoras() {
  // Estado para mostrar spinner si se está cargando los datos.
  const [loading, setLoading] = useState(false);
  const [documento, setDocumento] = useState({
    numero_de_bitacora: "",
    archivo: null,
  });
  const [documentosAprendiz, setDocumentosAprendiz] = useState([]);
  const { id_aprendiz } = useParams();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [bitacoraToUpdate, setBitacoraToUpdate] = useState(null);
  const [hoveredDownload, setHoveredDownload] = useState(null);
  const [hoveredUpdate, setHoveredUpdate] = useState(null);

  useEffect(() => {
    const fetchDocumentosAprendiz = async () => {
      try {
        const response = await clienteAxios.get(
          `/bitacoras-aprendiz/${id_aprendiz}`
        );
        const sortedBitacoras = response.data.bitacoras.sort(
          (a, b) => a.numero_de_bitacora - b.numero_de_bitacora
        );
        setDocumentosAprendiz(sortedBitacoras);
      } catch (error) {
        console.error("Error al obtener las bitácoras del aprendiz:", error);
      }
    };

    fetchDocumentosAprendiz();
  }, [id_aprendiz]);

  const handleDocumentoChange = (e) => {
    setDocumento({
      ...documento,
      [e.target.name]: e.target.value,
    });
  };

  const handleArchivoChange = (e) => {
    const archivo = e.target.files[0];
    const allowedFileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.google-apps.spreadsheet'];
    
    if (archivo && !allowedFileTypes.includes(archivo.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Archivo no permitido',
        text: 'Solo se permiten archivos de Excel o hojas de cálculo de Google',
        showConfirmButton: true,
      });
      setDocumento({ ...documento, archivo: null });
      e.target.value = null;
      return;
    }
    setDocumento({ ...documento, archivo });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('numero_de_bitacora', documento.numero_de_bitacora);
    formData.append('archivo', documento.archivo);
  
    try {
      await clienteAxios.post(`/bitacoras-upload/${id_aprendiz}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Bitácora cargada exitosamente',
        showConfirmButton: true,
      });
  
      const response = await clienteAxios.get(`/bitacoras-aprendiz/${id_aprendiz}`);
      const sortedBitacoras = response.data.bitacoras.sort(
        (a, b) => a.numero_de_bitacora - b.numero_de_bitacora
      );
      setDocumentosAprendiz(sortedBitacoras);
    } catch (error) {
      console.error('Error al cargar la bitácora:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar la bitácora',
        text: error.response.data.mensaje,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };
  

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

  const handleActualizar = async (bitacora) => {
    setModalIsOpen(true);
    setBitacoraToUpdate(bitacora);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleFileSelected = async (e) => {
    handleCloseModal();

    const nuevoArchivo = e.target.files[0];
    if (nuevoArchivo && bitacoraToUpdate) {
      try {
        const formData = new FormData();
        formData.append("archivo", nuevoArchivo);

        await clienteAxios.put(
          `/bitacoras-update/${bitacoraToUpdate.id_bitacora}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const response = await clienteAxios.get(
          `/bitacoras-aprendiz/${id_aprendiz}`
        );
        const sortedBitacoras = response.data.bitacoras.sort(
          (a, b) => a.numero_de_bitacora - b.numero_de_bitacora
        );
        setDocumentosAprendiz(sortedBitacoras);

        Swal.fire({
          icon: "success",
          title: "Bitácora actualizada exitosamente",
          showConfirmButton: true,
        });
      } catch (error) {
        console.error("Error al actualizar la bitácora:", error);
        Swal.fire({
          icon: "error",
          title: "Error al actualizar la bitácora",
          text: error.response.data.mensaje,
          showConfirmButton: true,
        });
      }
    }
  };

  const handleMouseDownload = (id) => {
    setHoveredDownload(id);
  };

  const handleLeaveDownload = () => {
    setHoveredDownload(null);
  };

  const handleMouseUpdate = (id) => {
    setHoveredUpdate(id);
  };

  const handleLeaveUpdate = () => {
    setHoveredUpdate(null);
  };

  return (
    <Fragment>
      <div className="docs-content">
        <h1 className="text-center upTitle">Cargar Bitácoras</h1>
        <div className="form-docs">
          <form onSubmit={handleSubmit}>
            <p className="tipoDocumento">
              Número de bitácora:
              <select
                name="numero_de_bitacora"
                onChange={handleDocumentoChange}
                required
                className="seletBitacoraNumber"
              >
                <option value="">Selecciona un número de bitácora</option>
                {[...Array(12).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
            </p>
            <p>
              Selecciona un archivo:{" "}
              <input
                type="file"
                name="archivo"
                onChange={handleArchivoChange}
                required
              />
            </p>
            <button type="submit" className="btn-upload-biatcora">
              {loading ? (<span className="spinner"></span>) : ("Cargar Bitácora")}
            </button>
          </form>
        </div>
        <div className="mt-4">
          <h2 className="text-center your-bitacoras-title">Tus Bitácoras</h2>
          <table className="docsAprendicesTab">
            <thead className="Thead2">
              <tr className="trr">
                <th className="thh">Número de bitácora</th>
                <th className="thh">Observaciones</th>
                <th className="thh">Estado</th>
                <th className="thh">Acciones</th>
              </tr>
            </thead>
            <tbody className="tbody2">
              {documentosAprendiz &&
                documentosAprendiz.map((doc) => (
                  <tr key={doc.id_bitacora} className="trr">
                    <td className="td-aprendiz">{doc.numero_de_bitacora}</td>
                    <td className="td-aprendiz">
                      {doc.observaciones
                        ? doc.observaciones
                        : "No hay observaciones"}
                    </td>
                    <td className="td-aprendiz">
                      {doc.estado ? "Aprobada" : "No aprobada"}
                    </td>
                    <td className="td-aprendiz">
                      <div className="btn-content">
                        <button
                          onClick={() => handleDownload(doc.archivo)}
                          className="btnDownload"
                          onMouseEnter={() =>
                            handleMouseDownload(doc.id_bitacora)
                          }
                          onMouseLeave={handleLeaveDownload}
                        >
                          <FaDownload />
                          {hoveredDownload === doc.id_bitacora && (
                            <span className="tooltip-bitacoras-aprendiz">
                              Descargar bitácora
                            </span>
                          )}
                        </button>
                        {doc.observaciones && (
                          <button
                            onClick={() => handleActualizar(doc)}
                            className="btnActualizar"
                            onMouseEnter={() =>
                              handleMouseUpdate(doc.id_bitacora)
                            }
                            onMouseLeave={handleLeaveUpdate}
                          >
                            <FaFileUpload />
                            {hoveredUpdate === doc.id_bitacora && (
                              <span className="tooltip-bitacoras-aprendiz">
                                Actualizar Bitácora
                              </span>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Actualizar Bitácora"
          className="modal-bitacoras-aprendiz"
          overlayClassName="modal-overlay-bitacoras-aprendiz"
        >
          <button onClick={handleCloseModal}>
            <strong>X</strong>
          </button>
          <h2>Actualizar Bitácora</h2>
          <input
            type="file"
            name="nuevoArchivo"
            onChange={handleFileSelected}
          />
        </Modal>
      </div>
    </Fragment>
  );
}

export default Bitacoras;
