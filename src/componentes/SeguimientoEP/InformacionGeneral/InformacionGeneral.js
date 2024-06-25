import React, { useEffect, useState } from "react";
import "./css/infoGeneral.css";
import LogoSena from "./img/sena-verde.png";
import { useParams } from "react-router-dom";
import clienteAxios from "../../../api/axios";

function InformacionGeneral({ evaluacionAprendiz, setEvalaucionAprendiz }) {
  const { id_aprendiz } = useParams();
  const [aprendizInfo, setAprendizInfo] = useState([]);
  const [fichaAprendizInfo, setFichaAprendizInfo] = useState([]);
  const [empresaInfo, setEmpresaInfo] = useState([]);

  useEffect(() => {
    const obtenerDatosAprendiz = async () => {
      if (id_aprendiz) {
        try {
          const res = await clienteAxios.get(`/aprendiz/id/${id_aprendiz}`);
          setAprendizInfo(res.data);
          const fichaData = await clienteAxios.get(
            `/ficha-aprendiz/ficha/${res.data.numero_ficha}`
          );
          setFichaAprendizInfo(fichaData.data.ficha);
          const empresaData = await clienteAxios.get(
            `/empresas/get/${res.data.id_empresa}`
          );
          setEmpresaInfo(empresaData.data.empresa);
        } catch (error) {
          console.error("Error al obtner los datos del aprendiz", error);
        }
      }
    };
    obtenerDatosAprendiz();
  }, [id_aprendiz]);

  return (

      <div className="info-general-content-box" id="infoGeneral">
        <img
          src={LogoSena}
          alt="logo-sena"
          className="info-general-content-box__logo-sena"
        />
        <h2 className="info-general-content-box__main-title">
          PROCESO GESTIÓN DE FORMACIÓN PROFESIONAL INTEGRAL <br />
          FORMATO PLANEACIÓN, SEGUIMIENTO Y EVALUACIÓN ETAPA PRODUCTIVA
        </h2>

        <h3 className="mt-4 font-bold">1. INFORMACIÓN GENERAL</h3>
        {/* Tabla Info General */}
        <div className="info-general-table">
          {/* Row 1*/}
          <div className="Regional-col">
            <p className="font-medium">Regional:</p>
          </div>
          <div className="Regional-col__text">
            <p>{fichaAprendizInfo.nombre_regional}</p>
          </div>
          <div className="CentroF-col">
            <p className="font-medium">Centro de Formación:</p>
          </div>
          <div className="CentroF-col__text">
            <p>{fichaAprendizInfo.centro_formacion}</p>
          </div>
          {/* Row 2 */}
          <div className="programF-col">
            <p className="font-medium">Programa de Formación:</p>
          </div>
          <div className="programF-col__text">
            <p>{fichaAprendizInfo.programa_formacion}</p>
          </div>
          <div className="NroFicha-col">
            <p className="font-medium">No. de Ficha:</p>
          </div>
          <div className="NroFicha-col__text">
            {fichaAprendizInfo.numero_ficha}
          </div>

          {/* Row 3 */}
          <div className="row-null"></div>

          {/* Row 4  */}
          <div className="DatAprendiz-col">
            <p className="font-medium">Datos del Aprendiz</p>
          </div>
          <div className="nombre-col">
            <p className="font-medium">Nombre: </p>
          </div>
          <div className="nombre-col__text">
            <p>
              {aprendizInfo.nombres} {aprendizInfo.apellidos}
            </p>
          </div>

          {/* Row 5 */}
          <div className="identi-col">
            <p className="font-medium">Identificación: </p>
          </div>
          <div className="identi-col__text">
            <p>{aprendizInfo.numero_documento}</p>
          </div>

          {/* Row 6 */}
          <div className="telef-col">
            <p className="font-medium">Teléfono:</p>
          </div>
          <div className="telef-col__text">{aprendizInfo.numero_celular1}</div>

          {/* Row 7 */}
          <div className="email-col">
            <p className="font-medium">E-mail:</p>
          </div>
          <div className="email-col__text">
            <p>{aprendizInfo.correo_electronico1}</p>
          </div>

          {/* Row 8 */}
          <div className="alter-col">
            <p className="font-medium">Alternativa registrada en SOFIA plus </p>
          </div>
          <div className="alter-col__text">
            <p>{aprendizInfo.correo_electronico_sofia_plus}</p>
          </div>

          {/* Row 9 */}
          <div className="Ente-col">
            <p className="font-medium">Ente Conformador</p>
          </div>
          <div className="rz-social__col">
            <p className="font-medium">Razón Social Empresa: </p>
          </div>
          <div className="nombre-col__text">
            <p>{empresaInfo.razon_social}</p>
          </div>

          {/* Row 5 */}
          <div className="identi-col">
            <p className="font-medium">Nit: </p>
          </div>
          <div className="identi-col__text">
            <p>{empresaInfo.nit_empresa}</p>
          </div>

          {/* Row 6 */}
          <div className="telef-col">
            <p className="font-medium">Dirección:</p>
          </div>
          <div className="telef-col__text">{empresaInfo.direccion_empresa}</div>

          {/* Row 7 */}
          <div className="nameJefe-col">
            <p className="font-medium">
              Nombre del Jefe Inmediato del aprendiz:{" "}
            </p>
          </div>
          <div className="email-col__text">
            <p>{empresaInfo.nombre_jefe_inmediato}</p>
          </div>

          {/* Row 8 */}
          <div className="alter-col">
            <p className="font-medium">Cargo:</p>
          </div>
          <div className="alter-col__text">
            <p>{empresaInfo.cargo_jefe_inmediato}</p>
          </div>
          <div className="telef-col">
            <p className="font-medium">Teléfono:</p>
          </div>
          <div className="telef-col__text">{empresaInfo.telefono_jefe_inmediato}</div>

          {/* Row 7 */}
          <div className="email-jefe-col">
            <p className="font-medium">E-mail:</p>
          </div>
          <div className="email-jefe-col__text">
            <p>{empresaInfo.email_jefe_imediato}</p>
          </div>
        </div>
      </div>
  );
}

export default InformacionGeneral;
