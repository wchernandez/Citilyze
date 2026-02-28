interface RiskAlertCardProps {
  message: string;
  level: 'low' | 'medium' | 'high';
}

export default function RiskAlertCard({ message, level }: RiskAlertCardProps) {
  const color =
    level === 'high' ? 'bg-red-500' : level === 'medium' ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="flex items-center bg-white dark:bg-gray-800 shadow rounded p-3">
      <span className={`${color} w-3 h-3 rounded-full mr-2`} />
      <p className="text-sm text-gray-700 dark:text-gray-200">{message}</p>
    </div>
  );
}
