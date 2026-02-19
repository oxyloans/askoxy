import React from 'react';

interface SkillBadgeProps {
  skill: string;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => (
  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
    {skill}
  </span>
);

interface ScoreCardProps {
  title: string;
  score: string;
  questionsAnswered?: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, questionsAnswered }) => {
  const scoreNum = parseFloat(score || '0');
  const bgColor = scoreNum >= 8 ? 'bg-green-50 border-green-200' : scoreNum >= 5 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';
  const textColor = scoreNum >= 8 ? 'text-green-700' : scoreNum >= 5 ? 'text-yellow-700' : 'text-red-700';

  return (
    <div className={`p-4 rounded-lg border-2 ${bgColor}`}>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className={`text-3xl font-bold ${textColor}`}>{score || 'N/A'}</p>
      {questionsAnswered && (
        <p className="text-xs text-gray-500 mt-1">{questionsAnswered} questions</p>
      )}
    </div>
  );
};

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <p className="mt-4 text-gray-600">{message}</p>
  </div>
);

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
    <p className="text-lg">{message}</p>
  </div>
);

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-red-600">
    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p className="text-lg mb-4">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Retry
      </button>
    )}
  </div>
);
