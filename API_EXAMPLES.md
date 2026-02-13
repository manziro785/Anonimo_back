# 🧪 ПРИМЕРЫ API ЗАПРОСОВ

Этот файл содержит готовые curl команды для тестирования всех эндпоинтов API.

**⚠️ Замените:**
- `YOUR_API_URL` на ваш URL (например: `https://anonimo-backend-xxxx.onrender.com`)
- `YOUR_TOKEN` на JWT токен, полученный после регистрации/входа

---

## 🔐 АУТЕНТИФИКАЦИЯ

### 1. Регистрация USER

```bash
curl -X POST YOUR_API_URL/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "role": "USER"
  }'
```

**Ответ:**
```json
{"token": "eyJhbGci..."}
```

### 2. Регистрация MANAGER

```bash
curl -X POST YOUR_API_URL/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@example.com",
    "password": "password123",
    "username": "john_manager",
    "role": "MANAGER"
  }'
```

### 3. Вход в систему

```bash
curl -X POST YOUR_API_URL/api/v1/auth/authenticate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

## 👤 ПОЛЬЗОВАТЕЛИ

### 4. Получить свой профиль

```bash
curl -X GET YOUR_API_URL/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Обновить профиль

```bash
curl -X PUT YOUR_API_URL/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_username",
    "email": "newemail@example.com"
  }'
```

### 6. Получить всех пользователей (только ADMIN)

```bash
curl -X GET YOUR_API_URL/api/v1/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Удалить свой профиль

```bash
curl -X DELETE YOUR_API_URL/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 💬 ЧАТЫ

### 8. Создать чат

```bash
curl -X POST YOUR_API_URL/api/v1/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Мой первый чат с AI",
    "user": {
      "id": 1
    }
  }'
```

### 9. Получить все чаты

```bash
curl -X GET YOUR_API_URL/api/v1/chat \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 10. Обновить чат

```bash
curl -X PUT YOUR_API_URL/api/v1/chat/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Обновленное название чата"
  }'
```

### 11. Удалить чат

```bash
curl -X DELETE YOUR_API_URL/api/v1/chat/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📨 СООБЩЕНИЯ

### 12. Отправить обычное сообщение

```bash
curl -X POST YOUR_API_URL/api/v1/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": 1,
    "content": "Привет! Это моё сообщение"
  }'
```

### 13. Отправить сообщение AI ⭐

```bash
curl -X POST YOUR_API_URL/api/v1/messages/ai \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": 1,
    "content": "Расскажи анекдот про программистов"
  }'
```

### 14. Получить все сообщения чата

```bash
curl -X GET YOUR_API_URL/api/v1/messages/chat/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 15. Получить последние 10 сообщений

```bash
curl -X GET "YOUR_API_URL/api/v1/messages/chat/1/recent?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 16. Удалить сообщение

```bash
curl -X DELETE YOUR_API_URL/api/v1/messages/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 ОПРОСЫ

### 17. Создать опрос

```bash
curl -X POST YOUR_API_URL/api/v1/surveys \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Опрос удовлетворенности",
    "description": "Насколько вы довольны нашим сервисом?",
    "questions": [
      {
        "text": "Как вы оцениваете наш сервис?",
        "type": "SINGLE_CHOICE",
        "answers": [
          {"text": "Отлично"},
          {"text": "Хорошо"},
          {"text": "Удовлетворительно"},
          {"text": "Плохо"}
        ]
      },
      {
        "text": "Что бы вы улучшили?",
        "type": "TEXT",
        "answers": []
      }
    ]
  }'
```

### 18. Получить все опросы

```bash
curl -X GET YOUR_API_URL/api/v1/surveys \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 19. Получить опрос по ID

```bash
curl -X GET YOUR_API_URL/api/v1/surveys/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 20. Обновить опрос

```bash
curl -X PUT YOUR_API_URL/api/v1/surveys/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Обновленный заголовок опроса",
    "description": "Новое описание"
  }'
```

### 21. Удалить опрос

```bash
curl -X DELETE YOUR_API_URL/api/v1/surveys/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 ОТВЕТЫ НА ОПРОСЫ

### 22. Сохранить ответ на вопрос

```bash
curl -X POST YOUR_API_URL/api/v1/answers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Отлично",
    "user": {"id": 1},
    "question": {"id": 1}
  }'
```

### 23. Получить ответы пользователя

```bash
curl -X GET YOUR_API_URL/api/v1/answers/user/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 24. Получить все ответы на опросы

```bash
curl -X GET YOUR_API_URL/survey-responses \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🧪 СЛУЖЕБНЫЕ ЭНДПОИНТЫ

### 25. Hello Endpoint

```bash
curl -X GET YOUR_API_URL/api/v1/anonimo-controller \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 26. Health Check

```bash
curl -X GET YOUR_API_URL/actuator/health
```

### 27. Главная страница

```bash
curl -X GET YOUR_API_URL/
```

---

## 🔄 ПОЛНЫЙ СЦЕНАРИЙ ТЕСТИРОВАНИЯ

Вот полный пример от регистрации до AI чата:

```bash
# 1. Регистрация
TOKEN=$(curl -s -X POST YOUR_API_URL/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","role":"USER"}' \
  | jq -r '.token')

echo "Token: $TOKEN"

# 2. Получить профиль
curl -X GET YOUR_API_URL/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"

# 3. Создать чат
CHAT_ID=$(curl -s -X POST YOUR_API_URL/api/v1/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Chat","user":{"id":1}}' \
  | jq -r '.id')

echo "Chat ID: $CHAT_ID"

# 4. Отправить сообщение AI
curl -X POST YOUR_API_URL/api/v1/messages/ai \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"chatId\":$CHAT_ID,\"content\":\"Привет! Расскажи анекдот\"}"

# 5. Получить историю сообщений
curl -X GET YOUR_API_URL/api/v1/messages/chat/$CHAT_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🌐 WEBSOCKET ПРИМЕРЫ

### Подключение через JavaScript

```javascript
// В браузере или Node.js с socket.io-client
const socket = io('YOUR_API_URL');

// Присоединиться к чату
socket.emit('join-chat', 1);

socket.on('joined-chat', (data) => {
  console.log('Joined chat:', data);
});

// Отправить сообщение
socket.emit('send-message', {
  chatId: 1,
  content: 'Hello from WebSocket!',
  username: 'test_user',
  userId: 1
});

// Слушать новые сообщения
socket.on('new-message', (message) => {
  console.log('New message:', message);
});

// Уведомление о печати
socket.emit('typing', {
  chatId: 1,
  username: 'test_user',
  isTyping: true
});

socket.on('user-typing', (data) => {
  console.log('User typing:', data);
});
```

---

## 📊 ТЕСТИРОВАНИЕ ПРОИЗВОДИТЕЛЬНОСТИ

### Массовая отправка сообщений

```bash
#!/bin/bash
TOKEN="YOUR_TOKEN"
CHAT_ID=1

for i in {1..10}
do
  curl -X POST YOUR_API_URL/api/v1/messages/ai \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"chatId\":$CHAT_ID,\"content\":\"Вопрос номер $i\"}" &
done

wait
echo "Все запросы отправлены!"
```

---

## 🎯 ГОТОВО!

Все эндпоинты протестированы и готовы к использованию.

**Совет:** Используйте Postman или Insomnia для более удобного тестирования API.
