import React, { useState } from 'react';

interface FilterProps {
  onFilter: (filters: any) => void;
}

export const AdvancedFilter: React.FC<FilterProps> = ({ onFilter }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minScore: '',
    maxScore: '',
    skills: '',
    dateFrom: '',
    dateTo: '',
    round: ''
  });

  const handleApply = () => {
    const filterData: any = {};
    if (filters.minScore) filterData.minScore = parseFloat(filters.minScore);
    if (filters.maxScore) filterData.maxScore = parseFloat(filters.maxScore);
    if (filters.skills) filterData.skills = filters.skills.split(',').map(s => s.trim());
    if (filters.dateFrom) filterData.dateFrom = filters.dateFrom;
    if (filters.dateTo) filterData.dateTo = filters.dateTo;
    if (filters.round) filterData.round = parseInt(filters.round);
    
    onFilter(filterData);
    setShowFilters(false);
  };

  const handleReset = () => {
    setFilters({
      minScore: '',
      maxScore: '',
      skills: '',
      dateFrom: '',
      dateTo: '',
      round: ''
    });
    onFilter({});
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Advanced Filters
      </button>

      {showFilters && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 p-4">
          <h3 className="text-white font-semibold mb-4">Filter Candidates</h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Min Score</label>
                <input
                  type="number"
                  value={filters.minScore}
                  onChange={e => setFilters({ ...filters, minScore: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Max Score</label>
                <input
                  type="number"
                  value={filters.maxScore}
                  onChange={e => setFilters({ ...filters, maxScore: e.target.value })}
                  placeholder="10"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Skills (comma-separated)</label>
              <input
                type="text"
                value={filters.skills}
                onChange={e => setFilters({ ...filters, skills: e.target.value })}
                placeholder="javascript, react, node"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">To Date</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Round</label>
              <select
                value={filters.round}
                onChange={e => setFilters({ ...filters, round: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
              >
                <option value="">All Rounds</option>
                <option value="1">Round 1</option>
                <option value="2">Round 2</option>
                <option value="3">Round 3</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-sm"
            >
              Apply
            </button>
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
