import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { candidateApi } from './api';
import { Candidate, InterviewResult } from './types';
import { SkillBadge, ScoreCard, LoadingSpinner, ErrorState } from './components';

export const CandidateDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRounds, setExpandedRounds] = useState<Set<number>>(new Set());

  const fetchCandidate = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError('');
      const data = await candidateApi.getCandidateById(userId);
      console.log({data})
      setCandidate(data);
    } catch (err) {
      setError('Failed to load candidate details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, [userId]);

  const toggleRound = (round: number) => {
    const newExpanded = new Set(expandedRounds);
    if (newExpanded.has(round)) {
      newExpanded.delete(round);
    } else {
      newExpanded.add(round);
    }
    setExpandedRounds(newExpanded);
  };

  const getScoreColor = (score: string) => {
    const scoreNum = parseFloat(score);
    if (scoreNum >= 8) return 'text-green-600 bg-green-50';
    if (scoreNum >= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const groupByRound = (results: InterviewResult[]) => {
    const grouped: { [key: number]: InterviewResult[] } = {};
    results?.forEach(result => {
      if (!grouped[result.round]) grouped[result.round] = [];
      grouped[result.round].push(result);
    });
    return grouped;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchCandidate} />;
  if (!candidate) return <ErrorState message="Candidate not found" />;

  const groupedResults = groupByRound(candidate.interviewResults);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/admin/candidates')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-700"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Candidates
        </button>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{candidate.name}</h1>
              <p className="text-gray-600">{candidate.experience} years experience</p>
            </div>
            <a
              href={`http://localhost:3001${candidate.resumePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            {candidate.skills?.map((skill, idx) => (
              <SkillBadge key={idx} skill={skill} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <ScoreCard title="Overall Average" score={candidate?.statistics?.avgScore || candidate.avgScore || 'N/A'} />
          {candidate.statistics?.roundScores?.map((round) => (
            <ScoreCard
              key={round.round}
              title={`Round ${round.round}`}
              score={round.avgScore}
              questionsAnswered={round.questionsAnswered}
            />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interview Results</h2>
          <div className="space-y-4">
            {Object.entries(groupedResults).map(([round, results]) => (
              <div key={round} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleRound(parseInt(round))}
                  className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    Round {round} ({results.length} questions)
                  </span>
                  <svg
                    className={`w-6 h-6 transform transition-transform ${
                      expandedRounds.has(parseInt(round)) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedRounds.has(parseInt(round)) && (
                  <div className="p-6 space-y-6">
                    {results.map((result, idx) => (
                      <div key={idx} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Q: {result.question}</h3>
                        <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded">{result.answer}</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className={`px-3 py-1 rounded-lg font-semibold ${getScoreColor(result.score)}`}>
                            Score: {result.score}
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Feedback:</span> {result.feedback}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
