# Инструкции по деплою

## Вариант 1: Docker (Рекомендуется)

### Локальный запуск с Docker

1. **Убедитесь, что установлен Docker и Docker Compose**

2. **Создайте файл .env в корне проекта:**
```bash
cp env.example .env
```

3. **Запустите приложение:**
```bash
docker-compose up --build
```

Приложение будет доступно по адресу: http://localhost:3000

### Деплой на сервер

1. **Подготовка сервера (Ubuntu/Debian):**
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Перезагрузка для применения изменений
sudo reboot
```

2. **Деплой приложения:**
```bash
# Клонируйте репозиторий
git clone <your-repository-url>
cd test_search

# Создайте .env файл
cp env.example .env

# Отредактируйте .env для продакшена
nano .env
```

Содержимое .env для продакшена:
```env
NODE_ENV=production
PORT=3001
SESSION_SECRET=your-very-secure-session-secret
CORS_ORIGIN=https://yourdomain.com

VITE_API_URL=https://yourdomain.com/api
VITE_APP_NAME=Drag & Drop List
```

3. **Запустите приложение:**
```bash
# Запуск в фоновом режиме
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

## Вариант 2: Git + PM2

### Подготовка сервера

1. **Установка Node.js и PM2:**
```bash
# Установка Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PM2
npm install -g pm2

# Установка nginx
sudo apt install nginx
```

2. **Настройка nginx:**
```bash
sudo nano /etc/nginx/sites-available/drag-drop-app
```

Содержимое конфигурации:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /var/www/drag-drop-app/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Активация конфигурации
sudo ln -s /etc/nginx/sites-available/drag-drop-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Деплой приложения

1. **Клонирование и настройка:**
```bash
# Клонируйте репозиторий
git clone <your-repository-url>
cd test_search

# Backend
cd backend
npm install
cp env.example .env
# Отредактируйте .env
npm run build
pm2 start dist/index.js --name "backend"

# Frontend
cd ../frontend
npm install
cp env.example .env
# Отредактируйте .env
npm run build

# Копирование файлов в nginx
sudo cp -r dist/* /var/www/drag-drop-app/frontend/
```

2. **Управление процессами:**
```bash
# Статус процессов
pm2 status

# Просмотр логов
pm2 logs

# Перезапуск
pm2 restart all

# Остановка
pm2 stop all
```

## SSL сертификат (HTTPS)

### С Let's Encrypt (бесплатно):

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d yourdomain.com

# Автоматическое обновление
sudo crontab -e
# Добавьте строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

## Мониторинг и логи

### Docker
```bash
# Просмотр логов всех сервисов
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f frontend

# Статистика контейнеров
docker stats

# Очистка неиспользуемых ресурсов
docker system prune -a
```

### PM2
```bash
# Мониторинг в реальном времени
pm2 monit

# Просмотр логов
pm2 logs

# Экспорт конфигурации
pm2 save
pm2 startup
```

## Резервное копирование

### Docker
```bash
# Создание образа для бэкапа
docker-compose build
docker save drag-drop-app-backend:latest > backend-backup.tar
docker save drag-drop-app-frontend:latest > frontend-backup.tar

# Восстановление
docker load < backend-backup.tar
docker load < frontend-backup.tar
```

### PM2
```bash
# Сохранение конфигурации PM2
pm2 save
pm2 startup

# Бэкап файлов приложения
tar -czf app-backup.tar.gz /path/to/your/app
```

## Troubleshooting

### Проблемы с Docker
```bash
# Проверка статуса контейнеров
docker-compose ps

# Пересборка образов
docker-compose build --no-cache

# Очистка Docker
docker system prune -a
```

### Проблемы с PM2
```bash
# Перезапуск процессов
pm2 restart all

# Очистка логов
pm2 flush

# Удаление процессов
pm2 delete all
```

### Проблемы с nginx
```bash
# Проверка конфигурации
sudo nginx -t

# Перезапуск nginx
sudo systemctl restart nginx

# Просмотр логов
sudo tail -f /var/log/nginx/error.log
```

## Рекомендации по безопасности

1. **Измените SESSION_SECRET** на уникальное значение
2. **Настройте firewall** (ufw)
3. **Используйте HTTPS** с Let's Encrypt
4. **Регулярно обновляйте** систему и зависимости
5. **Настройте мониторинг** (например, UptimeRobot)
6. **Создавайте резервные копии** регулярно
