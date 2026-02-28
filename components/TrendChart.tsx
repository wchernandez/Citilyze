'use client';

import { memo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from '../types';

interface TrendChartProps {
  data: ChartDataPoint[];
  dataKey?: string;
  strokeColor?: string;
  height?: number;
}

/**
 * Reusable trend chart component.
 * Memoized to prevent unnecessary Recharts re-renders.
 */
const TrendChart = memo(function TrendChart({
  data,
  dataKey = 'value',
  strokeColor = '#4caf50',
  height = 256,
}: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="bg-white dark:bg-gray-800 shadow rounded p-4 flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-4" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 12 }} />
          <YAxis tick={{ fill: '#888', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #4b5563',
              borderRadius: '4px',
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default TrendChart;
