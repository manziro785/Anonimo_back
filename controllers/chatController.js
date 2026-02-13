const { Chat, User } = require('../models');

// Создать чат
exports.createChat = async (req, res) => {
  try {
    const { name, user } = req.body;
    
    const chat = await Chat.create({
      name,
      userId: user.id
    });
    
    const createdChat = await Chat.findByPk(chat.id, {
      include: [{
        model: User,
        attributes: ['id', 'username']
      }]
    });
    
    res.status(201).json(createdChat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat', error: error.message });
  }
};

// Получить все чаты пользователя
exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.findAll({
      where: { userId: req.user.id },
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error: error.message });
  }
};

// Обновить чат
exports.updateChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const chat = await Chat.findByPk(id);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    if (chat.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    chat.name = name;
    await chat.save();
    
    const updatedChat = await Chat.findByPk(id, {
      include: [{
        model: User,
        attributes: ['id', 'username']
      }]
    });
    
    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: 'Error updating chat', error: error.message });
  }
};

// Удалить чат
exports.deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    
    const chat = await Chat.findByPk(id);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    if (chat.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await chat.destroy();
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting chat', error: error.message });
  }
};
