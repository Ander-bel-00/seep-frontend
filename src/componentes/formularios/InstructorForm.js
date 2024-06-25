import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./styles/Instructor.css";
import "bootstrap/dist/css/bootstrap.min.css";
import clienteAxios from "../../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const InstructorForm = () => {
  const [formData, setFormData] = useState({
    rol_usuario: "instructor",
  });
  const [fichasDisponibles, setFichasDisponibles] = useState([]);
  const [selectedFichas, setSelectedFichas] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerFichasDisponibles = async () => {
      try {
        const response = await clienteAxios.get("/fichas-getAll");
        setFichasDisponibles(response.data.fichas);
      } catch (error) {
        console.error("Error fetching fichas:", error);
      }
    };

    obtenerFichasDisponibles();
  }, []);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;

    if (name === "fichas_asignadas") {
      setSelectedFichas((prevSelectedFichas) => ({
        ...prevSelectedFichas,
        [value]: checked,
      }));
      // Actualizar el valor del input "Fichas Asignadas" cada vez que se seleccione una ficha
      const selectedFichasTexto = Object.keys(selectedFichas)
        .filter((ficha) => selectedFichas[ficha])
        .join(", ");
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: selectedFichasTexto,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Activar el estado de carga
    try {
      const response = await clienteAxios.post("/instructores-add", {
        ...formData,
        fichas_asignadas: Object.keys(selectedFichas).filter(
          (ficha) => selectedFichas[ficha]
        ),
      });
      Swal.fire({
        title: "Instructor registrado exitosamente",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          return navigate("/");
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error al crear el instructor:", error);
      let errorMessage = "Hubo un error al procesar la solicitud";
      if (
        error.response &&
        error.response.data &&
        error.response.data.mensaje
      ) {
        errorMessage = error.response.data.mensaje;
      }
      const errores = error.response.data.errores || [];
      Swal.fire({
        title: "Error de validación",
        html: `${errorMessage}<br>${errores.join("<br>")}`,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    // Actualizar el valor del input "Fichas Asignadas" al cerrar el modal
    const selectedFichasTexto = Object.keys(selectedFichas)
      .filter((ficha) => selectedFichas[ficha])
      .join(", ");
    setFormData((prevFormData) => ({
      ...prevFormData,
      fichas_asignadas: selectedFichasTexto,
    }));
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const fichasSeleccionadasTexto = Object.entries(selectedFichas)
    .filter(([ficha, seleccionada]) => seleccionada)
    .map(([ficha]) => ficha)
    .join(", ");

  return (
    <div className="form-container-instructor">
      <h1 className="titulo-fichas">Registro de Instructores</h1>
      <form onSubmit={handleSubmit} className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Número de Documento:</label>
          <input
            type="text"
            className="form-control"
            name="numero_documento"
            onChange={handleChange}
            placeholder="Número de Documento"
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Tipo de Documento</label>
          <select name="tipo_documento" onChange={handleChange}>
            <option selected disabled>
              Selecciona un tipo de documento
            </option>
            <option value="Cedula de Ciudadania">Cédula de Ciudadania</option>
            <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
            <option value="Cedula de Extranjeria">Cedula de Extranjería</option>
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Nombres:</label>
          <input
            type="text"
            className="form-control"
            name="nombres"
            onChange={handleChange}
            placeholder="Nombres"
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Apellidos:</label>
          <input
            type="text"
            className="form-control"
            name="apellidos"
            onChange={handleChange}
            placeholder="Apellidos"
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Correo Electrónico:</label>
          <input
            type="email"
            className="form-control"
            name="correo_electronico1"
            onChange={handleChange}
            placeholder="Correo electrónico"
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Número de Celular 1:</label>
          <input
            type="tel"
            className="form-control"
            name="numero_celular1"
            placeholder="Número de Celular 1"
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Número de Celular 2:</label>
          <input
            type="tel"
            className="form-control"
            name="numero_celular2"
            placeholder="Número de Celular 2"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Fichas Asignadas:</label>
          <input
            type="text"
            className="form-control"
            name="fichas_asignadas"
            value={fichasSeleccionadasTexto}
            readOnly
            onClick={openModal}
            placeholder="Presiona aquí"
          />
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Seleccionar Fichas"
            className="react-modal-custom"
          >
            <h2>Seleccionar Fichas</h2>
            <div>
              {fichasDisponibles.map((ficha) => (
                <div key={ficha.numero_ficha}>
                  <input
                    type="checkbox"
                    id={`ficha-${ficha.numero_ficha}`}
                    name="fichas_asignadas"
                    value={ficha.numero_ficha}
                    onChange={handleChange}
                    checked={selectedFichas[ficha.numero_ficha]}
                  />
                  <label htmlFor={`ficha-${ficha.numero_ficha}`}>
                    <span>{ficha.numero_ficha}</span>
                  </label>
                </div>
              ))}
            </div>
            <button onClick={closeModal} type="button">
              Cerrar
            </button>
          </Modal>
        </div>

        <div className="col-md-6 mb-3" hidden>
          <label className="form-label">Rol de Usuario:</label>
          <input
            type="text"
            className="form-control"
            name="rol_usuario"
            onChange={handleChange}
            value={formData.rol_usuario}
            readOnly
            required
          />
        </div>

        <div className="col-md-12 mb-3">
          <button type="submit" className="btn-instructor">
            {loading ? (
              <span className="spinner"></span>
            ) : (
              "Registrar nuevo instructor"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstructorForm;
