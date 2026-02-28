'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface TrendPoint {
  date: string;
  [key: string]: number | string;
}

interface TrendChartProps {
  data: TrendPoint[];
  dataKey?: string; // defaults to value
  strokeColor?: string;
}

export default function TrendChart({
  data,
  dataKey = 'value',
  strokeColor = '#4caf50',
}: TrendChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="date" tick={{ fill: '#888' }} />
          <YAxis tick={{ fill: '#888' }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
