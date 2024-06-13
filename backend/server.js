const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./models');
const User = db.User;
const Task = db.Task;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const SECRET_KEY = 'your_secret_key';

app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = await User.create({ username, password: hashedPassword, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

app.get('/tasks', authenticate, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [{ model: User, as: 'assignedUser' }]
    });
    console.log('Fetched tasks:', tasks);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/tasks', authenticate, authorize('admin'), async (req, res) => {
  const { title, status, assignedUserId } = req.body;
  try {
    const newTask = await Task.create({ title, status, assignedUserId: assignedUserId || null });
    res.json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.put('/tasks/:id', authenticate, authorize('admin'), async (req, res) => {
  const { id } = req.params;
  const { title, status, assignedUserId } = req.body;
  try {
    await Task.update({ title, status, assignedUserId: assignedUserId || null }, {
      where: { id }
    });
    const updatedTask = await Task.findByPk(id, {
      include: [{ model: User, as: 'assignedUser' }]
    });
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.delete('/tasks/:id', authenticate, authorize('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    await Task.destroy({
      where: { id }
    });
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/users', authenticate, authorize('admin'), async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = await User.create({ username, password: hashedPassword, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.put('/users/:id', authenticate, authorize('admin'), async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    await User.update({ role }, {
      where: { id }
    });
    const updatedUser = await User.findByPk(id);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = 5000;
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
