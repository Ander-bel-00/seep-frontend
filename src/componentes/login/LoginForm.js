import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoSEEP from "./img/LOGO_SEEP-removebg-preview.png";
import cditi2 from "./img/CDITI2.png";
import logoSENA from "./img/sena-verde.png";
import senaMedio from "./img/sena-seeep.png";

import "./css/login.styles.css";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  // Estado para mostrar spinner si se está cargando los datos.
  const [loading, setLoading] = useState(false); 
  // LLamar la función para procesar el inicio de sesión desde el AuthContext.
  const { handleLogin } = useAuth();

  // Estado para almacenar la información del formulario de login para enviarla al backend.
  const [formData, setFormData] = useState({
    // Atributo que almacena el número de Documento.
    numero_documento: "",
    // Atributo que almacena la contraseña.
    contrasena: "",
  });

  // Estado que guarda los errores obtenidos en el Login para mostrar mensaje al usuario.
  const [errors, setErrors] = useState([]);

  // Se usa el hook (useNavigate) para crear redireccionamiento.
  const navigate = useNavigate();

  // Obtener el número de documento y la contraseña del cuerpo del formulario.
  const { numero_documento, contrasena } = formData;

  // Función de evento para manejar los cambios en los campos de entarda (input, select, etc...).
  const onChange = (e) => {
    // Obener el nombre y el valor de esos elementos HTML que podrian estar cambiando.
    const { name, value } = e.target;
    // Validar que solo se ingresen números
    if (name === "numero_documento" && !/^\d*$/.test(value)) {
      return; // Si se ingresa un valor no numérico, se ignora
    }
    // Almacenar al estado formData el nuevo valor que se reciba en cada campo de entrada.
    setFormData({ ...formData, [name]: value });
  };

  // Función para manejar el envío de datos del formulario de Login.
  const onSubmit = async (e) => {
    // Previene el efecto por defecto del evento así evita que se envíe el formulario antes de tener todos los datos.
    e.preventDefault();

    setLoading(true); // Activar el estado de carga

    // Aquí irá el código para enviar los datos del estado formData a la función handleLogin.
    try {
      // Se envían los datos del formulario del Login (Se usa await para dar una espera mientras se obtienen los datos).
      await handleLogin(navigate, formData);
    } catch (error) {
      // Catch en caso de error se hace una acción.

      // Mostrar en consola el error.
      console.log(error);
      // Si se encuentra un array de errores guardar lo que contie ese array.
      if (Array.isArray(error.response.data)) {
        // Guardar en el estado de errores todo lo que contenga el array error.
        setErrors(error.response.data);
      } else {
        // Si no es un array solo almacenar el mensaje que se recibe del error.
        setErrors([error.response.data.message]);
      }
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  // Efecto para limpiar errores despues de 5 segundos
  useEffect(() => {
    // Si el estado errors tiene al menos un valor se hace un conteo y se limpia el estado errors despues de 5 segundos.
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <Fragment>
      <div className="login-body">
        <header className="header-login">
          <img src={logoSENA} alt="sena" className="sena-verde" />

          <img src={senaMedio} alt="sena-medio" className="sena-medio" />

          <img src={cditi2} alt="cditi" className="cditi" />
        </header>
        <main className="main-login-content">
          <form onSubmit={onSubmit} className="form-login-content">
            <h1 className="text-center">Iniciar Sesión</h1>
            <label className="form-login-content-label">
              Número de Documento
            </label>
            <input
              placeholder="Número de documento"
              type="text"
              name="numero_documento"
              value={numero_documento}
              onChange={onChange}
              className="form-login-content-input"
            />
            <label className="form-login-content-label">Contraseña</label>
            <input
              placeholder="Contraseña"
              type="password"
              name="contrasena"
              value={contrasena}
              onChange={onChange}
              className="form-login-content-input"
            />
            {/* Mostrar al usuario los errores que puedan ocurrir al iniciar sesión */}
            {errors.map((error, i) => (
              <div
                key={i}
                className="text-red-600 ml-6 form-login-content-errors"
              >
                {error}
              </div>
            ))}

            <Link
              to="/restablecimiento-contrasena"
              className="form-login-content-forget"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <div className="form-login-content-btn-box">
              <button
                type="submit"
                className={`form-login-content-loginBtn ${
                  errors.length > 0 ? "btn-with-errors" : ""
                }`}
              >
                {loading ? <span className="spinner"></span> : "Iniciar Sesión"}
              </button>
            </div>
          </form>

          <footer className="piePagina">
            © SENA - Todos los derechos reservados
          </footer>
        </main>
      </div>
    </Fragment>
  );
};

export default LoginForm;
