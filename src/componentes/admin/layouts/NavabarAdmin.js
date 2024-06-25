import React, { Fragment, useEffect, useRef, useState } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { BiSolidLogOut } from "react-icons/bi";
import clienteAxios from "../../../api/axios";
import "./css/NavbarAdmin.css";

const NavbarAdmin = ({ showNav, handleLogout, setShowNav }) => {
  const [usuario, setUsuario] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const response = await clienteAxios.get("/usuario");
        setUsuario(response.data.usuario);
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    };

    obtenerUsuario();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowNav(false);
      }
    };

    if (showNav) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNav]);

  const handleCloseMenu = () => {
    setShowNav(false);
  };

  const handleHover = (option, position) => {
    setHoveredOption(option);
    const topPosition = position.top + 22;
    // Ajusta las coordenadas left y top para el texto del hover
    setHoveredPosition({
      top: topPosition,
      left: position.left + position.width + 70, // Suma la posición de desplazamiento del menú
    });
  };

  const handleHoverEnd = () => {
    setHoveredOption(null);
  };

  return (
    <Fragment>
      {usuario && usuario.rol_usuario ? (
        <>
          {window.innerWidth >= 1024 ? (
            <div
              ref={menuRef}
              className={showNav ? "sidenav active" : "sidenavAdmin"}
            >
              <button className="close-btn" onClick={handleCloseMenu}>
                X
              </button>
              <ul className="list-group menu-content">
                <MenuItem
                  title="Inicio"
                  icon={<IoHomeSharp className="inline-block" />}
                  link="/"
                  handleHover={handleHover}
                  handleHoverEnd={handleHoverEnd}
                />
                <MenuItem
                  title="Cerrar Sesión"
                  icon={<BiSolidLogOut className="inline-block mr-1" />}
                  handleHover={handleHover}
                  handleHoverEnd={handleHoverEnd}
                  handleLogout={handleLogout}
                />
              </ul>
              {hoveredOption && (
                <div
                  className="hovered-options"
                  style={{
                    top: hoveredPosition.top,
                    left: hoveredPosition.left,
                  }}
                >
                  <div className="hovered-text">{hoveredOption}</div>
                </div>
              )}
            </div>
          ) : (
            <div
              ref={menuRef}
              className={showNav ? "sidenav active" : "sidenav"}
            >
              <button className="close-btn" onClick={handleCloseMenu}>
                X
              </button>
              <h3 className="text-xl userWelcome">
                ¡Bienvenido {usuario.nombres}!
              </h3>
              <ul className="list-group menu-content">
                <li className="menu-options" onClick={handleCloseMenu}>
                  <Link to="/">
                    <IoHomeSharp className="inline-block" /> Inicio
                  </Link>
                </li>
                {/* <li className="menu-options"><a href="#"><FaUser className="inline-block"/> Perfil</a></li> */}
                <li className="menu-options">
                  <Link to="/login" onClick={handleLogout}>
                    <BiSolidLogOut className="inline-block" />
                    Cerrar sesión
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <p>Cargando usuario...</p>
      )}
    </Fragment>
  );
};

const MenuItem = ({
  title,
  icon,
  link,
  handleHover,
  handleHoverEnd,
  handleLogout,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      const element = document.getElementById(title.toLowerCase());
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({ top: rect.top, left: rect.right });
      }
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [title]);

  return (
    <li
      id={title.toLowerCase()}
      className="menu-options"
      onMouseEnter={() => handleHover(title, position)}
      onMouseLeave={handleHoverEnd}
      onClick={handleLogout}
    >
      <Link to={link}>
        <div className="menu-option-wrapper">{icon}</div>
      </Link>
    </li>
  );
};

export default NavbarAdmin;
