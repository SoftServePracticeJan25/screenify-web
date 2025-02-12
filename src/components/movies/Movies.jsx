import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; //  API-client
import { FiFilter } from 'react-icons/fi';
import { IoMdAdd } from "react-icons/io";
import './Movies.css';
import AddMovieModal from './AddMovieModal';
import MovieDropdown from './MovieDropdown';
import MovieInfoModal from './MovieInfoModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const Movies = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movieToDelete, setMovieToDelete] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        api.get('/Movies')
            .then(response => {
                setMovies(response.data);
            })
            .catch(error => {
                console.error('API error:', error);
                setError('Failed to load movies.');
            })
            .finally(() => {
                setLoading(false);
            });

    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleAddMovie = () => {
        setIsEditing(false);
        setSelectedMovie(null);
        setIsAddModalOpen(true);
    };

    const handleSaveMovie = async (movieData) => {
        try {
            const response = await api.post('/Movies', movieData);
            setMovies([...movies, response.data]); // Добавляем новый фильм в список
        } catch (error) {
            console.error('Error adding movie:', error);
        }
        setIsAddModalOpen(false);
    };

    if (loading) {
        return (
            <div className="loading">
                <p>Loading movies...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="movies-container">
            <nav className="top-nav">
                <div className="logo">
                    <span>screenify</span>
                </div>
                <ul className="nav-links">
                    <li><a href="/movies" className="active">Movies</a></li>
                    <li><a href="/sessions">Sessions</a></li>
                    <li><a href="/users">Users</a></li>
                    <li><a href="/rooms">Rooms</a></li>
                    <li><a href="/tickets">Tickets</a></li>
                    <li><a href="/reviews">Reviews</a></li>
                    <li><button onClick={handleLogout} className="logout-btn">LOG OUT</button></li>
                </ul>
            </nav>

            <div className="content">
                <div className="movies-header">
                    <h1>List of Movies</h1>
                    <div className="header-buttons">
                        <button className="icon-button" onClick={handleAddMovie}>
                            <IoMdAdd />
                        </button>
                        <button className="icon-button">
                            <FiFilter />
                        </button>
                    </div>
                </div>

                <div className="movies-table">
                    <table>
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Duration</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {movies.map((movie) => (
                            <tr key={movie.id}>
                                <td>{movie.title}</td>
                                <td>{movie.genre}</td>
                                <td>{movie.duration}</td>
                                <td>
                                    <MovieDropdown
                                        movie={movie}
                                        onEdit={() => {}}
                                        onDelete={() => {}}
                                        onInfo={() => {}}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddMovieModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSaveMovie}
            />
        </div>
    );
};

export default Movies;
