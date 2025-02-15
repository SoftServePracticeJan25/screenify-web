import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import { IoSearch } from 'react-icons/io5';
import './Reviews.css';
import ReviewCard from './ReviewCard';

const API_URL = process.env.REACT_APP_API_URL

const Reviews = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        userId: '',
        movieId: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchReviews = async () => {
            try {
                const response = await fetch(`${API_URL}/review`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error loading reviews');
                }

                const data = await response.json();
                setReviews(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilterClick = () => {
        const filteredReviews = reviews.filter((review) => {
            const userIdFilter = !filters.userId || review.userId.toString() === filters.userId;
            const movieIdFilter = !filters.movieId || review.movieId.toString() === filters.movieId;
            return userIdFilter && movieIdFilter;
        });

        setReviews(filteredReviews);
        console.log('Applying filters:', filters);
    };

    if (loading) {
        return (
            <div className="loading">
                <p>Loading reviews...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="reviews-container">
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
                    <li><a href="/reviews" className="active">Reviews</a></li>
                    <li><button onClick={handleLogout} className="logout-btn">LOG OUT</button></li>
                </ul>
            </nav>

            <div className="content">
                <div className="reviews-header">
                    <h1>List of All Reviews</h1>
                    <div className="filters-section">
                        <div className="input-with-icon">
                            <IoSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="User ID"
                                name="userId"
                                value={filters.userId}
                                onChange={handleFilterChange}
                                className="filter-input"
                            />
                        </div>
                        <div className="input-with-icon">
                            <IoSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Movie ID"
                                name="movieId"
                                value={filters.movieId}
                                onChange={handleFilterChange}
                                className="filter-input"
                            />
                        </div>
                        <button className="filter-button" onClick={handleFilterClick}>
                            <FiFilter /> Filter
                        </button>
                    </div>
                </div>

                <div className="reviews-list">
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reviews;