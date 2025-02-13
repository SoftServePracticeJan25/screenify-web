import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import { IoSearch } from 'react-icons/io5';
import './Reviews.css';
import ReviewCard from './ReviewCard';

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

        // Mock data for testing
        const mockReviews = [
            {
                id: 1,
                userId: "USER123",
                username: "John Doe",
                userImage: "https://randomuser.me/api/portraits/women/2.jpg",
                movieId: "MOV456",
                movieTitle: "The Shawshank Redemption",
                reviewText: "An absolute masterpiece that stands the test of time. The performances are incredible and the story is deeply moving.",
                rating: 5,
                date: "2024-02-10"
            },
            {
                id: 2,
                userId: "USER124",
                username: "Jane Smith",
                userImage: "/api/placeholder/74/74",
                movieId: "MOV457",
                movieTitle: "The Godfather",
                reviewText: "A classic for a reason. The direction, acting, and cinematography are all perfect.",
                rating: 5,
                date: "2024-02-11"
            }
        ];

        setTimeout(() => {
            setReviews(mockReviews);
            setLoading(false);
        }, 1000);
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
        // Implement filtering logic here
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