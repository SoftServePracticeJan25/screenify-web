import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import { IoMdAdd } from "react-icons/io";
import './Movies.css';
import AddMovieModal from './AddMovieModal';

const Movies = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        // For testing purposes, using mock data
        const mockMovies = [
            {
                id: 1,
                title: "The Shawshank Redemption",
                genre: "Drama",
                duration: "2h 22min"
            },
            {
                id: 2,
                title: "The Godfather",
                genre: "Crime",
                duration: "2h 55min"
            },
            {
                id: 3,
                title: "The Dark Knight",
                genre: "Action",
                duration: "2h 32min"
            },
            {
                id: 4,
                title: "Pulp Fiction",
                genre: "Crime",
                duration: "2h 34min"
            },
            {
                id: 5,
                title: "Inception",
                genre: "Sci-Fi",
                duration: "2h 28min"
            },
            {
                id: 1,
                title: "The Shawshank Redemption",
                genre: "Drama",
                duration: "2h 22min"
            },
            {
                id: 2,
                title: "The Godfather",
                genre: "Crime",
                duration: "2h 55min"
            },
            {
                id: 3,
                title: "The Dark Knight",
                genre: "Action",
                duration: "2h 32min"
            },
            {
                id: 4,
                title: "Pulp Fiction",
                genre: "Crime",
                duration: "2h 34min"
            },
            {
                id: 5,
                title: "Inception",
                genre: "Sci-Fi",
                duration: "2h 28min"
            },
            {
                id: 1,
                title: "The Shawshank Redemption",
                genre: "Drama",
                duration: "2h 22min"
            },
            {
                id: 2,
                title: "The Godfather",
                genre: "Crime",
                duration: "2h 55min"
            },
            {
                id: 3,
                title: "The Dark Knight",
                genre: "Action",
                duration: "2h 32min"
            },
            {
                id: 4,
                title: "Pulp Fiction",
                genre: "Crime",
                duration: "2h 34min"
            },
            {
                id: 5,
                title: "Inception",
                genre: "Sci-Fi",
                duration: "2h 28min"
            }
        ];

        // Simulate API call
        setTimeout(() => {
            setMovies(mockMovies);
            setLoading(false);
        }, 1000);

        // When you have a real API, use this:
        /*
        const fetchMovies = async () => {
            try {
                const response = await fetch('http://your-api-url/api/movies', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setMovies(data);
                } else {
                    if (response.status === 401) {
                        localStorage.removeItem('accessToken');
                        navigate('/login');
                    } else {
                        setError('Failed to fetch movies');
                    }
                }
            } catch (error) {
                setError('Connection error');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
        */
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleFilterClick = () => {
        // Implement filter functionality
        console.log('Filter clicked');
    };

    const handleAddMovie = () => {
        setIsModalOpen(true);
    };

    const handleSaveMovie = (movieData) => {
        console.log('Saving movie:', movieData);
        setIsModalOpen(false);
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
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
                    <li><button onClick={handleLogout} className="logout-btn">LOG OUT</button></li>
                </ul>
            </nav>

            <div className="content">
                <div className="movies-header">
                    <h1>List of Movies</h1>
                    <div className="header-buttons">
                        <button className="icon-button" onClick={handleAddMovie}>
                            <IoMdAdd strokeWidth={12}/>
                        </button>
                        <button className="icon-button" onClick={handleFilterClick}>
                            <FiFilter strokeWidth={2} />
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
                                        <button className="more-button">⋮</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddMovieModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveMovie}
            />
        </div>
    );
};

export default Movies;