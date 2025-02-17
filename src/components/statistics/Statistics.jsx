import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import MovieDropdown from '../movies/MovieDropdown';
import MovieStatCard from './MovieStatCard';
import './Statistics.css';

const API_URL = "https://screenify-fzh4dgfpanbrbeea.polandcentral-01.azurewebsites.net/api";

const Statistics = () => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedView, setSelectedView] = useState('best-selling');
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterTrigger, setFilterTrigger] = useState(0); 

    const fetchStatisticsData = async (token, formattedStartDate, formattedEndDate) => {
        let endpoint;
        switch(selectedView) {
            case 'best-selling':
                endpoint = '/statistic/best-selling-movies';
                break;
            case 'best-rated':
                endpoint = '/statistic/best-rated-movies';
                break;
            case 'popular-genres':
                endpoint = '/statistic/most-popular-genres';
                break;
            default:
                throw new Error('Invalid view selected');
        }

        const response = await fetch(
            `${API_URL}${endpoint}?StartDate=${formattedStartDate}&EndDate=${formattedEndDate}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch statistics');
        }

        return response.json();
    };

    const fetchMoviesData = async (token) => {
        const response = await fetch(`${API_URL}/movies`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }

        return response.json();
    };

    const fetchGenresData = async (token) => {
        const response = await fetch(`${API_URL}/genres`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch genres');
        }

        return response.json();
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                const formattedStartDate = startDate.toISOString();
                const formattedEndDate = endDate.toISOString();

            
                const [statsData, moviesData, genresData] = await Promise.all([
                    fetchStatisticsData(token, formattedStartDate, formattedEndDate),
                    fetchMoviesData(token),
                    fetchGenresData(token)
                ]);

                const movieMap = new Map(moviesData.map(movie => [movie.id, movie]));
                const genreMap = new Map(genresData.map(genre => [genre.id, genre]));

                const enrichedData = statsData.map(stat => {
                    if (selectedView === 'popular-genres') {
                        const genre = genreMap.get(stat.genreId);
                        return {
                            ...stat,
                            id: stat.genreId,
                            genre: genre?.name || 'Unknown Genre'
                        };
                    } else {
                        const movie = movieMap.get(stat.movieId);
                        return {
                            ...stat,
                            id: stat.movieId,
                            title: movie?.title || 'Unknown Movie',
                            movie: movie,
                            image: movie?.image || "/api/placeholder/74/74"
                        };
                    }
                });

                setStatistics(enrichedData);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate, selectedView, filterTrigger]); 

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleFilter = () => {
        setFilterTrigger(prev => prev + 1);
    };

    const handleViewChange = (e) => {
        setSelectedView(e.target.value);
        setFilterTrigger(prev => prev + 1); 
    };

    if (loading) {
        return (
            <div className="loading">
                <p>Loading statistics...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="statistics-container">
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
                    <li><a href="/reviews">Reviews</a></li>
                    <li><a href="/statistics" className="active">Statistics</a></li>
                    <li><button onClick={handleLogout} className="logout-btn">LOG OUT</button></li>
                </ul>
            </nav>

            <div className="content">
                <div className="statistics-header">
                    <div className="header-left">
                        <h1>Screenify Statistics</h1>
                        <div className="date-filters">
                            <div className="date-input">
                                <label>Start Date</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={date => setStartDate(date)}
                                    className="date-picker"
                                />
                            </div>
                            <div className="date-input">
                                <label>End Date</label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={date => setEndDate(date)}
                                    className="date-picker"
                                />
                            </div>
                            <button className="filter-btn" onClick={handleFilter}>
                                <FiFilter /> Filter
                            </button>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="view-container">
                            <select 
                                className="view-select"
                                value={selectedView}
                                onChange={handleViewChange}
                            >
                                <option value="best-selling">Best selling movies</option>
                                <option value="best-rated">Best rated movies</option>
                                <option value="popular-genres">Most popular genres</option>
                            </select>
                        </div>
                    </div>
                </div>

                {selectedView === 'popular-genres' ? (
                    <div className="statistics-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Genre</th>
                                    <th>Tickets Sold</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {statistics.map((stat) => (
                                    <tr key={stat.id}>
                                        <td>{stat.genre}</td>
                                        <td>{stat.ticketsSold}</td>
                                        <td>
                                            <MovieDropdown 
                                                movie={stat} 
                                                disabled={true}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="movies-stats-list">
                        {statistics.map((movieStat) => (
                            <MovieStatCard 
                                key={movieStat.id} 
                                movie={movieStat}
                                showRating={selectedView === 'best-rated'}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Statistics;