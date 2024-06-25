import React, { useEffect, useState } from "react";
import "./css/AgendaCell.css";
import { Link } from "react-router-dom";
import clienteAxios from "../../../api/axios";
import moment from "moment";

function AgendaCell({ visita }) {
  const id_aprendiz = visita.aprendiz;
  const [aprendizInfo, setAprendizInfo] = useState([]);
  const [fichaAprendizInfo, setFichaAprendizInfo] = useState([]);

  useEffect(() => {
    if (id_aprendiz) {
      const obtenerDatosAprendiz = async () => {
        try {
          const res = await clienteAxios.get(`/aprendiz/id/${id_aprendiz}`);
          setAprendizInfo(res.data);
          const fichaData = await clienteAxios.get(
            `/ficha-aprendiz/ficha/${res.data.numero_ficha}`
          );
          setFichaAprendizInfo(fichaData.data.ficha);
        } catch (error) {
          console.error(
            "Hubo un error al obtener los datos del aprendiz",
            error
          );
        }
      };
      obtenerDatosAprendiz();
    }
  }, [id_aprendiz]);

  // Función para convertir hora de 24 a 12 horas usando moment.js
  const formatHour = (hour) => {
    return moment(hour, "HH:mm").format("hh:mm A");
  };

  // Función para formatear la fecha en español usando moment.js
  const formatDate = (date) => {
    return moment(date).locale("es").format("DD [de] MMMM [de] YYYY");
  };

  return (
    <Link
      to={`visitas-add/${
        aprendizInfo ? aprendizInfo.numero_ficha : null
      }/${id_aprendiz}`}
      className="Agenda-Link"
    >
      <div className="agenda-cell">
        <div>
          <strong>Aprendiz:</strong>
        </div>
        <div className="multiline">
          {aprendizInfo.nombres} {aprendizInfo.apellidos}
        </div>
        <div>
          <strong>Número de Ficha:</strong> {aprendizInfo.numero_ficha}
        </div>
        <div>
          <strong>Programa de Formación:</strong>
        </div>
        <div className="multiline">{fichaAprendizInfo.programa_formacion}</div>
        <div>
          <strong>Número de Visita Agendada:</strong> {visita.tipo_visita}
        </div>
        <div>
          <strong>Fecha:</strong> {formatDate(visita.fecha)}
        </div>
        <div>
          <strong>Hora de Inicio:</strong> {formatHour(visita.hora_inicio)}
        </div>
        <div>
          <strong>Hora de Fin:</strong> {formatHour(visita.hora_fin)}
        </div>
        <div>
          <strong>Lugar:</strong>
        </div>
        <div className="multiline">{visita.lugar_visita}</div>
        <div>
          <strong>Modalidad:</strong> {visita.modalidad_visita}
        </div>
      </div>
    </Link>
  );
}

export default AgendaCell;
