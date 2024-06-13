import React, { useState, useEffect } from 'react';
import { Container, Tab, Tabs, Box, Typography, Button } from '@mui/material';
import ProjectBoard from './components/ProjectBoard';
import { jwtDecode } from 'jwt-decode';
import UserManagement from './components/UserManagement';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }, []);

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleRegister = () => {
    setIsRegistering(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTabIndex(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="md">
      {user ? (
        <>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Project Board" />
            {user.role === 'admin' && <Tab label="User Management" />}
          </Tabs>
          {tabIndex === 0 && <ProjectBoard user={user} />}
          {tabIndex === 1 && user.role === 'admin' && <UserManagement />}
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        isRegistering ? (
          <Register onRegister={handleRegister} />
        ) : (
          <Login onLogin={handleLogin} />
        )
      )}
      {!user && (
        <Button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Go to Login' : 'Go to Register'}
        </Button>
      )}
    </Container>
  );
};

export default App;
