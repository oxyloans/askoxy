import { useState, useCallback, useEffect } from 'react'
import type { ConfigurationQuestion, QuestionType } from '../type/engineContext'

interface DynamicFormRendererProps {
  questions: ConfigurationQuestion[];
  onAnswersChange: (answers: Record<string, unknown>) => void;
  errors: Record<string, string>;
}

function normalizeBoolean(val: unknown): boolean {
  if (val === undefined || val === null) return false
  if (typeof val === 'boolean') return val
  if (typeof val === 'string') {
    const s = val.toLowerCase().trim()
    return s === 'true' || s === 'yes' || s === '1'
  }
  if (typeof val === 'number') {
    return val !== 0
  }
  return !!val
}

function resolveType(q: ConfigurationQuestion): QuestionType {
  const raw = (q.inputType ?? q.type ?? 'TEXT').toString().toUpperCase().trim()
  switch (raw) {
    case 'NUMBER':       return 'NUMBER'
    case 'PERCENTAGE':   return 'PERCENTAGE'
    case 'CURRENCY':     return 'NUMBER'
    case 'BOOLEAN':
    case 'BOOL':
    case 'CHECKBOX':     return 'BOOLEAN'
    case 'SELECT':
    case 'DROPDOWN':     return 'SELECT'
    case 'MULTI_SELECT':
    case 'MULTISET':  return 'MULTI_SELECT'
    case 'DATE':         return 'DATE'
    case 'FILE_UPLOAD':  return 'FILE_UPLOAD'
    default:             return 'TEXT'
  }
}

