const { User } = require('../models');

// Получить всех пользователей (только для ADMIN)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Получить свой профиль
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Обновить свой профиль
exports.updateMe = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    const user = await User.findByPk(req.user.id);
    
    if (username) user.username = username;
    if (email) user.email = email;
    
    await user.save();
    
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Удалить свой профиль
exports.deleteMe = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.user.id } });
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting profile', error: error.message });
  }
};
