import React, { Fragment, useState, useEffect } from "react";
import clienteAxios from "../../api/axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./css/documets-aprendiz.css";
import { FaDownload } from "react-icons/fa";

function Documents() {
  // Estado para mostrar spinner si se está cargando los datos.
  const [loading, setLoading] = useState(false);
  const [documento, setDocumento] = useState({
    tipo_documento: "",
    archivo: null,
  });
  const [documentosAprendiz, setDocumentosAprendiz] = useState([]);
  const { id_aprendiz } = useParams();
  const [hoveredButton, setHoveredButton] = useState(null); // Estado para controlar el hover

  useEffect(() => {
    const fetchDocumentosAprendiz = async () => {
      try {
        const response = await clienteAxios.get(
          `/documentos-aprendiz/${id_aprendiz}`
        );
        setDocumentosAprendiz(response.data.documentos);
      } catch (error) {
        console.error("Error al obtener los documentos del aprendiz:", error);
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
    setDocumento({
      ...documento,
      archivo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activar el estado de carga

    // Verificar si el tipo de documento ya ha sido subido
    const documentoExistente = documentosAprendiz.find(
      (doc) => doc.tipo_documento === documento.tipo_documento
    );

    if (documentoExistente) {
      Swal.fire({
        icon: "error",
        title: "El tipo de documento ya ha sido cargado",
        text: `Ya se subió un archivo para el tipo de documento: ${documento.tipo_documento}`,
        showConfirmButton: true,
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("tipo_documento", documento.tipo_documento);
    formData.append("archivo", documento.archivo);

    try {
      await clienteAxios.post(`/documentos-upload/${id_aprendiz}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Mostrar alerta de éxito
      Swal.fire({
        icon: "success",
        title: "Documento cargado exitosamente",
        showConfirmButton: true,
      });

      // Actualizar la lista de documentos del aprendiz después de cargar uno nuevo
      const response = await clienteAxios.get(
        `/documentos-aprendiz/${id_aprendiz}`
      );
      setDocumentosAprendiz(response.data.documentos);
    } catch (error) {
      console.error("Error al cargar el documento:", error);
      // Mostrar alerta de error si falla la carga del documento
      Swal.fire({
        icon: "error",
        title: "Error al cargar el documento",
        text:
          error.response?.data?.mensaje ||
          "Hubo un problema al subir el documento",
        showConfirmButton: true,
      });
      setLoading(false);
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

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

  const handleMouseEnter = (id) => {
    setHoveredButton(id);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  return (
    <Fragment>
      <div className="docs-content">
        <h1 className="text-center upTitle">Cargar Documentos</h1>
        <div className="form-docs-aprendiz my-4">
          <form onSubmit={handleSubmit}>
            <p className="tipoDocumento">
              Tipo de documento:
              <select
                name="tipo_documento"
                onChange={handleDocumentoChange}
                required
                className="ml-2"
              >
                <option value="">Selecciona un tipo de documento</option>
                <option value="Documento de Identidad">
                  Documento de Identidad
                </option>
                <option value="Carnet Destruido">Carnet Destruido</option>
                <option value="Certificado Pruebas TYT">
                  Certificado Pruebas TYT
                </option>
                <option value="Carta Laboral Empresa">
                  Carta Laboral Empresa
                </option>
                <option value="Certificado Agencia Pública de Empleo SENA">
                  Certificado Agencia Pública de Empleo SENA.
                </option>
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
            <button type="submit">
              {loading ? (<span className="spinner"></span>) : ("Cargar Documento")}
            </button>
          </form>
        </div>
        <div className="table-container">
          <h2>Documentos del Aprendiz</h2>
          <table>
            <thead>
              <tr>
                <th>Tipo de Documento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {documentosAprendiz.map((doc) => (
                <tr key={doc.id_documento}>
                  <td>{doc.tipo_documento}</td>
                  <td className="text-center">
                    <div className="btn-download-container">
                      <button
                        onClick={() => handleDownload(doc.archivo)}
                        className="btnDownloadAprend"
                        onMouseEnter={() => handleMouseEnter(doc.id_documento)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <FaDownload />
                      </button>
                      {hoveredButton === doc.id_documento && (
                        <span className="download-tooltip-docs-aprendiz">
                          Descargar documento
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
}

export default Documents;
