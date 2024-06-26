import React, { Fragment, useEffect, useState } from "react";
import clienteAxios from "../../api/axios";
import logoSena from "./img/sena-verde.png";
import "./css/Instructores.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { useAuth } from "../../context/AuthContext";

function Instructor({ setModalIsOpen }) {
  const [usuario, setUsuario] = useState(null);
  const [fichasAsignadas, setFichasAsignadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [fichasPorPagina] = useState(3); // Número de fichas por página
  const [infoInstructor, SetInstructorInfo] = useState([]);
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [contrasenaActualizada, setContrasenaActualizada] = useState(false);
  const [modalIsOpen, setModalIsOpenState] = useState(false);
  const navigate = useNavigate();

  const {userProfile} = useAuth();

  const id_instructor = userProfile ? userProfile.id_instructor: null;
  const numero_documento = userProfile ? userProfile.numero_documento: null;

  console.log(id_instructor)

  const openModal = () => {
    setModalIsOpen(true);
    setModalIsOpenState(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalIsOpenState(false);
  };

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const response = await clienteAxios.get("/usuario");
        setUsuario(response.data.usuario);

        const resInstructor = await clienteAxios.get(
          `instructores/get-Instructor/${id_instructor}`
        );
        SetInstructorInfo(resInstructor.data);

        const responseFichas = await clienteAxios.get(
          `/instructor/${resInstructor.data.numero_documento}/fichas-asignadas`
        );
        const fichasOrdenadas = responseFichas.data.fichasAsignadas.sort(
          (a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
          }
        );
        setFichasAsignadas(fichasOrdenadas);

       

        if (resInstructor.data.contrasena_temporal) {
          openModal();
        }
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    };

    obtenerUsuario();
  }, []);

  // Función para formatear la fecha en el formato Año-mes-día
  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toISOString().split("T")[0];
  };

  // Función para manejar cambios en el campo de búsqueda
  const handleChangeBusqueda = (event) => {
    let valor = event.target.value;
    if (isNaN(valor)) {
      valor = valor.replace(/\D/g, "");
    }
    setBusqueda(valor);
  };

  // Filtrar las fichas según el número de ficha ingresado en el campo de búsqueda
  const fichasFiltradas = fichasAsignadas.filter((ficha) =>
    ficha.numero_ficha.toString().includes(busqueda)
  );

  // Calcular el índice inicial y final de las fichas a mostrar en la página actual
  const indexInicial = (currentPage - 1) * fichasPorPagina;
  const indexFinal = currentPage * fichasPorPagina;

  // Obtener las fichas a mostrar en la página actual
  const fichasPagina = fichasFiltradas.slice(indexInicial, indexFinal);

  // Funciones para cambiar de página
  const pageBefore = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const pageAfter = () => {
    const totalPages = Math.ceil(fichasFiltradas.length / fichasPorPagina);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const actualizarContrasena = async () => {
    if (!nuevaContrasena.trim()) {
      Swal.fire({
        title: "Error",
        text: "Por favor ingresa una nueva contraseña.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      const response = await clienteAxios.put(
        `/instructor/${infoInstructor.id_instructor}/nuevaContrasena`,
        {
          contrasena: nuevaContrasena,
        }
      );
      console.log("Contraseña actualizada", response.data);
      Swal.fire({
        title: "Su contraseña se ha actualizado",
        text: "Le informamos que su contraseña se ha actualizado exitosamente",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "Aceptar",
      }).then(() => {
        setContrasenaActualizada(true);
        closeModal();
        return navigate('/')
      });
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      Swal.fire({
        title: "Error al actualizar su contraseña",
        text: "Hubo un error al actualizar su contraseña",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  console.log(infoInstructor.contrasena_temporal)

  return (
    <Fragment>
      <div className="main-container__contenedor-hijo fichas-movil">
        <div className="titles mt-11">
          <h2 className="fichasAsignedTitle ">Agendamiento de visitas</h2>
          <h5 className=" text-gray-500 selctFicha">Selecciona una ficha</h5>
        </div>
        <Modal
          isOpen={modalIsOpen}
          className="modal-new-contrasena"
          overlayClassName="Overlay"
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEsc={false}
        >
          <h2>Debes actualizar tu contraseña</h2>
          <label htmlFor="nuevaContrasena">Nueva contraseña:</label>
          <input
            type="password"
            id="nuevaContrasena"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
          />
          <button onClick={actualizarContrasena}>Actualizar contraseña</button>
        </Modal>
        
          <>
            {window.innerWidth >= 1024 ? (
              <Fragment>
                <div className="row my-2 fichas-content rounded-md">
                  <div className="searchContent">
                    <input
                      type="search"
                      placeholder="Buscar Fichas..."
                      className="buscarFichas"
                      name="searchFichas"
                      value={busqueda}
                      onChange={handleChangeBusqueda}
                    />
                  </div>
                  {fichasPagina.length > 0 ? (
                    <div className="fichas-grid">
                      {fichasPagina.map((ficha) => (
                        <div key={ficha.numero_ficha} className="ficha-card">
                          <Link
                            to={`/${usuario.rol_usuario}/aprendicesFicha/${ficha.numero_ficha}`}
                            title="Presiona en cada ficha para acceder a su información"
                            className="link-ficha"
                          >
                            <div className="card fichas">
                              <div className="card-body carta-cuerpo">
                                <h5 className="card-title">
                                  Ficha {ficha.numero_ficha}
                                </h5>
                                <img
                                  src={logoSena}
                                  className="w-9 logSenaFichas relative"
                                />
                                <p className="card-text">
                                  <strong>Programa de formación: </strong>
                                  {ficha.programa_formacion}
                                </p>
                                <p className="card-text">
                                  <strong>Nivel de formación: </strong>
                                  {ficha.nivel_formacion}
                                </p>
                                <p className="card-text">
                                  <strong>Título obtenido: </strong>
                                  {ficha.titulo_obtenido}
                                </p>
                                <p className="card-text">
                                  <strong>Fecha fin lectiva: </strong>
                                  {formatearFecha(ficha.fecha_fin_lectiva)}
                                </p>
                              </div>
                              <button className="btnVerFicha">
                                <Link
                                  to={`aprendicesFicha/${ficha.numero_ficha}`}
                                  className="verFichas"
                                >
                                  Ver Ficha
                                </Link>
                              </button>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="noFichas">
                      <p>No hay fichas asignadas</p>
                    </div>
                  )}
                </div>
              </Fragment>
            ) : (
              // Para dispositivos moviles
              <Fragment>
                <div className="row my-2 fichas-content rounded-md">
                  <div className="searchContent">
                    <input
                      type="search"
                      placeholder="Buscar Fichas..."
                      className="relative buscarFichas"
                      name="searchFichas"
                      value={busqueda}
                      onChange={handleChangeBusqueda}
                    />
                  </div>
                  {fichasFiltradas.length > 0 ? (
                    <div className="fichas-grid">
                      {fichasFiltradas.map((ficha) => (
                        <div
                          key={ficha.numero_ficha}
                          className="ficha-card"
                          title="Presiona en cada ficha
                      para acceder a su información"
                        >
                          <Link
                            to={`/${usuario.rol_usuario}/aprendicesFicha/${ficha.numero_ficha}`}
                            className="link-ficha"
                          >
                            <div className="card fichas">
                              <div className="card-body carta-cuerpo">
                                <h5 className="card-title">
                                  Ficha {ficha.numero_ficha}
                                </h5>
                                <img
                                  src={logoSena}
                                  className="w-9 logSenaFichas relative"
                                />
                                <p className="card-text">
                                  <strong>Programa de formación: </strong>
                                  {ficha.programa_formacion}
                                </p>
                                <p className="card-text">
                                  <strong>Nivel de formación: </strong>
                                  {ficha.nivel_formacion}
                                </p>
                                <p className="card-text">
                                  <strong>Título obtenido: </strong>
                                  {ficha.titulo_obtenido}
                                </p>
                                <p className="card-text">
                                  <strong>Fecha fin lectiva: </strong>
                                  {formatearFecha(ficha.fecha_fin_lectiva)}
                                </p>
                              </div>
                              <button className="btnVerFicha" type="button">
                                <Link
                                  to={`aprendicesFicha/${ficha.numero_ficha}`}
                                  className="verFichas"
                                >
                                  Ver Ficha
                                </Link>
                              </button>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="noFichas">
                      <p>No hay fichas asignadas</p>
                    </div>
                  )}
                </div>
              </Fragment>
            )}
          </>

        <div className="pageFichas-content">
          <button
            className="btn-pages"
            onClick={pageBefore}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>
            {currentPage} de{" "}
            {Math.ceil(fichasFiltradas.length / fichasPorPagina)}
          </span>
          <button
            className="btn-pages"
            onClick={pageAfter}
            disabled={
              currentPage ===
              Math.ceil(fichasFiltradas.length / fichasPorPagina)
            }
          >
            Siguiente
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default Instructor;
