import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TechnicianDashboard from './pages/TechnicianDashboard';
import DentistDashboard from './pages/DentistDashboard';

// A simple component to handle redirection
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/technician" 
          element={
            <PrivateRoute>
              <TechnicianDashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/dentist" 
          element={
            <PrivateRoute>
              <DentistDashboard />
            </PrivateRoute>
          } 
        />

        {/* Default route redirects to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;