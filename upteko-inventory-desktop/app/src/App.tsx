import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import InventoryPage from './pages/Inventory';
import AssemblyPage from './pages/Assembly';
import OrderPage from './pages/Order';
import AdminPage from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/assembly" element={<AssemblyPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* Other routes here */}
      </Routes>
    </Router>
  );
}


// function App() {
//   const [users, setUsers] = useState<User[]>([]);

//   useEffect(() => {
//     getAllUsers()
//       .then(fetchedUsers => {
//         setUsers(fetchedUsers as User[]);
//         console.log(fetchedUsers);
//       })
//       .catch(error => {
//         console.error('Error fetching users:', error);
//         // Handle the error appropriately
//       });
//   }, []); // Empty dependency array means this effect runs once on mount

//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload. Test, test2
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>

//         {/* User List */}
//         <div>
//           <h2>Users</h2>
//           <ul>
//             {users.map(user => (
//               <li key={user.id}>{user.firstName} {user.lastName} - {user.email}</li>
//             ))}
//           </ul>
//         </div>
//       </header>
//     </div>
//   );
// }

export default App;

