import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import { IoSearch } from 'react-icons/io5';
import './Reviews.css';
import ReviewCard from './ReviewCard';

const API_URL = "https://screenify-fzh4dgfpanbrbeea.polandcentral-01.azurewebsites.net/api";

const Reviews = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        movieId: '',
        AppUserId: '' 
    });
    const [appliedFilters, setAppliedFilters] = useState({
        movieId: '',
        AppUserId: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchReviews = async () => {
            try {
                let url = `${API_URL}/review`;
                const queryParams = [];
                
                if (appliedFilters.movieId && !isNaN(Number(appliedFilters.movieId))) {
                    queryParams.push(`movieId=${Number(appliedFilters.movieId)}`);
                }
                if (appliedFilters.AppUserId) {
                    queryParams.push(`AppUserId=${encodeURIComponent(appliedFilters.AppUserId)}`);
                }
                
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
                    throw new Error('Error loading reviews');
                }

                const reviewsData = await response.json();

                const transformedReviews = reviewsData.map(review => ({
                    id: review.id,
                    userId: review.appUserId, 
                    username: review.madeBy,   
                    userImage: "/api/placeholder/74/74",
                    movieId: review.movieId,
                    movieTitle: `Movie ${review.movieId}`,
                    reviewText: review.comment,
                    rating: review.rating,
                    date: new Date(review.creationTime).toISOString().split('T')[0],
                    likes: review.likes
                }));

                setReviews(transformedReviews);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [navigate, appliedFilters]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'movieId') {
            const numericValue = value === '' ? '' : Number(value);
            setFilters(prev => ({
                ...prev,
                [name]: numericValue
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFilterClick = () => {
        setAppliedFilters({
            movieId: filters.movieId === '' ? '' : Number(filters.movieId),
            AppUserId: filters.AppUserId
        });
        setLoading(true);
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
                    <li><a href="/statistics">Statistics</a></li>
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
                                placeholder="Enter User ID"
                                name="AppUserId"
                                value={filters.AppUserId}
                                onChange={handleFilterChange}
                                className="filter-input"
                            />
                        </div>
                        <div className="input-with-icon">
                            <IoSearch className="search-icon" />
                            <input
                                type="number"
                                placeholder="Enter Movie ID"
                                name="movieId"
                                value={filters.movieId}
                                onChange={handleFilterChange}
                                className="filter-input"
                                min="1"
                            />
                        </div>
                        <button className="filter-button" onClick={handleFilterClick}>
                            <FiFilter /> Apply Filters
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