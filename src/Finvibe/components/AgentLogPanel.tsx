import { useEffect, useRef, useState } from 'react'
import { useEngineStore } from '../hooks/engineStore'
import type { LogEntry } from '../hooks/engineStore'

const LEVEL_CLASSES: Record<LogEntry['level'], { color: string; bg: string; border: string; label: string }> = {
  info: { color: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/8', border: 'border-[#00D4FF]/30', label: 'INFO' },
  success: { color: 'text-[#00E676]', bg: 'bg-[#00E676]/8', border: 'border-[#00E676]/30', label: 'OK' },
  error: { color: 'text-[#FF1744]', bg: 'bg-[#FF1744]/8', border: 'border-[#FF1744]/30', label: 'ERR' },
  warn: { color: 'text-[#FFB700]', bg: 'bg-[#FFB700]/8', border: 'border-[#FFB700]/30', label: 'WARN' },
}

function formatTime(ts: string): string {
  const d = new Date(ts)
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
    '.' + String(d.getMilliseconds()).padStart(3, '0')
}

export default function AgentLogPanel() {
  const { logs, runStatus } = useEngineStore()
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(false)
  const [copied, setCopied] = useState(false)


  // Detect manual scroll
  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    setAutoScroll(atBottom)
  }

  const copyLogs = async () => {
    const text = logs.map(l =>
      `[${formatTime(l.timestamp)}] [${l.level.toUpperCase()}] [${l.agent}] ${l.message}`
    ).join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Log panel header */}
      <div className="flex items-center justify-between p-2.5 px-3.5 border-b border-[#00D4FF]/8 shrink-0">
        <div className="flex items-center gap-2">
          {runStatus === 'running' ? (
            <div className="w-3.5 h-3.5 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin shrink-0" />
          ) : (
            <div className={`w-2 h-2 rounded-full bg-[#00D4FF] ${logs.length > 0 ? 'animate-pulse-custom' : ''}`} />
          )}
          <span className="text-xs text-[#8B9CC8] font-mono tracking-wider">
            {runStatus === 'running' ? 'LIVE LOGS (PROCESSING)' : 'LIVE LOGS'}
          </span>
          <span className="text-[10px] text-[#8B9CC8] bg-white/5 border border-[#00D4FF]/10 rounded-full px-1.5 py-0.2">
            {logs.length}
          </span>
        </div>

        <div className="flex gap-2 items-center">
          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`rounded px-2 py-0.5 text-[11px] cursor-pointer transition-all duration-200 border ${
              autoScroll
                ? 'bg-[#00D4FF]/10 border-[#00D4FF]/30 text-[#00D4FF]'
                : 'bg-transparent border-[#00D4FF]/12 text-[#4A5580] hover:text-[#8B9CC8] hover:bg-white/5'
            }`}
            title="Toggle auto-scroll"
          >
            ↓ Auto
          </button>

          {/* Copy button */}
          <button
            onClick={copyLogs}
            disabled={logs.length === 0}
            className={`rounded px-2 py-0.5 text-[11px] cursor-pointer transition-all duration-200 border ${
              copied
                ? 'bg-[#00E676]/10 border-[#00E676]/30 text-[#00E676]'
                : 'bg-transparent border-[#00D4FF]/12 text-[#4A5580] hover:text-[#8B9CC8] hover:bg-white/5'
            }`}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Logs list */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
       className="flex-1 overflow-y-auto p-2 font-mono text-[12px] bg-[#0A0E1A]/60 flex flex-col gap-0.5 min-h-0 max-h-[1200px]"
      >
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-[120px] text-[#4A5580] text-xs font-sans text-center">
            <div>
              <div className="mb-2 text-2xl">📋</div>
              Waiting for agent activity...
            </div>
          </div>
        ) : (
          logs.map((log, idx) => {
            const levelClass = LEVEL_CLASSES[log.level] || LEVEL_CLASSES.info
            const isLast = idx === logs.length - 1
            return (
              <div
                key={idx}
                className={`flex gap-2 items-start p-1 px-1.5 rounded transition-all duration-300 ${
                  isLast ? levelClass.bg : 'bg-transparent'
                }`}
              >
                {/* Timestamp */}
                <span className="text-[#4A5580] shrink-0 text-[11px] mt-0.5">
                  {formatTime(log.timestamp)}
                </span>

                {/* Level badge */}
                <span className={`border text-[10px] shrink-0 font-bold tracking-wider leading-normal px-1 rounded-sm mt-0.5 ${levelClass.color} ${levelClass.bg} ${levelClass.border}`}>
                  {levelClass.label}
                </span>

                {/* Agent name */}
                <span className="text-[#8B9CC8] shrink-0 text-[11px] max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap mt-0.5">
                  [{log.agent}]
                </span>

                {/* Message */}
                <span className={`flex-1 break-all leading-normal ${levelClass.color}`}>
                  {log.message}
                </span>
              </div>
            )
          })
        )}
        {runStatus === 'running' && (
          <div className="flex items-center gap-2 p-1.5 text-[#00D4FF]/60 text-[11px] italic font-sans">
            <div className="w-3 h-3 border border-[#00D4FF]/40 border-t-[#00D4FF] rounded-full animate-spin shrink-0" />
            <span>Agent is working on the next step...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button (when not auto-scrolling) */}
      {!autoScroll && logs.length > 0 && (
        <button
          onClick={() => {
            setAutoScroll(true)
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="sticky bottom-2 mx-auto my-1 bg-[#00D4FF]/15 border border-[#00D4FF]/30 rounded-full px-3 py-1 text-xs text-[#00D4FF] cursor-pointer transition-all duration-200"
        >
          ↓ New logs below
        </button>
      )}
    </div>
  )
}
