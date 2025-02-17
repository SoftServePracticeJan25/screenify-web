import React from 'react';
import MovieDropdown from '../movies/MovieDropdown';

const StatisticsTable = ({ statistics }) => {
  return (
    <div className="statistics-table">
      <table>
        <thead>
          <tr>
            <th>Genre</th>
            <th>Genre ID</th>
            <th>Tickets Sold</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {statistics.map((stat) => (
            <tr key={stat.id}>
              <td>{stat.genre}</td>
              <td>{stat.genreId}</td>
              <td>{stat.ticketsSold}</td>
              <td>
                <div style={{ pointerEvents: 'none' }}>
                  <MovieDropdown movie={stat} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatisticsTable;