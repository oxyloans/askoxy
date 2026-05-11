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
    <div className="mx-auto max-w-md p-4 sm:p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">📝 Interview Feedback</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Share your experience with this interview.</p>

        <div className="mt-6">
          <label className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-300">Rating</label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                className="rounded-2xl px-1 text-4xl transition hover:scale-105"
                aria-label={`Rate ${n}`}
              >
                {n <= rating ? '⭐' : '☆'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">Comments</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            placeholder="Share your experience..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder-slate-500"
          />
        </div>

        <button
          onClick={submitFeedback}
          disabled={submitting}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-extrabold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none"
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  );
};
