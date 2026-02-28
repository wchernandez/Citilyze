import { memo } from 'react';
import type { AlertLevel } from '../types';
import { getAlertColor } from '../lib/utils';

interface RiskAlertCardProps {
  message: string;
  level: AlertLevel;
}

/**
 * Displays a risk alert with color-coded severity.
 * Memoized to prevent unnecessary re-renders.
 */
const RiskAlertCard = memo(function RiskAlertCard({
  message,
  level,
}: RiskAlertCardProps) {
  const color = getAlertColor(level);

  return (
    <div className="flex items-center bg-white dark:bg-gray-800 shadow rounded p-3">
      <span className={`${color} w-3 h-3 rounded-full mr-2 flex-shrink-0`} />
      <p className="text-sm text-gray-700 dark:text-gray-200">{message}</p>
    </div>
  );
});

export default RiskAlertCard;
