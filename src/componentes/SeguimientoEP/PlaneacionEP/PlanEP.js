import React, { Fragment, useEffect, useState } from "react";
import "./css/PlaneacionEP.css";
import PopupFirmas from "../Firmas/PopupFirmas";
import Swal from "sweetalert2";
import LogoSena from "./img/sena-verde.png";

function PlanEP({ evaluacionAprendiz, setEvalaucionAprendiz }) {
  const [campos, setCampos] = useState([
    { firma: null },
    { firma: null },
    { firma: null },
  ]);
  const [firmas, setFirmas] = useState([]);
  const [currentFirmaField, setCurrentFirmaField] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const storedFirmas = localStorage.getItem("firmas");
    if (storedFirmas) {
      setFirmas(JSON.parse(storedFirmas));
    }
  }, []);

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    const updatedCampos = [...campos];
    updatedCampos[index] = { ...updatedCampos[index], [name]: value };
    setCampos(updatedCampos);

    const newEvalaucionAprendiz = {
      ...evaluacionAprendiz,
      actividades_desarrollar: updatedCampos.map(
        (campo) => campo.actividades_desarrollar || ""
      ),
      evidencias_aprendizaje: updatedCampos.map(
        (campo) => campo.evidencias_aprendizaje || ""
      ),
      fecha_actividad: updatedCampos.map(
        (campo) => campo.fecha_actividad || ""
      ),
      lugar_actividad: updatedCampos.map(
        (campo) => campo.lugar_actividad || ""
      ),
    };
    setEvalaucionAprendiz(newEvalaucionAprendiz);
  };

  const handleObservacionesChange = (event) => {
    const { value } = event.target;
    // Actualizar el estado con las observaciones generales
    setEvalaucionAprendiz((prevEvalaucionAprendiz) => ({
      ...prevEvalaucionAprendiz,
      observaciones_actividades: value,
    }));
  };

  const handleNombreConformadorChange = (event) => {
    const { value } = event.target;
    // Actualizar el estado con el nombre del ente conformador
    setEvalaucionAprendiz((prevEvalaucionAprendiz) => ({
      ...prevEvalaucionAprendiz,
      nombre_ente_conformador: value,
    }));
  };

  const handleNombreInstructorChange = (event) => {
    const { value } = event.target;
    // Actualizar el estado con el nombre del instructor
    setEvalaucionAprendiz((prevEvalaucionAprendiz) => ({
      ...prevEvalaucionAprendiz,
      nombre_instructor: value,
    }));
  };

  const agregarCampos = () => {
    setCampos([...campos, { id: campos.length, firma: null }]);
  };

  const eliminarCampos = (index) => {
    // Evitar la eliminación si solo están presentes los campos iniciales
    if (campos.length > 3) {
      setCampos(campos.filter((_, i) => i !== index));
    } else {
      Swal.fire({
        icon: "warning",
        title: "Recuerda",
        text: "No se pueden eliminar las filas iniciales",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleAddFirma = (fieldId) => {
    setCurrentFirmaField(fieldId);
    setShowPopup(true);
  };

  const handleSaveFirma = (firma, editIndex = null) => {
    setFirmas((prevFirmas) => {
      let newFirmas;
      if (editIndex !== null) {
        if (firma) {
          newFirmas = prevFirmas.map((f, index) =>
            index === editIndex ? firma : f
          );
        } else {
          newFirmas = prevFirmas.filter((_, index) => index !== editIndex);
        }
      } else {
        newFirmas = [...prevFirmas, firma];
      }
      localStorage.setItem("firmas", JSON.stringify(newFirmas));
      return newFirmas;
    });

    if (currentFirmaField !== null) {
      const updatedCampos = [...campos];
      updatedCampos[currentFirmaField] = { ...updatedCampos[currentFirmaField], firma };
      setCampos(updatedCampos);

      const updatedEvalaucionAprendiz = {
        ...evaluacionAprendiz,
        firma_ente_conformador: currentFirmaField === 0 ? firma : evaluacionAprendiz.firma_ente_conformador,
        firma_aprendiz: currentFirmaField === 1 ? firma : evaluacionAprendiz.firma_aprendiz,
        firma_instructor_seguimiento: currentFirmaField === 2 ? firma : evaluacionAprendiz.firma_instructor_seguimiento,
      };
      setEvalaucionAprendiz(updatedEvalaucionAprendiz);
    }
  };

  const handleSelectFirma = (firma) => {
    const updatedCampos = [...campos];
    updatedCampos[currentFirmaField] = { ...updatedCampos[currentFirmaField], firma };
    setCampos(updatedCampos);
    setShowPopup(false);

    const updatedEvalaucionAprendiz = {
      ...evaluacionAprendiz,
      firma_ente_conformador: currentFirmaField === 0 ? firma : evaluacionAprendiz.firma_ente_conformador,
      firma_aprendiz: currentFirmaField === 1 ? firma : evaluacionAprendiz.firma_aprendiz,
      firma_instructor_seguimiento: currentFirmaField === 2 ? firma : evaluacionAprendiz.firma_instructor_seguimiento,
    };
    setEvalaucionAprendiz(updatedEvalaucionAprendiz);
  };

  return (
    <Fragment>
      <div className="plan-content-box" id="planEP">
        <img
          src={LogoSena}
          alt="logo-sena"
          className="info-general-content-box__logo-sena"
        />
        <div className="planEP-container-table">
          {/* Row 1 */}
          <div className="planEP-title-col">
            <h3 className="font-bold planEP-title">
              2. PLANEACIÓN ETAPA PRODUCTIVA
            </h3>
          </div>
          {/* Row 2 */}
          <div className="planEP-secondTitle-col">
            <h4 className="planEP-title">
              CONCERTACIÓN PLAN DE TRABAJO DURANTE LA ETAPA PRODUCTIVA DEL
              APRENDIZ
            </h4>
          </div>
          {/* Row 3 */}
          <div className="planEP-container-table__th actividades-info-col">
            <p className="planEP-title">ACTIVIDADES A DESARROLLAR</p>
            <p>
              Relacione las actividades que el aprendiz va a realizar. (Estas
              deben corresponder al Perfil del egresado establecido en el
              programa de formación que el aprendiz está desarrollando){" "}
            </p>
          </div>
          <div className="planEP-container-table__th evidens-info-col">
            <p className="planEP-title">
              EVIDENCIAS DE <br />
              APRENDIZAJE
            </p>
          </div>
          <div className="planEP-container-table__th recol-evidens-info-col final_border_col">
            <p className="planEP-title">
              RECOLECCIÓN DE <br />
              EVIDENCIAS
            </p>
          </div>
          <div className="planEP-container-table__th fecha-info-col">
            <p>Fecha</p>
          </div>
          <div className="planEP-container-table__th lugar-info-col final_border_col">
            <p>Lugar</p>
          </div>
          {/* Row 4 */}
          {campos.map((campo, index) => (
            <Fragment key={index}>
              <div className="planEP-container-table__td activi-text-col">
                <textarea
                  required
                  name="actividades_desarrollar"
                  value={campo.actividades_desarrollar || ""}
                  onChange={(event) => handleChange(event, index)}
                />
              </div>
              <div className="planEP-container-table__td evidens-text-col">
                <textarea
                  required
                  name="evidencias_aprendizaje"
                  value={campo.evidencias_aprendizaje || ""}
                  onChange={(event) => handleChange(event, index)}
                />
              </div>
              <div className="planEP-container-table__td">
                <input
                  type="date"
                  required
                  name="fecha_actividad"
                  value={campo.fecha_actividad || ""}
                  onChange={(event) => handleChange(event, index)}
                />
              </div>
              <div className="planEP-container-table__td final_border_col">
                <textarea
                  required
                  name="lugar_actividad"
                  value={campo.lugar_actividad || ""}
                  onChange={(event) => handleChange(event, index)}
                />
                {index === campos.length - 1 && (
                  <div className="action-icons">
                    <button
                      type="button"
                      onClick={agregarCampos}
                      className="add-icon"
                      title="Añadir fila"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => eliminarCampos(index)}
                      className="remove-icon"
                      title="Eliminar fila"
                    >
                      -
                    </button>
                  </div>
                )}
              </div>
            </Fragment>
          ))}
          <div className="planEP-container-table__td observaciones-col final_border_col">
            <label>
              <strong>OBSERVACIONES: </strong>
            </label>
            <textarea
              name="observaciones_actividades"
              onChange={handleObservacionesChange}
            ></textarea>
          </div>
          <div className="col-8cols ep-table-td firmas-ev-col">
            <div className="td__firmas_inputs">
              <div>
                <label>
                  <strong>Nombre del Ente Conformador:</strong>
                </label>
                <textarea
                  className="relative left-10"
                  rows={1}
                  name="nombre_ente_conformador"
                  required
                  onChange={handleNombreConformadorChange}
                />
                <label>
                  <strong>Firma del Ente Conformador:</strong>
                </label>
                <button
                  type="button"
                  onClick={() => handleAddFirma(0)}
                  className={campos[0].firma ? "" : "btn-add-firma"}
                >
                  {campos[0].firma ? (
                    <img
                      src={campos[0].firma}
                      alt="Firma del Ente Conformador"
                      style={{ width: 100, height: 50 }}
                    />
                  ) : (
                    "Añadir Firma"
                  )}
                </button>
              </div>
              <div>
                <label>
                  <strong>Firma del Aprendiz</strong>
                </label>
                <button
                  type="button"
                  onClick={() => handleAddFirma(1)}
                  className={campos[1].firma ? "" : "btn-add-firma"}
                >
                  {campos[1].firma ? (
                    <img
                      src={campos[1].firma}
                      alt="Firma del Aprendiz"
                      style={{ width: 100, height: 50 }}
                    />
                  ) : (
                    "Añadir Firma"
                  )}
                </button>
              </div>
              <div>
                <label>
                  <strong>Nombre Instructor seguimiento:</strong>
                </label>
                <textarea
                  rows={1}
                  required
                  name="nombre_instructor"
                  onChange={handleNombreInstructorChange}
                />
                <label>
                  <strong>Firma Instructor seguimiento</strong>
                </label>
                <button
                  type="button"
                  onClick={() => handleAddFirma(2)}
                  className={campos[2].firma ? "" : "btn-add-firma"}
                >
                  {campos[2].firma ? (
                    <img
                      src={campos[2].firma}
                      alt="Firma Instructor seguimiento"
                      style={{ width: 100, height: 50 }}
                    />
                  ) : (
                    "Añadir Firma"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PopupFirmas
        evaluacionAprendiz={evaluacionAprendiz}
        setEvalaucionAprendiz={setEvalaucionAprendiz}
        currentFirmaField={currentFirmaField}
        setCurrentFirmaField={setCurrentFirmaField}
        show={showPopup}
        onClose={() => setShowPopup(false)}
        onSave={(firma, editIndex) => {
          handleSaveFirma(firma, editIndex);
          setShowPopup(false);
        }}
        onSelect={(firma) => {
          handleSelectFirma(firma);
          setShowPopup(false);
        }}
        firmas={firmas}
      />
    </Fragment>
  );
}

export default PlanEP;
