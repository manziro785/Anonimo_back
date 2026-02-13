#!/bin/bash

echo "🚀 Anonimo Backend - Quick Start Script"
echo "========================================"
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен!"
    echo "Установите Node.js: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js версия: $(node -v)"
echo "✅ npm версия: $(npm -v)"
echo ""

# Проверка PostgreSQL (опционально)
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL установлен: $(psql --version)"
else
    echo "⚠️  PostgreSQL не найден локально"
    echo "   Вы можете использовать Render PostgreSQL или установить локально"
fi
echo ""

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при установке зависимостей!"
    exit 1
fi

echo ""
echo "✅ Зависимости установлены!"
echo ""

# Проверка .env файла
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден!"
    echo "📝 Создание .env из .env.example..."
    cp .env.example .env
    echo "✅ Файл .env создан!"
    echo ""
    echo "⚠️  ВАЖНО: Отредактируйте .env файл и укажите:"
    echo "   - DATABASE_URL (PostgreSQL connection string)"
    echo "   - GROQ_API_KEY (получите на https://console.groq.com)"
    echo ""
    echo "После редактирования запустите скрипт снова."
    exit 0
fi

# Проверка обязательных переменных
source .env

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL не указан в .env!"
    echo "   Укажите PostgreSQL connection string"
    exit 1
fi

if [ -z "$GROQ_API_KEY" ]; then
    echo "⚠️  GROQ_API_KEY не указан!"
    echo "   AI функции не будут работать"
    echo "   Получите ключ на: https://console.groq.com"
    echo ""
fi

echo "🎯 Готово к запуску!"
echo ""
echo "Выберите режим запуска:"
echo "1) Development (с автоперезагрузкой)"
echo "2) Production"
echo ""
read -p "Введите номер (1 или 2): " choice

case $choice in
    1)
        echo ""
        echo "🔄 Запуск в режиме разработки..."
        npm run dev
        ;;
    2)
        echo ""
        echo "🚀 Запуск в production режиме..."
        npm start
        ;;
    *)
        echo "❌ Неверный выбор!"
        exit 1
        ;;
esac
