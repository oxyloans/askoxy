import React, { useState } from 'react';
import { AdminAttempts } from './AdminAttempts';
import { CandidatesList } from './CandidatesList';
import { AdminAnalytics } from './AdminAnalytics';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'attempts' | 'analytics'>('candidates');

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-bold text-white mb-4">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'candidates'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Candidates
          </button>
          <button
            onClick={() => setActiveTab('attempts')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'attempts'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Attempt Management
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'analytics'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Analytics
          </button>
        </div>
      </header>
      {activeTab === 'candidates' ? <CandidatesList /> : activeTab === 'attempts' ? <AdminAttempts /> : <AdminAnalytics />}
    </div>
  );
};
