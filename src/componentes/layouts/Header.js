import React, { Fragment } from "react";
import "./css/Header.css";
import { HiMenuAlt1 } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import logoSena from "./img/sena-verde.png";

const Header = ({ showNav, setShowNav }) => {
  const { userProfile } = useAuth();
  // Cambiar el valor de la variable de estado showNav para mostrar o ocultar el menú.
  const toogleNav = () => {
    setShowNav(!showNav);
  };

  // Función para obtener el rol de Usuario y presentarlo de mejor manera al usuario
  const getRolNombre = (rol) => {
    switch (rol) {
      case "admin":
        return "Administrador";
      case "instructor":
        return "Instructor";
      case "aprendiz":
        return "Aprendiz";
      default:
        return rol;
    }
  };

  // Función para obtener solo el primer nombre
  const getPrimerNombre = (nombres) => {
    const nombresArray = nombres.split(" "); // Dividir los nombres por espacios
    return nombresArray[0]; // Devolver el primer nombre
  };

  // Función para obtener solo el primer apellido
  const getPrimerApellido = (apellidos) => {
    const apellidosArray = apellidos.split(" "); // Dividir los apellidos por espacios
    return apellidosArray[0]; // Devolver el primer apellido
  };

  return (
    <header className="Header-general">
      <div className="header-section left-section">
        <div onClick={toogleNav} className="menu-box">
          <HiMenuAlt1 className="menu-burguer" />
        </div>
        {window.innerWidth >= 1024 ? (
          <img alt="logo-sena" src={logoSena} className="logo-sena-header" />
        ) : (
          <div className="user-info-box">
            {userProfile ? (
              <Fragment>
                <p className="user-info-box__rol">
                  {getRolNombre(userProfile.rol_usuario)}
                </p>
                <p className="user-info-box__names">
                  {getPrimerNombre(userProfile.nombres)}{" "}
                  {getPrimerApellido(userProfile.apellidos)}
                </p>
              </Fragment>
            ) : (
              <p>No se han proporcionado datos del Usuario</p>
            )}
          </div>
        )}
      </div>
      <div className="header-section center-section">
        <h1 className="tSeep">S.E.E.P</h1>
      </div>
      <div className="header-section right-section">
        {window.innerWidth >= 1024 ? (
          <div className="user-info-box">
          {userProfile ? (
            <Fragment>
              <p className="user-info-box__rol">{getRolNombre(userProfile.rol_usuario)}</p>
              <p className="user-info-box__names">{getPrimerNombre(userProfile.nombres)} {getPrimerApellido(userProfile.apellidos)}</p>
            </Fragment>
          ) : (
            <p>No se han proporcionado datos del Usuario</p>
          )}
        </div>
        ): (
          <img alt="logo-sena" src={logoSena} className="logo-sena-header" />
        )}
      </div>
    </header>
  );
};

export default Header;
