import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import './Login.css';
import { FaRegUser } from "react-icons/fa";
import { MdVpnKey } from "react-icons/md";


const Login = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    if (localStorage.getItem('accessToken')) {
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
        const baseUrl = process.env.REACT_APP_BASE_URL;
        console.log(baseUrl+"api/account/login");
        e.preventDefault();
        setError('');

        if (formData.username === 'admin' && formData.password === 'admin') {
            const mockUserData = {
                accessToken: 'mock-token-12345',
                user: {
                    id: 1,
                    username: 'admin',
                    email: 'admin@example.com',
                    role: 'admin'
                }
            };
            
            localStorage.setItem('accessToken', mockUserData.accessToken);
            localStorage.setItem('user', JSON.stringify(mockUserData.user));
            navigate('/movies', { replace: true });
            return;
        }

        try {
            console.log(baseUrl+'/api/account/login');
            const response = await fetch(baseUrl+'/api/account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/movies', { replace: true });
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Incorrect username or password.');
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
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        autocomplete="off"
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
                        autocomplete="off"
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