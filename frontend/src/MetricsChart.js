import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MetricsChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await axios.get('http://localhost:3000/metrics');
                const newEntry = {
                    time: new Date().toLocaleTimeString(),
                    reliability: res.data.reliability,
                    avgResponse: res.data.averageResponseTime,
                };
                setData(prev => [...prev.slice(-9), newEntry]);
            } catch (err) {
                console.error('Ошибка загрузки метрик:', err);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ width: '100%', height: 300, marginTop: '2em' }}>
            <h3>График надёжности и времени ответа</h3>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="reliability" stroke="#00c853" name="Надёжность (%)" />
                    <Line yAxisId="right" type="monotone" dataKey="avgResponse" stroke="#ff9800" name="Среднее время (мс)" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MetricsChart;
