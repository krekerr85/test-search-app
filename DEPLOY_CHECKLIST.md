# ✅ Чек-лист деплоя в продакшен

## 🚀 Быстрый старт (5 минут)

### 1. Подготовка сервера
```bash
# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Клонирование проекта
```bash
git clone <your-repo-url> /opt/test_search
cd /opt/test_search
```

### 3. Настройка переменных
```bash
cp env.example .env
nano .env  # Отредактируйте для продакшена
```

### 4. Запуск
```bash
# Для простого деплоя (без SSL)
docker-compose up -d --build

# Для продакшена с SSL
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📋 Полный чек-лист

### ✅ Предварительные требования
- [ ] Сервер Ubuntu/Debian
- [ ] Домен (для SSL)
- [ ] SSH доступ к серверу
- [ ] Git репозиторий с кодом

### ✅ Установка зависимостей
- [ ] Docker установлен
- [ ] Docker Compose установлен
- [ ] Пользователь добавлен в группу docker
- [ ] Система обновлена

### ✅ Настройка проекта
- [ ] Проект склонирован
- [ ] .env файл создан и настроен
- [ ] nginx.prod.conf отредактирован (домен)
- [ ] SSL сертификаты получены (если нужно)

### ✅ Запуск приложения
- [ ] Frontend собран локально
- [ ] Docker образы собраны
- [ ] Контейнеры запущены
- [ ] Порты 80/443 открыты

### ✅ Проверка работы
- [ ] Frontend доступен
- [ ] API отвечает
- [ ] SSL работает (если настроен)
- [ ] Логи без ошибок

### ✅ Безопасность
- [ ] Firewall настроен
- [ ] Прямой доступ к backend заблокирован
- [ ] SSL сертификат действителен
- [ ] Security headers работают

### ✅ Мониторинг
- [ ] Логи настроены
- [ ] Автообновление SSL настроено
- [ ] Мониторинг ресурсов работает

## 🔧 Команды для проверки

```bash
# Статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Логи
docker-compose -f docker-compose.prod.yml logs -f

# Доступность
curl -I https://yourdomain.com
curl -I https://yourdomain.com/api/health

# Ресурсы
docker stats
df -h
free -h
```

## 🆘 Быстрое решение проблем

### Проблема: Порт занят
```bash
sudo netstat -tulpn | grep :80
sudo systemctl stop nginx  # если конфликт
```

### Проблема: SSL не работает
```bash
sudo certbot renew
docker-compose -f docker-compose.prod.yml restart nginx
```

### Проблема: Приложение не запускается
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🎯 Результат

После выполнения всех пунктов:
- ✅ Приложение работает на `https://yourdomain.com`
- ✅ API доступен на `https://yourdomain.com/api`
- ✅ SSL сертификат активен
- ✅ Безопасность настроена
- ✅ Мониторинг работает

**Проект готов к использованию!** 🚀
