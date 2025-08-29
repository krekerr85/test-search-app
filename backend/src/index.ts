import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemsRouter from './routes/items';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3001;
const NODE_ENV = process.env['NODE_ENV'] || 'development';
const CORS_ORIGIN = process.env['CORS_ORIGIN'] || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: NODE_ENV === 'production' ? CORS_ORIGIN : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Логирование запросов
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Маршруты
app.use('/api/items', itemsRouter);

// Базовый маршрут для проверки здоровья сервера
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    message: 'Backend API работает корректно'
  });
});

// Обработка 404
app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработка ошибок
app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Ошибка сервера:', error);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Backend сервер запущен на порту ${PORT}`);
  console.log(`📱 API доступен по адресу http://localhost:${PORT}/api`);
  console.log(`🔍 Проверка здоровья: http://localhost:${PORT}/health`);
});

export default app;
