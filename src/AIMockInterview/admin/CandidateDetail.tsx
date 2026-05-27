import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { candidateApi } from './api';
import { Candidate, Attempt, RoundBreakdown, ProctoringSnapshot } from './types';
import { LoadingSpinner, ErrorState } from './components';

interface ExamImage {
  id: string;
  sessionStatsId: string;
  imageUrl: string;
  type: string;
  violationType: string | null;
  capturedAt: string;
}

/* ─────────── tiny helpers ─────────── */
const clamp = (v: string) => Math.min(parseFloat(v) || 0, 100);

const scoreColor = (pct: number) => {
  if (pct >= 60) return { accent: '#0f7a3c', bg: '#f0faf4', text: '#0a5c2e', bar: '#18a254' };
  if (pct >= 40) return { accent: '#92600a', bg: '#fffbf0', text: '#7a5008', bar: '#e8920a' };
  return { accent: '#b91c1c', bg: '#fff5f5', text: '#991b1b', bar: '#e53e3e' };
};

const resultPill = (r: string) => {
  if (r === 'Selected') return { bg: '#f0faf4', text: '#0a5c2e', border: '#a7d9b8' };
  if (r === 'Not Selected') return { bg: '#fff5f5', text: '#991b1b', border: '#f5b8b8' };
  return { bg: '#f4f5f7', text: '#4b5563', border: '#d1d5db' };
};

/* ─────────── Score Ring (SVG) ─────────── */
const ScoreRing: React.FC<{ pct: string; size?: number }> = ({ pct, size = 52 }) => {
  const n = clamp(pct);
  const c = scoreColor(n);
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (n / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={c.bar} strokeWidth={4}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: size < 50 ? 11 : 13, fontWeight: 600, fill: c.accent, fontFamily: 'inherit' }}>
        {n}%
      </text>
    </svg>
  );
};

/* ─────────── Thin progress bar ─────────── */
const Bar: React.FC<{ pct: string }> = ({ pct }) => {
  const n = clamp(pct);
  const c = scoreColor(n);
  return (
    <div style={{ height: 3, background: '#f0f0f0', borderRadius: 2, overflow: 'hidden', marginTop: 6 }}>
      <div style={{ width: `${n}%`, height: '100%', background: c.bar, borderRadius: 2, transition: 'width 0.4s ease' }} />
    </div>
  );
};

/* ─────────── Dot Badge ─────────── */
const Pill: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontSize: 11, fontWeight: 500, padding: '2px 8px',
    borderRadius: 4, border: '1px solid #e5e7eb',
    background: '#f9fafb', color: '#4b5563',
    whiteSpace: 'nowrap', ...style
  }}>{children}</span>
);

