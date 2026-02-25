import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface ResultsData {
  results: any[];
  state: any;
  session: any;
  roundStats: any[];
  overallAvg: string;
}

export const ResultsDashboard: React.FC = () => {
  const { userId, sessionId } = useParams();
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/interview/results/${userId}/${sessionId}`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [userId, sessionId]);

  if (loading) return <div className="p-6 text-white">Loading results...</div>;
  if (!data) return <div className="p-6 text-red-400">No results found</div>;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400 bg-green-900/30';
    if (score >= 5) return 'text-yellow-400 bg-yellow-900/30';
    return 'text-red-400 bg-red-900/30';
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-white mb-2">Interview Results</h1>
          <p className="text-gray-400">Session: {sessionId}</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Overall Score</div>
            <div className="text-3xl font-bold text-emerald-400">{data.overallAvg}%</div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Questions Answered</div>
            <div className="text-3xl font-bold text-white">{data.results.length}</div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Rounds Completed</div>
            <div className="text-3xl font-bold text-white">{data.state?.round || 0}</div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Status</div>
            <div className="text-xl font-bold text-emerald-400">{data.session?.status || 'Completed'}</div>
          </div>
        </div>

        {/* Round Performance */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Round Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.roundStats.map(stat => (
              <div key={stat.round} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-semibold">Round {stat.round}</span>
                  <span className={`px-3 py-1 rounded text-sm font-bold ${getScoreColor(parseFloat(stat.avgScore))}`}>
                    {stat.avgScore}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Questions:</span>
                    <span className="text-white">{stat.questionsAnswered}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Max Score:</span>
                    <span className="text-green-400">{stat.maxScore}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Min Score:</span>
                    <span className="text-red-400">{stat.minScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Question-by-Question Breakdown</h2>
          <div className="space-y-4">
            {data.results.map((result, idx) => (
              <div key={idx} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold">Q{idx + 1}</span>
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Round {result.round}</span>
                  </div>
                  {result.score && (
                    <span className={`px-3 py-1 rounded text-sm font-bold ${getScoreColor(parseFloat(result.score))}`}>
                      {parseFloat(result.score).toFixed(1)}/10
                    </span>
                  )}
                </div>
                <div className="text-white text-sm mb-2 font-medium">{result.question}</div>
                {result.answer && (
                  <div className="bg-gray-800 rounded p-3 mb-2">
                    <div className="text-xs text-gray-400 mb-1">Your Answer:</div>
                    <div className="text-gray-300 text-sm">{result.answer}</div>
                  </div>
                )}
                {result.feedback && (
                  <div className="bg-emerald-900/20 rounded p-3 border border-emerald-500/30">
                    <div className="text-xs text-emerald-400 mb-1">Feedback:</div>
                    <div className="text-gray-300 text-sm">{result.feedback}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
          >
            Download PDF
          </button>
          <button
            onClick={() => window.location.href = '/interview'}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