function resolveMin(q: ConfigurationQuestion): number | undefined {
  return q.min ?? (q.validationRules?.min as number | undefined)
}
function resolveMax(q: ConfigurationQuestion): number | undefined {
  return q.max ?? (q.validationRules?.max as number | undefined)
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function ToggleField({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none w-fit">
      <input
        type="checkbox"
        className="absolute opacity-0 w-0 h-0 peer"
        checked={value}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="w-10 h-5 bg-white/5 border border-[#00D4FF]/15 rounded-full relative transition-all duration-200 shrink-0
        after:content-[''] after:absolute after:w-[14px] after:h-[14px] after:bg-[#4A5580] after:rounded-full after:top-[2px] after:left-[2px] after:transition-all after:duration-200
        peer-checked:bg-[#00D4FF]/15 peer-checked:border-[#00D4FF] peer-checked:after:bg-[#00D4FF] peer-checked:after:left-[22px]" />
      <span className="text-[13px] text-[#C8D0E8]">{value ? 'Yes' : 'No'}</span>
    </label>
  )
}

// ─── Multi-select ─────────────────────────────────────────────────────────────
function MultiSelectField({
  question, value, onChange,
}: {
  question: ConfigurationQuestion;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt])

  return (
    <div className="flex flex-col gap-1.5">
      {(question.options ?? []).map(opt => {
        const checked = value.includes(opt)
        return (
          <label
            key={opt}
            onClick={() => toggle(opt)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 border rounded-lg cursor-pointer transition-all duration-150 select-none ${
              checked
                ? 'border-[#00D4FF]/30 bg-[#00D4FF]/8 text-[#F0F4FF]'
                : 'border-[#00D4FF]/8 bg-white/[0.02] text-[#8B9CC8] hover:border-[#00D4FF]/20 hover:bg-white/[0.03]'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-all duration-150 ${
              checked ? 'border-[#00D4FF] bg-[#00D4FF]' : 'border-[#00D4FF]/25 bg-transparent'
            }`}>
              {checked && (
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <span className="text-[13px]">{opt}</span>
          </label>
        )
      })}
    </div>
  )
}

// ─── Number with suffix ───────────────────────────────────────────────────────
function NumberSuffixField({
  question, value, onChange, error, suffix,
}: {
  question: ConfigurationQuestion;
  value: number | string;
  onChange: (v: number) => void;
  error?: string;
  suffix?: string;
}) {
  return (
    <div className="relative flex items-center">
      <input
        type="number"
        className={`bg-white/5 border rounded-lg text-[#F0F4FF] text-[13px] px-3.5 py-2.5 ${suffix ? 'pr-10' : ''} outline-none w-full transition-all duration-200 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/15 ${error ? 'border-[#FF1744]' : 'border-[#00D4FF]/10'}`}
        value={value === '' || value === undefined ? '' : value}
        min={resolveMin(question)}
        max={resolveMax(question)}
        step={suffix === '%' ? '0.01' : '1'}
        onChange={e => onChange(parseFloat(e.target.value))}
        placeholder={suffix === '%' ? '0.00' : 'Enter value'}
      />
      {suffix && (
        <span className="absolute right-3.5 text-[#4A5580] text-[12px] pointer-events-none">{suffix}</span>
      )}
    </div>
  )
}

// ─── Shared input class ───────────────────────────────────────────────────────
const inputCls = (hasError: boolean) =>
  `bg-white/5 border rounded-lg text-[#F0F4FF] text-[13px] px-3.5 py-2.5 outline-none w-full transition-all duration-200 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/15 ${
    hasError ? 'border-[#FF1744]' : 'border-[#00D4FF]/10'
  }`

// ─── DynamicFormRenderer ──────────────────────────────────────────────────────
export default function DynamicFormRenderer({ questions, onAnswersChange, errors }: DynamicFormRendererProps) {
  const [answers, setAnswers] = useState<Record<string, unknown>>(() => {
    const d: Record<string, unknown> = {}
    questions.forEach(q => {
      const t = resolveType(q)
      d[q.questionId] = q.defaultValue !== undefined
        ? (t === 'BOOLEAN' ? normalizeBoolean(q.defaultValue) : q.defaultValue)
        : t === 'BOOLEAN' ? false
        : t === 'MULTI_SELECT' ? []
        : ''
    })
    return d
  })

  useEffect(() => {
    const d: Record<string, unknown> = {}
    questions.forEach(q => {
      const t = resolveType(q)
      d[q.questionId] = q.defaultValue !== undefined
        ? (t === 'BOOLEAN' ? normalizeBoolean(q.defaultValue) : q.defaultValue)
        : t === 'BOOLEAN' ? false
        : t === 'MULTI_SELECT' ? []
        : ''
    })
    onAnswersChange(d)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateAnswer = useCallback((questionId: string, value: unknown) => {
    setAnswers(prev => {
      const next = { ...prev, [questionId]: value }
      onAnswersChange(next)
      return next
    })
  }, [onAnswersChange])

  const categorized = questions.reduce<Record<string, ConfigurationQuestion[]>>((acc, q) => {
    const cat = q.category ?? 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(q)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-7">
      {Object.entries(categorized).map(([category, qs]) => (
        <div key={category}>

          {/* Category header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-[2px] h-4 rounded-full bg-[#00D4FF]/60 shrink-0" />
            <span className="text-[10px] font-bold text-[#4A5580] tracking-widest uppercase">
              {category}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {qs.map(q => {
              const qType = resolveType(q)
              const qMin  = resolveMin(q)
              const qMax  = resolveMax(q)
              const hasError = !!errors[q.questionId]

              return (
                <div key={q.questionId} className="flex flex-col gap-1.5">

                  {/* Label */}
                  <label
                    className="flex items-center flex-wrap gap-1.5 text-[11px] font-semibold text-[#8B9CC8] tracking-wider uppercase"
                    htmlFor={q.questionId}
                  >
                    {q.questionText}
                    {q.required && <span className="text-[#FF1744]">*</span>}
                    {q.regulatoryBasis && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-[#FFB700]/8 text-[#FFB700] border-[#FFB700]/25 normal-case tracking-normal">
                        {q.regulatoryBasis}
                      </span>
                    )}
                  </label>

                  {/* TEXT */}
                  {qType === 'TEXT' && (
                    <input
                      id={q.questionId}
                      type="text"
                      className={inputCls(hasError)}
                      value={(answers[q.questionId] as string) ?? ''}
                      onChange={e => updateAnswer(q.questionId, e.target.value)}
                      placeholder={q.helpText ?? `Enter ${q.questionText.toLowerCase()}`}
                    />
                  )}

                  {/* NUMBER */}
                  {qType === 'NUMBER' && (
                    <input
                      id={q.questionId}
                      type="number"
                      className={inputCls(hasError)}
                      value={(answers[q.questionId] as number) ?? ''}
                      min={qMin}
                      max={qMax}
                      onChange={e => updateAnswer(q.questionId, parseFloat(e.target.value))}
                      placeholder={[
                        'Enter value',
                        qMin !== undefined && `min ${qMin}`,
                        qMax !== undefined && `max ${qMax}`,
                      ].filter(Boolean).join(' · ')}
                    />
                  )}

                  {/* PERCENTAGE */}
                  {qType === 'PERCENTAGE' && (
                    <NumberSuffixField
                      question={q}
                      value={(answers[q.questionId] as number) ?? ''}
                      onChange={val => updateAnswer(q.questionId, val)}
                      error={errors[q.questionId]}
                      suffix="%"
                    />
                  )}

                  {/* BOOLEAN */}
                  {qType === 'BOOLEAN' && (
                    <ToggleField
                      value={normalizeBoolean(answers[q.questionId])}
                      onChange={val => updateAnswer(q.questionId, val)}
                    />
                  )}

                  {/* MULTI_SELECT */}
                  {qType === 'MULTI_SELECT' && (
                    <MultiSelectField
                      question={q}
                      value={(answers[q.questionId] as string[]) ?? []}
                      onChange={val => updateAnswer(q.questionId, val)}
                    />
                  )}

                  {/* SELECT */}
                  {qType === 'SELECT' && (
                    <select
                      id={q.questionId}
                      className={inputCls(hasError)}
                      value={(answers[q.questionId] as string) ?? ''}
                      onChange={e => updateAnswer(q.questionId, e.target.value)}
                    >
                      <option value="" className="bg-[#0F1525] text-[#4A5580]">— Select —</option>
                      {(q.options ?? []).map(opt => (
                        <option key={opt} value={opt} className="bg-[#0F1525] text-[#F0F4FF]">{opt}</option>
                      ))}
                    </select>
                  )}

                  {/* DATE */}
                  {qType === 'DATE' && (
                    <input
                      id={q.questionId}
                      type="date"
                      className={inputCls(hasError)}
                      value={(answers[q.questionId] as string) ?? ''}
                      onChange={e => updateAnswer(q.questionId, e.target.value)}
                    />
                  )}

                  {/* FILE_UPLOAD */}
                  {qType === 'FILE_UPLOAD' && (
                    <input
                      id={q.questionId}
                      type="file"
                      className={`${inputCls(hasError)} text-[12px] py-2`}
                      onChange={e => updateAnswer(q.questionId, e.target.files?.[0]?.name ?? '')}
                    />
                  )}

                  {/* Help text — only when different from placeholder */}
                  {q.helpText && qType !== 'TEXT' && (
                    <span className="text-[11px] text-[#4A5580]">{q.helpText}</span>
                  )}

                  {/* Error */}
                  {hasError && (
                    <span data-error="true" className="text-[11px] text-[#FF6B6B]">
                      ⚠ {errors[q.questionId]}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}