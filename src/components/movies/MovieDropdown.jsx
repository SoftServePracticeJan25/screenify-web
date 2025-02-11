import React, { useState, useEffect, useRef } from 'react';
import { FiEdit2, FiInfo, FiTrash2 } from 'react-icons/fi';
import './MovieDropdown.css';

const MovieDropdown = ({ movie, onEdit, onDelete, onInfo }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionClick = (action) => {
        setIsOpen(false);
        switch(action) {
            case 'edit':
                onEdit(movie);
                break;
            case 'delete':
                onDelete(movie);
                break;
            case 'info':
                onInfo(movie);
                break;
            default:
                break;
        }
    };

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button className="more-button" onClick={() => setIsOpen(!isOpen)}>⋮</button>
            {isOpen && (
                <div className="dropdown-content">
                    <div className="dropdown-option" onClick={() => handleOptionClick('edit')}>
                        <FiEdit2 /> Edit
                    </div>
                    <div className="dropdown-option" onClick={() => handleOptionClick('delete')}>
                        <FiTrash2 /> Delete
                    </div>
                    <div className="dropdown-option" onClick={() => handleOptionClick('info')}>
                        <FiInfo /> Info
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDropdown;