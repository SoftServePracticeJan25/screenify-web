import React from 'react';
import MovieStatCard from './MovieStatCard';

const MovieStatsList = ({ movies }) => {
  return (
    <div className="movies-stats-list">
      {movies.map((movie) => (
        <MovieStatCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieStatsList;