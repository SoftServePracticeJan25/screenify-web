import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Movies from './components/movies/Movies';
import Users from './components/users/Users';
import Tickets from './components/tickets/Tickets';
import Reviews from './components/reviews/Reviews';
import Sessions from './components/sessions/Sessions';
import Rooms from './components/rooms/Rooms';
import Statistics from './components/statistics/Statistics';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('accessToken') !== null;
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Navbar />
              <Login />
            </>
          } />
          <Route path="/login" element={
            <>
              <Header />
              <Navbar />
              <Login />
            </>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/movies" element={
            <ProtectedRoute>
              <Movies />
            </ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />

          <Route path="/tickets" element={
            <ProtectedRoute>
              <Tickets />
            </ProtectedRoute>
          } />

          <Route path="/reviews" element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          } />

          <Route path="/sessions" element={
            <ProtectedRoute>
              <Sessions />
            </ProtectedRoute>
          } />

          <Route path="/rooms" element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          } />

         <Route path="/statistics" element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;