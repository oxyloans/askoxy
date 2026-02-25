import React, { useEffect, useState } from 'react';

export const AdminAnalyticsEnhanced: React.FC = () => {
  const [funnel, setFunnel] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    const [funnelRes, trendsRes, skillsRes] = await Promise.all([
      fetch('/api/admin/analytics/funnel'),
      fetch(`/api/admin/analytics/trends?days=${days}`),
      fetch('/api/admin/analytics/skills')
    ]);
    
    setFunnel(await funnelRes.json());
    setTrends(await trendsRes.json());
    setSkills(await skillsRes.json());
  };

  const calculateRate = (current: number, total: number) => {
    return total > 0 ? ((current / total) * 100).toFixed(1) : '0';
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <select
            value={days}
            onChange={e => setDays(parseInt(e.target.value))}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Funnel */}
        {funnel && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Candidate Funnel</h2>
            <div className="space-y-4">
              {[
                { label: 'Started Interview', count: funnel.started, color: 'bg-blue-600' },
                { label: 'Completed Round 1', count: funnel.round1Pass, color: 'bg-emerald-600' },
                { label: 'Completed Round 2', count: funnel.round2Pass, color: 'bg-teal-600' },
                { label: 'Completed Round 3', count: funnel.round3Pass, color: 'bg-green-600' },
                { label: 'Fully Completed', count: funnel.completed, color: 'bg-purple-600' }
              ].map((stage, idx) => {
                const percentage = calculateRate(stage.count, funnel.started);
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">{stage.label}</span>
                      <span className="text-white font-bold">{stage.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className={`${stage.color} h-3 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Trends */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Daily Trends</h2>
          {trends.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 text-sm py-3">Date</th>
                    <th className="text-right text-gray-400 text-sm py-3">Candidates</th>
                    <th className="text-right text-gray-400 text-sm py-3">Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {trends.map((trend, idx) => (
                    <tr key={idx} className="border-b border-gray-700/50">
                      <td className="text-white text-sm py-3">
                        {new Date(trend.date).toLocaleDateString()}
                      </td>
                      <td className="text-right text-white text-sm py-3">{trend.candidates}</td>
                      <td className="text-right text-emerald-400 text-sm py-3 font-bold">
                        {parseFloat(trend.avg_score || 0).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-8">No data available</div>
          )}
        </div>

        {/* Skills Performance */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Top Skills Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.slice(0, 9).map((skill, idx) => (
              <div key={idx} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-white font-medium text-sm">{skill.skill}</span>
                  <span className="text-xs text-gray-400">{skill.usage_count} uses</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-emerald-400">
                    {parseFloat(skill.avg_score || 0).toFixed(1)}
                  </span>
                  <span className="text-gray-400 text-sm mb-1">/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export */}
        <div className="flex gap-4">
          <button
            onClick={() => window.location.href = '/api/admin/export/candidates'}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
          >
            Export All Candidates (CSV)
          </button>
        </div>
      </div>
    </div>
  );
};
