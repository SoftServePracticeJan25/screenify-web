import React from 'react';

const MovieStatCard = ({ movie }) => {
  return (
    <div className="movie-stat-card">
      <div className="movie-stat-header">
        <img 
          src={movie.image || "/api/placeholder/74/74"} 
          alt={movie.title} 
          className="movie-image"
        />
        <div className="header-info">
          <span className="movie-title">{movie.title}</span>
          <span className="id">ID: {movie.movieId}</span>
          <div className="stat-info">
            <span className="stat-label">Tickets Sold:</span>
            <span className="stat-value">{movie.ticketsSold}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieStatCard;