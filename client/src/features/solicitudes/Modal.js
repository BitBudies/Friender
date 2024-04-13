import React from 'react';
import "./Modal.css";

const Modal = ({ show, onClose, onConfirm, title, message, confirmText, cancelText }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal">
                <div className="modal-header">
                    <h3>{title}</h3>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="modal-confirm" onClick={onConfirm}>{confirmText}</button>
                    {cancelText && <button className="modal-cancel" onClick={onClose}>{cancelText}</button>}
                </div>
            </div>
        </div>
    );
}

export default Modal;
