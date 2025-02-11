import React from 'react';
import { IoMdClose } from "react-icons/io";
import './MovieInfoModal.css';

const MovieInfoModal = ({ isOpen, onClose, movie }) => {
    if (!isOpen || !movie) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <IoMdClose />
                </button>
                
                <div className="modal-body">
                    <div className="image-section">
                        <div className="image-container">
                            {movie.image ? (
                                <img src={movie.image} alt={movie.title} className="movie-image" />
                            ) : (
                                <div className="image-placeholder">
                                    No image available
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="details-section">
                        <h2 className="movie-title">{movie.title}</h2>
                        
                        <div className="info-group">
                            <span className="info-label">Genre</span>
                            <span className="info-value">{movie.genre}</span>
                        </div>

                        <div className="info-group">
                            <span className="info-label">Duration</span>
                            <span className="info-value">{movie.duration}</span>
                        </div>

                        <div className="cast-section">
                            <span className="info-label">Cast</span>
                            <div className="cast-list">
                                {movie.cast && movie.cast.map((member, index) => (
                                    <div key={index} className="cast-item">
                                        <span className="actor-name">{member.actor}</span>
                                        <span className="role-name">as {member.role}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="close-button-footer" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default MovieInfoModal;
