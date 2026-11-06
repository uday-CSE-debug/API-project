import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'emerald' | 'amber';
}

export default function ProgressBar({
  percentage,
  showText = true,
  size = 'md',
  color = 'blue',
}: ProgressBarProps) {
  const boundedPercentage = Math.min(100, Math.max(0, percentage));

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-3',
    lg: 'h-5',
  }[size];

  const colorClass = {
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
  }[color];

  return (
    <div className="w-full">
      {showText && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
          <span className="text-gray-600">Course Progress</span>
          <span className="text-blue-600 font-bold">{boundedPercentage}% Completed</span>
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${heightClass} shadow-inner`}>
        <div
          className={`${colorClass} ${heightClass} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${boundedPercentage}%` }}
        />
      </div>
    </div>
  );
}
