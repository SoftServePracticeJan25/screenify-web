import React, { useState, useEffect } from 'react';
import './AddMovieModal.css';
import { IoMdClose } from "react-icons/io";

const AddMovieModal = ({ isOpen, onClose, onSave, editingMovie }) => {
    const [movieData, setMovieData] = useState({
        title: '',
        image: '',
        genre: '',
        duration: '',
        cast: [{ role: '', actor: '' }]
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (editingMovie) {
                setMovieData(editingMovie);
                setImagePreview(editingMovie.image || null);
            } else {
                setMovieData({
                    title: '',
                    image: '',
                    genre: '',
                    duration: '',
                    cast: [{ role: '', actor: '' }]
                });
                setImagePreview(null);
            }
        }
    }, [isOpen, editingMovie]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMovieData(prev => ({ ...prev, image: reader.result }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddCastMember = () => {
        setMovieData(prev => ({
            ...prev,
            cast: [...prev.cast, { role: '', actor: '' }]
        }));
    };

    const handleCastChange = (index, field, value) => {
        const newCast = [...movieData.cast];
        newCast[index][field] = value;
        setMovieData(prev => ({ ...prev, cast: newCast }));
    };

    const handleRemoveCastMember = (index) => {
        setMovieData(prev => ({
            ...prev,
            cast: prev.cast.filter((_, i) => i !== index)
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <IoMdClose />
                </button>
                
                <div className="modal-body">
                    <div className="image-section">
                        <div className="image-upload-container">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Movie preview" className="image-preview" />
                            ) : (
                                <div className="image-placeholder">
                                    <input type="file" accept="image/*" onChange={handleImageChange} id="image-upload" />
                                    <label htmlFor="image-upload">Click to upload image</label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="details-section">
                        <div className="input-group">
                            <label>Title</label>
                            <input 
                                type="text" 
                                value={movieData.title} 
                                onChange={(e) => setMovieData(prev => ({ ...prev, title: e.target.value }))} 
                            />
                        </div>

                        <div className="input-group">
                            <label>Genre</label>
                            <input 
                                type="text" 
                                value={movieData.genre} 
                                onChange={(e) => setMovieData(prev => ({ ...prev, genre: e.target.value }))} 
                            />
                        </div>

                        <div className="input-group">
                            <label>Duration</label>
                            <input 
                                type="text" 
                                value={movieData.duration} 
                                onChange={(e) => setMovieData(prev => ({ ...prev, duration: e.target.value }))} 
                                placeholder="2h 30min" 
                            />
                        </div>

                        <div className="cast-section">
                            <label>Cast</label>
                            {movieData.cast.map((member, index) => (
                                <div key={index} className="cast-member">
                                    <input 
                                        type="text" 
                                        placeholder="Role" 
                                        value={member.role} 
                                        onChange={(e) => handleCastChange(index, 'role', e.target.value)} 
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Actor" 
                                        value={member.actor} 
                                        onChange={(e) => handleCastChange(index, 'actor', e.target.value)} 
                                    />
                                    {movieData.cast.length > 1 && (
                                        <button className="remove-cast" onClick={() => handleRemoveCastMember(index)}>×</button>
                                    )}
                                </div>
                            ))}
                            <button className="add-cast-button" onClick={handleAddCastMember}>
                                + Add Cast Member
                            </button>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button className="save-button" onClick={() => onSave(movieData)}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default AddMovieModal;
