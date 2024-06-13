import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Select, MenuItem } from '@mui/material';

const TaskForm = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('To Do');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [users, setUsers] = useState([]);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ title, status, assignedUserId: assignedUserId || null });
    setTitle('');
    setStatus('To Do');
    setAssignedUserId('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mb={3}>
      <TextField
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Select
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        fullWidth
        margin="normal"
        required
      >
        <MenuItem value="To Do">To Do</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
        <MenuItem value="Done">Done</MenuItem>
      </Select>
      <Select
        label="Assign User"
        value={assignedUserId}
        onChange={(e) => setAssignedUserId(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="">None</MenuItem>
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.username}
          </MenuItem>
        ))}
      </Select>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Add Task
      </Button>
    </Box>
  );
};

export default TaskForm;
