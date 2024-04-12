import React, { useState, useEffect, useRef } from 'react';
import { NavigationBar } from '../../components/NavBar/NavBar';
import { useRequireAuth } from "../../hooks/useRequireAuth"
import { ToastContainer, toast, Zoom } from 'react-toastify';
import { sendUserPasswordResetEmail, signUp } from '../../services/firebase/authentication';
import { addUserData } from '../../services/firebase/userManagement';
import { User } from '../../interfaces/IUser';
import { subscribeToAllUsers } from "../../services/firebase/userManagement";
import styles from "../Admin/Admin.module.css";

export default function AdminPage() {
    useRequireAuth();

    const [users, setUsers] = useState<User[]>([]);
    const [email, setEmail] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [isTableMenuVisible, setTableMenuVisible] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [contextMenuPosition, setContextMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    
    const contextMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = subscribeToAllUsers((users: User[]) => { // Subscribe to user updates
            setUsers(users);
        });
        
        return () => unsubscribe(); // Cleanup function to unsubscribe when component unmounts
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                setTableMenuVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const renderEmptyRows = () => {
        const emptyRowCount = Math.max(20 - users.length, 0);
        const emptyRows = [];

        for (let i = 0; i < emptyRowCount; i++) {
            emptyRows.push(
                <tr key={`empty-${i}`}>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            );
        }

        return emptyRows;
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLTableRowElement>, user: User) => {
        event.preventDefault();
        setSelectedUser(user);
        setContextMenuPosition({ top: event.clientY, left: event.clientX });
        setTableMenuVisible(true);
    };

    const handleModify = () => {
        // Implement modify functionality here using selectedUser.email
        toast.info(`Modify ${selectedUser?.email}`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Zoom
        });
        handleCloseMenu();
    };

    const handleDelete = () => {
        // Implement delete functionality here using selectedUser.email
        toast.error(`Delete ${selectedUser?.email}`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Zoom
        });
        handleCloseMenu();
    };

    const handleCloseMenu = () => {
        setSelectedUser(null);
        setTableMenuVisible(false);
    };

// -------- CREATE USER --------- //
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!email || !firstName || !lastName || !role) {
            toast.error("Please fill out all the fields to create an account!", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Zoom
            });
        } else {
            const randomPassword = Math.random().toString(36).slice(-8);
            const userSignUp = await signUp(email, randomPassword);
            if (userSignUp) {
                await addUserData(email, firstName, lastName, role);
                
                toast.success(`Account created. Password reset link sent to user's e-mail.`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Zoom
                });
                
                setEmail('');
                setFirstName('');
                setLastName('');
                setRole('');
                
                await sendUserPasswordResetEmail(email);
            } else {
                toast.error(`Error creating account.`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Zoom
                });
            }
        }
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (role !== e.target.value) {
            setRole(e.target.value);
        } else {
            setRole('');
        }
    };

    return (
        <div>
            <NavigationBar />
            <ToastContainer />

            <div className={styles.list}>
                <h2>List of Users</h2>
                <div className={styles.userListContainer}>
                    <table className={styles.userTable}>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Full Name</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} onContextMenu={(e) => handleContextMenu(e, user)}>
                                    <td>{user.email}</td>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td className={styles.userRole}>{user.role}</td>
                                </tr>
                            ))}
                            {renderEmptyRows()}
                        </tbody>
                    </table>
                </div>
            </div>

            {isTableMenuVisible && (
                <div 
                    ref={contextMenuRef}
                    className={styles.contextMenu} 
                    style={{ top: contextMenuPosition.top, left: contextMenuPosition.left }}
                >
                    <div onClick={handleModify}>Modify</div>
                    <div onClick={handleDelete}>Delete</div>
                </div>
            )}

            <div className={styles.formContainer}>
                <h2>Create new account</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />

                    <input 
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                    />
                    
                    <input 
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                    />

                    <label>
                        <input 
                            type="radio"
                            name="role"
                            value="User"
                            onChange={handleRoleChange}
                            checked={role === "User"}
                        />
                        User
                    </label>

                    <label>
                        <input 
                            type="radio"
                            name="role"
                            value="Admin"
                            onChange={handleRoleChange}
                            checked={role === "Admin"}
                        />
                        Admin
                    </label>

                    <button>Create</button>
                </form>
            </div>
        </div>
    );
}
