'use client';

import { memo } from 'react';
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
import type { SpendingPoint } from '../types';

interface SpendingIncidentChartProps {
  data: SpendingPoint[];
  height?: number;
}

/**
 * Dual-axis chart for spending vs incidents.
 * Memoized to prevent unnecessary Recharts re-renders.
 */
const SpendingIncidentChart = memo(function SpendingIncidentChart({
  data,
  height = 256,
}: SpendingIncidentChartProps) {
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
          <YAxis yAxisId="left" tick={{ fill: '#888', fontSize: 12 }} />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#888', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #4b5563',
              borderRadius: '4px',
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="spending"
            stroke="#8884d8"
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="incidents"
            stroke="#82ca9d"
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default SpendingIncidentChart;
