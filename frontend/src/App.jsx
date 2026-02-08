import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';
import AsteroidDetail from './AsteroidDetail';
import Profile from './Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-inter">
        <Navbar />
        
        <main className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} /> {/* New Route */}
            <Route path="/asteroid/:id" element={<AsteroidDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;