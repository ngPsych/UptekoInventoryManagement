import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { User } from "../interfaces/IUser";
import { getAllUsers } from "../services/firebase/userManagement";
import { NavigationBar } from "../components/NavBar/NavBar";
import { useRequireAuth } from "../hooks/useRequireAuth"

export default function DashboardPage() {
    const [users, setUsers] = useState<User[]>([]);

    useRequireAuth();

    useEffect(() => {
        // getAllUsers()
        // .then(fetchedUsers => {
        //     setUsers(fetchedUsers as User[]);
        //     console.log(fetchedUsers);
        // })
        // .catch(error => {
        //     console.error('Error fetching users:', error);
        //     // Handle the error appropriately
        // });
    }, []); 

    return (
        <NavigationBar />
        // <div>
            
        //     <div>
        //         <h2>Users</h2>
        //         <button onClick={handleLogout}>Logout</button> {/* Logout button */}
        //         <ul>
        //             {users.map(user => (
        //                 <li key={user.id}>{user.firstName} {user.lastName} - {user.email} - {user.role}</li>
        //             ))}
        //         </ul>
        //     </div>
        // </div>
    );
}
