import React, { useState, useEffect } from 'react';

export const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(setAnalytics);
  }, []);

  const updateLimit = async () => {
    if (maxAttempts < 1) {
      alert('Limit must be at least 1');
      return;
    }
    await fetch('/api/admin/attempts/limit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maxAttempts })
    });
    alert('Limit updated successfully');
  };

  const uploadCSV = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('csv', file);

    try {
      const res = await fetch('/api/bulk/import-candidates', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      alert(`Imported: ${data.imported}, Errors: ${data.errors}`);
      setFile(null);
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = `userId,name,email,skills,domains\nuser1,John Doe,john@example.com,"javascript,react,node","web development,backend"\nuser2,Jane Smith,jane@example.com,"python,django","data science,ml"`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'candidates_template.csv';
    a.click();
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">System Analytics</h1>

      {/* Analytics Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Basic Interviews</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Total Candidates:</span>
              <span className="font-semibold text-white">{analytics?.basic.total_candidates || 0}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Avg Score:</span>
              <span className="font-semibold text-white">{analytics?.basic.avg_score || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Completed:</span>
              <span className="font-semibold text-white">{analytics?.basic.completed_interviews || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Multi-Level Interviews</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Total Users:</span>
              <span className="font-semibold text-white">{analytics?.multiLevel.total_users || 0}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Completed:</span>
              <span className="font-semibold text-white">{analytics?.multiLevel.completed || 0}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Avg Score:</span>
              <span className="font-semibold text-white">{analytics?.multiLevel.avg_score || 'N/A'}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">⚙️ Settings</h3>
        <div className="flex gap-3 items-center">
          <label className="text-gray-300 text-sm">Max Attempts:</label>
          <input
            type="number"
            min="1"
            value={maxAttempts}
            onChange={(e) => setMaxAttempts(Number(e.target.value))}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white w-24"
          />
          <button
            onClick={updateLimit}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium"
          >
            Update
          </button>
        </div>
      </div>

      {/* Bulk Import */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📥 Bulk Import</h3>
        <div className="space-y-3">
          <button
            onClick={downloadTemplate}
            className="text-sm text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Download CSV Template
          </button>
          <div className="flex gap-3">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
            />
            <button
              onClick={uploadCSV}
              disabled={!file || uploading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
