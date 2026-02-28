interface ScoreCardProps {
  title: string;
  score: number;
  max?: number;
}

export default function ScoreCard({ title, score, max = 100 }: ScoreCardProps) {
  const percentage = Math.round((score / max) * 100);
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-4">
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h2>
      <p className="mt-2 text-3xl font-semibold">
        {score}
        <span className="text-lg text-gray-500">/{max}</span>
      </p>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mt-3">
        <div
          className="h-full bg-green-500 rounded"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
