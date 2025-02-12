import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../api'; // Убедись, что путь правильный
import './Login.css';
import { FaRegUser } from "react-icons/fa";
import { MdVpnKey } from "react-icons/md";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    // Если уже залогинен, перенаправляем на /movies
    if (localStorage.getItem('accessToken')) {
        return <Navigate to="/movies" />;
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
            console.log('Sending request to API:', formData); // ✅ Проверяем, что отправляем
            const response = await api.post('/account/login', formData);
            console.log('API Response:', response.data); // ✅ Проверяем, что пришло

            const { accessToken, refreshToken, userName, email } = response.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify({ userName, email }));

            navigate('/movies', { replace: true });
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Invalid username or password.');
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
