'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface SpendingPoint {
  date: string;
  spending: number;
  incidents: number;
}

interface SpendingIncidentChartProps {
  data: SpendingPoint[];
}

export default function SpendingIncidentChart({ data }: SpendingIncidentChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="date" tick={{ fill: '#888' }} />
          <YAxis yAxisId="left" tick={{ fill: '#888' }} />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#888' }}
          />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="spending"
            stroke="#8884d8"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="incidents"
            stroke="#82ca9d"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