/* ─────────── Markdown renderer (bold + line breaks only) ─────────── */
const renderMd = (text: string): React.ReactNode[] => {
  return text.split('\n').map((line, li) => {
    const parts: React.ReactNode[] = [];
    const re = /\*\*(.+?)\*\*/g;
    let last = 0, m;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) parts.push(line.slice(last, m.index));
      parts.push(<strong key={m.index}>{m[1]}</strong>);
      last = m.index + m[0].length;
    }
    if (last < line.length) parts.push(line.slice(last));
    return <span key={li}>{parts}{li < text.split('\n').length - 1 && <br />}</span>;
  });
};
export const CandidateDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selAttempt, setSelAttempt] = useState(0);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [lightbox, setLightbox] = useState<ProctoringSnapshot | null>(null);
  const [examLightbox, setExamLightbox] = useState<ExamImage | null>(null);
  const [showExamImages, setShowExamImages] = useState(false);
  const [examFilter, setExamFilter] = useState<string | null>(null);
  const [showResumePreview, setShowResumePreview] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    candidateApi.getCandidateById(userId)
      .then(d => { setCandidate(d); setLoading(false); })
      .catch(() => { setError('Failed to load candidate'); setLoading(false); });
  }, [userId]);

  const toggle = (r: number) => {
    const s = new Set(expanded);
    s.has(r) ? s.delete(r) : s.add(r);
    setExpanded(s);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!candidate) return <ErrorState message="Candidate not found" />;

  const attempt: Attempt | undefined = candidate.attempts?.[selAttempt];
  const BASE = 'https://interviews-zadn.onrender.com';

  /* ── shared card style ── */
  const card: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e8e8e8',
    borderRadius: 10,
    overflow: 'hidden',
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: '#9ca3af', marginBottom: 12,
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: 960, margin: '0 auto', fontFamily: "'Amazon Ember', 'Segoe UI', sans-serif" }}>

      {/* ── Breadcrumb ── */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'none', border: '1px solid #e5e7eb', cursor: 'pointer',
            color: '#374151', padding: '5px 12px', fontSize: 13, borderRadius: 6,
            fontWeight: 500,
          }}
        >
          <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span style={{ color: '#d1d5db' }}>›</span>
        <span style={{ color: '#111827', fontWeight: 500 }}>{candidate.name}</span>
      </nav>

      {/* ── Profile Card ── */}
      <div style={{ ...card, padding: '20px 24px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {/* Avatar */}
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a2840 0%, #232f3e 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 20, fontWeight: 700, flexShrink: 0,
            letterSpacing: '-0.5px',
          }}>
            {candidate.name?.charAt(0).toUpperCase() || '?'}
          </div>

          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>{candidate.name}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <span style={{ fontSize: 12, color: '#6b7280' }}>
                {candidate.experience > 0 ? `${candidate.experience} yrs exp` : 'Fresher'}
              </span>
              <span style={{ color: '#e5e7eb' }}>·</span>
              <Pill style={candidate.isTechnical
                ? { background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }
                : { background: '#faf5ff', color: '#7c3aed', borderColor: '#ddd6fe' }}>
                {candidate.isTechnical ? 'Technical' : 'Non-Technical'}
              </Pill>
              {candidate.domains?.map((d, i) => <Pill key={i}>{d}</Pill>)}
            </div>
            {candidate.skills?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                {candidate.skills.map((sk, i) => (
                  <Pill key={i} style={{ background: '#f0f7ff', color: '#1a56a0', borderColor: '#c3daf9' }}>{sk}</Pill>
                ))}
              </div>
            )}
          </div>
        </div>

        {((candidate as any).resumeUrl || candidate.resumePath) && (
          <button
            onClick={() => setShowResumePreview(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', background: '#ff9900',
              color: '#111', fontSize: 13, fontWeight: 600,
              borderRadius: 6, border: '1px solid #e88900', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Resume
          </button>
        )}
      </div>

      {/* ── Summary Stats + Best Result ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total Attempts', value: String(candidate.summary?.totalAttempts ?? 0), unit: '' },
          { label: 'Completed', value: String(candidate.summary?.completedAttempts ?? 0), unit: '' },
          { label: 'Best Score', value: candidate.summary?.bestScore ?? 'N/A', unit: '%' },
          { label: 'Latest Score', value: candidate.summary?.latestScore ?? 'N/A', unit: '%' },
        ].map(s => {
          const n = parseFloat(s.value);
          const colored = s.unit === '%' && s.value !== 'N/A';
          const c = colored ? scoreColor(n) : null;
          return (
            <div key={s.label} style={{
              ...card, padding: '14px 16px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>{s.label}</p>
              {colored && s.value !== 'N/A'
                ? <ScoreRing pct={s.value} size={52} />
                : <p style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1 }}>{s.value}</p>
              }
            </div>
          );
        })}

        {/* Best Result */}
        {(() => {
          const rp = resultPill(candidate.summary?.bestResult || '');
          return (
            <div style={{
              ...card, padding: '14px 16px', textAlign: 'center',
              borderColor: rp.border,
            }}>
              <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Best Result</p>
              <span style={{
                display: 'inline-block', fontSize: 13, fontWeight: 700,
                padding: '4px 12px', borderRadius: 20,
                background: rp.bg, color: rp.text, border: `1px solid ${rp.border}`,
              }}>
                {candidate.summary?.bestResult || 'N/A'}
              </span>
            </div>
          );
        })()}
      </div>

      {/* ── Resume Preview Modal ── */}
      {showResumePreview && (() => {
        const resumeUrl = (candidate as any).resumeUrl || `${BASE}${candidate.resumePath}`;
        const isDocx = resumeUrl?.match(/\.docx?$/i);
        const previewUrl = isDocx
          ? `https://docs.google.com/gview?url=${encodeURIComponent(resumeUrl)}&embedded=true`
          : resumeUrl;
        return (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
            onClick={() => setShowResumePreview(false)}
          >
            <div
              style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', width: '90%', maxWidth: 800, height: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Resume — {candidate.name}</span>
                <button onClick={() => setShowResumePreview(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 18, lineHeight: 1 }}>✕</button>
              </div>
              <iframe
                src={previewUrl}
                title="Resume Preview"
                style={{ flex: 1, border: 'none', width: '100%' }}
              />
            </div>
          </div>
        );
      })()}

      {/* ── Exam Images ── */}
      {((candidate as any).examImages?.length || 0) > 0 && (() => {
        const examImages: ExamImage[] = (candidate as any).examImages;
        const violations = examImages.filter(e => e.violationType);
        const violationTypes = Array.from(new Set(violations.map(e => e.violationType))) as string[];
        const filtered = examFilter ? examImages.filter(e => e.violationType === examFilter) : examImages;
        return (
          <div style={{ ...card, marginBottom: 16 }}>
            <div style={{
              padding: '12px 20px', borderBottom: showExamImages ? '1px solid #f0f0f0' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#fafafa', flexWrap: 'wrap', gap: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width={16} height={16} fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Exam Images</span>
                <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 10, background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' }}>
                  {examImages.length} total
                </span>
                {violations.length > 0 && (
                  <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 10, background: '#fff5f5', color: '#b91c1c', border: '1px solid #fca5a5' }}>
                    {violations.length} violations
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowExamImages(v => !v)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', fontSize: 12, fontWeight: 600,
                  borderRadius: 6, border: '1px solid #e5e7eb',
                  background: showExamImages ? '#f3f4f6' : '#fff',
                  color: '#374151', cursor: 'pointer',
                }}
              >
                <svg width={13} height={13} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {showExamImages ? 'Hide Images' : 'View Images'}
              </button>
            </div>

            {showExamImages && (
              <div style={{ padding: 16 }}>
                {/* Filter buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  <button
                    onClick={() => setExamFilter(null)}
                    style={{
                      padding: '4px 12px', fontSize: 11, fontWeight: 600, borderRadius: 20, cursor: 'pointer',
                      border: `1px solid ${examFilter === null ? '#1a2840' : '#e5e7eb'}`,
                      background: examFilter === null ? '#1a2840' : '#fff',
                      color: examFilter === null ? '#fff' : '#6b7280',
                    }}
                  >
                    All ({examImages.length})
                  </button>
                  {violationTypes.map(v => {
                    const count = examImages.filter(e => e.violationType === v).length;
                    const active = examFilter === v;
                    return (
                      <button
                        key={v}
                        onClick={() => setExamFilter(active ? null : v)}
                        style={{
                          padding: '4px 12px', fontSize: 11, fontWeight: 600, borderRadius: 20, cursor: 'pointer',
                          border: `1px solid ${active ? '#b91c1c' : '#fca5a5'}`,
                          background: active ? '#b91c1c' : '#fff5f5',
                          color: active ? '#fff' : '#b91c1c',
                        }}
                      >
                        {v.replace(/_/g, ' ')} ({count})
                      </button>
                    );
                  })}
                  {examImages.some(e => !e.violationType) && (
                    <button
                      onClick={() => setExamFilter(examFilter === 'NONE' ? null : 'NONE')}
                      style={{
                        padding: '4px 12px', fontSize: 11, fontWeight: 600, borderRadius: 20, cursor: 'pointer',
                        border: `1px solid ${examFilter === 'NONE' ? '#0066c0' : '#bfdbfe'}`,
                        background: examFilter === 'NONE' ? '#0066c0' : '#eff6ff',
                        color: examFilter === 'NONE' ? '#fff' : '#1d4ed8',
                      }}
                    >
                      Normal ({examImages.filter(e => !e.violationType).length})
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 10 }}>
                  {(examFilter === 'NONE' ? examImages.filter(e => !e.violationType) : filtered).map((img, i) => {
                    const vio = !!img.violationType;
                    return (
                      <button
                        key={img.id}
                        onClick={() => setExamLightbox(img)}
                        style={{
                          position: 'relative', borderRadius: 7, overflow: 'hidden',
                          border: `1.5px solid ${vio ? '#fca5a5' : '#e5e7eb'}`,
                          cursor: 'pointer', padding: 0, background: 'none',
                          transition: 'transform 0.15s', aspectRatio: '1',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                      >
                        <img
                          src={img.imageUrl} alt={`Exam ${i + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          onError={e => { (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='%23f1f5f9'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='9'>No img</text></svg>`; }}
                        />
                        {vio && (
                          <div style={{
                            position: 'absolute', top: 3, right: 3,
                            width: 14, height: 14, background: '#ef4444',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <span style={{ color: '#fff', fontSize: 8, fontWeight: 700 }}>!</span>
                          </div>
                        )}
                        {img.type === 'CANDIDATE_IMAGE' && (
                          <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'rgba(0,82,204,0.75)', padding: '2px 0',
                          }}>
                            <span style={{ color: '#fff', fontSize: 7, fontWeight: 700, display: 'block', textAlign: 'center' }}>ID</span>
                          </div>
                        )}
                        {vio && (
                          <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'rgba(185,28,28,0.75)', padding: '2px 3px',
                          }}>
                            <span style={{ color: '#fff', fontSize: 6, fontWeight: 600, display: 'block', textAlign: 'center', lineHeight: 1.2 }}>
                              {img.violationType!.replace(/_/g, ' ')}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {filtered.length === 0 && (
                  <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', margin: '16px 0 0' }}>No images match this filter.</p>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Exam Image Lightbox ── */}
      {examLightbox && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setExamLightbox(null)}
        >
          <div
            style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 18px', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: examLightbox.violationType ? '#b91c1c' : '#374151' }}>
                  {examLightbox.violationType ? `⚠ ${examLightbox.violationType.replace(/_/g, ' ')}` : examLightbox.type === 'CANDIDATE_IMAGE' ? '🪪 Candidate ID Photo' : 'Exam Image'}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>{new Date(examLightbox.capturedAt).toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => setExamLightbox(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, fontSize: 18, lineHeight: 1 }}>✕</button>
            </div>
            <img
              src={examLightbox.imageUrl}
              alt="Exam image"
              style={{ width: '100%', maxHeight: 380, objectFit: 'contain', display: 'block' }}
            />
            <div style={{ padding: '10px 18px', background: '#fafafa', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace', margin: 0 }}>Session: {examLightbox.sessionStatsId.slice(0, 16)}…</p>
              <a href={examLightbox.imageUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, color: '#0066c0', textDecoration: 'none', fontWeight: 500 }}>Open full ↗</a>
            </div>
          </div>
        </div>
      )}

      {/* ── Proctoring Snapshots ── */}
      {(candidate.proctoringSnapshots?.length || 0) > 0 && (
        <div style={{ ...card, marginBottom: 16 }}>
          {/* Header */}
          <div style={{
            padding: '12px 20px', borderBottom: '1px solid #f0f0f0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#fafafa',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width={16} height={16} fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Proctoring Snapshots</span>
              <span style={{
                fontSize: 11, padding: '1px 7px', borderRadius: 10,
                background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb',
              }}>
                {candidate.proctoringSnapshots!.length}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#9ca3af' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} /> Violation
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#d1d5db', display: 'inline-block' }} /> Normal
              </span>
            </div>
          </div>

          <div style={{ padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 10 }}>
              {candidate.proctoringSnapshots!.map((snap, i) => {
                const src = snap.imageUrl.startsWith('http') ? snap.imageUrl : BASE + snap.imageUrl;
                const vio = !!snap.violationType;
                return (
                  <button
                    key={i}
                    onClick={() => setLightbox(snap)}
                    style={{
                      position: 'relative', borderRadius: 7, overflow: 'hidden',
                      border: `1.5px solid ${vio ? '#fca5a5' : '#e5e7eb'}`,
                      cursor: 'pointer', padding: 0, background: 'none',
                      transition: 'border-color 0.15s, transform 0.15s',
                      aspectRatio: '1',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                  >
                    <img
                      src={src} alt={`Snap ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => { (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='%23f1f5f9'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='9'>No img</text></svg>`; }}
                    />
                    {vio && (
                      <div style={{
                        position: 'absolute', top: 3, right: 3,
                        width: 14, height: 14, background: '#ef4444',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ color: '#fff', fontSize: 8, fontWeight: 700 }}>!</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {candidate.proctoringSnapshots!.some(s => s.violationType) && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
                <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Violations</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {Array.from(new Set(candidate.proctoringSnapshots!.filter(s => s.violationType).map(s => s.violationType))).map(v => (
                    <Pill key={v} style={{ background: '#fff5f5', color: '#b91c1c', borderColor: '#fca5a5' }}>
                      {v?.replace(/_/g, ' ')}
                    </Pill>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setLightbox(null)}
        >
          <div
            style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 18px', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: lightbox.violationType ? '#b91c1c' : '#374151' }}>
                  {lightbox.violationType ? `⚠ ${lightbox.violationType.replace(/_/g, ' ')}` : 'Normal snapshot'}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>{new Date(lightbox.capturedAt).toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => setLightbox(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, fontSize: 18, lineHeight: 1 }}>✕</button>
            </div>
            <img
              src={lightbox.imageUrl.startsWith('http') ? lightbox.imageUrl : BASE + lightbox.imageUrl}
              alt="Proctoring snapshot"
              style={{ width: '100%', maxHeight: 380, objectFit: 'contain', display: 'block' }}
            />
            <div style={{ padding: '10px 18px', background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace', margin: 0 }}>Session: {lightbox.sessionId?.slice(0, 16)}…</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Attempts ── */}
      {(candidate.attempts?.length || 0) === 0 ? (
        <div style={{ ...card, padding: 48, textAlign: 'center', color: '#9ca3af' }}>
          <svg width={40} height={40} style={{ margin: '0 auto 12px', display: 'block', color: '#d1d5db' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p style={{ fontSize: 13, margin: 0 }}>No interview attempts found.</p>
        </div>
      ) : (
        <div style={card}>
          {/* Attempt Tabs */}
          {candidate.attempts.length > 1 && (
            <div style={{
              display: 'flex', gap: 4, padding: '12px 16px 0',
              background: '#fafafa', borderBottom: '1px solid #e8e8e8',
              overflowX: 'auto',
            }}>
              {candidate.attempts.map((a, i) => {
                const active = selAttempt === i;
                const rp = resultPill(a.result);
                return (
                  <button
                    key={i}
                    onClick={() => { setSelAttempt(i); setExpanded(new Set()); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '8px 14px', fontSize: 13, fontWeight: active ? 600 : 400,
                      borderRadius: '6px 6px 0 0', border: 'none', cursor: 'pointer',
                      whiteSpace: 'nowrap', transition: 'background 0.12s',
                      background: active ? '#fff' : 'transparent',
                      color: active ? '#111827' : '#6b7280',
                      borderBottom: active ? '2px solid #ff9900' : '2px solid transparent',
                      marginBottom: -1,
                    }}
                  >
                    Attempt {a.attemptNumber}
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '1px 7px',
                      borderRadius: 4, border: `1px solid ${rp.border}`,
                      background: rp.bg, color: rp.text,
                    }}>{a.overallScore}%</span>
                  </button>
                );
              })}
            </div>
          )}

          {attempt && (
            <div style={{ padding: 24 }}>
              {/* Attempt Header Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Attempt {attempt.attemptNumber}</h2>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                    {new Date(attempt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    &nbsp;·&nbsp;{attempt.status}&nbsp;·&nbsp;{attempt.totalQuestions} questions
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ScoreRing pct={attempt.overallScore} size={56} />
                  {(() => {
                    const rp = resultPill(attempt.result);
                    return (
                      <span style={{
                        fontSize: 13, fontWeight: 700, padding: '5px 14px',
                        borderRadius: 20, border: `1px solid ${rp.border}`,
                        background: rp.bg, color: rp.text,
                      }}>
                        {attempt.result}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Round Score Cards */}
              <p style={sectionTitle}>Round Breakdown</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 20 }}>
                {attempt.roundBreakdown.map(rb => {
                  const n = clamp(rb.percentage);
                  const c = scoreColor(n);
                  return (
                    <div key={rb.round} style={{
                      background: '#fafafa', border: '1px solid #f0f0f0',
                      borderRadius: 8, padding: '12px 14px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, lineHeight: 1.3, maxWidth: '65%' }}>{rb.label}</span>
                        <span style={{
                          fontSize: 14, fontWeight: 700, color: c.accent,
                          background: c.bg, padding: '1px 6px', borderRadius: 4,
                        }}>{n}%</span>
                      </div>
                      <Bar pct={rb.percentage} />
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: '5px 0 0' }}>{rb.scored}/{rb.maxScore} pts</p>
                    </div>
                  );
                })}
              </div>

              {/* Round Accordion */}
              <p style={sectionTitle}>Questions & Feedback</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {attempt.roundBreakdown.map((rb: RoundBreakdown) => {
                  const n = clamp(rb.percentage);
                  const c = scoreColor(n);
                  const open = expanded.has(rb.round);
                  return (
                    <div key={rb.round} style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggle(rb.round)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between', padding: '12px 16px',
                          background: open ? '#fffbf5' : '#fafafa',
                          border: 'none', cursor: 'pointer', textAlign: 'left',
                          borderBottom: open ? '1px solid #f0f0f0' : 'none',
                          transition: 'background 0.12s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{
                            width: 24, height: 24, borderRadius: '50%',
                            background: '#1a2840', color: '#fff',
                            fontSize: 10, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>R{rb.round}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{rb.label}</span>
                          <span style={{
                            fontSize: 11, padding: '1px 8px', borderRadius: 4, fontWeight: 600,
                            background: c.bg, color: c.accent,
                            border: `1px solid ${c.accent}22`,
                          }}>
                            {n}% · {rb.scored}/{rb.maxScore}
                          </span>
                          <span style={{ fontSize: 11, color: '#9ca3af' }}>{rb.questionsAnswered} Q</span>
                        </div>
                        <svg
                          width={14} height={14} fill="none" stroke="#9ca3af" viewBox="0 0 24 24"
                          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {open && (
                        <div>
                          {rb.questions.map((q, idx) => {
                            const qs = parseFloat(q.score);
                            const qc = scoreColor(qs >= 7 ? 80 : qs >= 4 ? 50 : 20);
                            return (
                              <div key={idx} style={{
                                padding: '18px 20px',
                                borderBottom: idx < rb.questions.length - 1 ? '1px solid #f9fafb' : 'none',
                                background: '#fff',
                              }}>
                                {/* Q number + text */}
                                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                                  <span style={{
                                    flexShrink: 0, width: 22, height: 22,
                                    borderRadius: '50%', background: '#f3f4f6',
                                    color: '#6b7280', fontSize: 10, fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}>{idx + 1}</span>
                                  <p style={{ margin: 0, fontSize: 13, color: '#111827', fontWeight: 500, lineHeight: 1.6 }}>{renderMd(q.question)}</p>
                                </div>

                                {/* Answer box */}
                                <div style={{
                                  marginLeft: 32, marginBottom: 10,
                                  background: '#f9fafb', border: '1px solid #f0f0f0',
                                  borderRadius: 6, padding: '10px 14px',
                                }}>
                                  <p style={{ margin: '0 0 4px', fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Answer</p>
                                  <p style={{ margin: 0, fontSize: 13, color: '#374151', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{q.answer || '—'}</p>
                                </div>

                                {/* Score + Feedback */}
                                <div style={{ marginLeft: 32, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                  <span style={{
                                    flexShrink: 0, fontSize: 12, fontWeight: 700,
                                    padding: '3px 10px', borderRadius: 4,
                                    background: qc.bg, color: qc.accent,
                                    border: `1px solid ${qc.accent}22`,
                                    whiteSpace: 'nowrap',
                                  }}>
                                    {q.score} / 10
                                  </span>
                                  <p style={{ margin: 0, fontSize: 12, color: '#6b7280', lineHeight: 1.65 }}>{q.feedback}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};