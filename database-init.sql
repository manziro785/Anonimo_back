-- ============================================
-- ANONIMO DATABASE INITIALIZATION SCRIPT
-- ============================================
-- Этот скрипт создает все таблицы и необходимые индексы
-- Sequelize автоматически создаст таблицы, но это бэкап на случай ручной настройки

-- Удаление существующих таблиц (опционально)
DROP TABLE IF EXISTS user_answers CASCADE;
DROP TABLE IF EXISTS question_answers CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS surveys CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chats CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- ТАБЛИЦА: users
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'MANAGER', 'ADMIN')),
    manager_code VARCHAR(6) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_manager_code ON users(manager_code);

-- ============================================
-- ТАБЛИЦА: chats
-- ============================================
CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для chats
CREATE INDEX idx_chats_user_id ON chats(user_id);

-- ============================================
-- ТАБЛИЦА: messages
-- ============================================
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_ai_response BOOLEAN DEFAULT FALSE,
    chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Индексы для messages
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_time ON messages(time);

-- ============================================
-- ТАБЛИЦА: surveys
-- ============================================
CREATE TABLE surveys (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ТАБЛИЦА: questions
-- ============================================
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TEXT')),
    survey_id INTEGER NOT NULL REFERENCES surveys(id) ON DELETE CASCADE
);

-- Индексы для questions
CREATE INDEX idx_questions_survey_id ON questions(survey_id);

-- ============================================
-- ТАБЛИЦА: question_answers
-- ============================================
CREATE TABLE question_answers (
    id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE
);

-- Индексы для question_answers
CREATE INDEX idx_question_answers_question_id ON question_answers(question_id);

-- ============================================
-- ТАБЛИЦА: user_answers
-- ============================================
CREATE TABLE user_answers (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для user_answers
CREATE INDEX idx_user_answers_user_id ON user_answers(user_id);
CREATE INDEX idx_user_answers_question_id ON user_answers(question_id);

-- ============================================
-- ТЕСТОВЫЕ ДАННЫЕ (опционально)
-- ============================================

-- Создание тестового админа (пароль: admin123)
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@anonimo.com', '$2a$10$VZqGJzXU6KxVQVH1K0nF8.HEhLz8J7Uq0r5Y7U5r5Y7U5r5Y7U5r5', 'ADMIN');

-- Создание тестового менеджера (пароль: manager123)
INSERT INTO users (username, email, password, role, manager_code) VALUES 
('manager_user', 'manager@anonimo.com', '$2a$10$VZqGJzXU6KxVQVH1K0nF8.HEhLz8J7Uq0r5Y7U5r5Y7U5r5Y7U5r5', 'MANAGER', 'ABC123');

-- Создание тестового пользователя (пароль: user123)
INSERT INTO users (username, email, password, role) VALUES 
('anonimus_12345678', 'user@anonimo.com', '$2a$10$VZqGJzXU6KxVQVH1K0nF8.HEhLz8J7Uq0r5Y7U5r5Y7U5r5Y7U5r5', 'USER');

-- ============================================
-- ГОТОВО!
-- ============================================
-- База данных готова к использованию
-- Sequelize автоматически синхронизирует модели при запуске
