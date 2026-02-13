require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { sequelize, testConnection } = require('./config/database');
const models = require('./models');

// Создание Express приложения
const app = express();
const server = http.createServer(app);

// Настройка Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Импорт роутов
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');
const messageRoutes = require('./routes/messages');
const surveyRoutes = require('./routes/surveys');
const answerRoutes = require('./routes/answers');
const { authMiddleware } = require('./middleware/auth');

// API роуты
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/surveys', surveyRoutes);
app.use('/api/v1/answers', answerRoutes);

// Дополнительные эндпоинты
app.get('/api/v1/anonimo-controller', authMiddleware, (req, res) => {
  res.json('Hello Anonimo');
});

app.get('/survey-responses', authMiddleware, async (req, res) => {
  const answerController = require('./controllers/answerController');
  answerController.getAllSurveyResponses(req, res);
});

app.get('/actuator/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Anonimo Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      chat: '/api/v1/chat',
      messages: '/api/v1/messages',
      surveys: '/api/v1/surveys',
      answers: '/api/v1/answers',
      health: '/actuator/health'
    }
  });
});

// WebSocket обработка
const chatNamespaces = new Map();

io.on('connection', (socket) => {
  console.log('New WebSocket connection:', socket.id);
  
  // Подключение к чату
  socket.on('join-chat', (chatId) => {
    const room = `chat-${chatId}`;
    socket.join(room);
    console.log(`Socket ${socket.id} joined chat ${chatId}`);
    
    socket.emit('joined-chat', { chatId, message: 'Successfully joined chat' });
  });
  
  // Отправка сообщения
  socket.on('send-message', async (data) => {
    const { chatId, content, username, isAiResponse } = data;
    const room = `chat-${chatId}`;
    
    // Сохранение в БД
    try {
      const { Message } = require('./models');
      const message = await Message.create({
        content,
        chatId,
        userId: data.userId || null,
        isAiResponse: isAiResponse || false
      });
      
      const messageWithUser = await Message.findByPk(message.id, {
        include: [{
          model: models.User,
          attributes: ['id', 'username']
        }]
      });
      
      // Отправка всем в комнате
      io.to(room).emit('new-message', messageWithUser);
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
  
  // Уведомление "печатает"
  socket.on('typing', (data) => {
    const { chatId, username, isTyping } = data;
    const room = `chat-${chatId}`;
    
    socket.to(room).emit('user-typing', { username, isTyping });
  });
  
  // Отключение от чата
  socket.on('leave-chat', (chatId) => {
    const room = `chat-${chatId}`;
    socket.leave(room);
    console.log(`Socket ${socket.id} left chat ${chatId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('WebSocket disconnected:', socket.id);
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Запуск сервера
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    // Тестирование подключения к БД
    await testConnection();
    
    // Синхронизация моделей с БД
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');
    
    // Запуск сервера
    server.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   🚀 Anonimo Backend Server Running   ║
╠════════════════════════════════════════╣
║   Port: ${PORT.toString().padEnd(31)}║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(23)}║
║   WebSocket: Enabled                   ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, io };
