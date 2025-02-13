import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import MovieDropdown from '../movies/MovieDropdown';
import MovieInfoModal from '../movies/MovieInfoModal';
import DeleteConfirmationModal from '../movies/DeleteConfirmationModal';
import './Statistics.css';

const Statistics = () => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedView, setSelectedView] = useState('best-selling');
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedStat, setSelectedStat] = useState(null);
    const [statToDelete, setStatToDelete] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        // Mock data for testing
        const mockStats = [
            {
                id: 1,
                genre: "Action",
                genreId: "ACT001",
                ticketsSold: 1500
            },
            {
                id: 2,
                genre: "Drama",
                genreId: "DRA001",
                ticketsSold: 1200
            },
            {
                id: 3,
                genre: "Comedy",
                genreId: "COM001",
                ticketsSold: 900
            }
        ];

        setTimeout(() => {
            setStatistics(mockStats);
            setLoading(false);
        }, 1000);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleFilterClick = () => {
        setIsFilterModalOpen(true);
    };

    const handleFilter = () => {
        console.log('Filtering data...', startDate, endDate, selectedView);
        // Add filter logic here
    };

    const handleEditStat = (stat) => {
        console.log('Edit stat:', stat);
        // Add edit logic here
    };

    const handleDeleteStat = (stat) => {
        setStatToDelete(stat);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setStatistics(statistics.filter(s => s.id !== statToDelete.id));
        setIsDeleteModalOpen(false);
        setStatToDelete(null);
    };

    const handleShowInfo = (stat) => {
        setSelectedStat(stat);
        setIsInfoModalOpen(true);
    };

    if (loading) {
        return (
            <div className="loading">
                <p>Loading statistics...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="statistics-container">
            <nav className="top-nav">
                <div className="logo">
                    <span>screenify</span>
                </div>
                <ul className="nav-links">
                    <li><a href="/movies">Movies</a></li>
                    <li><a href="/sessions">Sessions</a></li>
                    <li><a href="/users">Users</a></li>
                    <li><a href="/rooms">Rooms</a></li>
                    <li><a href="/tickets">Tickets</a></li>
                    <li><a href="/reviews">Reviews</a></li>
                    <li><a href="/statistics" className="active">Statistics</a></li>
                    <li><button onClick={handleLogout} className="logout-btn">LOG OUT</button></li>
                </ul>
            </nav>

            <div className="content">
                <div className="statistics-header">
                    <div className="header-left">
                        <h1>Screenify Statistics</h1>
                        <div className="date-filters">
                            <div className="date-input">
                                <label>Start Date</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={date => setStartDate(date)}
                                    className="date-picker"
                                />
                            </div>
                            <div className="date-input">
                                <label>End Date</label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={date => setEndDate(date)}
                                    className="date-picker"
                                />
                            </div>
                            <button className="filter-btn" onClick={handleFilter}>
                                <FiFilter /> Filter
                            </button>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="view-container">
                            <select 
                                className="view-select"
                                value={selectedView}
                                onChange={(e) => setSelectedView(e.target.value)}
                            >
                                <option value="best-selling">Best selling movies</option>
                                <option value="best-rated">Best rated movies</option>
                                <option value="popular-genres">Most popular genres</option>
                            </select>
                        
                        </div>
                    </div>
                </div>

                <div className="statistics-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Genre</th>
                                <th>Genre ID</th>
                                <th>Tickets Sold</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {statistics.map((stat) => (
                                <tr key={stat.id}>
                                    <td>{stat.genre}</td>
                                    <td>{stat.genreId}</td>
                                    <td>{stat.ticketsSold}</td>
                                    <td>
                                        <MovieDropdown
                                            movie={stat}
                                            onEdit={handleEditStat}
                                            onDelete={handleDeleteStat}
                                            onInfo={handleShowInfo}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <MovieInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => {
                    setIsInfoModalOpen(false);
                    setSelectedStat(null);
                }}
                movie={selectedStat}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setStatToDelete(null);
                }}
                onConfirm={confirmDelete}
                movieTitle={statToDelete?.genre || ''}
            />


        </div>
    );
};

export default Statistics;