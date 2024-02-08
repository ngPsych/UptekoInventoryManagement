import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { User } from "../interfaces/IUser";
import { getAllUsers } from "../services/firebase/userManagement";
import { NavigationBar } from "../components/NavBar/NavBar";
import { useRequireAuth } from "../hooks/useRequireAuth"
import { getAllItems } from "../services/firebase/inventoryManagement"
import { Item } from "../interfaces/IItem"

export default function DashboardPage() {
    const [users, setUsers] = useState<User[]>([]);

    useRequireAuth();

    useEffect(() => {
        getAllUsers()
        .then(users => {
            setUsers(users as User[]);
            console.log(users);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            // Handle the error appropriately
        });
    }, []); 

    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        getAllItems()
        .then(items => {
            setItems(items as Item[]);
            console.log(items);
        })
        .catch(error => {
            console.error("Error fetching items: ", error);
        });
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
