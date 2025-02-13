import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Users.css';
import UserDropdown from './UserDropdown';
import DeleteConfirmationModal from '../movies/DeleteConfirmationModal';
import UsersInfoModal from './UsersInfoModal';

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        //Mock data for testing*
        const mockUsers = [
            {
                id: 1,
                username: "john_doe",
                tickets: 5,
                image: "https://randomuser.me/api/portraits/men/1.jpg"
            },
            {
                id: 2,
                username: "jane_smith",
                tickets: 3,
                image: "https://randomuser.me/api/portraits/women/2.jpg"
            },
            {
                id: 3,
                username: "bob_wilson",
                tickets: 7,
                image: ""
            }
        ];

        //Simulate API call*
        setTimeout(() => {
            setUsers(mockUsers);
            setLoading(false);
        }, 1000);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleShowInfo = (user) => {
        setSelectedUser(user);
        setIsInfoModalOpen(true);
    };

    if (loading) {
        return (
            <div className="loading">
                <p>Loading users...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="users-container">
            <nav className="top-nav">
                <div className="logo">
                    <span>screenify</span>
                </div>
                <ul className="nav-links">
                    <li><a href="/movies">Movies</a></li>
                    <li><a href="/sessions">Sessions</a></li>
                    <li><a href="/users" className="active">Users</a></li>
                    <li><a href="/rooms">Rooms</a></li>
                    <li><a href="/tickets">Tickets</a></li>
                    <li><a href="/reviews">Reviews</a></li>
                    <li><a href="/statistics">Statistics</a></li>
                    <li><button onClick={handleLogout} className="logout-btn">LOG OUT</button></li>
                </ul>
            </nav>

            <div className="content">
                <div className="users-header">
                    <h1>List of Users</h1>
                </div>

                <div className="users-table">
                    <table>
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Username</th>
                                <th>Tickets</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.username}</td>
                                    <td>{user.tickets}</td>
                                    <td>
                                        <UserDropdown
                                            user={user}
                                            onDelete={handleDeleteUser}
                                            onInfo={handleShowInfo}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <UsersInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => {
                    setIsInfoModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                }}
                onConfirm={confirmDelete}
                movieTitle={userToDelete?.username || ''}
            />
        </div>
    );
};

export default Users;
