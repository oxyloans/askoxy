import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateApi } from './api';
import { Candidate } from './types';
import { LoadingSpinner, EmptyState, ErrorState } from './components';
import { AdvancedFilter } from './AdvancedFilter';

type SortField = 'name' | 'bestScore' | 'createdAt';

export const CandidatesList: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchCandidates = async () => {
    try {
      setLoading(true); setError('');
      const data = await candidateApi.getCandidates();
      setCandidates(data.filter(c => c.name !== 'N/A'));
    } catch { setError('Failed to load candidates'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCandidates(); }, []);

  const list = useMemo(() => {
    let r = [...candidates];
    if (search.trim()) {
      const t = search.toLowerCase();
      r = r.filter(c => c.name?.toLowerCase().includes(t) || c.skills?.some(s => s.toLowerCase().includes(t)));
    }
    r.sort((a, b) => {
      let av: any, bv: any;
      if (sortField === 'bestScore') { av = parseFloat(a.summary?.bestScore || '0'); bv = parseFloat(b.summary?.bestScore || '0'); }
      else if (sortField === 'createdAt') { av = new Date(a.createdAt || 0).getTime(); bv = new Date(b.createdAt || 0).getTime(); }
      else { av = a.name || ''; bv = b.name || ''; }
      return sortOrder === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return r;
  }, [candidates, search, sortField, sortOrder]);

  const scoreBg = (s: string) => {
    const n = parseFloat(s || '0');
    if (n >= 60) return 'bg-[#d4edda] text-[#155724]';
    if (n >= 40) return 'bg-[#fff3cd] text-[#856404]';
    return 'bg-[#f8d7da] text-[#721c24]';
  };

  const resultBg = (r: string) => {
    if (r === 'Selected') return 'bg-[#d4edda] text-[#155724] border-[#c3e6cb]';
    if (r === 'Not Selected') return 'bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]';
    return 'bg-[#e2e3e5] text-[#383d41] border-[#d6d8db]';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchCandidates} />;

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and review all interview candidates
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Candidates', value: candidates.length, color: 'text-gray-900' },
          { label: 'Showing', value: list.length, color: 'text-[#0066c0]' },
          { label: 'Selected', value: candidates.filter(c => c.summary?.bestResult === 'Selected').length, color: 'text-[#007600]' },
          { label: 'Not Selected', value: candidates.filter(c => c.summary?.bestResult === 'Not Selected').length, color: 'text-[#c40000]' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-lg border border-gray-200 px-4 py-3 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search candidates by name or skill..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#ff9900] focus:ring-1 focus:ring-[#ff9900] bg-white text-gray-900 placeholder-gray-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <AdvancedFilter onFilter={async (filters) => {
              if (!Object.keys(filters).length) { fetchCandidates(); return; }
              try {
                const res = await fetch('/api/admin/candidates/filter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(filters) });
                const data = await res.json();
                setCandidates(data.filter((c: any) => c.name !== 'N/A'));
              } catch { /* ignore */ }
            }} />
            <select
              value={sortField}
              onChange={e => setSortField(e.target.value as SortField)}
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#ff9900] bg-white text-gray-700"
            >
              <option value="createdAt">Sort: Date</option>
              <option value="bestScore">Sort: Score</option>
              <option value="name">Sort: Name</option>
            </select>
            <button
              onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 transition"
              title="Toggle order"
            >
              <svg className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </button>
          </div>
        </div>
        {search && (
          <p className="mt-2 text-xs text-gray-500">
            {list.length} result{list.length !== 1 ? 's' : ''} for "<span className="font-medium text-gray-700">{search}</span>"
          </p>
        )}
      </div>

      {/* Table */}
      {list.length === 0 ? (
        <EmptyState message={search ? 'No candidates match your search' : 'No candidates found'} />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#f7f8f8] border-b border-gray-200">
                  {['Candidate', 'Skills', 'Experience', 'Result', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((c, i) => (
                  <tr
                    key={c.userId}
                    className={`border-b border-gray-100 hover:bg-[#fffbf2] cursor-pointer transition-colors group ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}
                    onClick={() => navigate(`/admin/candidate/${c.userId}`)}
                  >
                    {/* Candidate */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#232f3e] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {c.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0066c0] group-hover:underline">{c.name || 'N/A'}</p>
                          <p className="text-xs text-gray-400 font-mono">{c.userId?.slice(0, 8)}…</p>
                        </div>
                      </div>
                    </td>
                    {/* Skills */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.skills?.slice(0, 3).map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-[#e8f4fd] text-[#0066c0] border border-[#c8e6f9] rounded text-xs font-medium">
                            {s}
                          </span>
                        ))}
                        {(c.skills?.length || 0) > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">+{c.skills!.length - 3}</span>
                        )}
                        {!c.skills?.length && <span className="text-xs text-gray-400">—</span>}
                      </div>
                    </td>
                    {/* Experience */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">
                        {c.experience > 0 ? `${c.experience} yr${c.experience !== 1 ? 's' : ''}` : 'Fresher'}
                      </span>
                    </td>
                    {/* Result */}
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded border text-xs font-semibold ${resultBg(c.summary?.bestResult || '')}`}>
                        {c.summary?.bestResult || 'Pending'}
                      </span>
                    </td>
                    {/* Arrow */}
                    <td className="px-4 py-3">
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-[#ff9900] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-[#f7f8f8] border-t border-gray-200 text-xs text-gray-500">
            Showing {list.length} of {candidates.length} candidates
          </div>
        </div>
      )}
    </div>
  );
};
