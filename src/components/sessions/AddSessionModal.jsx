import React, { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import './AddSessionModal.css';
import { getGenreIdByName } from '../../utils/genreUtils';

const AddSessionModal = ({ isOpen, onClose, onSave, editingSession }) => {
    const [sessionData, setSessionData] = useState({
        movieTitle: '',
        image: '',
        genre: [],
        duration: '',
        date: '',
        time: '',
        room: '',
        price: ''
        //ticketTypes: [{ type: '', price: '' }]
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (editingSession) {
                setSessionData({
                    id: editingSession.id || null,
                    movieTitle: editingSession.movieTitle || '',
                    image: editingSession.image || '',
                    genre: Array.isArray(editingSession.genres) ? editingSession.genres : [],
                    duration: editingSession.duration || '',
                    date: editingSession.date || '',
                    time: editingSession.time || '',
                    room: editingSession.room || '',
                    price: editingSession.price || '',
                    //ticketTypes: editingSession.ticketTypes || [{ type: '', price: '' }],
                })
                setImagePreview(editingSession.image || null);
            } else {
                setSessionData({
                    id: null,
                    movieTitle: '',
                    image: '',
                    genre: [],
                    duration: '',
                    date: '',
                    time: '',
                    room: '',
                    price: ''
                    //ticketTypes: [{ type: '', price: '' }]
                });
                setImagePreview(null);
            }
        }
    }, [isOpen, editingSession]);

    const handleSave = () => {
        const formattedSessionData = {
            ...sessionData,
            genres: sessionData.genres.map(g => g.id),
            ticketTypes: undefined  // Убираем ticketTypes
        };

        onSave(formattedSessionData);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSessionData(prev => ({ ...prev, image: reader.result }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddTicketType = () => {
        setSessionData(prev => ({
            ...prev,
            ticketTypes: [...prev.ticketTypes, { type: '', price: '' }]
        }));
    };

    const handleTicketTypeChange = (index, field, value) => {
        const newTicketTypes = [...sessionData.ticketTypes];
        newTicketTypes[index][field] = value;
        setSessionData(prev => ({ ...prev, ticketTypes: newTicketTypes }));
    };

    const handleRemoveTicketType = (index) => {
        setSessionData(prev => ({
            ...prev,
            ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="session-modal-content">
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
                            <label htmlFor="title">Title</label>
                            <input 
                                id="title"
                                type="text" 
                                value={sessionData.movieTitle} 
                                onChange={(e) => setSessionData(prev => ({ ...prev, movieTitle: e.target.value }))} 
                            />
                        </div>

                        <div className="input-group">
                            <label>Genre</label>
                            <input 
                                type="text" 
                                value={sessionData.genres.map(g => (typeof g === 'object' ? g.name : g)).join(', ')}
                                onChange={(e) => {
                                    const genreNames = e.target.value.split(',').map(name => name.trim());
                                    setSessionData(prev => ({
                                        ...prev,
                                        genres: genreNames.map(name => {
                                            const genreId = getGenreIdByName(name);
                                            return genreId ? { id: genreId, name } : { name };
                                        })
                                    }));
                                }}
                            />
                        </div>

                        <div className="input-group">
                            <label>Duration</label>
                            <input 
                                type="text" 
                                value={sessionData.duration} 
                                onChange={(e) => setSessionData(prev => ({ ...prev, duration: e.target.value }))} 
                                placeholder="2h 30min" 
                            />
                        </div>

                        <div className="date-time-section">
                            <label>Date & Time</label>
                            <div className="date-time-inputs">
                                <input 
                                    type="date" 
                                    value={sessionData.date}
                                    onChange={(e) => setSessionData(prev => ({ ...prev, date: e.target.value }))}
                                />
                                <input 
                                    type="time" 
                                    value={sessionData.time}
                                    onChange={(e) => setSessionData(prev => ({ ...prev, time: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Price</label>
                            <input
                                type="number"
                                value={sessionData.price}
                                onChange={(e) => setSessionData(prev => ({ ...prev, price: e.target.value }))}
                            />
                        </div>

                        <div className="ticket-types-section">
                            <label>Ticket Price</label>
                            {sessionData.ticketTypes.map((ticket, index) => (
                                <div key={index} className="ticket-type">
                                    <input 
                                        type="text" 
                                        placeholder="Type" 
                                        value={ticket.type} 
                                        onChange={(e) => handleTicketTypeChange(index, 'type', e.target.value)} 
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="Price" 
                                        value={ticket.price} 
                                        onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)} 
                                    />
                                    {sessionData.ticketTypes.length > 1 && (
                                        <button className="remove-ticket" onClick={() => handleRemoveTicketType(index)}>×</button>
                                    )}
                                </div>
                            ))}
                            <button className="add-ticket-button" onClick={handleAddTicketType}>
                                + Add Ticket Type
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

export default AddSessionModal;