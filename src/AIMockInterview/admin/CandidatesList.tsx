import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateApi } from './api';
import { Candidate } from './types';
import { SkillBadge, LoadingSpinner, EmptyState, ErrorState } from './components';

type SortField = 'name' | 'avgScore' | 'createdAt';

export const CandidatesList: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // const fetchCandidates = async () => {
  //   try {
  //     setLoading(true);
  //     setError('');
  //     const data = await candidateApi.getCandidates();

  //     setCandidates(data);
  //   } catch (err) {
  //     setError('Failed to load candidates');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  const fetchCandidates = async () => {
  try {
    setLoading(true);
    setError('');

    const data = await candidateApi.getCandidates();

    // Remove candidates where name is "N/A"
    const filteredData = data.filter(
      (candidate) => candidate.name !== "N/A"
    );

    setCandidates(filteredData);
  } catch (err) {
    setError('Failed to load candidates');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCandidates();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...candidates];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(c => 
        c.name?.toLowerCase().includes(term) ||
        c.skills?.some(s => s.toLowerCase().includes(term))
      );
    }

    result.sort((a, b) => {
      let aVal, bVal;
      if (sortField === 'avgScore') {
        aVal = parseFloat(a.avgScore || '0');
        bVal = parseFloat(b.avgScore || '0');
      } else if (sortField === 'createdAt') {
        aVal = new Date(a.createdAt || 0).getTime();
        bVal = new Date(b.createdAt || 0).getTime();
      } else {
        aVal = a[sortField] || '';
        bVal = b[sortField] || '';
      }
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    return result;
  }, [candidates, searchTerm, sortField, sortOrder]);

  const getRoundProgress = (candidate: Candidate) => {
    const rounds = candidate.statistics?.roundScores?.length || 0;
    return `${rounds}/3`;
  };

  const clearSearch = () => setSearchTerm('');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchCandidates} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Candidates</h1>
            <p className="text-gray-600">Manage and review candidate performance</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <div className="text-2xl font-bold text-gray-900">{filteredAndSorted.length}</div>
              <div className="text-xs text-gray-500">Total: {candidates.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg mb-6 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <select
                aria-label="Sort"
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer bg-white transition"
              >
                <option value="createdAt">Date</option>
                <option value="avgScore">Score</option>
                <option value="name">Name</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                aria-label="Toggle sort order"
              >
                <svg className={`w-5 h-5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </button>
            </div>
          </div>
          {searchTerm && (
            <div className="mt-3 text-sm text-gray-600">
              Showing <span className="font-semibold text-blue-600">{filteredAndSorted.length}</span> result{filteredAndSorted.length !== 1 ? 's' : ''} for &quot;{searchTerm}&quot;
            </div>
          )}
        </div>

        {filteredAndSorted.length === 0 ? (
          <EmptyState message={searchTerm ? "No candidates match your search" : "No candidates found"} />
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Skills</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Progress</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredAndSorted.map((candidate) => (
                    <tr
                      key={candidate.userId}
                      onClick={() => navigate(`/admin/candidate/${candidate.userId}`)}
                      className="hover:bg-blue-50 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {candidate.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition">{candidate.name || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{candidate.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills?.length ? (
                            candidate.skills.slice(0, 3).map((skill, idx) => (
                              <SkillBadge key={idx} skill={skill} />
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">No skills</span>
                          )}
                          {candidate.skills?.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                              +{candidate.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">{candidate.experience || 0} years</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-sm ${
                          parseFloat(candidate.avgScore || '0') >= 8 ? 'bg-green-100 text-green-700' :
                          parseFloat(candidate.avgScore || '0') >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {candidate.avgScore || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${((candidate.statistics?.roundScores?.length || 0) / 3) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{getRoundProgress(candidate)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
