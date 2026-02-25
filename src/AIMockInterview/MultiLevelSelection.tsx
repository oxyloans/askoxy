import React, { useState, useEffect } from 'react';
import { api } from './lib/api';

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
    <div className="max-w-4xl mx-auto p-6">
      {/* Attempt Status */}
      <div 
        className="mb-6 rounded-lg p-4 border"
        style={{ borderColor: badgeColor + '40', backgroundColor: badgeColor + '10' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">📊 Your Interview Status</span>
          <span 
            className="text-xs font-medium px-2 py-1 rounded"
            style={{ backgroundColor: badgeColor + '20', color: badgeColor }}
          >
            {status?.canAttempt ? 'Available' : 'Limit Reached'}
          </span>
        </div>
        <div className="text-sm text-gray-300 mt-2">
          Attempts: <span className="font-semibold" style={{ color: badgeColor }}>
            {status?.attemptsUsed}/{status?.maxAttempts}
          </span> used • {status?.attemptsRemaining} remaining
        </div>
      </div>

      {/* Level Selection */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Select Interview Level</h2>
        
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[3,4,5,6,7,8,9,10,11,12,13,14,15].map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`p-4 rounded-lg border-2 transition font-medium ${
                selectedLevel === level
                  ? 'border-emerald-500 bg-emerald-900/30 text-emerald-400'
                  : 'border-gray-600 bg-gray-900 text-gray-300 hover:border-gray-500'
              }`}
            >
              Level {level}
            </button>
          ))}
        </div>

        {/* Selected Level Info */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6">
          <div className="text-white font-semibold mb-2">Selected: Level {selectedLevel}</div>
          <div className="text-sm text-gray-400">
            Questions: {levelConfig[selectedLevel].questions} • 
            Time: {levelConfig[selectedLevel].time} min each
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={startInstant}
            disabled={!status?.canAttempt || loading}
            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
          >
            {loading ? 'Starting...' : 'Start Instant Interview'}
          </button>
        </div>
      </div>
    </div>
  );
};
