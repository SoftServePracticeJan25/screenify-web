import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rooms.css';
import { MdEventSeat } from "react-icons/md";

const API_URL = "https://screenify-fzh4dgfpanbrbeea.polandcentral-01.azurewebsites.net/api";

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchRooms = async () => {
      try {
        const response = await fetch(`${API_URL}/rooms`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error loading rooms');
        }

        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [navigate]);

  const handleSeatClick = (roomName, rowIndex, seatIndex) => {
    setRooms(prevRooms => {
      const newRooms = { ...prevRooms };
      newRooms[roomName].seatsAmount[rowIndex][seatIndex].isBooked =
          !newRooms[roomName].seatsAmount[rowIndex][seatIndex].isBooked;
      return newRooms;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading"><p>Loading rooms...</p></div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const Room = ({ name, color, seatsAmount, onSeatClick }) => {

    const freeSeats = seatsAmount.reduce((acc, row) => acc + row.filter(seat => !seat.isBooked).length, 0);
    const purchasedSeats = seatsAmount.reduce((acc, row) => acc + row.filter(seat => seat.isBooked).length, 0);

    return (
        <div className={`room-container ${color.toLowerCase()}-room`}>
          <h2>{name}</h2>
          <div className="screen">Screen</div>
          <div className="seats-container">
            {seatsAmount.map((row, rowIndex) => (
                <div key={rowIndex} className="seat-row">
                  {row.map((seat, seatIndex) => (
                      <div
                          key={`${rowIndex}-${seatIndex}`}
                          className={`seat ${seat.isBooked ? 'booked' : ''}`}
                          onClick={() => onSeatClick(name, rowIndex, seatIndex)}
                          title={`Row ${rowIndex + 1}, Seat ${seatIndex + 1}`}
                      >
                        <MdEventSeat />
                      </div>
                  ))}
                </div>
            ))}
          </div>
          <div className="room-info">
            <p>Free Seats: {freeSeats}</p>
            <p>Purchased Seats: {purchasedSeats}</p>
          </div>
        </div>
    );
  };

  return (
      <div className="rooms-container">
        <nav className="top-nav">
          <div className="logo">
            <span>screenify</span>
          </div>
          <ul className="nav-links">
            <li><a href="/movies">Movies</a></li>
            <li><a href="/sessions">Sessions</a></li>
            <li><a href="/users">Users</a></li>
            <li><a href="/rooms" className="active">Rooms</a></li>
            <li><a href="/tickets">Tickets</a></li>
            <li><a href="/reviews">Reviews</a></li>
            <li><a href="/statistics">Statistics</a></li>
            <li><button onClick={handleLogout} className="logout-btn">LOG OUT</button></li>
          </ul>
        </nav>

        <div className="content">
          <div className="rooms-header">
            <h1>List of All Rooms</h1>
          </div>

          <div className="rooms-grid">
            {rooms.map(({ id, name, cinemaTypeName, seatsAmount }) => (
                <div key={id} className="room-container">
                  <h2>{name}</h2>
                  <p>Type: {cinemaTypeName}</p>
                  <p>Seats: {seatsAmount}</p>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default Rooms;