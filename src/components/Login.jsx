import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import './Login.css';
import { FaRegUser } from "react-icons/fa";
import { MdVpnKey } from "react-icons/md";


const Login = () => {
    const baseUrl = "https://screenify-fzh4dgfpanbrbeea.polandcentral-01.azurewebsites.net/api";
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const isAuthenticated = localStorage.getItem('accessToken');

    useEffect(() => {
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.focus();
        }
        window.scrollTo(0, 0);
    }, []);

    if (isAuthenticated) {
        return <Navigate to="/statistics" />;
    }

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
            const response = await fetch(`${baseUrl}/account/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.accessToken) {

                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));

                navigate('/statistics', { replace: true });
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Server error. Please try again later.');
        }
    };

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