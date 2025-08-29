# Drag & Drop List Application

Веб-приложение с функциональностью drag & drop для списка элементов с поиском, пагинацией и сохранением состояния.

## Технологии

### Frontend
- React 18 + TypeScript
- Vite
- @tanstack/react-query
- @dnd-kit (drag & drop)
- Axios

### Backend
- Node.js + Express
- TypeScript
- CORS
- In-memory state management

## Быстрый старт

### Разработка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd test_search
```

2. Установите зависимости:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Создайте файлы переменных окружения:
```bash
# Backend
cd ../backend
cp env.example .env

# Frontend
cd ../frontend
cp env.example .env
```

4. Запустите в режиме разработки:
```bash
# Backend (в одном терминале)
cd backend
npm run dev

# Frontend (в другом терминале)
cd frontend
npm run dev
```

### Продакшен с Docker

1. Создайте файл `.env` в корне проекта:
```bash
cp env.example .env
```

2. Запустите с Docker Compose:
```bash
docker-compose up --build
```

Приложение будет доступно по адресу: http://localhost:3000

## API Endpoints

### Items
- `GET /api/items` - Получить список элементов с пагинацией
- `GET /api/items/state` - Получить состояние пользователя
- `POST /api/items/select` - Обновить выбранные элементы
- `POST /api/items/reorder` - Изменить порядок элементов
- `GET /api/items/count` - Получить общее количество элементов

### Health Check
- `GET /health` - Проверка состояния сервера

## Переменные окружения

### Backend
- `NODE_ENV` - Окружение (development/production)
- `PORT` - Порт сервера (по умолчанию: 3001)
- `SESSION_SECRET` - Секрет для сессий
- `CORS_ORIGIN` - Разрешенные домены для CORS

### Frontend
- `VITE_API_URL` - URL API бэкенда
- `VITE_APP_NAME` - Название приложения

## Деплой

### Вариант 1: Docker (Рекомендуется)

1. **Подготовка сервера:**
```bash
# Установите Docker и Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

2. **Деплой:**
```bash
# Клонируйте репозиторий на сервер
git clone <repository-url>
cd test_search

# Создайте .env файл
cp env.example .env
# Отредактируйте .env для продакшена

# Запустите
docker-compose up -d --build
```

### Вариант 2: Git + PM2

1. **Подготовка сервера:**
```bash
# Установите Node.js, PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2
```

2. **Деплой:**
```bash
# Клонируйте репозиторий
git clone <repository-url>
cd test_search

# Backend
cd backend
npm install
npm run build
pm2 start dist/index.js --name "backend"

# Frontend
cd ../frontend
npm install
npm run build
# Настройте nginx для раздачи статических файлов
```

## Мониторинг

### Docker
```bash
# Просмотр логов
docker-compose logs -f

# Статус контейнеров
docker-compose ps

# Перезапуск
docker-compose restart
```

### PM2
```bash
# Статус процессов
pm2 status

# Просмотр логов
pm2 logs

# Перезапуск
pm2 restart all
```

## Структура проекта

```
test_search/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── routes/         # API маршруты
│   │   ├── services/       # Бизнес-логика
│   │   └── types/          # TypeScript типы
│   ├── Dockerfile
│   └── package.json
├── frontend/               # Frontend приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── hooks/          # React Query хуки
│   │   └── types/          # TypeScript типы
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml      # Docker Compose конфигурация
├── .gitignore
└── README.md
```

## Рекомендации по деплою

**Для продакшена рекомендуется использовать Docker**, так как:

1. **Простота развертывания** - все зависимости и конфигурация упакованы в контейнеры
2. **Изоляция** - приложения работают в изолированной среде
3. **Масштабируемость** - легко масштабировать и балансировать нагрузку
4. **Версионирование** - четкое управление версиями приложения
5. **Воспроизводимость** - одинаковое поведение на всех окружениях

**Git + PM2 подходит для:**
- Простых проектов
- Когда нужен полный контроль над сервером
- Для обучения и понимания процесса деплоя

## Troubleshooting

### Проблемы с Docker
```bash
# Очистка Docker
docker system prune -a

# Пересборка образов
docker-compose build --no-cache
```

### Проблемы с CORS
Убедитесь, что `CORS_ORIGIN` в `.env` файле соответствует домену фронтенда.

### Проблемы с портами
Проверьте, что порты 3000 и 3001 не заняты другими приложениями.
