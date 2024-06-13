import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const Task = ({ task, onEdit, onDelete }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {task.title}
        </Typography>
        <Typography color="textSecondary">
          Status: {task.status}
        </Typography>
        {task.assignedUser && (
          <Typography color="textSecondary">
            Assigned to: {task.assignedUser.username}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={() => onEdit(task.id, task)} sx={{ mr: 1 }}>
            Edit
          </Button>
          <Button variant="contained" color="secondary" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Task;
