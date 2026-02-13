const { Message, Chat, User } = require('../models');
const axios = require('axios');

// Отправить обычное сообщение
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    
    const message = await Message.create({
      content,
      chatId,
      userId: req.user.id,
      isAiResponse: false
    });
    
    const createdMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: Chat,
          attributes: ['id', 'name']
        }
      ]
    });
    
    res.status(201).json(createdMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Отправить сообщение AI и получить ответ
exports.sendAiMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    
    // Сохраняем сообщение пользователя
    const userMessage = await Message.create({
      content,
      chatId,
      userId: req.user.id,
      isAiResponse: false
    });
    
    // Получаем последние 10 сообщений для контекста
    const recentMessages = await Message.findAll({
      where: { chatId },
      order: [['time', 'DESC']],
      limit: 10,
      include: [{
        model: User,
        attributes: ['username']
      }]
    });
    
    // Формируем контекст для AI
    const messages = recentMessages.reverse().map(msg => ({
      role: msg.isAiResponse ? 'assistant' : 'user',
      content: msg.content
    }));
    
    // Вызов Groq API
    let aiResponseText = '';
    try {
      const groqResponse = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          messages: messages,
          temperature: 0.7,
          max_tokens: 1024
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      
      aiResponseText = groqResponse.data.choices[0].message.content;
    } catch (aiError) {
      console.error('Groq API error:', aiError.message);
      aiResponseText = 'Извините, произошла ошибка при обработке вашего запроса. Попробуйте еще раз.';
    }
    
    // Сохраняем ответ AI
    const aiMessage = await Message.create({
      content: aiResponseText,
      chatId,
      userId: null,
      isAiResponse: true
    });
    
    // Возвращаем оба сообщения
    const userMessageWithData = await Message.findByPk(userMessage.id, {
      include: [{ model: User, attributes: ['id', 'username'] }]
    });
    
    const aiMessageWithData = await Message.findByPk(aiMessage.id);
    
    res.json({
      userMessage: userMessageWithData,
      aiMessage: aiMessageWithData
    });
  } catch (error) {
    console.error('Send AI message error:', error);
    res.status(500).json({ message: 'Error sending AI message', error: error.message });
  }
};

// Получить все сообщения чата
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const messages = await Message.findAll({
      where: { chatId },
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['time', 'ASC']]
    });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Получить последние N сообщений чата
exports.getRecentMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    const messages = await Message.findAll({
      where: { chatId },
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['time', 'DESC']],
      limit
    });
    
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent messages', error: error.message });
  }
};

// Удалить сообщение
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findByPk(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    if (message.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await message.destroy();
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};
