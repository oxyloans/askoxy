import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DynamicFormRenderer from './DynamicFormRenderer'
import { engineApi } from '../hooks/engineApi'
import { useEngineStore } from '../hooks/engineStore'
import { USE_CASE_REGISTRY } from '../hooks/useCaseRegistry'
import type { RequiredDocument, ConfigurationQuestion } from '../type/engineContext'
import type { Stage1Data } from '../hooks/engineStore'

const CATEGORY_CLASSES: Record<string, { colorText: string; bg: string; border: string }> = {
  IDENTITY:   { colorText: 'text-[#1E6FD9]', bg: 'bg-[#1E6FD9]/10', border: 'border-[#1E6FD9]/25' },
  INCOME:     { colorText: 'text-[#00875A]', bg: 'bg-[#00875A]/10', border: 'border-[#00875A]/25' },
  EMPLOYMENT: { colorText: 'text-[#E85D00]', bg: 'bg-[#E85D00]/10', border: 'border-[#E85D00]/25' },
  FINANCIAL:  { colorText: 'text-[#FFB700]', bg: 'bg-[#FFB700]/10', border: 'border-[#FFB700]/25' },
  PROPERTY:   { colorText: 'text-[#7B5EA7]', bg: 'bg-[#7B5EA7]/10', border: 'border-[#7B5EA7]/25' },
  BUSINESS:   { colorText: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10', border: 'border-[#00D4FF]/25' },
  COMPLIANCE: { colorText: 'text-[#FF1744]', bg: 'bg-[#FF1744]/10', border: 'border-[#FF1744]/25' },
  OTHER:      { colorText: 'text-[#8B9CC8]', bg: 'bg-white/5',      border: 'border-[#00D4FF]/10' },
}

const FRAMEWORK_BADGE: Record<string, string> = {
  CBUAE: 'text-[#1E6FD9] bg-[#1E6FD9]/10 border border-[#1E6FD9]/20',
  RBI:   'text-[#E85D00] bg-[#E85D00]/10 border border-[#E85D00]/20',
  SAMA:  'text-[#00875A] bg-[#00875A]/10 border border-[#00875A]/20',
}

// ─── Document Card ─────────────────────────────────────────────────────────
function DocumentCard({ doc }: { doc: RequiredDocument }) {
  const cls = CATEGORY_CLASSES[doc.category] ?? CATEGORY_CLASSES.OTHER
  return (
    <div className="p-3 px-3.5 bg-white/[0.02] border border-[#00D4FF]/8 rounded-lg">
      <div className="flex items-start gap-2.5">
        <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 border ${cls.bg} ${cls.border}`}>
          <svg className={`w-3.5 h-3.5 ${cls.colorText}`} viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" />
            <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className="text-[13px] font-semibold text-[#F0F4FF] truncate">{doc.name}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border tracking-wider uppercase shrink-0 ${
              doc.mandatory
                ? 'bg-[#FF1744]/10 text-[#FF1744] border-[#FF1744]/25'
                : 'bg-[#FF9800]/10 text-[#FF9800] border-[#FF9800]/25'
            }`}>
              {doc.mandatory ? 'Required' : 'Optional'}
            </span>
          </div>
          {doc.description && (
            <p className="text-[11px] text-[#8B9CC8] leading-relaxed mb-1.5">{doc.description}</p>
          )}
          <div className="flex gap-1 flex-wrap">
            {doc.acceptedFormats.map(fmt => (
              <span key={fmt} className="px-1.5 py-0.5 bg-white/5 border border-[#00D4FF]/10 rounded text-[10px] text-[#4A5580] font-mono">
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Stage2Page ────────────────────────────────────────────────────────────
export default function Stage2Page() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { stage1Data, stage2Questions, stage2Documents, setStage1Data, setStage2Questions } = useEngineStore()

  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [recovering, setRecovering] = useState(false)

  // ── Recover stage1Data from sessionStorage if store was cleared (e.g. page refresh) ──
  useEffect(() => {
    if (!stage1Data) {
      try {
        const saved = sessionStorage.getItem('finvibe_stage1')
        if (saved) {
          setStage1Data(JSON.parse(saved) as Stage1Data)
          return
        }
      } catch {}
    }
  }, [stage1Data, setStage1Data])

  // ── Recover stage2Questions from backend if missing ──
  useEffect(() => {
    if (!sessionId || stage2Questions?.length) return
    setRecovering(true)
    engineApi.getSession(sessionId)
      .then(({ data }) => {
        const raw = data as any
        let ctx: any = {}
        if (raw?.contextJson) {
          try { ctx = JSON.parse(raw.contextJson) } catch {}
        }
        const reqs = raw?.dynamicRequirements ?? ctx?.dynamicRequirements
        if (reqs) {
          const questions = reqs.questions ?? reqs.configurationQuestions ?? []
          const documents = reqs.documents ?? reqs.requiredDocuments ?? []
          if (questions.length > 0) {
            setStage2Questions(questions, documents)
          }
        }
        // Also recover stage1Data if missing
        if (!stage1Data) {
          const bp = raw?.bankProfile ?? ctx?.bankProfile
          if (bp) {
            setStage1Data({
              selectedUseCase: bp.selectedUseCase ?? bp.useCaseId ?? '',
              regulatoryFramework: bp.regulatoryFramework ?? '',
              bankName: bp.bankName ?? '',
              backendStack: bp.backendStack ?? '',
              frontendStack: bp.frontendStack ?? '',
              databaseType: bp.databaseType ?? '',
              aiProvider: bp.aiProvider ?? '',
              aiModelId: bp.aiModelId ?? '',
              existingServices: bp.existingServices ?? [],
            })
          }
        }
      })
      .catch(() => {})
      .finally(() => setRecovering(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const selectedUC = USE_CASE_REGISTRY.find(uc => uc.id === stage1Data?.selectedUseCase)
  const questions = (stage2Questions ?? []) as ConfigurationQuestion[]
  const documents = (stage2Documents ?? []) as RequiredDocument[]

  const resolveQType = (q: ConfigurationQuestion) => {
    const raw = (q.inputType ?? q.type ?? 'TEXT').toString().toUpperCase().trim()
    if (raw === 'BOOLEAN' || raw === 'BOOL') return 'BOOLEAN'
    if (raw === 'NUMBER' || raw === 'CURRENCY') return 'NUMBER'
    if (raw === 'PERCENTAGE') return 'PERCENTAGE'
    return raw
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    questions.forEach(q => {
      if (!q.required) return
      const val = answers[q.questionId]
      const qType = resolveQType(q)
      if (qType === 'BOOLEAN') return
      if ((qType === 'NUMBER' || qType === 'PERCENTAGE') &&
          (val === '' || val === undefined || val === null || isNaN(val as number))) {
        errs[q.questionId] = `${q.questionText} is required`
        return
      }
      if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
        errs[q.questionId] = `${q.questionText} is required`
      }
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      setTimeout(() => {
        const el = document.querySelector('[data-error="true"]') as HTMLElement
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }
    if (!sessionId) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await engineApi.submitStage2(sessionId, answers)
      // Manually update store status to completed for step 2 and runStatus to running
      // to prevent the Action Required banner from flashing or remaining visible during navigation
      useEngineStore.getState().updateAgentStatus(2, 'completed');
      useEngineStore.setState({ runStatus: 'running', isRunning: true });
      navigate(`/generating/${sessionId}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Loading state ──
  if (!stage1Data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#00D4FF]/20 border-t-[#00D4FF] rounded-full animate-spin-custom mx-auto mb-4" />
          <p className="text-[#8B9CC8] text-sm mb-4">Recovering session...</p>
          <button
            type="button"
            onClick={() => navigate('/generate')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border bg-white/5 text-[#8B9CC8] border-[#00D4FF]/10 hover:border-[#00D4FF] hover:text-[#00D4FF] transition-all duration-200"
          >
            ← Back to Stage 1
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in py-8 pb-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-[11px] font-bold text-[#FFB700] bg-[#FFB700]/10 border border-[#FFB700]/30 rounded-full px-2.5 py-0.5 tracking-widest uppercase shrink-0">
              Step 2 of 3
            </span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F0F4FF]">Use Case Configuration</h2>
            {selectedUC && (
              <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border ${FRAMEWORK_BADGE[selectedUC.framework] ?? 'bg-white/5 border-[#00D4FF]/10 text-[#8B9CC8]'}`}>
                {selectedUC.framework}
              </span>
            )}
          </div>
          {stage1Data.bankName && (
            <p className="text-[13px] text-[#4A5580] mt-1">
              {stage1Data.bankName}
              {selectedUC ? ` · ${selectedUC.name}` : ''}
            </p>
          )}
        </div>

        {/* ── AI intro banner ── */}
        <div className="flex items-start gap-3 p-3.5 px-4 rounded-lg border border-[#00D4FF]/20 bg-[#00D4FF]/5 mb-6">
          <svg className="shrink-0 mt-0.5 text-[#00D4FF]" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-[12px] text-[#00D4FF] leading-relaxed">
            <span className="font-semibold">{questions.length} questions</span> generated for{' '}
            <span className="font-semibold">{selectedUC?.name}</span> under{' '}
            <span className="font-semibold">{stage1Data.regulatoryFramework}</span> — answers are embedded directly into the generated service.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">

            {/* ── Left: Questions ── */}
            <div className="flex flex-col gap-4">
              {questions.length > 0 ? (
                <div className="bg-white/[0.03] border border-[#00D4FF]/10 rounded-2xl p-5 sm:p-6">
                  <DynamicFormRenderer
                    questions={questions}
                    onAnswersChange={setAnswers}
                    errors={errors}
                  />
                </div>
              ) : (
                <div className="bg-white/[0.03] border border-[#00D4FF]/10 rounded-2xl p-10 text-center">
                  <div className="w-8 h-8 border-2 border-[#00D4FF]/20 border-t-[#00D4FF] rounded-full animate-spin-custom mx-auto mb-4" />
                  <h4 className="text-[14px] font-semibold text-[#F0F4FF] mb-1.5">Generating Questions...</h4>
                  <p className="text-[12px] text-[#8B9CC8]">Analyzing your use case to determine configuration parameters.</p>
                </div>
              )}

              {submitError && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-lg border border-[#FF1744]/25 bg-[#FF1744]/5 text-[12px] text-[#FF1744]">
                  <svg className="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || questions.length === 0}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[14px] font-semibold cursor-pointer border-none transition-all duration-200 bg-gradient-to-r from-[#00D4FF] to-[#0099BB] text-black shadow-[0_4px_16px_rgba(0,212,255,0.25)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,212,255,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin-custom" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    Confirm & Start Code Generation
                  </>
                )}
              </button>
            </div>

            {/* ── Right: Documents + Session ── */}
            <div className="flex flex-col gap-4">

              {/* Required Documents */}
              <div className="bg-white/[0.03] border border-[#00D4FF]/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[13px] font-semibold text-[#F0F4FF]">Required Documents</h4>
                  {documents.length > 0 && (
                    <span className="text-[10px] font-mono text-[#00D4FF] bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-full px-2 py-0.5">
                      {documents.length}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#4A5580] mb-3">
                  Collected from end users by the generated service
                </p>
                {documents.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {documents.map(doc => (
                      <DocumentCard key={doc.documentId} doc={doc} />
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-[#4A5580] text-[12px]">
                    Loaded after questions are answered
                  </div>
                )}
              </div>

              {/* Session Details */}
              <div className="bg-white/[0.02] border border-[#00D4FF]/8 rounded-xl p-4">
                <p className="text-[10px] text-[#4A5580] mb-2.5 tracking-wider uppercase font-semibold">
                  Session Details
                </p>
                <div className="flex flex-col">
                  {[
                    { label: 'Session ID',  value: sessionId ?? '—',                    mono: true },
                    { label: 'Use Case',    value: selectedUC?.id ?? '—',               mono: true },
                    { label: 'Framework',   value: stage1Data.regulatoryFramework,       mono: false },
                    { label: 'Questions',   value: `${questions.length} questions`,      mono: false },
                  ].map(({ label, value, mono }, i, arr) => (
                    <div key={label} className={`flex items-center justify-between py-2 ${i !== arr.length - 1 ? 'border-b border-[#00D4FF]/5' : ''}`}>
                      <span className="text-[11px] text-[#4A5580]">{label}</span>
                      {mono ? (
                        <span className="font-mono text-[10px] text-[#00D4FF] bg-[#00D4FF]/10 border border-[#00D4FF]/15 rounded px-1.5 py-0.5 truncate max-w-[180px]">
                          {value}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#C8D0E8]">{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  )
}