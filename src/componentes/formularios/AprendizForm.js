import React, { Fragment, useState } from "react";
import clienteAxios from "../../api/axios";
import Swal from "sweetalert2";
import "./styles/Aprendiz.css";


function AprendizForm() {
  //inicializa el estado con usestate para almacenar datos en formdata
  const [formData, setFormData] = useState({
    rol_usuario: "aprendiz",
  });

  //funcion para manejar los cambios en el campo del formulario y actualizarlos
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  //funcion que se ejecuta cuando se envia el formulario -> POST con los datos
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Verificar si telefonofijo_Contacto está vacío y establecerlo como null si es así
      if (!formData.telefonofijo_Contacto) {
        formData.telefonofijo_Contacto = null;
      }

      if (!formData.numero_celular2) {
        formData.numero_celular2 = null;
      }
      const response = await clienteAxios.post("/aprendices-add", formData);
      Swal.fire({
        title: "Aprendiz registrado exitosamente",
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
      console.error("Error al crear el aprendiz:", error);

      let errorMessage = 'Hubo un error al procesar la solicitud';
        if (error.response && error.response.data && error.response.data.mensaje) {
            errorMessage = error.response.data.mensaje;
        }
        const errores = error.response.data.errores || [];
        Swal.fire({
            title: 'Error de validación',
            html: `${errorMessage}<br>${errores.join('<br>')}`,
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
    }
  };

  return (
    <Fragment>
       <h1 className="text-center aprendices-new-title">Registrar Nuevo Aprendiz</h1>
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
              <option value="Cedula de Extranjeria">Cedula de Extranjería</option>
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
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Apellidos</label>
            <input
              type="text"
              placeholder="Apellidos"
              required
              name="apellidos"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Genero:</label>
            <select name="sexo" onChange={handleChange}>
              <option selected disabled>Selecciona tu Género</option>
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
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Departamento domicilio</label>
            <input
              type="text"
              placeholder="Departamento domicilio"
              required
              name="departamento_domicilio"
              onChange={handleChange}
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
              placeholder="Número de ficha"
              required
              name="numero_ficha"
              onChange={handleChange}
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
          <button type="submit" className="btn-register">
            Registrar nuevo aprendiz
          </button>
        </form>
      </main>
    </Fragment>
  );
}

export default AprendizForm;
