import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import './Movies.css';
import { getGenreIdByName } from '../../utils/genreUtils';
import AddMovieModal from './AddMovieModal';
import MovieDropdown from './MovieDropdown';
import MovieInfoModal from './MovieInfoModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const API_URL = process.env.REACT_APP_API_URL

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

        //  API
        const fetchMovies = async () => {
            try {
                const response = await fetch(`${API_URL}/movies`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error loading films');
                }

                const data = await response.json();
                setMovies(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
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
        const token = localStorage.getItem('accessToken');

        if (!token) {
            console.error('No token found, redirecting to login.');
            navigate('/login');
            return;
        }

        const formattedMovieData = {
            ...movieData,
            genres: movieData.genres.map(g => (typeof g === 'object' ? g.id : getGenreIdByName(g)))
        };

        try {
            const response = await fetch(`${API_URL}/movies/${movieData.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formattedMovieData)
            });

            const data = await response.json();
            console.log('Server response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update movie');
            }

            setMovies((prevMovies) =>
                prevMovies.map((movie) =>
                    movie.id === data.id ? data : movie
                )
            );

            setIsAddModalOpen(false);
            setIsEditing(false);
            setSelectedMovie(null);
        } catch (err) {
            console.error('Error updating movie:', err);
            setError(err.message);
        }
    };


    const handleEditMovie = (movie) => {
        setIsEditing(true);
        setSelectedMovie(movie);
        setIsAddModalOpen(true);
    };

    const handleDeleteMovie = (movie) => {
        setMovieToDelete(movie);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!movieToDelete) return;

        const token = localStorage.getItem('accessToken');

        if (!token) {
            console.error('No token found, redirecting to login.');
            navigate('/login');
            return;
        }


        console.log('Using token:', token); // Debugging

        try {
            const response = await fetch(`${API_URL}/movies/${movieToDelete.id}`, {
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

            setMovies((prevMovies) => prevMovies.filter((m) => m.id !== movieToDelete.id));
            setIsDeleteModalOpen(false);
            setMovieToDelete(null);
        } catch (err) {
            setError(err.message);
        }
    };


    const handleShowInfo = (movie) => {
        setSelectedMovie(movie);
        setIsInfoModalOpen(true);
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
                                <td>{movie.genres && Array.isArray(movie.genres) ? movie.genres.map(g => g.name).join(', ') : 'Unknown'}</td>
                                <td>{movie.duration}</td>
                                <td>
                                    <MovieDropdown
                                        movie={movie}
                                        onEdit={handleEditMovie}
                                        onDelete={handleDeleteMovie}
                                        onInfo={handleShowInfo}
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
                onClose={() => {
                    setIsAddModalOpen(false);
                    setIsEditing(false);
                    setSelectedMovie(null);
                }}
                onSave={handleSaveMovie} // Now connected to API
                editingMovie={isEditing ? selectedMovie || {} : null}
            />


            <MovieInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => {
                    setIsInfoModalOpen(false);
                    setSelectedMovie(null);
                }}
                movie={selectedMovie}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setMovieToDelete(null);
                }}
                onConfirm={confirmDelete} // Now connected to API
                movieTitle={movieToDelete?.title || ''}
            />
        </div>
    );
};

export default Movies;