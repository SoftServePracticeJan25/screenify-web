import React, { useState, useEffect, useRef } from 'react';
import { FiInfo } from 'react-icons/fi';
import '../movies/MovieDropdown.css'; 

const TicketDropdown = ({ ticket, onInfo }) => {
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

    const handleOptionClick = () => {
        setIsOpen(false);
        onInfo(ticket);
    };

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button className="more-button" onClick={() => setIsOpen(!isOpen)}>⋮</button>
            {isOpen && (
                <div className="dropdown-content">
                    <div className="dropdown-option" onClick={handleOptionClick}>
                        <FiInfo /> Info
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketDropdown;
