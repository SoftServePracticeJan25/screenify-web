import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tickets.css';

const API_URL = "https://screenify-fzh4dgfpanbrbeea.polandcentral-01.azurewebsites.net/api";

const Tickets = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchTickets = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${API_URL}/ticket`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error loading tickets');
                }

                const data = await response.json();
                setTickets(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'Invalid date';
        }
    };

    if (loading) {
        return <div className="loading"><p>Loading tickets...</p></div>;
    }

    return (
        <div className="tickets-container">
            <nav className="top-nav">
                <div className="logo"><span>screenify</span></div>
                <ul className="nav-links">
                    <li><a href="/movies">Movies</a></li>
                    <li><a href="/sessions">Sessions</a></li>
                    <li><a href="/users">Users</a></li>
                    <li><a href="/rooms">Rooms</a></li>
                    <li><a href="/tickets" className="active">Tickets</a></li>
                    <li><a href="/reviews">Reviews</a></li>
                    <li><a href="/statistics">Statistics</a></li>
                    <li><button onClick={handleLogout} className="logout-btn">LOG OUT</button></li>
                </ul>
            </nav>

            <div className="content">
                <div className="tickets-header">
                    <h1>List of All Tickets</h1>
                </div>

                {error && (
                    <div className="error-container">
                        <p className="error-message">{error}</p>
                        <button className="retry-button" onClick={() => window.location.reload()}>Try again</button>
                    </div>
                )}

                {!error && tickets.length === 0 ? (
                    <div className="no-tickets-message">
                        <p>No tickets found</p>
                    </div>
                ) : (
                    <div className="tickets-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>№</th>
                                    <th>Movie</th>
                                    <th>Room</th>
                                    <th>Seat</th>
                                    <th>Start Time</th>
                                    <th>Price</th>
                                    <th>Purchase Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket, index) => (
                                    <tr key={ticket.id}>
                                        <td>{index + 1}</td>
                                        <td>{ticket.title}</td>
                                        <td>{ticket.roomName}</td>
                                        <td>{ticket.seatNum}</td>
                                        <td>{formatDate(ticket.startTime)}</td>
                                        <td>${ticket.price}</td>
                                        <td>{formatDate(ticket.transactionTime)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tickets;