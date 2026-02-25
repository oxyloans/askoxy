import React, { useState } from 'react';

export const PracticeMode: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = {
    mcq: [
      { q: 'What is closure in JavaScript?', options: ['A) Function scope', 'B) Block scope', 'C) Function with access to outer scope', 'D) Global scope'], correct: 'C' },
      { q: 'Which HTTP method is idempotent?', options: ['A) POST', 'B) PUT', 'C) PATCH', 'D) All'], correct: 'B' }
    ],
    scenario: [
      'You notice a critical bug in production. What are your immediate steps?',
      'A team member consistently misses deadlines. How do you handle this?'
    ],
    coding: [
      'Write a function to reverse a string without using built-in methods.',
      'Implement a function to check if a number is prime.'
    ]
  };

  const startPractice = (type: 'mcq' | 'scenario' | 'coding') => {
    setStarted(true);
    setFeedback('');
    setAnswer('');
    
    if (type === 'mcq') {
      const q = sampleQuestions.mcq[Math.floor(Math.random() * sampleQuestions.mcq.length)];
      setQuestion(`${q.q}\n${q.options.join('\n')}`);
    } else if (type === 'scenario') {
      setQuestion(sampleQuestions.scenario[Math.floor(Math.random() * sampleQuestions.scenario.length)]);
    } else {
      setQuestion(sampleQuestions.coding[Math.floor(Math.random() * sampleQuestions.coding.length)]);
    }
  };

  const submitPractice = () => {
    setLoading(true);
    setTimeout(() => {
      setFeedback('Good attempt! In practice mode, you can try as many times as you want. This helps you prepare for the actual interview.');
      setLoading(false);
    }, 1000);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
            <h1 className="text-3xl font-bold text-white mb-4">Practice Mode</h1>
            <p className="text-gray-400 mb-8">
              Try sample questions without affecting your interview attempts. Perfect for preparation!
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => startPractice('mcq')}
                className="bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-lg p-6 text-left transition-all"
              >
                <div className="text-emerald-400 text-2xl mb-2">📝</div>
                <h3 className="text-white font-bold mb-2">MCQ Practice</h3>
                <p className="text-gray-400 text-sm">Practice multiple choice questions</p>
              </button>

              <button
                onClick={() => startPractice('scenario')}
                className="bg-teal-900/30 hover:bg-teal-900/50 border border-teal-500/30 rounded-lg p-6 text-left transition-all"
              >
                <div className="text-teal-400 text-2xl mb-2">💼</div>
                <h3 className="text-white font-bold mb-2">Scenario Practice</h3>
                <p className="text-gray-400 text-sm">Practice scenario-based questions</p>
              </button>

              <button
                onClick={() => startPractice('coding')}
                className="bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 rounded-lg p-6 text-left transition-all"
              >
                <div className="text-purple-400 text-2xl mb-2">💻</div>
                <h3 className="text-white font-bold mb-2">Coding Practice</h3>
                <p className="text-gray-400 text-sm">Practice coding challenges</p>
              </button>
            </div>

            <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-blue-400 text-xl">ℹ️</div>
                <div className="text-sm text-gray-300">
                  <strong className="text-white">Note:</strong> Practice mode doesn't count towards your interview attempts. 
                  Use it to familiarize yourself with the question format and interface.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Practice Question</h2>
            <button
              onClick={() => setStarted(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
            >
              Back to Menu
            </button>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <p className="text-white whitespace-pre-line">{question}</p>
          </div>

          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white mb-4"
            rows={8}
          />

          {feedback && (
            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4 mb-4">
              <p className="text-emerald-400">{feedback}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={submitPractice}
              disabled={loading || !answer.trim()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg font-medium"
            >
              {loading ? 'Checking...' : 'Submit Answer'}
            </button>
            <button
              onClick={() => { setAnswer(''); setFeedback(''); }}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
