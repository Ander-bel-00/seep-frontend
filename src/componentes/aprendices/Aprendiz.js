import React, { Fragment, useEffect, useState } from "react";
import clienteAxios from "../../api/axios";
import moment from "moment";
import "moment/locale/es";
import "./css/aprendiz.styles.css";
import Swal from "sweetalert2";
import Modal from "react-modal";

function Aprendiz({ setModalIsOpen, setModalEmpresaOpen }) {
  const [usuario, setUsuario] = useState(null);
  Modal.setAppElement("#root");
  const [visitas, setVisitas] = useState([]);
  const [aprendizInfo, setAprendizInfo] = useState([]);
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [contrasenaActualizada, setContrasenaActualizada] = useState(false);
  const fechasPorTipo = {};
  const horasPorTipo = {};
  const [modalIsOpen, setModalIsOpenState] = useState(false);
  const [modalEmpresa, setModalEmpresaState] = useState(false);
  const [empresaData, setEmpresaData] = useState([]);
  const [showVisits, setShowVisits] = useState(true);
  const [empresaInfo, setEmpresaInfo] = useState(null);
  const [fichaAprendizInfo, setFichaAprendizInfo] = useState([]);
  const [instructorInfo, setInstructorInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
    setModalIsOpenState(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalIsOpenState(false);
  };

  const openModalEmpersa = () => {
    setModalEmpresaOpen(true);
    setModalEmpresaState(true);
  };

  const closeModalEmpresa = () => {
    setModalEmpresaOpen(false);
    setModalEmpresaState(false);
  };

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const response = await clienteAxios.get("/usuario");
        setUsuario(response.data.usuario);

        const resVisitas = await clienteAxios.get(
          `/visitas-aprendiz/${response.data.usuario.id_aprendiz}`
        );
        if (Array.isArray(resVisitas.data.visitas)) {
          setVisitas(resVisitas.data.visitas);
        } else {
          console.error(
            "La respuesta de la API no es un array:",
            resVisitas.data.visitas
          );
        }

        const resAprendiz = await clienteAxios.get(
          `/aprendiz/id/${response.data.usuario.id_aprendiz}`
        );
        setAprendizInfo(resAprendiz.data);

        const fichaData = await clienteAxios.get(
          `/ficha-aprendiz/ficha/${resAprendiz.data.numero_ficha}`
        );
        setFichaAprendizInfo(fichaData.data.ficha);

        const instructorData = await clienteAxios.get(
          `/instructor/get/ficha/${resAprendiz.data.numero_ficha}`
        );
        setInstructorInfo(instructorData.data);

        if (resAprendiz.data.contrasena_temporal) {
          openModal();
        } else if (!resAprendiz.data.id_empresa) {
          openModalEmpersa();
        }
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    };

    obtenerUsuario();
  }, []);

  const visitasPorTipo = {
    "primera visita": false,
    "segunda visita": false,
    "tercera visita": false,
  };

  visitas.forEach((visita) => {
    const tipoVisitaNormalizado = visita.tipo_visita.toLowerCase();
    visitasPorTipo[tipoVisitaNormalizado] = true;
    fechasPorTipo[tipoVisitaNormalizado] = visita.fecha;
    horasPorTipo[tipoVisitaNormalizado] = visita.hora_inicio;
  });

  const actualizarContrasena = async () => {
    setLoading(true); // Activar el estado de carga
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
        `/aprendiz/${aprendizInfo.id_aprendiz}/nuevaContrasena`,
        {
          contrasena: nuevaContrasena,
        }
      );
      Swal.fire({
        title: "Su contraseña se ha actualizado",
        text: "Le informamos que su contraseña se ha actualizado exitosamente",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "Aceptar",
      }).then(() => {
        setContrasenaActualizada(true);
        closeModal();
        if (!aprendizInfo.id_empresa) {
          openModalEmpersa();
        }
      });
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      Swal.fire({
        title: "Error al actualizar su contraseña",
        text: "Hubo un error al actualizar su contraseña",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpresaData({ ...empresaData, [name]: value });
  };

  const añadirInfoEmpresa = async () => {
    setLoading(true); // Activar el estado de carga
    try {
      const res = await clienteAxios.post(
        `/empresas/add/${aprendizInfo.id_aprendiz}`,
        empresaData
      );
      Swal.fire({
        title: "Información Registrada",
        text: "Se ha registardo la información de la empresa exitosamente",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "Aceptar",
      }).then(() => {
        closeModalEmpresa();
      });
    } catch (error) {
      console.error("Error al registrar la información de la empresa:", error);
      Swal.fire({
        title: "Error al registrar la información de la empresa",
        text: "Hubo un error al registrar la información de la empresa",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  // Función para obtener el rol de Usuario y presentarlo de mejor manera al usuario
  const getRolNombre = (rol) => {
    switch (rol) {
      case "aprendiz":
        return "Aprendiz";
      default:
        return rol;
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true); // Activar el estado de carga
      const response = await clienteAxios.get(
        `/empresa/aprendiz/${aprendizInfo.id_aprendiz}`
      );
      setEmpresaInfo(response.data.empresa);
      setShowVisits(false); // Activa la transición al siguiente contenido
    } catch (error) {
      console.error("Error al obtener la información de la empresa:", error);
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  const handlePrevious = () => {
    setShowVisits(true); // Activa la transición al contenido anterior
  };

  return (
    <Fragment>
      <div className="main-container__contenedor-hijo">
        {usuario && usuario.id_aprendiz && usuario.rol_usuario ? (
          <Fragment>
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
              <button onClick={actualizarContrasena}>
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  "Actualizar contraseña"
                )}
              </button>
            </Modal>
            <Modal
              isOpen={modalEmpresa}
              className="modal-empresa-data"
              overlayClassName="Overlay"
              shouldCloseOnOverlayClick={false}
              shouldCloseOnEsc={false}
            >
              <h2>
                Ingresa la información de la empresa en la que realiza sus
                prácticas
              </h2>
              <label htmlFor="razon_social">Razón social empresa:</label>
              <input
                type="text"
                id="razon_social"
                name="razon_social"
                onChange={handleChange}
              />
              <label htmlFor="nit_empresa">Nit empresa:</label>
              <input
                type="number"
                id="nit_empresa"
                name="nit_empresa"
                onChange={handleChange}
              />
              <label htmlFor="direccion_empresa">
                Dirección de la empresa:
              </label>
              <input
                type="text"
                id="direccion_empresa"
                name="direccion_empresa"
                onChange={handleChange}
              />
              <label htmlFor="nombre_jefe_inmediato">
                Nombres del jefe inmediato:
              </label>
              <input
                type="text"
                id="nombre_jefe_inmediato"
                name="nombre_jefe_inmediato"
                onChange={handleChange}
              />
              <label htmlFor="apellidos_jefe_inmediato">
                Apellidos del jefe inmediato:
              </label>
              <input
                type="text"
                id="apellidos_jefe_inmediato"
                name="apellidos_jefe_inmediato"
                onChange={handleChange}
              />
              <label htmlFor="cargo_jefe_inmediato">
                Cargo del jefe inmediato:
              </label>
              <input
                type="text"
                id="cargo_jefe_inmediato"
                name="cargo_jefe_inmediato"
                onChange={handleChange}
              />
              <label htmlFor="telefono_jefe_inmediato">
                Teléfono del jefe inmediato:
              </label>
              <input
                type="number"
                id="telefono_jefe_inmediato"
                name="telefono_jefe_inmediato"
                onChange={handleChange}
              />
              <label htmlFor="email_jefe_imediato">
                E-mail del jefe inmediato:
              </label>
              <input
                type="email"
                id="email_jefe_imediato"
                name="email_jefe_imediato"
                onChange={handleChange}
              />
              <button onClick={añadirInfoEmpresa}>
              {loading ? (
                <span className="spinner"></span>
              ) : (
                "Añadir Información de la Empresa"
              )}
              </button>
            </Modal>

            <div className="row">
              <div className="col-md-6 col-lg-6">
                <div className="card carta info-aprendiz">
                  <i className="bi bi-person-circle"></i>
                  <div className="card-body cuerpo-carta">
                    <h5 className="card-title text-center">
                      <strong>{getRolNombre(usuario.rol_usuario)}</strong>
                    </h5>
                    <p className="card-text texo-carta">
                      <strong>Nombres: </strong> {usuario.nombres}
                    </p>
                    <p className="card-text texo-carta">
                      <strong>Apellidos: </strong> {usuario.apellidos}
                    </p>
                    <p className="card-text texo-carta">
                      <strong>Número de Ficha: </strong> {usuario.numero_ficha}
                    </p>
                    <p className="card-text texo-carta">
                      <strong>Programa de formación: </strong>{" "}
                      {fichaAprendizInfo.programa_formacion}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 my-4 visitas-cont">
                {showVisits ? (
                  <Fragment>
                    <h2>Tus visitas programadas</h2>
                    <table className="tabla">
                      <thead>
                        <tr>
                          <th>Número de Visita</th>
                          <th>Fecha de Visita</th>
                          <th>Hora de Visita</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Primera visita</td>
                          <td>
                            {fechasPorTipo["primera visita"]
                              ? moment(fechasPorTipo["primera visita"]).format(
                                  "LL"
                                )
                              : "No agendada"}
                          </td>
                          <td>
                            {horasPorTipo["primera visita"]
                              ? moment(
                                  horasPorTipo["primera visita"],
                                  "HH:mm"
                                ).format("h:mm A")
                              : "No agendada"}
                          </td>
                        </tr>
                        <tr>
                          <td>Segunda visita</td>
                          <td>
                            {fechasPorTipo["segunda visita"]
                              ? moment(fechasPorTipo["segunda visita"]).format(
                                  "LL"
                                )
                              : "No agendada"}
                          </td>
                          <td>
                            {horasPorTipo["segunda visita"]
                              ? moment(
                                  horasPorTipo["segunda visita"],
                                  "HH:mm"
                                ).format("h:mm A")
                              : "No agendada"}
                          </td>
                        </tr>
                        <tr>
                          <td>Tercera visita</td>
                          <td>
                            {fechasPorTipo["tercera visita"]
                              ? moment(fechasPorTipo["tercera visita"]).format(
                                  "LL"
                                )
                              : "No agendada"}
                          </td>
                          <td>
                            {horasPorTipo["tercera visita"]
                              ? moment(
                                  horasPorTipo["tercera visita"],
                                  "HH:mm"
                                ).format("h:mm A")
                              : "No agendada"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="buttons-container">
                      <button onClick={handleNext}>
                        {" "}
                        {loading ? (
                          <span className="spinner"></span>
                        ) : (
                          "Siguiente"
                        )}
                      </button>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    {empresaInfo ? (
                      <div className="empresa-info">
                        <h2>Información de la Empresa</h2>
                        <p>
                          <strong>Razón Social:</strong>{" "}
                          {empresaInfo.razon_social}
                        </p>
                        <p>
                          <strong>NIT:</strong> {empresaInfo.nit_empresa}
                        </p>
                        <p>
                          <strong>Dirección:</strong>{" "}
                          {empresaInfo.direccion_empresa}
                        </p>
                        <p>
                          <strong>Nombre del Jefe Inmediato:</strong>{" "}
                          {empresaInfo.nombre_jefe_inmediato}
                        </p>
                        <p>
                          <strong>Apellidos del Jefe Inmediato:</strong>{" "}
                          {empresaInfo.apellidos_jefe_inmediato}
                        </p>
                        <p>
                          <strong>Cargo del Jefe Inmediato:</strong>{" "}
                          {empresaInfo.cargo_jefe_inmediato}
                        </p>
                        <p>
                          <strong>Teléfono del Jefe Inmediato:</strong>{" "}
                          {empresaInfo.telefono_jefe_inmediato}
                        </p>
                        <p>
                          <strong>Email del Jefe Inmediato:</strong>{" "}
                          {empresaInfo.email_jefe_imediato}
                        </p>
                        <p>
                          <strong>
                            Instructor Seguimiento Etapa Productiva:
                          </strong>{" "}
                          {instructorInfo.nombres} {instructorInfo.apellidos}
                        </p>
                        <p>
                          <strong>
                            E-mail Instructor Seguimiento Etapa Productiva:
                          </strong>{" "}
                          {instructorInfo.correo_electronico1}
                        </p>
                      </div>
                    ) : (
                      <p>Cargando información de la empresa...</p>
                    )}
                    <div className="buttons-container">
                      <button onClick={handlePrevious}>Anterior</button>
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          </Fragment>
        ) : (
          <p>Cargando usuario...</p>
        )}
      </div>
    </Fragment>
  );
}

export default Aprendiz;
