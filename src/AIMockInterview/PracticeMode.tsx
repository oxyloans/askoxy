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
      <div className="min-h-screen bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-white sm:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-indigo-50 p-6 dark:border-slate-800 dark:from-emerald-950/30 dark:to-indigo-950/30 sm:p-8">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Unlimited Practice</span>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Practice Mode</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                Try sample questions without affecting your interview attempts. Perfect for preparation and interface familiarity.
              </p>
            </div>

            <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-3">
              <button onClick={() => startPractice('mcq')} className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-left transition hover:-translate-y-1 hover:shadow-lg dark:border-emerald-900/60 dark:bg-emerald-950/30">
                <div className="mb-3 text-3xl">📝</div>
                <h3 className="font-black text-slate-900 dark:text-white">Skill Check Practice</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Practice multiple-choice technical questions.</p>
              </button>

              <button onClick={() => startPractice('scenario')} className="rounded-3xl border border-sky-200 bg-sky-50 p-5 text-left transition hover:-translate-y-1 hover:shadow-lg dark:border-sky-900/60 dark:bg-sky-950/30">
                <div className="mb-3 text-3xl">💼</div>
                <h3 className="font-black text-slate-900 dark:text-white">Scenario Practice</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Practice real-world thinking and decision-making.</p>
              </button>

              <button onClick={() => startPractice('coding')} className="rounded-3xl border border-purple-200 bg-purple-50 p-5 text-left transition hover:-translate-y-1 hover:shadow-lg dark:border-purple-900/60 dark:bg-purple-950/30">
                <div className="mb-3 text-3xl">💻</div>
                <h3 className="font-black text-slate-900 dark:text-white">Coding Practice</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Practice coding challenges before the assessment.</p>
              </button>
            </div>

            <div className="mx-5 mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-slate-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-slate-300 sm:mx-6">
              <strong className="text-slate-900 dark:text-white">Note:</strong> Practice mode does not count towards your interview attempts.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-white sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">Practice Question</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Answer freely and review feedback instantly.</p>
            </div>
            <button onClick={() => setStarted(false)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto">
              Back to Menu
            </button>
          </div>

          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
            <p className="whitespace-pre-line break-words text-sm leading-7 text-slate-900 dark:text-white">{question}</p>
          </div>

          <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer here..." className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" rows={8} />

          {feedback && (
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium leading-6 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300">
              {feedback}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={submitPractice} disabled={loading || !answer.trim()} className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-extrabold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none">
              {loading ? 'Checking...' : 'Submit Answer'}
            </button>
            <button onClick={() => { setAnswer(''); setFeedback(''); }} className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
