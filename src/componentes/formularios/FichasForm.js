import React, { Fragment, useState } from "react";
import clienteAxios from "../../api/axios";
import Swal from "sweetalert2";
import "./styles/Fichas.css";

function FichasForm() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Activar el estado de carga
    try {
      const response = await clienteAxios.post("/fichas-Admin-new", formData);

      Swal.fire({
        title: "Ficha registrada exitosamente",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/";
        }
      });

      console.log(response.data);
    } catch (error) {
      console.error("Error al crear la ficha:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.mensaje
      ) {
        // Si hay un mensaje de error en la respuesta del servidor, mostrarlo
        Swal.fire({
          title: "Error",
          text: error.response.data.mensaje,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } else {
        // Si no hay un mensaje de error específico, mostrar un mensaje genérico
        Swal.fire({
          title: "Error",
          text: "Hubo un error al crear la ficha",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  return (
    <Fragment>
      <div className="main-container__contenedor-hijo">
        <div className="new-fichas-fomr-box">
          <form className="formularioFichasInstructor" onSubmit={handleSubmit}>
            <h1 className="text-center title-nweFichas">
              Registrar Nueva Ficha
            </h1>
            <div className="form-fichas-container">
              <div className="form-fichas-col1">
                <label htmlFor="numero_ficha">Número de Ficha</label>
                <input
                  type="text"
                  placeholder="Ingresa el número de ficha"
                  name="numero_ficha"
                  onChange={handleChange}
                  required
                />
                <label htmlFor="programa_formacion">
                  Programa de Formación
                </label>
                <input
                  type="text"
                  placeholder="Programa de formación"
                  name="programa_formacion"
                  onChange={handleChange}
                  required
                />
                <label htmlFor="nivel_formacion">Nivel de Formación</label>
                <select name="nivel_formacion" onChange={handleChange} required>
                  <option selected disabled>
                    Selecciona el nivel de formación
                  </option>
                  <option value="Tecnico">Técnico</option>
                  <option value="Tecnologico">Tecnológico</option>
                </select>
                <label htmlFor="titulo_obtenido">Titulo Obtenido</label>
                <input
                  type="text"
                  placeholder="Titulo obtenido"
                  required
                  name="titulo_obtenido"
                  onChange={handleChange}
                />
              </div>
              <div className="form-fichas-col2">
                <label htmlFor="nombre_regional">
                  Nombre de la Regional a la que pertenece
                </label>
                <select required name="nombre_regional" onChange={handleChange}>
                  <option selected disabled>
                    Selecciona la Regional
                  </option>
                  <option value="Risaralda">Risaralda</option>
                </select>
                <label htmlFor="centro_formacion">
                  Nombre del Centro de Formación
                </label>
                <select
                  required
                  name="centro_formacion"
                  onChange={handleChange}
                >
                  <option selected disabled>
                    Selecciona el centro de formación
                  </option>
                  <option value="Centro de Diseño e Innovación Tecnológica Industrial">
                    Centro de Diseño e Innovación Tecnológica Industrial
                  </option>
                </select>
                <label htmlFor="fecha_inicio_lectiva">
                  Fecha de Inicio de Etapa Lectiva
                </label>
                <input
                  type="date"
                  required
                  name="fecha_inicio_lectiva"
                  onChange={handleChange}
                />
                <label htmlFor="fecha_fin_lectiva">
                  Fecha en que Finaliza Etapa Lectiva
                </label>
                <input
                  type="date"
                  required
                  name="fecha_fin_lectiva"
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              {loading ? (
                <span className="spinner"></span>
              ) : (
                "Registrar nueva ficha"
              )}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}

export default FichasForm;
