import React, { useState, useEffect } from 'react';

export const FeedbackForm: React.FC = () => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get('session') || '');
  }, []);

  const submitFeedback = async () => {
    if (!user || !sessionId) return;
    setSubmitting(true);
    try {
      await fetch('/api/proctoring/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, sessionId, rating, comment })
      });
      alert('Thank you for your feedback!');
      window.location.href = '/';
    } catch (error) {
      alert('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-6">📝 Interview Feedback</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Rating:</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(n => (
              <span 
                key={n}
                onClick={() => setRating(n)}
                className="cursor-pointer text-3xl transition hover:scale-110"
              >
                {n <= rating ? '⭐' : '☆'}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Comments:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            placeholder="Share your experience..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <button
          onClick={submitFeedback}
          disabled={submitting}
          className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  );
};
