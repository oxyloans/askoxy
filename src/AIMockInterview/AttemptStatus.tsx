import React, { useEffect, useState } from 'react';
import { api } from './lib/api';

interface AttemptStatusProps {
  userId: string;
  onStatusChange?: (canAttempt: boolean) => void;
}

export const AttemptStatus: React.FC<AttemptStatusProps> = ({ userId, onStatusChange }) => {
  const [status, setStatus] = useState<{
    canAttempt: boolean;
    attemptsUsed: number;
    attemptsRemaining: number;
    maxAttempts: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await api.getAttemptStatus(userId);
        setStatus(data);
        onStatusChange?.(data.canAttempt);
      } catch (error) {
        console.error('Failed to fetch attempt status:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [userId, onStatusChange]);

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-24"></div>
      </div>
    );
  }

  if (!status) return null;

  const percentage = (status.attemptsRemaining / status.maxAttempts) * 100;
  const color = percentage > 50 ? '#10b981' : percentage > 0 ? '#f59e0b' : '#ef4444';

  return (
    <div 
      className="bg-gray-800 border rounded-lg p-4"
      style={{ borderColor: color + '40' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-white">📊 Interview Attempts</span>
        <span 
          className="text-xs font-medium px-2 py-1 rounded"
          style={{ 
            backgroundColor: color + '20',
            color: color
          }}
        >
          {status.canAttempt ? 'Available' : 'Limit Reached'}
        </span>
      </div>
      <div className="text-sm text-gray-300">
        Used: <span className="font-semibold" style={{ color }}>{status.attemptsUsed}/{status.maxAttempts}</span>
        {' • '}
        Remaining: <span className="font-semibold" style={{ color }}>{status.attemptsRemaining}</span>
      </div>
      {!status.canAttempt && (
        <div className="mt-2 text-xs text-red-400 bg-red-900/20 border border-red-800 rounded p-2">
          ⚠️ You have used all {status.maxAttempts} attempts
        </div>
      )}
    </div>
  );
};
