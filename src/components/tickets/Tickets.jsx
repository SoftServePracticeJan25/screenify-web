import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tickets.css';
import TicketDropdown from './TicketDropdown';
import TicketsInfoModal from './TicketsInfoModal';

const API_URL = process.env.REACT_APP_API_URL

const Tickets = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchTickets = async () => {
            try {
                const response = await fetch(`${API_URL}/ticket`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error loading tickets');
                }

                const data = await response.json();
                setTickets(data);
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

    const handleDeleteTicket = (ticket) => {
        setTicketToDelete(ticket);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!ticketToDelete) return;

        const token = localStorage.getItem('accessToken');

        if (!token) {
            console.error('No token found, redirecting to login.');
            navigate('/login');
            return;
        }


        console.log('Using token:', token);

        try {
            const response = await fetch(`${API_URL}/movies/${ticketToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Server response:', errorResponse);
                throw new Error(errorResponse.message || 'Failed to cancel ticket');
            }

            setTickets((prevTickets) => prevTickets.filter((m) => m.id !== ticketToDelete.id));
            setIsDeleteModalOpen(false);
            setTicketToDelete(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleShowInfo = (ticket) => {
        setSelectedTicket(ticket);
        setIsInfoModalOpen(true);
    };

    if (loading) {
        return <div className="loading"><p>Loading tickets...</p></div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
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
                    <li><button onClick={handleLogout} className="logout-btn">LOG OUT</button></li>
                </ul>
            </nav>

            <div className="content">
                <div className="tickets-header">
                    <h1>List of All Tickets</h1>
                </div>

                <div className="tickets-table">
                    <table>
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Movie</th>
                                <th>Room</th>
                                <th>Start Time</th>
                                <th>Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket, index) => (
                                <tr key={ticket.id}>
                                    <td>{index + 1}</td>
                                    <td>{ticket.movie}</td>
                                    <td>{ticket.room}</td>
                                    <td>{ticket.startTime}</td>
                                    <td>{ticket.price}</td>
                                    <td>
                                        <TicketDropdown
                                            ticket={ticket}
                                            onInfo={handleShowInfo}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
