# 🚀 Anonimo Backend

Полнофункциональный бэкенд для чат-приложения с AI интеграцией на Express.js и PostgreSQL.

## 📋 Возможности

- ✅ JWT аутентификация и авторизация
- ✅ Управление пользователями (USER, MANAGER, ADMIN)
- ✅ Чаты и сообщения
- ✅ AI интеграция через Groq API (llama-3.3-70b-versatile)
- ✅ Опросы и ответы
- ✅ WebSocket для real-time общения
- ✅ PostgreSQL база данных

## 🛠 Технологии

- Node.js + Express.js
- PostgreSQL + Sequelize ORM
- JWT для авторизации
- Socket.IO для WebSocket
- Groq API для AI
- Bcrypt для хэширования паролей

## 📦 Установка локально

### 1. Клонируйте репозиторий

```bash
git clone <your-repo-url>
cd anonimo-backend
```

### 2. Установите зависимости

```bash
npm install
```

### 3. Настройте переменные окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Заполните переменные:

```env
PORT=8080
NODE_ENV=development

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/anonimo

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=86400000

# Groq API
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.3-70b-versatile

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### 4. Запустите сервер

```bash
# Development
npm run dev

# Production
npm start
```

Сервер запустится на `http://localhost:8080`

## 🌐 Деплой на Render

### Шаг 1: Создайте PostgreSQL базу данных

1. Зайдите на [Render.com](https://render.com)
2. Создайте новый **PostgreSQL** сервис
3. Выберите план (Free tier доступен)
4. Скопируйте **Internal Database URL** (будет что-то вроде `postgresql://user:pass@host/db`)

### Шаг 2: Создайте Web Service

1. В Render создайте новый **Web Service**
2. Подключите ваш GitHub репозиторий
3. Настройте параметры:

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

### Шаг 3: Настройте Environment Variables

Добавьте следующие переменные окружения в Render:

| Ключ | Значение |
|------|----------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `<ваш Internal Database URL>` |
| `JWT_SECRET` | `<ваш секретный ключ>` |
| `JWT_EXPIRATION` | `86400000` |
| `GROQ_API_KEY` | `<ваш Groq API ключ>` |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` |
| `ALLOWED_ORIGINS` | `https://your-frontend.vercel.app,http://localhost:3000` |

### Шаг 4: Деплой

1. Нажмите **Create Web Service**
2. Render автоматически задеплоит ваше приложение
3. После деплоя вы получите URL вида: `https://your-app.onrender.com`

### Шаг 5: Проверка

Откройте в браузере:
```
https://your-app.onrender.com/actuator/health
```

Должен вернуть:
```json
{"status": "UP"}
```

## 🔑 Получение Groq API ключа

1. Зайдите на [Groq Console](https://console.groq.com)
2. Зарегистрируйтесь или войдите
3. Перейдите в раздел **API Keys**
4. Создайте новый ключ
5. Скопируйте и добавьте в `.env` как `GROQ_API_KEY`

## 📚 API Endpoints

### Аутентификация
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/authenticate` - Вход

### Пользователи
- `GET /api/v1/users` - Все пользователи (ADMIN)
- `GET /api/v1/users/me` - Мой профиль
- `PUT /api/v1/users/me` - Обновить профиль
- `DELETE /api/v1/users/me` - Удалить профиль

### Чаты
- `POST /api/v1/chat` - Создать чат
- `GET /api/v1/chat` - Все чаты
- `PUT /api/v1/chat/:id` - Обновить чат
- `DELETE /api/v1/chat/:id` - Удалить чат

### Сообщения
- `POST /api/v1/messages` - Отправить сообщение
- `POST /api/v1/messages/ai` - Отправить AI сообщение
- `GET /api/v1/messages/chat/:chatId` - Все сообщения чата
- `GET /api/v1/messages/chat/:chatId/recent` - Последние сообщения
- `DELETE /api/v1/messages/:messageId` - Удалить сообщение

### Опросы
- `POST /api/v1/surveys` - Создать опрос
- `GET /api/v1/surveys` - Все опросы
- `GET /api/v1/surveys/:id` - Опрос по ID
- `PUT /api/v1/surveys/:id` - Обновить опрос
- `DELETE /api/v1/surveys/:id` - Удалить опрос

### Ответы
- `POST /api/v1/answers` - Сохранить ответ
- `GET /api/v1/answers/user/:userId` - Ответы пользователя
- `GET /survey-responses` - Все ответы опросов

### Служебные
- `GET /api/v1/anonimo-controller` - Hello endpoint
- `GET /actuator/health` - Health check

## 🔌 WebSocket

Подключение к WebSocket:

```javascript
const socket = io('https://your-app.onrender.com');

// Присоединиться к чату
socket.emit('join-chat', chatId);

// Отправить сообщение
socket.emit('send-message', {
  chatId: 1,
  content: 'Hello!',
  username: 'john_doe',
  userId: 1
});

// Слушать новые сообщения
socket.on('new-message', (message) => {
  console.log('New message:', message);
});

// Уведомление о печати
socket.emit('typing', {
  chatId: 1,
  username: 'john_doe',
  isTyping: true
});
```

## 🧪 Тестирование API

### Пример: Регистрация и создание чата

```bash
# 1. Регистрация
curl -X POST https://your-app.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "USER"
  }'

# Ответ: {"token": "eyJ..."}

# 2. Создание чата
curl -X POST https://your-app.onrender.com/api/v1/chat \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Мой первый чат",
    "user": {"id": 1}
  }'

# 3. Отправка сообщения AI
curl -X POST https://your-app.onrender.com/api/v1/messages/ai \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": 1,
    "content": "Привет! Расскажи анекдот"
  }'
```

## 📊 Структура базы данных

### Таблицы:
- `users` - Пользователи
- `chats` - Чаты
- `messages` - Сообщения
- `surveys` - Опросы
- `questions` - Вопросы опросов
- `question_answers` - Варианты ответов
- `user_answers` - Ответы пользователей

### Связи:
- User → Chat (1:M)
- User → Message (1:M)
- Chat → Message (1:M)
- Survey → Question (1:M)
- Question → QuestionAnswer (1:M)
- User → UserAnswer (1:M)
- Question → UserAnswer (1:M)

## 🔒 Безопасность

- ✅ JWT токены с истечением срока действия
- ✅ Bcrypt для хэширования паролей
- ✅ CORS настройка
- ✅ Role-based access control (USER, MANAGER, ADMIN)
- ✅ SQL injection защита через Sequelize

## 📝 Лицензия

MIT

## 👨‍💻 Автор

Создано для проекта Anonimo

---

**Готово к деплою! 🚀**
