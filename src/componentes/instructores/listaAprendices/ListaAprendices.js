import React, { Fragment, useEffect, useState } from "react";
import clienteAxios from "../../../api/axios";
import { Link, useParams } from "react-router-dom";
import "./css/ListaAprendices.css";
import { FaUser } from "react-icons/fa";

function ListaAprendices() {
  const [aprendices, setAprendices] = useState([]);
  const { numero_ficha } = useParams();
  const [aprendizInfo, setAprendizInfo] = useState({});
  const [fichaAprendiz, setFichaAprendiz] = useState({});
  const [bitacorasAprendiz, setBitacorasAprendiz] = useState([]);
  const [visitasAprendiz, setVisitasAprendiz] = useState([]);

  const consultarApi = async () => {
    try {
      const consultarAprendices = await clienteAxios.get(
        `/fichas-getAprendices/${numero_ficha}`
      );
      // Ordenar los aprendices por orden alfabético de apellidos.
      const aprendicesOrdenados = consultarAprendices.data.aprendices.sort(
        (a, b) => {
          return a.apellidos.localeCompare(b.apellidos);
        }
      );
      setAprendices(aprendicesOrdenados); // Actualiza el estado con el array de aprendices ordenados
    } catch (error) {
      console.error("Error al obtener los aprendices:", error);
    }
  };

  useEffect(() => {
    consultarApi();
  }, [numero_ficha]);

  const getInfoAprendiz = async (id_aprendiz) => {
    try {
      setBitacorasAprendiz([]); // Restablecer el estado de las bitácoras
      setVisitasAprendiz([]);
      const res = await clienteAxios.get(`/aprendiz/id/${id_aprendiz}`);
      setAprendizInfo(res.data);
      const resFichas = await clienteAxios.get(
        `/ficha-aprendiz/ficha/${res.data.numero_ficha}`
      );
      const resVisitas = await clienteAxios.get(`/visitas-aprendiz/${id_aprendiz}`);
      setVisitasAprendiz(resVisitas.data.visitas);

      setFichaAprendiz(resFichas.data.ficha);
      const resBitacoras = await clienteAxios.get(`/bitacoras-aprendiz/${id_aprendiz}`);
      setBitacorasAprendiz(resBitacoras.data.bitacoras);


    } catch (error) {
      console.error("Hubo un error al obtener los datos del aprendiz", error);
    }
  };

  console.log(bitacorasAprendiz)

  return (
    <Fragment>
      <div className="main-container__contenedor-hijo fichas-movil">
        <div className="list-aprendices-box">
          <div className="list-col1">
            <h2 className="list-title">
              Aprendices de la Ficha {numero_ficha}
            </h2>
            <ul className="lista-aprendices">
              {Array.isArray(aprendices) && aprendices.length > 0 ? (
                aprendices.map((aprendiz) => (
                  <li
                    key={aprendiz.id_aprendiz}
                    className="aprendices-fichas"
                    onClick={() => getInfoAprendiz(aprendiz.id_aprendiz)}
                  >
                    <p className="flex p-2 user-info">
                      <p className="user-icon">
                        <FaUser />
                      </p>{" "}
                      <p>
                        {aprendiz.nombres} {aprendiz.apellidos}
                      </p>
                    </p>
                  </li>
                ))
              ) : (
                <li>No hay aprendices asociados a esta ficha</li>
              )}
            </ul>
          </div>
          <div className="list-col2">
            <div>
              <h2>
                {aprendizInfo && !aprendizInfo.id_aprendiz ? (
                  <p>Selecciona un Aprendiz</p>
                ) : (
                  <p className="text-center">Información del Aprendiz</p>
                )}
              </h2>
              {/* Aquí la info del aprendiz */}

              {aprendizInfo && !aprendizInfo.id_aprendiz ? (
                <p>Selecciona un aprendiz para ver su información</p>
              ) : (
                <>
                  <label>Nombres y apellidos:</label>
                  <p>
                    {aprendizInfo.nombres} {aprendizInfo.apellidos}
                  </p>
                  <label>Número de Ficha</label>
                  <p>{aprendizInfo.numero_ficha}</p>
                  <label>Programa de Formación</label>
                  <p>{fichaAprendiz.programa_formacion}</p>
                  <label>Estado del Aprendiz:</label>
                  <p>{aprendizInfo && aprendizInfo.estado ? aprendizInfo.estado : 'En Ejecución'}</p>
                  <label>Bitácoras Cargadas:</label>
                  <p>{bitacorasAprendiz.length} de 12</p>
                  <label>Número de Visitas Agendadas:</label>
                  <p>{visitasAprendiz.length} de 3</p>
                  {aprendizInfo && !aprendizInfo.id_aprendiz ? null : (
                    <div className="mt-4">
                      <button>
                        <Link
                          to={`/instructor/evaluacion-EP/${aprendizInfo.id_aprendiz}`}
                          className="agendarVisita"
                        >
                          Planeacion y Seguimiento
                        </Link>
                      </button>
                      <button>
                        <Link
                          to={`/instructor/visitas-add/${numero_ficha}/${aprendizInfo.id_aprendiz}`}
                          className="agendarVisita"
                        >
                          Ver o agendar visitas
                        </Link>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ListaAprendices;
