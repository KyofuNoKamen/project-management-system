import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './Task';
import TaskForm from './TaskForm';
import { Container, Box, Typography, Grid } from '@mui/material';

const ProjectBoard = ({ user }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched tasks:', response.data); // Додайте цей рядок
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (task) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/tasks', task, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const editTask = async (id, updatedTask) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/tasks/${id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.map(task => (task.id === id ? { ...task, ...updatedTask } : task)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Project Board
      </Typography>
      {user.role === 'admin' && <TaskForm onSave={addTask} />}
      <Grid container spacing={3}>
        {['To Do', 'In Progress', 'Done'].map(status => (
          <Grid item xs={12} sm={4} key={status}>
            <Box className="task-column">
              <Typography variant="h6" align="center">{status}</Typography>
              <Box>
                {tasks.filter(task => task.status === status).map(task => (
                  <Task key={task.id} task={task} onEdit={editTask} onDelete={deleteTask} />
                ))}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProjectBoard;
