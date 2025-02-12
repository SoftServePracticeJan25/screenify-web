import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

        //Mock data for testing*
        const mockMovies = [
            {
                id: 1,
                title: "The Shawshank Redemption",
                genre: "Drama",
                duration: "2h 22min",
                cast: [
                    { role: "Andy Dufresne", actor: "Tim Robbins" },
                    { role: "Ellis Boyd 'Red' Redding", actor: "Morgan Freeman" }
                ]
                
            },
            {
                id: 2,
                title: "The Godfather",
                genre: "Crime",
                duration: "2h 55min",
                cast: [
                    { role: "Don Vito Corleone", actor: "Marlon Brando" },
                    { role: "Michael Corleone", actor: "Al Pacino" }
                ]
            },
            {
                id: 3,
                title: "The Dark Knight",
                genre: "Action",
                duration: "2h 32min",
                cast: [
                    { role: "Bruce Wayne", actor: "Christian Bale" },
                    { role: "Joker", actor: "Heath Ledger" }
                ]
            }
        ];

        //Simulate API call*
        setTimeout(() => {
            setMovies(mockMovies);
            setLoading(false);
        }, 1000);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleFilterClick = () => {
        
        console.log('Filter clicked');
    };

    const handleAddMovie = () => {
        setIsEditing(false);
        setSelectedMovie(null);
        setIsAddModalOpen(true);
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

    const confirmDelete = () => {
        setMovies(movies.filter(m => m.id !== movieToDelete.id));
        setIsDeleteModalOpen(false);
        setMovieToDelete(null);
    };

    const handleShowInfo = (movie) => {
        setSelectedMovie(movie);
        setIsInfoModalOpen(true);
    };

    const handleSaveMovie = (movieData) => {
        if (isEditing) {
            
            setMovies(movies.map(movie => 
                movie.id === selectedMovie.id 
                ? { 
                    ...movie,  
                    ...movieData, 
                    id: selectedMovie.id  
                }
                : movie
            ));
        } else {

            const newMovie = {
                id: Date.now(),
                ...movieData
            };
            setMovies([...movies, newMovie]);
        }
        
        setIsAddModalOpen(false);
        setIsEditing(false);
        setSelectedMovie(null);
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
                                    <td>{movie.genre}</td>
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
                onSave={handleSaveMovie}
                editingMovie={isEditing ? selectedMovie : null}
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
                onConfirm={confirmDelete}
                movieTitle={movieToDelete?.title || ''}
            />
        </div>
    );
};

export default Movies;