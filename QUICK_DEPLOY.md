# Быстрый деплой проекта

## 🚀 Локальный запуск с Docker

### Предварительные требования
- Docker Desktop установлен и запущен
- Git

### Шаги деплоя

1. **Клонирование репозитория:**
```bash
git clone <your-repository-url>
cd test_search
```

2. **Настройка переменных окружения:**
```bash
cp env.example .env
# Отредактируйте .env файл при необходимости
```

3. **Сборка и запуск:**
```bash
# Сборка frontend локально (для ускорения)
cd frontend
npm install
npm run build
cd ..

# Сборка и запуск Docker контейнеров
docker-compose up -d --build
```

4. **Проверка работы:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3002/health

## 🌐 Деплой на сервер

### Вариант 1: Docker (Рекомендуется)

1. **Подготовка сервера:**
```bash
# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

2. **Деплой приложения:**
```bash
git clone <your-repository-url>
cd test_search

# Настройка переменных окружения
cp env.example .env
nano .env  # Отредактируйте для продакшена

# Сборка и запуск
docker-compose up -d --build
```

### Вариант 2: Git + PM2

1. **Установка зависимостей:**
```bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2
sudo apt install nginx
```

2. **Деплой:**
```bash
git clone <your-repository-url>
cd test_search

# Backend
cd backend
npm install
cp env.example .env
npm run build
pm2 start dist/index.js --name "backend"

# Frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

## 📋 Управление

### Docker команды
```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Просмотр логов
docker-compose logs -f

# Пересборка
docker-compose up -d --build
```

### PM2 команды
```bash
# Статус
pm2 status

# Логи
pm2 logs

# Перезапуск
pm2 restart all
```

## 🔧 Настройка для продакшена

1. **Обновите .env файл:**
```env
NODE_ENV=production
PORT=3001
SESSION_SECRET=your-very-secure-session-secret
CORS_ORIGIN=https://yourdomain.com
```

2. **Настройте SSL (Let's Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

3. **Настройте firewall:**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 📊 Мониторинг

- **Docker:** `docker stats`
- **PM2:** `pm2 monit`
- **Nginx:** `sudo tail -f /var/log/nginx/access.log`

## 🆘 Troubleshooting

### Проблемы с портами
```bash
# Проверка занятых портов
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :3001

# Остановка процессов
sudo kill -9 <PID>
```

### Проблемы с Docker
```bash
# Очистка Docker
docker system prune -a

# Пересборка образов
docker-compose build --no-cache
```

### Проблемы с PM2
```bash
# Перезапуск процессов
pm2 restart all

# Очистка логов
pm2 flush
```
