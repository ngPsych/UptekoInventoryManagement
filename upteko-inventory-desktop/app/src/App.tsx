import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import InventoryPage from './pages/Inventory/Inventory';
import AssemblyPage from './pages/Assembly/Assembly';
import OrderPage from './pages/Order';
import AdminPage from './pages/Admin/Admin';
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
      </Routes>
    </Router>
  );
}

export default App;

