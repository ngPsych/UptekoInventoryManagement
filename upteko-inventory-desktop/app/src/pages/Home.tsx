import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { signOutUser } from '../services/firebase/authentication';
import { User } from "../interfaces/User";
import { getAllUsers } from "../services/firebase/userManagement";


export default function HomePage() {
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate(); // Initialize useNavigate

    // Logout function
    const handleLogout = () => {
        signOutUser()
            .then(() => {
                navigate('/'); // Redirect to login page after logout
            })
            .catch((error) => {
                console.error('Logout error:', error);
                // Handle error here, perhaps show a notification
            });
    };

    useEffect(() => {
        getAllUsers()
        .then(fetchedUsers => {
            setUsers(fetchedUsers as User[]);
            console.log(fetchedUsers);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            // Handle the error appropriately
        });
    }, []); 

    return (
        <div>
            <h2>Users</h2>
            <button onClick={handleLogout}>Logout</button> {/* Logout button */}
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.firstName} {user.lastName} - {user.email}</li>
                ))}
            </ul>
        </div>
    );
}
