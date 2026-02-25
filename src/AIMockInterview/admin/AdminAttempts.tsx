import React, { useEffect, useState } from 'react';
import { candidateApi } from './api';
import { Candidate } from './types';

export const AdminAttempts: React.FC = () => {
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [newLimit, setNewLimit] = useState(3);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [limitData, candidatesData] = await Promise.all([
          candidateApi.getAttemptLimit(),
          candidateApi.getCandidates()
        ]);
        setMaxAttempts(limitData.maxAttempts);
        setNewLimit(limitData.maxAttempts);
        setCandidates(candidatesData.filter(c => c.name !== 'N/A'));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateLimit = async () => {
    if (newLimit < 1) {
      alert('Limit must be at least 1');
      return;
    }
    try {
      const result = await candidateApi.updateAttemptLimit(newLimit);
      setMaxAttempts(result.maxAttempts);
      alert('Limit updated successfully');
    } catch (error) {
      alert('Failed to update limit');
    }
  };

  const handleViewUser = async (userId: string) => {
    try {
      const data = await candidateApi.getUserAttempts(userId);
      setSelectedUser(data);
    } catch (error) {
      alert('Failed to fetch user attempts');
    }
  };

  const handleResetAttempts = async (userId: string) => {
    if (!window.confirm('Reset attempts for this user?')) return;
    try {
      await fetch(`/api/admin/attempts/reset/${userId}`, { method: 'POST' });
      alert('Attempts reset successfully');
      window.location.reload();
    } catch (error) {
      alert('Failed to reset attempts');
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Attempt Management</h1>

      {/* Limit Control */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Set Maximum Attempts</h2>
        <div className="flex gap-3 items-center">
          <input
            type="number"
            min="1"
            value={newLimit}
            onChange={(e) => setNewLimit(Number(e.target.value))}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white w-24"
          />
          <button
            onClick={handleUpdateLimit}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium"
          >
            Update Limit
          </button>
          <span className="text-gray-400 text-sm">Current limit: {maxAttempts} attempts</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">User ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Used</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {candidates.map((candidate) => {
                const used = candidate.interviewResults?.length || 0;
                const remaining = maxAttempts - used;
                const canAttempt = remaining > 0;
                
                return (
                  <tr key={candidate.userId} className="hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-sm text-gray-300">{candidate.userId}</td>
                    <td className="px-4 py-3 text-sm text-white">{candidate.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{used}/{maxAttempts}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        canAttempt ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                      }`}>
                        {canAttempt ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleViewUser(candidate.userId)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleResetAttempts(candidate.userId)}
                        className="text-xs text-yellow-400 hover:text-yellow-300 font-medium"
                      >
                        Reset
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Attempts for {selectedUser.userId}
            </h3>
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {selectedUser.attempts?.length > 0 ? (
                selectedUser.attempts.map((attempt: any, idx: number) => (
                  <div key={idx} className="bg-gray-900 p-3 rounded text-sm">
                    <div className="text-gray-400">Session {idx + 1}</div>
                    <div className="text-white">{new Date(attempt.startedAt).toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-900 p-3 rounded text-sm text-gray-400">
                  No attempts yet
                </div>
              )}
            </div>
            <div className="text-sm text-gray-300 mb-4">
              Total: {selectedUser.attempts?.length || 0}/{selectedUser.maxAttempts} attempts used
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
