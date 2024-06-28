import React, { useState, useRef, Fragment, useEffect } from "react";
import clienteAxios from "../../../api/axios";
import Swal from "sweetalert2";
import "./css/recuperar.css";
import { Link, useNavigate } from "react-router-dom";
import cditi2 from "./img/CDITI2.png";
import logoSENA from "./img/sena-verde.png";
import senaMedio from "./img/sena-seeep.png";
import { IoHomeSharp } from "react-icons/io5";

function RecuperaContrasena() {
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [codigoVerificacion, setCodigoVerificacion] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSolicitarCodigo, setShowSolicitarCodigo] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const codeInputsRefs = useRef([]);

  const handleSolicitarCodigo = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    try {
      const response = await clienteAxios.post(
        "/verificar-correo-electronico",
        {
          numero_documento: numeroDocumento,
          correo_electronico1: correoElectronico,
        }
      );

      if (!response.data.coincide) {
        setError("El correo electrónico no coincide con el registrado");
        setShowLoader(false);
        return;
      }

      const responseSolicitud = await clienteAxios.post(
        "/solicitar-restablecimiento-contrasena",
        {
          numero_documento: numeroDocumento,
          correo_electronico1: correoElectronico,
        }
      );

      setSuccessMessage(responseSolicitud.data.mensaje);
      setCodigoEnviado(true);
      setShowSolicitarCodigo(false);
      Swal.fire(
        "Código enviado",
        "Se ha enviado un código de verificación a tu correo electrónico",
        "success"
      );
    } catch (error) {
      console.error("Error de servidor:", error.response);
      setError("Error del servidor: " + JSON.stringify(error.response.data));
    } finally {
      setShowLoader(false);
    }
  };

  const verificarCodigo = async (e) => {
    e.preventDefault();
    const codigoVerificacionUnido = codigoVerificacion.join("");
    setShowLoader(true);

    try {
      const response = await clienteAxios.post("/verificar-codigo", {
        correo_electronico1: correoElectronico,
        codigo_verificacion: codigoVerificacionUnido,
      });

      setSuccessMessage(response.data.mensaje);
      setShowLoader(false);
    } catch (error) {
      console.error("Error al verificar código:", error);
      setError("El código de verificación es incorrecto");
      setShowLoader(false);
    }
  };

  const handleChangeCodigo = (index, value) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newCodigoVerificacion = [...codigoVerificacion];
      newCodigoVerificacion[index] = value;
      setCodigoVerificacion(newCodigoVerificacion);

      if (value && index < 5) {
        codeInputsRefs.current[index + 1].focus();
      }
    }
  };

  const handleCambiarContrasena = async (e) => {
    e.preventDefault();
    setLoading(true); // Activar el estado de carga
    const codigoVerificacionUnido = codigoVerificacion.join("");

    if (nuevaContrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await clienteAxios.post("/cambiar-contrasena", {
        correo_electronico1: correoElectronico,
        codigo_verificacion: codigoVerificacionUnido,
        nueva_contrasena: nuevaContrasena,
      });

      Swal.fire("Contraseña Restablecida", response.data.mensaje, "success");
      navigate("/login");
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      setError(
        "Error al cambiar contraseña: " + JSON.stringify(error.response.data)
      );
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  // Efecto para limpiar errores despues de 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="login-body">
      <header className="header-login">
        <img src={logoSENA} alt="sena" className="sena-verde" />
        <img src={senaMedio} alt="sena-medio" className="sena-medio" />
        <img src={cditi2} alt="cditi" className="cditi" />
      </header>
      <div className="recuperar-box-main">
        <div className="recupera-contrasena-container">
          <h1 className="recupera-titulo text-center">Recuperar Contraseña</h1>

          {successMessage && (
            <p className="recupera-mensaje">{successMessage}</p>
          )}
          {error && <p className="recupera-mensaje">{error}</p>}
          {!codigoEnviado && showSolicitarCodigo ? (
            <div className="recupera-formulario">
              <form onSubmit={handleSolicitarCodigo}>
                <label htmlFor="numero_documento">
                  <strong>Ingresar Número de Documento</strong>
                </label>
                <input
                  className="recupera-input"
                  type="text"
                  id="numero_documento"
                  name="numero_documento"
                  value={numeroDocumento}
                  onChange={(e) => setNumeroDocumento(e.target.value)}
                  required
                  placeholder="Número de documento"
                />
                <label htmlFor="correo_electronico1">
                  <strong>Ingresar Correo Electrónico</strong>
                </label>
                <input
                  className="recupera-input"
                  type="email"
                  id="correo_electronico1"
                  name="correo_electronico1"
                  value={correoElectronico}
                  onChange={(e) => setCorreoElectronico(e.target.value)}
                  required
                  placeholder="Correo electrónico"
                />
                {showLoader ? (
                  <div className="loader"></div>
                ) : (
                  <div className="flex justify-center items-center mt-2">
                    <button className="recupera-boton" type="submit">
                      Solicitar código de verificación
                    </button>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <Fragment>
              {successMessage === "Código de verificación válido" ? (
                <div className="recupera-cambio-formulario">
                  <h3 className="recupera-titulo">Cambiar contraseña</h3>
                  <form onSubmit={handleCambiarContrasena}>
                    <input
                      className="recupera-cambio-input"
                      type="password"
                      name="nueva_contrasena"
                      value={nuevaContrasena}
                      onChange={(e) => setNuevaContrasena(e.target.value)}
                      required
                      placeholder="Nueva contraseña"
                    />
                    <input
                      className="recupera-cambio-input"
                      type="password"
                      name="confirmar_contrasena"
                      value={confirmarContrasena}
                      onChange={(e) => setConfirmarContrasena(e.target.value)}
                      required
                      placeholder="Confirmar contraseña"
                    />
                    {showLoader ? (
                      <div className="loader"></div>
                    ) : (
                      <button className="recupera-cambio-boton" type="submit">
                        {loading ? (
                          <span className="spinner"></span>
                        ) : (
                          "Cambiar contraseña"
                        )}
                      </button>
                    )}
                  </form>
                </div>
              ) : (
                <div className="recupera-codigo-container">
                  <h3 className="recupera-titulo">Código de verificación</h3>
                  <div className="codigo-inputs">
                    {codigoVerificacion.map((digito, index) => (
                      <input
                        key={index}
                        className="recupera-codigo-input"
                        type="text"
                        maxLength="1"
                        value={digito}
                        onChange={(e) =>
                          handleChangeCodigo(index, e.target.value)
                        }
                        ref={(inputRef) =>
                          (codeInputsRefs.current[index] = inputRef)
                        }
                      />
                    ))}
                  </div>
                  <div className="flex justify-center items-center mt-2">
                    <button
                      className="recupera-verificar-boton"
                      onClick={verificarCodigo}
                    >
                      Verificar código
                    </button>
                  </div>
                </div>
              )}
            </Fragment>
          )}
        </div>
        <footer className="piePagina">
          © SENA - Todos los derechos reservados
        </footer>
      </div>
      <div className="inicio-box-main">
        <Link className="link-home" to="/login">
          <IoHomeSharp className="inline-block" />{" "}
          <p className="inline-block relative top-1">Ir al Inicio</p>
        </Link>
      </div>
    </div>
  );
}

export default RecuperaContrasena;
