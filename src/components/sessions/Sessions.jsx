import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import { IoMdAdd } from "react-icons/io";
import './Sessions.css';
import AddSessionModal from './AddSessionModal';
import MovieDropdown from '../movies/MovieDropdown'; 
import MovieInfoModal from '../movies/MovieInfoModal'; 
import DeleteConfirmationModal from '../movies/DeleteConfirmationModal'; 
import FilterModal from './FilterModal';

const Sessions = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessionToDelete, setSessionToDelete] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        // Mock data for testing
        const mockSessions = [
            {
                id: 1,
                movieTitle: "The Shawshank Redemption",
                date: "2024-02-15",
                time: "19:00",
                room: "Hall 1",
                ticketTypes: [
                    { type: "Standard", price: "10.00" },
                    { type: "VIP", price: "15.00" }
                ]
            },
            {
                id: 2,
                movieTitle: "The Godfather",
                date: "2024-02-15",
                time: "20:30",
                room: "Hall 2",
                ticketTypes: [
                    { type: "Standard", price: "10.00" },
                    { type: "VIP", price: "15.00" }
                ]
            }
        ];

        setTimeout(() => {
            setSessions(mockSessions);
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

    const handleAddSession = () => {
        setIsEditing(false);
        setSelectedSession(null);
        setIsAddModalOpen(true);
    };

    const handleEditSession = (session) => {
        setIsEditing(true);
        setSelectedSession(session);
        setIsAddModalOpen(true);
    };

    const handleDeleteSession = (session) => {
        setSessionToDelete(session);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setSessions(sessions.filter(s => s.id !== sessionToDelete.id));
        setIsDeleteModalOpen(false);
        setSessionToDelete(null);
    };

    const handleShowInfo = (session) => {
        setSelectedSession(session);
        setIsInfoModalOpen(true);
    };

    const handleSaveSession = (sessionData) => {
        if (isEditing) {
            setSessions(sessions.map(session => 
                session.id === selectedSession.id 
                ? { ...session, ...sessionData, id: selectedSession.id }
                : session
            ));
        } else {
            const newSession = {
                id: Date.now(),
                ...sessionData
            };
            setSessions([...sessions, newSession]);
        }
        
        setIsAddModalOpen(false);
        setIsEditing(false);
        setSelectedSession(null);
    };

    if (loading) {
        return (
            <div className="loading">
                <p>Loading sessions...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="sessions-container">
            <nav className="top-nav">
                <div className="logo">
                    <span>screenify</span>
                </div>
                <ul className="nav-links">
                    <li><a href="/movies">Movies</a></li>
                    <li><a href="/sessions" className="active">Sessions</a></li>
                    <li><a href="/users">Users</a></li>
                    <li><a href="/rooms">Rooms</a></li>
                    <li><a href="/tickets">Tickets</a></li>
                    <li><a href="/reviews">Reviews</a></li>
                    <li><a href="/statistics">Statistics</a></li>
                    <li><button onClick={handleLogout} className="logout-btn">LOG OUT</button></li>
                </ul>
            </nav>

            <div className="content">
                <div className="sessions-header">
                    <h1>List of Sessions</h1>
                    <div className="header-buttons">
                        <button className="icon-button" onClick={handleAddSession}>
                            <IoMdAdd />
                        </button>
                        <button className="icon-button" onClick={handleFilterClick}>
                            <FiFilter />
                        </button>
                    </div>
                </div>

                <div className="sessions-table">
                <table>
    <thead>
        <tr>
            <th>№</th>
            <th>Movie Title</th>
            <th>Room</th>
            <th>Start Time</th>
            <th>Price</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        {sessions.map((session, index) => (
            <tr key={session.id}>
                <td>{index + 1}</td>
                <td>{session.movieTitle}</td>
                <td>{session.room}</td>
                <td>{`${session.date} ${session.time}`}</td>
                <td>
                    {session.ticketTypes.length > 0 
                        ? `$${session.ticketTypes[0].price}${session.ticketTypes.length > 1 ? '+' : ''}`
                        : '-'
                    }
                </td>
                <td>
                    <MovieDropdown
                        movie={session}
                        onEdit={handleEditSession}
                        onDelete={handleDeleteSession}
                        onInfo={handleShowInfo}
                    />
                </td>
            </tr>
        ))}
    </tbody>
</table>
                </div>
            </div>

            <AddSessionModal 
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setIsEditing(false);
                    setSelectedSession(null);
                }}
                onSave={handleSaveSession}
                editingSession={isEditing ? selectedSession : null}
            />
            
            <MovieInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => {
                    setIsInfoModalOpen(false);
                    setSelectedSession(null);
                }}
                movie={selectedSession}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSessionToDelete(null);
                }}
                onConfirm={confirmDelete}
                movieTitle={sessionToDelete?.movieTitle || ''}
            />

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onFilter={(filterData) => {
                    console.log('Filter data:', filterData);
                    setIsFilterModalOpen(false);
                }}
            />
        </div>
    );
};

export default Sessions;