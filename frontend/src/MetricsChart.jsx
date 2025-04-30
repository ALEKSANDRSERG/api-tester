import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const MetricsChart = ({ metrics }) => {
  return (
      <LineChart width={900} height={500} data={metrics}>
        <CartesianGrid stroke="#ccc" />
        <XAxis
            dataKey="timestamp"
            tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="requestCount" stroke="#8884d8" name="Количество запросов" />
        <Line type="monotone" dataKey="averageResponseTime" stroke="#82ca9d" name="Среднее время ответа (мс)" />
      </LineChart>
  );
};

export default MetricsChart;