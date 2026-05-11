import React, { useState, useEffect } from 'react';

interface LevelConfig {
  questions: number;
  time: number;
}

const levelConfig: Record<number, LevelConfig> = {
  3: { questions: 5, time: 3 },
  4: { questions: 6, time: 4 },
  5: { questions: 7, time: 5 },
  6: { questions: 8, time: 5 },
  7: { questions: 8, time: 6 },
  8: { questions: 10, time: 6 },
  9: { questions: 10, time: 7 },
  10: { questions: 12, time: 7 },
  11: { questions: 12, time: 8 },
  12: { questions: 15, time: 8 },
  13: { questions: 15, time: 9 },
  14: { questions: 18, time: 9 },
  15: { questions: 20, time: 10 }
};

export const MultiLevelSelection: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [selectedLevel, setSelectedLevel] = useState(5);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      fetch(`/api/multi-level-interview/status/${userData.id}`)
        .then(res => res.json())
        .then(setStatus);
    }
  }, []);

  const startInstant = async () => {
    if (!user || !status?.canAttempt) {
      alert('Maximum attempt limit reached');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/multi-level-interview/instant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, level: selectedLevel })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        window.location.href = `/multi-interview?session=${data.sessionId}`;
      }
    } catch (error) {
      alert('Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const percentage = status ? (status.attemptsRemaining / status.maxAttempts) * 100 : 0;
  const badgeColor = percentage > 50 ? '#10b981' : percentage > 0 ? '#f59e0b' : '#ef4444';

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-white sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold sm:text-3xl">Select Interview Level</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose your difficulty level and start an instant interview.</p>
            </div>
            <span
              className="w-fit rounded-full px-3 py-1 text-xs font-extrabold"
              style={{ backgroundColor: badgeColor + '18', color: badgeColor }}
            >
              {status?.canAttempt ? 'Available' : 'Limit Reached'}
            </span>
          </div>

          <div className="mt-5 rounded-2xl border p-4" style={{ borderColor: badgeColor + '35', backgroundColor: badgeColor + '08' }}>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="font-bold text-slate-700 dark:text-slate-200">📊 Your Interview Status</span>
              <span className="font-medium text-slate-500 dark:text-slate-400">
                Attempts: <b style={{ color: badgeColor }}>{status?.attemptsUsed}/{status?.maxAttempts}</b> used • {status?.attemptsRemaining} remaining
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[3,4,5,6,7,8,9,10,11,12,13,14,15].map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`rounded-2xl border-2 p-4 text-left transition ${selectedLevel === level ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-500/10 dark:bg-emerald-950/30 dark:text-emerald-300' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-600'}`}
              >
                <div className="font-extrabold">Level {level}</div>
                <div className="mt-1 text-xs opacity-80">{levelConfig[level].questions} Qs • {levelConfig[level].time} min</div>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
            <div className="font-extrabold">Selected: Level {selectedLevel}</div>
            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Questions: {levelConfig[selectedLevel].questions} • Time: {levelConfig[selectedLevel].time} min each
            </div>
          </div>

          <button
            onClick={startInstant}
            disabled={!status?.canAttempt || loading}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-extrabold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none"
          >
            {loading ? 'Starting...' : 'Start Instant Interview'}
          </button>
        </div>
      </div>
    </div>
  );
};
