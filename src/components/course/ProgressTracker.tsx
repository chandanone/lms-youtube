'use client';

import { Progress } from '@/components/ui/progress';

interface ProgressTrackerProps {
  completed: number;
  total: number;
  percentage: number;
}

export default function ProgressTracker({ completed, total, percentage }: ProgressTrackerProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Progress: {completed} / {total} videos</span>
        <span className="font-semibold">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
