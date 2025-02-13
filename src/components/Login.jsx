import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import './Login.css';
import { FaRegUser } from "react-icons/fa";
import { MdVpnKey } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const isAuthenticated = localStorage.getItem('accessToken');

    useEffect(() => {
        const usernameInput = document.getElementById('username');
        if (usernameInput) usernameInput.focus();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_URL}/account/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('Server response:', data); // 🔥 Debugging line

            if (response.ok && data.accessToken) {
                console.log('Storing token:', data.accessToken);  // ✅ Debugging
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data));
                navigate('/movies', { replace: true });
            } else {
                console.error('Error: Token is missing in response:', data);
                setError(data.message || 'Incorrect login credentials.');
            }
        } catch (err) {
            setError('Server error. Please try again later.');
        }
    };


    if (isAuthenticated) {
        return <Navigate to="/movies" />;
    }

    return (
        <div className="wrapper">
            <div className="form-box login">
                <form onSubmit={handleLogin}>
                    <h1>Log In</h1>
                    {error && <p className="error">{error}</p>}
                    <div className="input-box">
                        <input
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                        />
                        <FaRegUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                        />
                        <MdVpnKey className="icon" />
                    </div>
                    <div className="remember-forgot">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#forgot">Forgot Password?</a>
                    </div>
                    <button type="submit">Log In</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
