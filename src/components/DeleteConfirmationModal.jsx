import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, movieTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="delete-modal-content">
                <div className="delete-modal-message">
                    Are you sure you want to delete <br /> "{movieTitle}"?
                </div>
                <div className="delete-modal-buttons">
                    <button className="delete-modal-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="delete-modal-confirm" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;