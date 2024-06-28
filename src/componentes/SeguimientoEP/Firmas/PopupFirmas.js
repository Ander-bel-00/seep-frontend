import React, { useRef, useState } from "react";
import Modal from "react-modal";
import SignatureCanvas from "react-signature-canvas";
import "./css/PopupFirmas.css";

Modal.setAppElement("#root");

const PopupFirmas = ({
  show,
  onClose,
  onSave,
  onSelect,
  firmas,
  evaluacionAprendiz,
  setEvalaucionAprendiz,
  currentFirmaField,
  setCurrentFirmaField,
}) => {
  const sigCanvas = useRef({});
  const [editIndex, setEditIndex] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const clearCanvas = () => {
    sigCanvas.current.clear();
  };

  const saveFirma = () => {
    const firma = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    onSave(firma, editIndex);
    setEditIndex(null);

    // Actualiza el estado de evaluacionAprendiz con la nueva firma
    const updatedFirmas = [...firmas];
    if (editIndex !== null) {
      updatedFirmas[editIndex] = firma;
    } else {
      updatedFirmas.push(firma);
    }
    onSelect(firma);
    localStorage.setItem("firmas", JSON.stringify(updatedFirmas));
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    const firma = firmas[index];
    const image = new Image();
    image.src = firma;
    image.onload = () => {
      sigCanvas.current.fromDataURL(firma);
    };
  };

  const handleDelete = (index) => {
    const updatedFirmas = firmas.filter((_, i) => i !== index);
    localStorage.setItem("firmas", JSON.stringify(updatedFirmas));
    onSave(null, index);
    if (firmas.length === 1) {
      setEditIndex(null);
    }
  };

  const handleSelectFirma = (firma) => {
    onSelect(firma);
    onClose(); // Asegúrate de cerrar el modal después de seleccionar la firma
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const firma = e.target.result;
        onSave(firma, editIndex);
        setEditIndex(null);

        const updatedFirmas = [...firmas];
        if (editIndex !== null) {
          updatedFirmas[editIndex] = firma;
        } else {
          updatedFirmas.push(firma);
        }
        onSelect(firma);
        localStorage.setItem("firmas", JSON.stringify(updatedFirmas));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Por favor, suba un archivo JPG o PNG válido.");
    }
  };

  return (
    <Modal
      isOpen={show}
      onRequestClose={onClose}
      contentLabel="Seleccionar o Crear Firma"
      className="modal-firmas"
      overlayClassName="modal-overlay-firmas"
    >
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <h2 className="text-center">Seleccionar o Crear Firma</h2>
      <div className="modal-content-firmas">
        <div className="firmas-list-container">
          <h6>Firmas Registradas</h6>
          <div className="firmas-list">
            {firmas.map((firma, index) => (
              <div key={index} className="firma-item-container">
                <img
                  src={firma}
                  alt={`Firma ${index}`}
                  className="firma-item"
                  onClick={() => handleSelectFirma(firma)}
                />
                <div className="button-firmas-container">
                  <button
                    className="btn-edit-firma"
                    onClick={() => handleEdit(index)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete-firma"
                    onClick={() => handleDelete(index)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="firma-draw">
          <h3>{editIndex !== null ? "Editar Firma" : "Crear Nueva Firma"}</h3>
          <div className="upload-or-draw">
            <button onClick={() => setIsDrawing(true)} className="btn-draw-firma">
              Dibujar Firma
            </button>
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileUpload}
              className="btn-upload-firma"
            />
          </div>
          <div className="mt-3">
          {isDrawing && (
            <>
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{ width: 300, height: 150, className: "sigCanvas" }}
              />
              <div className="modal-firma-actions relative left-7">
                <button onClick={clearCanvas} className="btn-clean-firma">
                  Limpiar
                </button>
                <button onClick={saveFirma} className="btn-save-firma">
                  {editIndex !== null ? "Actualizar Firma" : "Guardar Firma"}
                </button>
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PopupFirmas;
