const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Генерация JWT токена
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '24h'
  });
};

// Регистрация
exports.register = async (req, res) => {
  try {
    const { email, password, username, role } = req.body;

    // Проверка существования пользователя
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Создание пользователя
    const userData = { email, password, role: role || 'USER' };
    
    // Для MANAGER обязателен username
    if (role === 'MANAGER') {
      if (!username) {
        return res.status(400).json({ message: 'Username required for MANAGER' });
      }
      userData.username = username;
    }

    const user = await User.create(userData);

    // Генерация токена
    const token = generateToken(user.id);

    res.status(201).json({ token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Вход
exports.authenticate = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Проверка пароля
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Генерация токена
    const token = generateToken(user.id);

    res.json({ token });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
};
