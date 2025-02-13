import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Statistics.css';

const Statistics = () => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedView, setSelectedView] = useState('best-selling');
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        // Mock data for testing
        const mockStats = [
            {
                genre: "Action",
                genreId: "ACT001",
                ticketsSold: 1500
            },
            {
                genre: "Drama",
                genreId: "DRA001",
                ticketsSold: 1200
            },
            {
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

    const handleFilter = () => {
        console.log('Filtering data...', startDate, endDate);
        // Add filter logic here
    };

    if (loading) {
        return (
            <div className="loading">
                <p>Loading statistics...</p>
            </div>
        );
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
                    <li><a href="/statistics">Statistics</a></li>
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
                                Filter
                            </button>
                        </div>
                    </div>
                    <div className="header-right">
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

                <div className="statistics-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Genre</th>
                                <th>Genre ID</th>
                                <th>Tickets Sold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statistics.map((stat, index) => (
                                <tr key={index}>
                                    <td>{stat.genre}</td>
                                    <td>{stat.genreId}</td>
                                    <td>{stat.ticketsSold}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Statistics;