import React, { useState, useEffect } from 'react';
import './AddMovieModal.css';
import { getGenreIdByName } from '../../utils/genreUtils';
import { IoMdClose } from "react-icons/io";

const AddMovieModal = ({ isOpen, onClose, onSave, editingMovie }) => {
    const initialState = {
        id: null,
        title: '',
        image: '',
        genres: [],
        duration: '',
        cast: [{ role: '', actor: '' }]
    };

    const [movieData, setMovieData] = useState(initialState);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (editingMovie) {
                const formattedGenres = editingMovie.genres?.map(genre => ({
                    id: typeof genre === 'object' ? genre.id : genre,
                    name: typeof genre === 'object' ? genre.name : ''
                })) || [];

                setMovieData({
                    id: editingMovie.id,
                    title: editingMovie.title || '',
                    image: editingMovie.image || '',
                    genres: formattedGenres,
                    duration: editingMovie.duration || '',
                    cast: Array.isArray(editingMovie.cast) && editingMovie.cast.length > 0 
                        ? editingMovie.cast 
                        : [{ role: '', actor: '' }]
                });
                setImagePreview(editingMovie.image || null);
            } else {
                setMovieData(initialState);
                setImagePreview(null);
            }
            setErrors({});
        }
    }, [isOpen, editingMovie]);

    const validateForm = () => {
        const newErrors = {};
        if (!movieData.title.trim()) newErrors.title = 'Title is required';
        if (movieData.genres.length === 0) newErrors.genres = 'At least one genre is required';
        // Приводим duration к строке перед вызовом trim()
        if (!String(movieData.duration).trim()) newErrors.duration = 'Duration is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGenreChange = (e) => {
        const genreNames = e.target.value.split(',')
            .map(name => name.trim())
            .filter(name => name);

        const updatedGenres = genreNames.map(name => {
            const genreId = getGenreIdByName(name);
            return genreId ? { id: genreId, name } : null;
        }).filter(genre => genre !== null);

        setMovieData(prev => ({
            ...prev,
            genres: updatedGenres
        }));

        if (errors.genres) {
            setErrors(prev => ({ ...prev, genres: '' }));
        }
    };

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

    const handleCastChange = (index, field, value) => {
        const newCast = [...movieData.cast];
        newCast[index][field] = value;
        setMovieData(prev => ({ ...prev, cast: newCast }));
    };

    const handleAddCastMember = () => {
        setMovieData(prev => ({
            ...prev,
            cast: [...prev.cast, { role: '', actor: '' }]
        }));
    };

    const handleRemoveCastMember = (index) => {
        if (movieData.cast.length > 1) {
            setMovieData(prev => ({
                ...prev,
                cast: prev.cast.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSave = () => {
        if (validateForm()) {
            const formattedData = {
                ...movieData,
                // Приводим duration к строке
                duration: String(movieData.duration).trim(),
                // Преобразуем жанры в массив идентификаторов
                genres: movieData.genres.map(genre => genre.id)
            };
            onSave(formattedData);
        }
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
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                        id="image-upload" 
                                    />
                                    <label htmlFor="image-upload">Click to upload image</label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="details-section">
                        <div className="input-group">
                            <label htmlFor="title">Title</label>
                            <input 
                                id="title"
                                type="text" 
                                value={movieData.title} 
                                onChange={(e) => {
                                    setMovieData(prev => ({ ...prev, title: e.target.value }));
                                    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                                }}
                                className={errors.title ? 'error' : ''}
                            />
                            {errors.title && <span className="error-message">{errors.title}</span>}
                        </div>

                        <div className="input-group">
                            <label>Genre</label>
                            <input
                                type="text"
                                value={movieData.genres.map(g => g.name).join(', ')}
                                onChange={handleGenreChange}
                                placeholder="Enter genres separated by commas"
                                className={errors.genres ? 'error' : ''}
                            />
                            {errors.genres && <span className="error-message">{errors.genres}</span>}
                        </div>

                        <div className="input-group">
                            <label>Duration</label>
                            <input
                                type="text"
                                value={movieData.duration}
                                onChange={(e) => {
                                    setMovieData(prev => ({ ...prev, duration: e.target.value }));
                                    if (errors.duration) setErrors(prev => ({ ...prev, duration: '' }));
                                }}
                                placeholder="2h 30min"
                                className={errors.duration ? 'error' : ''}
                            />
                            {errors.duration && <span className="error-message">{errors.duration}</span>}
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
                                        <button 
                                            className="remove-cast" 
                                            onClick={() => handleRemoveCastMember(index)}
                                        >
                                            ×
                                        </button>
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
                    <button className="save-button" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default AddMovieModal;