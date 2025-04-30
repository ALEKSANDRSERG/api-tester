import React, { useState } from 'react';
import MetricsChart from './MetricsChart';
import axios from "axios";
import ReliabilityStatus from './ReliabilityStatus';

function App() {
  const [metrics, setMetrics] = useState([]);
  const [apiUrl, setApiUrl] = useState('');
  const [loadCount, setLoadCount] = useState(50);
  const [loadDelay, setLoadDelay] = useState(100);
  const [currentTarget, setCurrentTarget] = useState('');

  const fetchMetrics = () => {
    axios.get('/metrics')
      .then(response => {
        setMetrics(prev => [...prev, response.data]);
      })
      .catch(error => console.error('Ошибка получения метрик:', error));
  };

  const setTargetApi = () => {
    if (!apiUrl.startsWith('http')) {
      alert('Введите корректный URL, начиная с http/https');
      return;
    }

    axios.post('/set-target', { url: apiUrl })
      .then(() => {
        setCurrentTarget(apiUrl);
        setApiUrl('');
      })
      .catch(() => alert('Ошибка при установке нового API'));
  };

  const startLoadTest = () => {
    axios.post('/load-test', {
      count: loadCount,
      delay: loadDelay
    })
      .then(() => alert(`Нагрузочное тестирование запущено: ${loadCount} запросов, задержка ${loadDelay} мс`))
      .catch((err) => {
        console.error('Ошибка запуска нагрузки:', err);
        alert('Ошибка при запуске нагрузочного теста');
      });
  };

  return (
    <div className="App" style={{ padding: '2em' }}>
      <h1>Мониторинг API</h1>

      <div style={{ marginBottom: '1em' }}>
        <input
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="https://example.com/api"
          style={{ width: '300px', marginRight: '10px' }}
        />
        <button onClick={setTargetApi}>Установить API</button>

        <div style={{ marginTop: '1em' }}>
          <label style={{ marginRight: '10px' }}>
            Кол-во:
            <input
              type="number"
              value={loadCount}
              onChange={(e) => setLoadCount(Number(e.target.value))}
              style={{ width: '70px', marginLeft: '5px' }}
            />
          </label>

          <label style={{ marginRight: '10px' }}>
            Задержка (мс):
            <input
              type="number"
              value={loadDelay}
              onChange={(e) => setLoadDelay(Number(e.target.value))}
              style={{ width: '70px', marginLeft: '5px' }}
            />
          </label>

          <button onClick={startLoadTest}>Запустить нагрузку</button>
        </div>
      </div>

      {currentTarget && <p>📡 Тестируемое API: <strong>{currentTarget}</strong></p>}

      <div style={{ marginBottom: '1em' }}>
        <button onClick={fetchMetrics}>Загрузить метрики</button>
      </div>

      <ReliabilityStatus />
      <MetricsChart metrics={metrics} />
    </div>
  );
}

export default App;
