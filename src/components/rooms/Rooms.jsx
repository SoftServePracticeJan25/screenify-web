import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rooms.css';
import { MdEventSeat } from 'react-icons/md';

const API_URL = 'https://screenify-fzh4dgfpanbrbeea.polandcentral-01.azurewebsites.net/api';

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/login');

    const fetchRooms = async () => {
      try {
        const response = await fetch(`${API_URL}/rooms`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Error loading rooms');
        setRooms(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [navigate]);

  if (loading) return <div className="loading">Loading rooms...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const Room = ({ id, name, seatsAmount, cinemaTypeName = '' }) => {
    const roomClass = `${cinemaTypeName.toLowerCase()}-room`;

    return (
        <div className={`room-container ${roomClass}`}>
          <h2>{name}</h2>
          <div className="screen">Screen</div>
          <div className="seats-grid">
            {Array.from({ length: 8 }).map((_, rowIndex) => (
                <div key={rowIndex} className="seat-row">
                  {Array.from({ length: 8 }).map((_, seatIndex) => (
                      <div key={seatIndex} className={`seat ${roomClass}`}>
                        <MdEventSeat />
                      </div>
                  ))}
                </div>
            ))}
          </div>
          <div className="room-info">
            <p>ID: {id}</p>
            <p>Seats: {seatsAmount}</p>
            <p>Type: {cinemaTypeName}</p>
          </div>
        </div>
    );
  };

  return (
      <div className="rooms-container">
        <nav className="top-nav">
          <div className="logo"><span>screenify</span></div>
          <ul className="nav-links">
            <li><a href="/movies">Movies</a></li>
            <li><a href="/sessions">Sessions</a></li>
            <li><a href="/users">Users</a></li>
            <li><a href="/rooms" className="active">Rooms</a></li>
            <li><a href="/tickets">Tickets</a></li>
            <li><a href="/reviews">Reviews</a></li>
            <li><a href="/statistics">Statistics</a></li>
            <li><button onClick={() => localStorage.removeItem('accessToken') || navigate('/login')} className="logout-btn">LOG OUT</button></li>
          </ul>
        </nav>
        <h1>List of All Rooms</h1>
        <div className="rooms-grid">
          {rooms.length > 0 ? (
              rooms.map(room => <Room key={room.id} {...room} />)
          ) : (
              <p className="no-data">No rooms available</p>
          )}
        </div>
      </div>
  );
};

export default Rooms;
