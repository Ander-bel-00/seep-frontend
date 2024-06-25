import React, { Fragment, useState, useRef } from "react";
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
        // Si el correo electrónico no coincide, muestra un mensaje de error
        setError("El correo electrónico no coincide con el registrado");
        setShowLoader(false);
        return;
      }

      // Si el correo electrónico coincide, continúa con la solicitud de restablecimiento de contraseña
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

  const handleCambiarContrasena = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    const codigoConcatenado = codigoVerificacion.join("");
    if (nuevaContrasena !== confirmarContrasena) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      setShowLoader(false);
      return;
    }
    try {
      const response = await clienteAxios.post("/cambiar-contrasena", {
        codigo_verificacion: codigoConcatenado,
        nueva_contrasena: nuevaContrasena,
      });
      setSuccessMessage(response.data.mensaje);
      Swal.fire("Éxito", response.data.mensaje, "success").then(() => {
        return navigate("/login");
      });
    } catch (error) {
      setError(error.response.data.mensaje);
    } finally {
      setShowLoader(false);
    }
  };

  const handleChangeCodigo = (index, value) => {
    const newCodigo = [...codigoVerificacion];
    newCodigo[index] = value;
    setCodigoVerificacion(newCodigo);
    if (value.length === 1 && index < 5) {
      codeInputsRefs.current[index + 1].focus();
    }
  };

  const verificarCodigo = async () => {
    const codigoConcatenado = codigoVerificacion.join("");
    try {
      await clienteAxios.post("/verificar-codigo", {
        codigo_verificacion: codigoConcatenado,
      });
      setSuccessMessage("Código de verificación válido");
    } catch (error) {
      setError("Código de verificación inválido");
      setNuevaContrasena("");
      setConfirmarContrasena("");
      setShowSolicitarCodigo(true);
      return;
    }
    setCodigoEnviado(false);
  };

  return (
    <Fragment>
      <div className="login-body">
        <header className="header-login">
          <img src={logoSENA} alt="sena" className="sena-verde" />

          <img src={senaMedio} alt="sena-medio" className="sena-medio" />

          <img src={cditi2} alt="cditi" className="cditi" />
        </header>
        <div className="recuperar-box-main">
          <div className="recupera-contrasena-container">
            <h1 className="recupera-titulo text-center">
              Recuperar Contraseña
            </h1>

            {successMessage && (
              <p className="recupera-mensaje">{successMessage}</p>
            )}
            {error && <p className="recupera-mensaje">{error}</p>}
            {!codigoEnviado && showSolicitarCodigo ? (
              <div className="recupera-formulario">
                <form onSubmit={handleSolicitarCodigo}>
                  <label>
                    <strong>Ingresar Número de Documento</strong>
                  </label>
                  <input
                    className="recupera-input"
                    type="text"
                    name="numero_documento"
                    value={numeroDocumento}
                    onChange={(e) => setNumeroDocumento(e.target.value)}
                    required
                    placeholder="Número de documento"
                  />
                  <label>
                    <strong>Ingresar Correo Electrónico</strong>
                  </label>
                  <input
                    className="recupera-input"
                    type="email"
                    name="correo_electronico1"
                    value={correoElectronico}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
                    required
                    placeholder="correo electronico"
                  />
                  {showLoader ? (
                    <div className="loader"></div> // Indicador de carga
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
              <div className="recupera-codigo-container">
                <h3 className="recupera-titulo">Código de verificación</h3>
                <div>
                  {codigoVerificacion.map((digito, index) => (
                    <input
                      key={index}
                      className="recupera-codigo-input"
                      type="text"
                      value={digito}
                      onChange={(e) =>
                        handleChangeCodigo(index, e.target.value)
                      }
                      maxLength="1"
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
            {successMessage === "Código de verificación válido" && (
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
                    <div className="loader"></div> // Indicador de carga
                  ) : (
                    <button className="recupera-cambio-boton" type="submit">
                      Cambiar contraseña
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>
          <footer className="piePagina">
            © SENA - Todos los derechos reservados
          </footer>
        </div>
        <div className="inicio-box-main">
          <Link className="link-home" to={"/login"}>
            <IoHomeSharp className="inline-block" />{" "}
            <p className="inline-block relative top-1">Ir al Inicio</p>
          </Link>
        </div>
      </div>
    </Fragment>
  );
}

export default RecuperaContrasena;
