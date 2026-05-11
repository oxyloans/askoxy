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
      <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <div className="h-4 w-36 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-3 h-3 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
    );
  }

  if (!status) return null;

  const percentage = (status.attemptsRemaining / status.maxAttempts) * 100;
  const color = percentage > 50 ? '#10b981' : percentage > 0 ? '#f59e0b' : '#ef4444';

  return (
    <div
      className="rounded-2xl border bg-white/85 p-4 shadow-sm backdrop-blur dark:bg-slate-900/75"
      style={{ borderColor: color + '45' }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-extrabold text-slate-900 dark:text-white">📊 Interview Attempts</span>
        <span
          className="rounded-full px-3 py-1 text-xs font-bold"
          style={{ backgroundColor: color + '18', color }}
        >
          {status.canAttempt ? 'Available' : 'Limit Reached'}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: color }} />
      </div>

      <div className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
        Used: <span className="font-extrabold" style={{ color }}>{status.attemptsUsed}/{status.maxAttempts}</span>
        {' • '}
        Remaining: <span className="font-extrabold" style={{ color }}>{status.attemptsRemaining}</span>
      </div>

      {!status.canAttempt && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          ⚠️ You have used all {status.maxAttempts} attempts.
        </div>
      )}
    </div>
  );
};
