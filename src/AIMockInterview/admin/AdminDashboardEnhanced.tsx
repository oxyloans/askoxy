import React, { useState } from 'react';
import { AdminAttempts } from './AdminAttempts';
import { CandidatesList } from './CandidatesList';
import { AdminAnalyticsEnhanced } from './AdminAnalyticsEnhanced';
import { AdminTemplates } from './AdminTemplates';
import { AdminLiveMonitor } from './AdminLiveMonitor';
import { InterviewConfig } from './InterviewConfig';

export const AdminDashboardEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'attempts' | 'analytics' | 'templates' | 'live' | 'config'>('candidates');

  const tabs = [
    { id: 'candidates', label: 'Candidates', icon: '👥' },
    { id: 'live', label: 'Live Monitor', icon: '📡' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'config', label: 'Interview Settings', icon: '⚙️' },
    { id: 'templates', label: 'Templates', icon: '📋' },
    { id: 'attempts', label: 'Attempts', icon: '🔢' }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 sticky top-0 z-40">
        <h1 className="text-xl font-bold text-white mb-4">Admin Dashboard</h1>
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main>
        {activeTab === 'candidates' && <CandidatesList />}
        {activeTab === 'live' && <AdminLiveMonitor />}
        {activeTab === 'analytics' && <AdminAnalyticsEnhanced />}
        {activeTab === 'config' && <InterviewConfig />}
        {activeTab === 'templates' && <AdminTemplates />}
        {activeTab === 'attempts' && <AdminAttempts />}
      </main>
    </div>
  );
};
