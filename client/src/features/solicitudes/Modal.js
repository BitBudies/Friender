import React from 'react';
import "./Modal.css";

const Modal = ({attributes,onConfirm,onCancel,onClose }) => {

    return (
        <div className={`modal-overlay ${attributes.show && "modal-active"}`} 
        onClick={onClose}>
            <div className="modal-details">
                <div className="modal-header">
                    <h3>Confirmacion de {attributes.type === 1 ? "Aceptacion" : "Rechazo"}</h3>
                </div>
                <div className="modal-body">
                    <p>¿Estás seguro de {attributes.type ===1 ? "Aceptar " : "Rechazar "} la solicitud.</p>
                </div>
                <div className="modal-footer">
                    {attributes.type === 1 ?
                        <button className="btn btn-success" onClick={onConfirm}>Aceptar</button>
                    :
                        <button className="btn btn-danger" onClick={onCancel}>Rechazar</button>
                    }
                    <button className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
