import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Select, MenuItem, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingRole, setEditingRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/users', { username, password, role }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('User added successfully');
      setUsername('');
      setPassword('');
      setRole('user');
      const response = await axios.get('http://localhost:5000/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError('User management failed. Please try again.');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditingRole(user.role);
  };

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/users/${id}`, { role: editingRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingUserId(null);
      const response = await axios.get('http://localhost:5000/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setMessage('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Failed to update user role. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setEditingRole('');
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        User Management
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      <Box component="form" onSubmit={handleSubmit} mb={3}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add User
        </Button>
      </Box>
      <Typography variant="h6" gutterBottom>
        Existing Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', fontSize: '16px' }}>Username</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '16px' }} align="right">Role</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '16px' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  {user.username}
                </TableCell>
                <TableCell align="right">
                  {editingUserId === user.id ? (
                    <Select
                      value={editingRole}
                      onChange={(e) => setEditingRole(e.target.value)}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  ) : (
                    user.role
                  )}
                </TableCell>
                <TableCell align="right">
                  {editingUserId === user.id ? (
                    <>
                      <IconButton onClick={() => handleSave(user.id)} color="primary">
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={handleCancel} color="secondary">
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton onClick={() => handleEdit(user)} color="primary">
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UserManagement;
