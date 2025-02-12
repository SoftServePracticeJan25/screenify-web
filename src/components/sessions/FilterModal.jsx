import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import './FilterModal.css';

const FilterModal = ({ isOpen, onClose, onFilter }) => {
    const [filterData, setFilterData] = useState({
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        genre: ''
    });

    if (!isOpen) return null;

    const handleFilter = () => {
        onFilter(filterData);
    };

    return (
        <div className="modal-overlay">
            <div className="filter-modal-content">
                <button className="close-button" onClick={onClose}>
                    <IoMdClose />
                </button>

                <div className="filter-body">
                    <div className="filter-group">
                        <label>Date</label>
                        <div className="date-inputs">
                            <div className="input-with-label">
                                <label>Start Date</label>
                                <input 
                                    type="date" 
                                    value={filterData.startDate}
                                    onChange={(e) => setFilterData(prev => ({ ...prev, startDate: e.target.value }))}
                                />
                            </div>
                            <div className="input-with-label">
                                <label>End Date</label>
                                <input 
                                    type="date" 
                                    value={filterData.endDate}
                                    onChange={(e) => setFilterData(prev => ({ ...prev, endDate: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Time</label>
                        <div className="time-inputs">
                            <div className="input-with-label">
                                <label>Start Time</label>
                                <input 
                                    type="time" 
                                    value={filterData.startTime}
                                    onChange={(e) => setFilterData(prev => ({ ...prev, startTime: e.target.value }))}
                                />
                            </div>
                            <div className="input-with-label">
                                <label>End Time</label>
                                <input 
                                    type="time" 
                                    value={filterData.endTime}
                                    onChange={(e) => setFilterData(prev => ({ ...prev, endTime: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Genre</label>
                        <input 
                            type="text" 
                            value={filterData.genre}
                            onChange={(e) => setFilterData(prev => ({ ...prev, genre: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="filter-footer">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button className="filter-button" onClick={handleFilter}>Filter</button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;