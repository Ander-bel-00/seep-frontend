import React, { useState } from "react";
import "./css/SegumientoEP.css";

function SeguimientoEp({ evaluacionAprendiz, setEvalaucionAprendiz }) {
  const [selected, setSelected] = useState(""); // Estado para almacenar la selección
  const [inputState, setInputState] = useState({
    inicio_periodo_evaluado: "",
    fin_periodo_evaluado: "",
    relaciones_in_satisfactorio: "",
    relaciones_in_por_mejorar: "",
    trabajo_equip_satisfactorio: "",
    trabajo_equip_por_mejorar: "",
    solucion_prob_satisfactorio: "",
    solucion_prob_por_mejorar: "",
    cumplimiento_satisfactorio: "",
    cumplimiento_por_mejorar: "",
    organizacion_satisfactorio: "",
    organizacion_por_mejorar: "",
    trasnfe_cono_satisfactorio: "",
    trasnfe_cono_por_mejorar: "",
    mejora_conti_satisfactorio: "",
    mejora_conti_por_mejorar: "",
    fort_ocup_satisfactorio: "",
    fort_ocup_por_mejorar: "",
    oport_calidad_satisfactorio: "",
    oport_calidad_por_mejorar: "",
    respo_ambient_satisfactorio: "",
    respo_ambient_por_mejorar: "",
    admin_recursos_satisfactorio: "",
    admin_recursos_por_mejorar: "",
    seg_ocupacional_satisfactorio: "",
    seg_ocupacional_por_mejorar: "",
    docs_etapro_satisfactorio: "",
    docs_etapro_por_mejorar: "",
    // Observaciones
    relaciones_in_observaciones: "",
    trabajo_equip_observaciones: "",
    solucion_prob_observaciones: "",
    cumplimiento_observaciones: "",
    organizacion_observaciones: "",
    trasnfe_cono_observaciones: "",
    mejora_conti_observaciones: "",
    fort_ocup_observaciones: "",
    oport_calidad_observaciones: "",
    respo_ambient_observaciones: "",
    admin_recursos_observaciones: "",
    seg_ocupacional_observaciones: "",
    docs_etapro_observaciones: "",
    Observaciones_ente_conf: "",
    observaciones_aprendiz: "",
  });

  const handleSelection = (type) => {
    setSelected(type);
    setEvalaucionAprendiz({ ...evaluacionAprendiz, tipo_informe: type });
  };

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    let updatedValue = value;

    if (type === "text") {
      // Convertir a mayúsculas solo para los campos "satisfactorio" y "por mejorar"
      const isSatisfactorio = name.includes("satisfactorio");
      const isPorMejorar = name.includes("por_mejorar");
      if (isSatisfactorio || isPorMejorar) {
        updatedValue = value.toUpperCase();
        const oppositeField = name.replace(
          isSatisfactorio ? "satisfactorio" : "por_mejorar",
          isSatisfactorio ? "por_mejorar" : "satisfactorio"
        );

        if (
          updatedValue === "" ||
          (updatedValue === "X" && inputState[oppositeField] !== "X")
        ) {
          setInputState({ ...inputState, [name]: updatedValue });
          setEvalaucionAprendiz({
            ...evaluacionAprendiz,
            [name]: updatedValue,
          });
        }
      } else {
        setInputState({ ...inputState, [name]: updatedValue });
        setEvalaucionAprendiz({ ...evaluacionAprendiz, [name]: updatedValue });
      }
    } else {
      setInputState({ ...inputState, [name]: updatedValue });
      setEvalaucionAprendiz({ ...evaluacionAprendiz, [name]: updatedValue });
    }
  };

  return (
    <div className="segumiento-table-box" id="seguimientoEP">
      <div className="segumientoEP-content-table">
        {/* Row 1 */}
        <div className="seguimientoEP-title-col">
          <h3 className="font-bold spaccing">
            3. SEGUIMIENTO ETAPA PRODUCTIVA
          </h3>
        </div>
        {/* Row 2 */}
        <div className="tipoInforme-col segumientoEP-content-table__th">
          <p>TIPO DE INFORME</p>
        </div>
        <div className="segumientoEP-content-table__td  select-typeinfo-col">
          <div
            className="selectable-container"
            onClick={() => handleSelection("Parcial")}
          >
            <p className="font-medium">Parcial:</p>
            <div
              className={`selectable-box ${
                selected === "Parcial" ? "selected-recono" : ""
              }`}
            >
              {selected && selected === "Parcial" ? (
                <input
                  type="text"
                  value={selected === "Parcial" ? "X" : ""}
                  className="w-4 recon-check mt-2"
                  readOnly
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className="periodo-evaluado-col segumientoEP-content-table__th">
          <p className="spaccing">PERÍODO EVALUADO</p>
        </div>
        <div className="inicio-period-col segumientoEP-content-table__td">
          <p className="font-medium">Inicio:</p>
          <input
            type="date"
            name="inicio_periodo_evaluado"
            value={inputState.inicio_periodo_evaluado}
            onChange={handleChange}
          />
        </div>
        <div className="fin-period-col segumientoEP-content-table__td select-typeinfo-col">
          <div
            className="selectable-container"
            onClick={() => handleSelection("Final")}
          >
            <p className="font-medium">Final:</p>
            <div
              className={`selectable-box ${
                selected === "Final" ? "selected-recono" : ""
              }`}
            >
              {selected && selected === "Final" ? (
                <input
                  type="text"
                  value={selected === "Final" ? "X" : ""}
                  className="w-4 recon-check mt-2"
                  readOnly
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className="inicio-period-col segumientoEP-content-table__td">
          <p className="font-medium">Finalización:</p>
          <input
            type="date"
            name="fin_periodo_evaluado"
            value={inputState.fin_periodo_evaluado}
            onChange={handleChange}
          />
        </div>
        <div className="factors-col segumientoEP-content-table__th final_border_col">
          <h3 className="spaccing-extra">
            FACTORES ACTITUDINALES Y COMPORTAMENTALES
          </h3>
        </div>
        <div className="segumientoEP-content-table__th variable-col">
          <p>VARIABLE</p>
        </div>
        <div className="segumientoEP-content-table__th descripcion-col">
          <p>DESCRIPCIÓN</p>
        </div>
        <div className="segumientoEP-content-table__th valoracion-col">
          <p>VALORACIÓN </p>
        </div>
        <div className="segumientoEP-content-table__th obser-col final_border_col">
          <p>Observación </p>
        </div>
        <div className="segumientoEP-content-table__th satisfac-col">
          <p>Satisfactorio</p>
        </div>
        <div className="segumientoEP-content-table__th porme-col">
          <p>
            Por <br />
            mejorar
          </p>
        </div>
        <div className="segumientoEP-content-table__th relciones-inter-col">
          RELACIONES <br />
          INTERPERSONALES
        </div>
        <div className="segumientoEP-content-table__td cols-descripcion">
          <p>
            Desarrolla relaciones interpersonales con las personas de los
            diferentes niveles del ente Conformador en forma armoniosa,
            respetuosa y enmarcada dentro de los principios de convivencia
            social.
          </p>
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          {/* Satisfactorio */}
          <input
            type="text"
            name="relaciones_in_satisfactorio"
            value={inputState.relaciones_in_satisfactorio}
            onChange={handleChange}
            maxLength={1} // Limitar a un carácter
          />
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          {/* Por Mejorar */}
          <input
            type="text"
            name="relaciones_in_por_mejorar"
            value={inputState.relaciones_in_por_mejorar}
            onChange={handleChange}
            maxLength={1} // Limitar a un carácter
          />
        </div>
        <div className="segumientoEP-content-table__td observaciones-segEP-col">
          <textarea
            value={inputState.relaciones_in_observaciones}
            name="relaciones_in_observaciones"
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="segumientoEP-content-table__th relciones-inter-col spaccing">
          TRABAJO EN <br />
          EQUIPO
        </div>
        <div className="segumientoEP-content-table__td cols-descripcion">
          <p>
            Participa en forma activa y propositiva en equipos de trabajo
            asumiendo los roles, de acuerdo con sus fortalezas.
          </p>
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            maxLength={1}
            name="trabajo_equip_satisfactorio"
            value={inputState.trabajo_equip_satisfactorio}
            onChange={handleChange}
          />
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            maxLength={1}
            value={inputState.trabajo_equip_por_mejorar}
            onChange={handleChange}
            name="trabajo_equip_por_mejorar"
          />
        </div>
        <div className="segumientoEP-content-table__td observaciones-segEP-col">
          <textarea
            value={inputState.trabajo_equip_observaciones}
            name="trabajo_equip_observaciones"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="segumientoEP-content-table__th relciones-inter-col spaccing">
          SOLUCIÓN DE <br />
          PROBLEMAS
        </div>
        <div className="segumientoEP-content-table__td cols-descripcion">
          <p>
            Propone alternativas de solución a situaciones problemáticas, en el
            contexto del desarrollo de su etapa productiva.
          </p>
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            maxLength={1}
            value={inputState.solucion_prob_satisfactorio}
            name="solucion_prob_satisfactorio"
            onChange={handleChange}
          />
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.solucion_prob_por_mejorar}
            name="solucion_prob_por_mejorar"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td observaciones-segEP-col">
          <textarea
            value={inputState.solucion_prob_observacione}
            name="solucion_prob_observacione"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="segumientoEP-content-table__th relciones-inter-col">
          CUMPLIMIENTO
        </div>
        <div className="segumientoEP-content-table__td cols-descripcion">
          <p>
            Asume compromiso de las funciones y responsabilidades asignadas en
            el desarrollo de su trabajo.
          </p>
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.cumplimiento_satisfactorio}
            name="cumplimiento_satisfactorio"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.cumplimiento_por_mejorar}
            name="cumplimiento_por_mejorar"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td observaciones-segEP-col">
          <textarea
            value={inputState.cumplimiento_observaciones}
            name="cumplimiento_observaciones"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="segumientoEP-content-table__th relciones-inter-col">
          ORGANIZACIÓN
        </div>
        <div className="segumientoEP-content-table__td cols-descripcion">
          <p>
            Demuestra capacidad para ordenar y disponer los elementos necesarios
            e información para facilitar la ejecución de un trabajo y el logro
            de los objetivos.
          </p>
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.organizacion_satisfactorio}
            name="organizacion_satisfactorio"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.organizacion_por_mejorar}
            name="organizacion_por_mejorar"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td observaciones-segEP-col">
          <textarea
            value={inputState.organizacion_observaciones}
            name="organizacion_observaciones"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="factors-col segumientoEP-content-table__th final_border_col">
          <h3 className="spaccing-extra">FACTORES TÉCNICOS</h3>
        </div>
        <div className="segumientoEP-content-table__th variable-col">
          <p>VARIABLE</p>
        </div>
        <div className="segumientoEP-content-table__th descripcion-col">
          <p>DESCRIPCIÓN</p>
        </div>
        <div className="segumientoEP-content-table__th valoracion-col">
          <p>VALORACIÓN </p>
        </div>
        <div className="segumientoEP-content-table__th obser-col final_border_col">
          <p>Observación </p>
        </div>
        <div className="segumientoEP-content-table__th satisfac-col">
          <p>Satisfactorio</p>
        </div>
        <div className="segumientoEP-content-table__th porme-col">
          <p>
            Por <br />
            mejorar
          </p>
        </div>
        <div className="segumientoEP-content-table__th">
          TRANSFERENCIA DE <br /> CONOCIMIENTO
        </div>
        <div className="segumientoEP-content-table__td cols-descripcion">
          <p>
            Demuestra las competencias específicas del programa de formación en
            situaciones reales de trabajo.
          </p>
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.trasnfe_cono_satisfactorio}
            name="trasnfe_cono_satisfactorio"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.trasnfe_cono_por_mejorar}
            name="trasnfe_cono_por_mejorar"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td observaciones-segEP-col">
          <textarea
            value={inputState.trasnfe_cono_observaciones}
            name="trasnfe_cono_observaciones"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="segumientoEP-content-table__th">
          MEJORA <br />
          CONTINUA
        </div>
        <div className="segumientoEP-content-table__td cols-descripcion">
          <p>Aporta al mejoramiento de los procesos propios de su desempeño.</p>
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.mejora_conti_satisfactorio}
            name="mejora_conti_satisfactorio"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.mejora_conti_por_mejorar}
            name="mejora_conti_por_mejorar"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td observaciones-segEP-col">
          <textarea
            value={inputState.mejora_conti_observaciones}
            name="mejora_conti_observaciones"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="segumientoEP-content-table__th">
          FORTALECIMIENTO <br />
          OCUPACIONAL
        </div>
        <div className="segumientoEP-content-table__td cols-descripcion">
          <p>
            Autogestiona acciones que fortalezca su perfil ocupacional en el
            marco de su proyecto de vida.
          </p>
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.fort_ocup_satisfactorio}
            name="fort_ocup_satisfactorio"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.fort_ocup_por_mejorar}
            name="fort_ocup_por_mejorar"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td observaciones-segEP-col">
          <textarea
            value={inputState.fort_ocup_observaciones}
            name="fort_ocup_observaciones"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="segumientoEP-content-table__th">
          OPORTUNIDAD Y <br />
          CALIDAD
        </div>
        <div className="segumientoEP-content-table__td cols-descripcion">
          <p>
            Presenta con oportunidad y calidad los productos generados en el
            desarrollo de sus funciones y actividades.
          </p>
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.oport_calidad_satisfactorio}
            name="oport_calidad_satisfactorio"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.oport_calidad_por_mejorar}
            name="oport_calidad_por_mejorar"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td observaciones-segEP-col">
          <textarea
            value={inputState.oport_calidad_observaciones}
            name="oport_calidad_observaciones"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="segumientoEP-content-table__th">
          RESPONSABILIDAD <br />
          AMBIENTAL
        </div>
        <div className="segumientoEP-content-table__td cols-descripcion">
          <p>
            Administra los recursos para el desarrollo de sus actividades con
            criterios de responsabilidad ambiental.
          </p>
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.respo_ambient_satisfactorio}
            name="respo_ambient_satisfactorio"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.respo_ambient_por_mejorar}
            name="respo_ambient_por_mejorar"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td observaciones-segEP-col">
          <textarea
            value={inputState.respo_ambient_observaciones}
            name="respo_ambient_observaciones"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="segumientoEP-content-table__th">
          ADMINISTRACIÓN <br />
          DE RECURSOS
        </div>
        <div className="segumientoEP-content-table__td cols-descripcion">
          <p>
            Utiliza de manera racional los materiales, equipos y herramientas
            suministrados para el desempeño de sus actividades o funciones.
          </p>
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.admin_recursos_satisfactorio}
            name="admin_recursos_satisfactorio"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.admin_recursos_por_mejorar}
            name="admin_recursos_por_mejorar"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td observaciones-segEP-col">
          <textarea
            value={inputState.admin_recursos_observaciones}
            name="admin_recursos_observaciones"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="segumientoEP-content-table__th spaccing">
          SEGURIDAD <br />
          OCUPACIONAL E <br />
          INDUSTRIAL
        </div>
        <div className="segumientoEP-content-table__td cols-descripcion">
          <p>
            Utiliza los elementos de seguridad y salud ocupacional de acuerdo
            con la normatividad vigente establecida para sus actividades o
            funciones.
          </p>
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.seg_ocupacional_satisfactorio}
            name="seg_ocupacional_satisfactorio"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td cols-input">
          <input
            type="text"
            value={inputState.seg_ocupacional_por_mejorar}
            name="seg_ocupacional_por_mejorar"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td observaciones-segEP-col">
          <textarea
            value={inputState.seg_ocupacional_observaciones}
            name="seg_ocupacional_observaciones"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="segumientoEP-content-table__th final-bottom-border">
          DOCUMENTACIÓN <br />
          ETAPA <br />
          PRODUCTIVA
        </div>
        <div className="segumientoEP-content-table__td cols-descripcion final-bottom-border">
          <p>Actualiza permanentemente el portafolio de evidencias.</p>
        </div>
        <div className="segumientoEP-content-table__td cols-input final-bottom-border">
          <input
            type="text"
            value={inputState.docs_etapro_satisfactorio}
            name="docs_etapro_satisfactorio"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td cols-input final-bottom-border">
          <input
            type="text"
            value={inputState.docs_etapro_por_mejorar}
            name="docs_etapro_por_mejorar"
            onChange={handleChange}
            maxLength={1}
          />
        </div>
        <div className="segumientoEP-content-table__td observaciones-segEP-col final-bottom-border">
          <textarea
            value={inputState.docs_etapro_observaciones}
            name="docs_etapro_observaciones"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="segumientoEP-content-table__td observaciones-ente">
          <label>
            <p className="spaccing">
              <strong>Observaciones del responsable ente Conformador.</strong>{" "}
            </p>
            <p className="text-nowrap">
              (Sus observaciones proporcionan información que aporta al
              mejoramiento de la calidad de la Formación Profesional Integral):
            </p>
          </label>
          <textarea
            value={inputState.Observaciones_ente_conf}
            name="Observaciones_ente_conf"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="segumientoEP-content-table__td observaciones-aprendiz">
          <label className="spaccing">
            <strong>Observaciones del Aprendiz:</strong>
          </label>
          <textarea
            value={inputState.observaciones_aprendiz}
            name="observaciones_aprendiz"
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default SeguimientoEp;
