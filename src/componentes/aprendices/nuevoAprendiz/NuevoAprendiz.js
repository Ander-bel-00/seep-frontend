import React, { Fragment, useEffect, useState } from "react";
import clienteAxios from "../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import "./css/NuevoAprendiz.css";
import Swal from "sweetalert2";
import Modal from "react-modal";

function NuevoAprendiz() {
  const { id_instructor } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rol_usuario: "aprendiz",
  });
  const [loading, setLoading] = useState(false);
  const [Fichas, setFichas] = useState([]);
  const [selectedFichaNumero, setSelectedFichaNumero] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const obtenerFichas = async () => {
      try {
        const res = await clienteAxios.get("/fichas-getAll");
        setFichas(res.data.fichas);
      } catch (error) {
        console.error("Hubo un error al obtener las fichas", error);
      }
    };
    obtenerFichas();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Activar el estado de carga
    try {
      if (!formData.telefonofijo_Contacto) {
        formData.telefonofijo_Contacto = null;
      }

      if (!formData.numero_celular2) {
        formData.numero_celular2 = null;
      }
      const response = await clienteAxios.post("/aprendices-add", formData);

      Swal.fire({
        title:
          "Aprendiz registrado exitosamente, se ha enviado un correo al aprendiz con los pasos para iniciar sesión",
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
      console.error("Error al crear el aprendiz:", error);

      let errorMessage = "Hubo un error al procesar la solicitud";
      if (error.response && error.response.data && error.response.data.mensaje) {
        errorMessage = error.response.data.mensaje;
      }
      const errores = error.response.data.errores || [];
      Swal.fire({
        title: "Error de validación",
        html: `${errorMessage}<br>${errores.join(", <br>")}`,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  const handleTextInput = (event) => {
    const { name, value } = event.target;
    const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
    setFormData({ ...formData, [name]: sanitizedValue });
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSelectFicha = (numero_ficha) => {
    setSelectedFichaNumero(numero_ficha);
    setFormData({ ...formData, numero_ficha: numero_ficha }); // Actualizar formData con el número de ficha seleccionado
    setModalIsOpen(false);
  };

  const handleFilterChange = (event) => {
    const { value } = event.target;
    // Filtrar solo números
    const filteredValue = value.replace(/\D/g, "");
    setFilter(filteredValue);
  };

  // Filtrar las fichas basado en el número de ficha
  const filteredFichas = Fichas.filter((ficha) =>
    ficha.numero_ficha.toString().includes(filter)
  );
  

  return (
    <Fragment>
      <h1 className="text-center aprendices-new-title">
        Registrar Nuevo Aprendiz
      </h1>
      <main className="contenedor-formulario-aprendiz">
        <form className="formulario-aprendiz" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo de Documento</label>
            <select name="tipo_documento" onChange={handleChange}>
              <option selected disabled>
                Selecciona un tipo de documento
              </option>
              <option value="Cedula de Ciudadania">Cédula de Ciudadania</option>
              <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
              <option value="Cedula de Extranjeria">
                Cedula de Extranjería
              </option>
            </select>
          </div>
          <div className="form-group">
            <label>Número de documento</label>
            <input
              type="number"
              placeholder="Número de documento"
              name="numero_documento"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Fecha de expedición del documento</label>
            <input
              type="date"
              placeholder="Fecha de expedición"
              name="fecha_expedicion"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Lugar de expedición</label>
            <input
              type="text"
              placeholder="Lugar de expedición"
              required
              name="lugar_expedicion"
              onInput={handleTextInput}
              value={formData.lugar_expedicion || ""}
            />
          </div>
          <div className="form-group">
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              placeholder="Fecha de nacimiento"
              required
              name="fecha_nacimiento"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Nombres</label>
            <input
              type="text"
              placeholder="Nombres"
              required
              name="nombres"
              onInput={handleTextInput}
              value={formData.nombres || ""}
            />
          </div>
          <div className="form-group">
            <label>Apellidos</label>
            <input
              type="text"
              placeholder="Apellidos"
              required
              name="apellidos"
              onInput={handleTextInput}
              value={formData.apellidos || ""}
            />
          </div>
          <div className="form-group">
            <label>Genero:</label>
            <select name="sexo" onChange={handleChange}>
              <option selected disabled>
                Selecciona tu Género
              </option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="No Binario">No Binario</option>
            </select>
          </div>
          <div className="form-group">
            <label>Dirección domicilio</label>
            <input
              type="text"
              placeholder="Dirección domicilio"
              required
              name="direccion_domicilio"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Municipio domicilio</label>
            <input
              type="text"
              placeholder="Municipio domicilio"
              required
              name="municipio_domicilio"
              onInput={handleTextInput}
              value={formData.municipio_domicilio || ""}
            />
          </div>
          <div className="form-group">
            <label>Departamento domicilio</label>
            <input
              type="text"
              placeholder="Departamento domicilio"
              required
              name="departamento_domicilio"
              onInput={handleTextInput}
              value={formData.departamento_domicilio || ""}
            />
          </div>
          <div className="form-group">
            <label>Teléfono fijo de contacto</label>
            <input
              type="number"
              placeholder="Teléfono fijo de contacto"
              name="telefonofijo_Contacto"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Número de celular 1</label>
            <input
              type="number"
              placeholder="Número de celular 1"
              required
              name="numero_celular1"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Número de celular 2</label>
            <input
              type="number"
              placeholder="Número de celular 2"
              name="numero_celular2"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Correo electrónico 1</label>
            <input
              type="email"
              placeholder="Correo electrónico 1"
              required
              name="correo_electronico1"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Correo electrónico sofía plus</label>
            <input
              type="email"
              placeholder="Correo electrónico sofía plus"
              name="correo_electronico_sofia_plus"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Número de ficha</label>
            <input
              type="number"
              placeholder="Click para seleccionar  ficha"
              required
              name="numero_ficha"
              onClick={openModal}
              value={selectedFichaNumero || ""}
              readOnly // Para evitar la edición manual
            />
          </div>
          <input
            type="text"
            required
            name="rol_usuario"
            onChange={handleChange}
            readOnly
            value={formData.rol_usuario}
            hidden
          />
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Seleccionar Ficha"
            className="modal-ficha-aprendiz"
            overlayClassName="overlay-Modal"
          >
            <div className="modal-fichas-set-content">
              {/* Campo de filtro */}
              <input
                type="text"
                placeholder="Buscar Ficha Por Número"
                value={filter}
                onChange={handleFilterChange}
                className="new-aprendiz-ficha-sel"
              />
              {/* Lista de fichas filtradas o todas las fichas si no hay filtro */}
              {Fichas.length > 0 ? (
                <ul>
                  {filter === "" ? (
                    Fichas.map((ficha) => (
                      <li key={ficha.numero_ficha}>
                        <button
                          onClick={() => handleSelectFicha(ficha.numero_ficha)}
                        >
                          {ficha.numero_ficha} - {ficha.programa_formacion}
                        </button>
                      </li>
                    ))
                  ) : (
                    filteredFichas.map((ficha) => (
                      <li key={ficha.numero_ficha}>
                        <button
                          onClick={() => handleSelectFicha(ficha.numero_ficha)}
                        >
                          {ficha.numero_ficha} - {ficha.programa_formacion}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              ) : (
                <p>No hay fichas disponibles</p>
              )}
            </div>
          </Modal>
          <button type="submit" className="btn-register">
            {loading ? (
              <span className="spinner"></span>
            ) : (
              "Registrar nuevo aprendiz"
            )}
          </button>
        </form>
      </main>
    </Fragment>
  );
}

export default NuevoAprendiz;
