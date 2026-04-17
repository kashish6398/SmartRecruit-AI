import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Auth from './components/Auth';
import CandidateDashboard from './components/CandidateDashboard';
import HRDashboard from './components/HRDashboard';
import { authAPI, pingBackend } from './services/api';
import './App.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    // Ping backend to wake it up (Render cold boot)
    pingBackend().catch(err => console.log('Ping check:', err.message));

    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (token && role) {
        try {
          // Verify token with backend
          await authAPI.getMe();
          setIsAuthenticated(true);
          setUserRole(role);
        } catch (err) {
          console.error('Session expired or invalid:', err);
          localStorage.clear();
          setIsAuthenticated(false);
          setUserRole(null);
        }
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentScreen('landing');
  };

  if (!isAuthenticated) {
    if (currentScreen === 'landing') {
      return (
        <Landing 
          onNavigate={(screen, mode) => {
            setCurrentScreen(screen);
            if (mode) setAuthMode(mode);
          }} 
        />
      );
    }
return (
  <Auth 
    onLogin={handleLogin} 
    initialMode={authMode}
    onBack={() => setCurrentScreen('landing')}
  />
  );
  }

  return (
    <div className="App">
      {userRole === 'candidate' ? (
        <CandidateDashboard onLogout={handleLogout} />
      ) : (
        <HRDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
