import React, { useState } from 'react';

interface FeedbackFormProps {
  userId: string;
  sessionId: string;
  onSubmit?: () => void;
}

export const FeedbackFormEnhanced: React.FC<FeedbackFormProps> = ({ userId, sessionId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/interview/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, sessionId, rating, comments })
      });
      setSubmitted(true);
      onSubmit?.();
    } catch (error) {
      alert('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
        <p className="text-gray-400">Your feedback helps us improve the interview experience.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-xl font-bold text-white mb-4">How was your experience?</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Rate your experience</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-4xl transition-all ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-600'
                } hover:text-yellow-400`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Additional comments (optional)
          </label>
          <textarea
            value={comments}
            onChange={e => setComments(e.target.value)}
            placeholder="Tell us about your experience..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={loading || rating === 0}
          className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg font-medium"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};
