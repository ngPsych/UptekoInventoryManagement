import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { User } from "./interfaces/User"

import { getAllUsers } from "./services/api/firebase/firestore"

function App() {
  const [users, setUsers] = useState<User[]>([]);

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
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload. Test, test2
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        {/* User List */}
        <div>
          <h2>Users</h2>
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.firstName} {user.lastName} - {user.email}</li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;

