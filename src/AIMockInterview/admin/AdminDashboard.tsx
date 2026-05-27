import React, { useState } from 'react';
import { AdminAttempts } from './AdminAttempts';
import { CandidatesList } from './CandidatesList';
import { AdminAnalytics } from './AdminAnalytics';
import { InterviewConfig } from './InterviewConfig';

type Tab = 'candidates' | 'attempts' | 'analytics' | 'round-settings';

const NAV: { key: Tab; label: string; icon: React.ReactNode }[] = [
  {
    key: 'candidates',
    label: 'Candidates',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'round-settings',
    label: 'Round Settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'attempts',
    label: 'Attempt Management',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    key: 'analytics',
    label: 'Analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export const AdminDashboard: React.FC = () => {
  const [active, setActive] = useState<Tab>('candidates');

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
      {/* ── Top Bar ── */}
      <header className="bg-[#232f3e] h-14 flex items-center px-6 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#ff9900] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">AI Mock Interview</span>
          <span className="text-[#aab7c4] text-xs">/ Admin</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#ff9900] flex items-center justify-center text-white text-xs font-bold">A</div>
          <span className="text-[#aab7c4] text-xs hidden md:block">Admin</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
          <div className="px-4 py-5 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</p>
          </div>
          <nav className="flex-1 py-3">
            {NAV.map(item => (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                  active === item.key
                    ? 'bg-[#fff8ec] text-[#c45500] border-r-2 border-[#ff9900]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={active === item.key ? 'text-[#ff9900]' : 'text-gray-400'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">AI Interview Portal</p>
            <p className="text-xs text-gray-300 mt-0.5">v1.0</p>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Admin</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-medium capitalize">{active === 'round-settings' ? 'Round Settings' : active.replace('-', ' ')}</span>
            </div>
          </div>

          {active === 'candidates' && <CandidatesList />}
          {active === 'round-settings' && <InterviewConfig />}
          {active === 'attempts' && <AdminAttempts />}
          {active === 'analytics' && <AdminAnalytics />}
        </main>
      </div>
    </div>
  );
};
