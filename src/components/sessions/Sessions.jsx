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

const API_URL =  "https://screenify-fzh4dgfpanbrbeea.polandcentral-01.azurewebsites.net/api"

const Sessions = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [movies, setMovies] = useState([]);
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

        const fetchData = async () => {
            try {
                // Fetch both sessions and movies in parallel
                const [sessionsResponse, moviesResponse] = await Promise.all([
                    fetch(`${API_URL}/session`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }),
                    fetch(`${API_URL}/movies`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })
                ]);

                if (!sessionsResponse.ok || !moviesResponse.ok) {
                    throw new Error('Error loading data');
                }

                const [sessionsData, moviesData] = await Promise.all([
                    sessionsResponse.json(),
                    moviesResponse.json()
                ]);

                // Create a map of movie IDs to movie titles for quick lookup
                const movieMap = new Map(moviesData.map(movie => [movie.id, movie]));

                // Combine session data with movie data
                const enrichedSessions = sessionsData.map(session => ({
                    ...session,
                    movieTitle: movieMap.get(session.movieId)?.title || 'Unknown Movie',
                    movie: movieMap.get(session.movieId)
                }));

                setSessions(enrichedSessions);
                setMovies(moviesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

    const handleSaveSession = async (sessionData) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('No token found, redirecting to login.');
            navigate('/login');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/session/${sessionData.id ? sessionData.id : ''}`, {
                method: sessionData.id ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sessionData)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to save session');
            }
            if (sessionData.id) {
                setSessions(prevSessions => prevSessions.map(session => session.id === data.id ? data : session));
            } else {
                setSessions(prevSessions => [...prevSessions, data]);
            }
            setIsAddModalOpen(false);
        } catch (err) {
            console.error('Error saving session:', err);
            setError(err.message);
        }
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

    const confirmDelete = async () => {
        if (!sessionToDelete) return;
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('No token found, redirecting to login.');
            navigate('/login');
            return;
        }
        console.log('Using token:', token); // Debugging
        try {
            const response = await fetch(`${API_URL}/session/${sessionToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Server response:', errorResponse); // Debugging
                throw new Error(errorResponse.message || 'Failed to delete movie');
            }
            setSessions((prevSessions) => prevSessions.filter((m) => m.id !== sessionToDelete.id));
            setIsDeleteModalOpen(false);
            setSessionToDelete(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleShowInfo = (session) => {
        setSelectedSession(session);
        setIsInfoModalOpen(true);
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
                                    <td>{session.roomId}</td>
                                    <td>{session.startTime}</td>
                                    <td>{session.price ? `$${session.price}` : '-'}</td>
                                    <td>
                                        <MovieDropdown
                                            movie={session}
                                            onEdit={handleEditSession}
                                            onDelete={handleDeleteSession}
                                            onInfo={() => handleShowInfo(session.movie)}
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
                editingSession={isEditing ? selectedSession || {} : null}
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