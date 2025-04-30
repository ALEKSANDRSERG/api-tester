import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReliabilityStatus = () => {
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await axios.get('http://localhost:3000/metrics');
                setMetrics(res.data);
            } catch (err) {
                console.error('Ошибка при получении метрик', err);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!metrics) return <p>Загрузка метрик...</p>;

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '1em',
            maxWidth: '400px',
            backgroundColor: '#f9f9f9',
            marginTop: '1em'
        }}>
            <h2>Надёжность API</h2>
            <p><strong>Надёжность:</strong> {metrics.reliability}%</p>
            <p><strong>Среднее время ответа:</strong> {metrics.averageResponseTime} мс</p>
            <p><strong>Макс. время ответа:</strong> {metrics.maxResponseTime} мс</p>
            <p><strong>Всего запросов:</strong> {metrics.requestCount}</p>
            <p><strong>Ошибок:</strong> {metrics.errorCount}</p>
        </div>
    );
};

export default ReliabilityStatus;
