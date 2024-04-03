import React, { useState, useEffect } from "react";
import { User } from "../interfaces/IUser";
import { getAllUsers } from "../services/firebase/userManagement";
import { NavigationBar } from "../components/NavBar/NavBar";
import { useRequireAuth } from "../hooks/useRequireAuth"

export default function DashboardPage() {
    const [users, setUsers] = useState<User[]>([]);

    useRequireAuth();

    useEffect(() => {
        getAllUsers()
        .then(users => {
            setUsers(users as User[]);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            // Handle the error appropriately
        });
    }, []); 

    return (
        <div>
            <NavigationBar />
            <div>
                
                <div>
                    <h2>Users</h2>
                    <ul>
                        {users.map(user => (
                            <li key={user.id}>{user.firstName} {user.lastName} - {user.email} - {user.role}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
