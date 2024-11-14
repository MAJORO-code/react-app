import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    const [updateUser, setUpdateUser] = useState({ oldUsername: '', newUsername: '', newPassword: '' });

    // Fetch users from the database
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5300/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Add a new user
    const addUser = async (e) => {
        e.preventDefault();
        if (!newUser.username || !newUser.password) {
            alert("Both fields are required");
            return;
        }
        try {
            await axios.post('http://localhost:5300/users', newUser);
            fetchUsers(); // Refresh user list
            alert('User added');
            setNewUser({ username: '', password: '' });
        } catch (error) {
            alert(error.response?.data?.error || 'Error adding user');
        }
    };

    // Update an existing user
    const updateExistingUser = async (e) => {
        e.preventDefault();
        if (!updateUser.oldUsername || !updateUser.newUsername || !updateUser.newPassword) {
            alert('All fields are required');
            return;
        }
        try {
            await axios.put('http://localhost:5300/users', updateUser);
            fetchUsers(); // Refresh user list
            alert('User updated');
            setUpdateUser({ oldUsername: '', newUsername: '', newPassword: '' });
        } catch (error) {
            alert(error.response?.data?.error || 'Error updating user');
        }
    };

    // Delete a user
    const deleteUser = async (username) => {
        try {
            await axios.delete('http://localhost:5300/users', { data: { username } });
            fetchUsers(); // Refresh user list
            alert('User deleted');
        } catch (error) {
            alert(error.response?.data?.error || 'Error deleting user');
        }
    };

    // Set user data for editing
    const handleEdit = (username) => {
        setUpdateUser({ oldUsername: username, newUsername: username, newPassword: '' });
    };

    return (
        <section id="usersManagement" className="users-management">
            <h2 className="header">USERS MANAGEMENT</h2>

            <div className="forms-container">
                {/* Add User Form */}
                <form onSubmit={addUser} className="user-form">
                    <label>Username:</label>
                    <input type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
                    <label>Password:</label>
                    <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
                    <button type="submit">Add User</button>
                </form>

                {/* Update User Form */}
                <form onSubmit={updateExistingUser} className="user-form">
                    <label>Old Username:</label>
                    <input type="text" value={updateUser.oldUsername} onChange={(e) => setUpdateUser({ ...updateUser, oldUsername: e.target.value })} required />
                    <label>New Username:</label>
                    <input type="text" value={updateUser.newUsername} onChange={(e) => setUpdateUser({ ...updateUser, newUsername: e.target.value })} required />
                    <label>New Password:</label>
                    <input type="password" value={updateUser.newPassword} onChange={(e) => setUpdateUser({ ...updateUser, newPassword: e.target.value })} required />
                    <button type="submit">Update User</button>
                </form>
            </div>

            <div className="users-list-container">
                <h3>Users List:</h3>
                <table className="users-list">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="2">No users available</td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.username}</td>
                                    <td>
                                        <button onClick={() => handleEdit(user.username)} className="action-btn edit-btn">Edit</button>
                                        <button onClick={() => deleteUser(user.username)} className="action-btn delete-btn">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style>
                {`
                    .users-management {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                        background-color: #f9f9f9;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 20px;
                    }

                    .header {
                        text-align: center;
                        width: 100%;
                        font-size: 1.5em;
                        margin-bottom: 15px;
                    }

                    .forms-container, .users-list-container {
                        flex: 1;
                        min-width: 300px;
                    }

                    .user-form {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                        margin-bottom: 15px;
                    }

                    .user-form label {
                        font-weight: bold;
                        flex: 0 0 100%;
                        font-size: 0.9em;
                    }

                    .user-form input {
                        padding: 6px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        flex: 1;
                        font-size: 0.9em;
                    }

                    .user-form button {
                        padding: 6px 10px;
                        background-color: #007bff;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 0.9em;
                        margin-top: 5px;
                        flex: 0 0 auto;
                    }

                    .users-list {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    .users-list th, .users-list td {
                        padding: 6px;
                        border: 1px solid #ccc;
                        text-align: center;
                        font-size: 0.9em;
                    }

                    .users-list th {
                        background-color: #007bff;
                        color: white;
                    }

                    .users-list tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }

                    .action-btn {
                        padding: 5px 8px;
                        margin: 0 4px;
                        font-size: 0.8em;
                        cursor: pointer;
                        border-radius: 4px;
                        border: none;
                    }

                    .edit-btn {
                        background-color: #28a745;
                        color: white;
                    }

                    .delete-btn {
                        background-color: #dc3545;
                        color: white;
                    }

                    .edit-btn:hover {
                        background-color: #218838;
                    }

                    .delete-btn:hover {
                        background-color: #c82333;
                    }
                `}
            </style>
        </section>
    );
};

export default UsersManagement;
