# 🚀 Пошаговый деплой в продакшен

## ✅ Проверка готовности проекта

Проект полностью готов к продакшену:
- ✅ Docker конфигурации настроены
- ✅ Nginx reverse proxy настроен
- ✅ SSL поддержка готова
- ✅ Environment переменные настроены
- ✅ Все зависимости установлены
- ✅ Git репозиторий готов

## 📋 Пошаговый деплой

### Шаг 1: Подготовка сервера

```bash
# Подключитесь к серверу
ssh user@your-server-ip

# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установите Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Перезагрузитесь для применения изменений
sudo reboot
```

### Шаг 2: Настройка домена (если есть)

```bash
# Установите Certbot для SSL сертификатов
sudo apt install certbot python3-certbot-nginx

# Получите SSL сертификат
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Скопируйте сертификаты в проект
sudo mkdir -p /opt/test_search/ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /opt/test_search/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /opt/test_search/ssl/key.pem
sudo chown -R $USER:$USER /opt/test_search/ssl
```

### Шаг 3: Клонирование и настройка проекта

```bash
# Клонируйте репозиторий
git clone <your-repository-url> /opt/test_search
cd /opt/test_search

# Создайте .env файл для продакшена
cp env.example .env
nano .env
```

**Содержимое .env для продакшена:**
```env
# Backend Configuration
NODE_ENV=production
PORT=3001
SESSION_SECRET=your-very-secure-random-secret-key-here
CORS_ORIGIN=https://yourdomain.com

# Frontend Configuration
VITE_API_URL=https://yourdomain.com/api
VITE_APP_NAME=Drag & Drop List
```

### Шаг 4: Настройка Nginx конфигурации

```bash
# Отредактируйте nginx.prod.conf
nano nginx.prod.conf
```

**Замените `yourdomain.com` на ваш домен в файле `nginx.prod.conf`**

### Шаг 5: Сборка и запуск

```bash
# Соберите frontend локально (для ускорения)
cd frontend
npm install
npm run build
cd ..

# Запустите с продакшен конфигурацией
docker-compose -f docker-compose.prod.yml up -d --build
```

### Шаг 6: Проверка работы

```bash
# Проверьте статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Проверьте логи
docker-compose -f docker-compose.prod.yml logs -f

# Проверьте доступность
curl -I https://yourdomain.com
curl -I https://yourdomain.com/api/health
```

## 🔧 Управление в продакшене

### Команды управления:

```bash
# Остановка
docker-compose -f docker-compose.prod.yml down

# Запуск
docker-compose -f docker-compose.prod.yml up -d

# Пересборка
docker-compose -f docker-compose.prod.yml up -d --build

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f

# Просмотр логов конкретного сервиса
docker-compose -f docker-compose.prod.yml logs -f nginx
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Мониторинг:

```bash
# Статистика контейнеров
docker stats

# Использование диска
df -h

# Использование памяти
free -h

# Проверка портов
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

## 🔄 Обновление приложения

```bash
# Остановите приложение
docker-compose -f docker-compose.prod.yml down

# Получите обновления
git pull origin master

# Пересоберите и запустите
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🔒 Безопасность

### Настройка firewall:

```bash
# Установите ufw
sudo apt install ufw

# Настройте правила
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw deny 3001/tcp   # Блокируйте прямой доступ к backend

# Включите firewall
sudo ufw enable
```

### Автоматическое обновление SSL:

```bash
# Добавьте в crontab
sudo crontab -e

# Добавьте строку:
0 12 * * * /usr/bin/certbot renew --quiet && docker-compose -f /opt/test_search/docker-compose.prod.yml restart nginx
```

## 🆘 Troubleshooting

### Проблемы с SSL:
```bash
# Проверьте сертификаты
sudo certbot certificates

# Обновите сертификаты
sudo certbot renew

# Перезапустите nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Проблемы с портами:
```bash
# Проверьте занятые порты
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Остановите конфликтующие сервисы
sudo systemctl stop nginx  # если установлен системный nginx
```

### Проблемы с Docker:
```bash
# Очистка Docker
docker system prune -a

# Пересборка образов
docker-compose -f docker-compose.prod.yml build --no-cache
```

## 📊 Мониторинг и логи

### Логи приложения:
```bash
# Все логи
docker-compose -f docker-compose.prod.yml logs -f

# Логи nginx
docker-compose -f docker-compose.prod.yml logs -f nginx

# Логи backend
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Мониторинг ресурсов:
```bash
# Статистика контейнеров
docker stats

# Использование диска
du -sh /opt/test_search
```

## 🎯 Результат

После успешного деплоя:
- **Фронтенд:** `https://yourdomain.com`
- **API:** `https://yourdomain.com/api`
- **Health check:** `https://yourdomain.com/api/health`
- **Автоматический редирект:** HTTP → HTTPS
- **SSL сертификат:** Let's Encrypt
- **Rate limiting:** Защита от DDoS
- **Security headers:** Дополнительная безопасность

Проект готов к использованию в продакшене! 🚀
