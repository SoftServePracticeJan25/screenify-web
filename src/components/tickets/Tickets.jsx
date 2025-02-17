import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tickets.css';
import TicketDropdown from './TicketDropdown';
import TicketsInfoModal from './TicketsInfoModal';

const API_URL = "https://screenify-fzh4dgfpanbrbeea.polandcentral-01.azurewebsites.net/api";

const Tickets = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [filterUserId, setFilterUserId] = useState('');
    const [filterMovieId, setFilterMovieId] = useState('');

    const fetchTickets = async (token) => {
        try {
            let url = `${API_URL}/ticket`;
            const queryParams = [];
            if (filterUserId) queryParams.push(`UserId=${filterUserId}`);
            if (filterMovieId) queryParams.push(`MovieId=${filterMovieId}`);
            if (queryParams.length > 0) {
                url += `?${queryParams.join('&')}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);

                if (response.status === 401) {
                    localStorage.removeItem('accessToken');
                    navigate('/login');
                    throw new Error('Session expired. Please login again.');
                }

                if (response.status === 403) {
                    throw new Error('You do not have permission to view tickets');
                }

                if (response.status === 404) {
                    throw new Error('Tickets not found');
                }

                throw new Error(errorData?.message || 'Error loading tickets');
            }

            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error('Invalid data received from server');
            }

            return data;
        } catch (error) {
            throw error;
        }
    };

    const fetchTicketDetails = async (ticketId, token) => {
        try {
            const response = await fetch(`${API_URL}/ticket/${ticketId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);

                if (response.status === 401) {
                    localStorage.removeItem('accessToken');
                    navigate('/login');
                    throw new Error('Session expired. Please login again.');
                }

                if (response.status === 404) {
                    throw new Error('Ticket not found');
                }

                throw new Error(errorData?.message || 'Error loading ticket details');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const loadTickets = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchTickets(token);
                setTickets(data);
            } catch (err) {
                setError(err.message);
                if (err.message.includes('session expired')) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, [navigate, filterUserId, filterMovieId]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleShowInfo = async (ticket) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const ticketDetails = await fetchTicketDetails(ticket.id, token);
            setSelectedTicket(ticketDetails);
            setIsInfoModalOpen(true);
        } catch (err) {
            setError(err.message);
            if (err.message.includes('session expired')) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
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
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading tickets...</p>
            </div>
        );
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
                        <button
                            className="retry-button"
                            onClick={() => {
                                setError(null);
                                setLoading(true);
                                const token = localStorage.getItem('accessToken');
                                if (token) {
                                    fetchTickets(token)
                                        .then(data => setTickets(data))
                                        .catch(err => setError(err.message))
                                        .finally(() => setLoading(false));
                                }
                            }}
                        >
                            Try again
                        </button>
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
                                <th></th>
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
                                    <td>
                                        <TicketDropdown
                                            ticket={ticket}
                                            onInfo={() => handleShowInfo(ticket)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <TicketsInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => {
                    setIsInfoModalOpen(false);
                    setSelectedTicket(null);
                }}
                ticket={selectedTicket}
            />
        </div>
    );
};

export default Tickets;