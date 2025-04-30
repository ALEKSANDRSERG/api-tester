const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { collectMetrics, getMetrics, updateMetrics } = require('./metrics');

const app = express();
const PORT = 3000;

let targetUrl = 'https://api.github.com'; // стартовое значение

// Middleware
app.use(cors());
app.use(express.json()); // чтобы читать req.body
app.use(collectMetrics); // собираем базовые метрики при обращении к самому серверу

// 🔧 Установить новое целевое API
app.post('/set-target', (req, res) => {
  const { url } = req.body;
  try {
    new URL(url); // проверка, что строка — валидный URL
    if (!url.startsWith('http')) {
      return res.status(400).json({ error: 'URL должен начинаться с http/https' });
    }
    targetUrl = url;
    console.log(`🛰 Целевое API установлено: ${targetUrl}`);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ error: 'Некорректный URL' });
  }
});

// 🚀 Запустить нагрузочное тестирование
app.post('/load-test', async (req, res) => {
  const { count = 20, delay = 100 } = req.body;

  if (typeof count !== 'number' || typeof delay !== 'number') {
    return res.status(400).json({ error: 'Параметры должны быть числами' });
  }

  console.log(`🚀 Нагрузка: ${count} запросов к ${targetUrl} с задержкой ${delay}мс`);

  for (let i = 0; i < count; i++) {
    setTimeout(async () => {
      const start = Date.now();
      try {
        const response = await axios.get(targetUrl);
        const duration = Date.now() - start;
        updateMetrics(duration, response.status);
        console.log(`[✓] ${i + 1}/${count}: ${duration}мс`);
      } catch (err) {
        const duration = Date.now() - start;
        updateMetrics(duration, err.response?.status || 500);
        console.warn(`[✗] ${i + 1}/${count}: Ошибка`);
      }
    }, i * delay);
  }

  res.json({ started: true, count, delay });
});

// 🔁 Тестовый одиночный запрос — вызывается автоматически каждые 5 сек
app.get('/test-api', async (req, res) => {
  const start = Date.now();
  try {
    const response = await axios.get(targetUrl);
    const duration = Date.now() - start;
    updateMetrics(duration, response.status);
    res.status(200).json({ data: response.data });
  } catch (error) {
    const duration = Date.now() - start;
    updateMetrics(duration, error.response?.status || 500);
    res.status(500).json({ error: 'Ошибка запроса', details: error.message });
  }
});

// 📊 Вернуть текущие метрики
app.get('/metrics', getMetrics);

// ▶️ Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});

// ⏱ Автоматический опрос API каждую 5 сек
setInterval(() => {
  axios.get(`http://localhost:${PORT}/test-api`)
    .then(() => console.log(`[✓] Автопинг: ${targetUrl}`))
    .catch(() => console.warn(`[!] Целевое API не отвечает: ${targetUrl}`));
}, 5000);
