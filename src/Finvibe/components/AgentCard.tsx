import type { AgentInfo } from '../type/agents'

interface AgentCardProps {
  agent: AgentInfo;
  isLast: boolean;
}

const STATUS_CLASSES = {
  waiting: {
    container: 'bg-white/[0.02] border-[#00D4FF]/10',
    dot: 'bg-[#4A5580]',
    badge: 'text-[#4A5580] bg-[#4A5580]/10 border-[#4A5580]/20',
    numberCircle: 'bg-[#4A5580]/10 border-[#4A5580] text-[#4A5580]',
    label: 'Waiting',
  },
  running: {
    container: 'bg-[#00D4FF]/5 border-[#00D4FF]/30 shadow-[0_0_16px_rgba(0,212,255,0.12)]',
    dot: 'bg-[#00D4FF] animate-pulse-custom',
    badge: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/20',
    numberCircle: 'bg-[#00D4FF]/10 border-[#00D4FF] text-[#00D4FF] shadow-[0_0_12px_rgba(0,212,255,0.5)]',
    label: 'Running',
  },
  completed: {
    container: 'bg-white/[0.02] border-[#00E676]/15',
    dot: 'bg-[#00E676]',
    badge: 'text-[#00E676] bg-[#00E676]/10 border-[#00E676]/20',
    numberCircle: 'bg-[#00E676]/10 border-[#00E676] text-[#00E676]',
    label: 'Completed',
  },
  failed: {
    container: 'bg-white/[0.02] border-[#FF1744]/20',
    dot: 'bg-[#FF1744]',
    badge: 'text-[#FF1744] bg-[#FF1744]/10 border-[#FF1744]/20',
    numberCircle: 'bg-[#FF1744]/10 border-[#FF1744] text-[#FF1744]',
    label: 'Failed',
  },
  awaiting_input: {
    container: 'bg-[#FFB700]/5 border-[#FFB700]/30',
    dot: 'bg-[#FFB700] animate-pulse-slow',
    badge: 'text-[#FFB700] bg-[#FFB700]/10 border-[#FFB700]/20',
    numberCircle: 'bg-[#FFB700]/10 border-[#FFB700] text-[#FFB700]',
    label: 'Awaiting Input',
  },
}

function formatDuration(agent: AgentInfo): string | null {
  if (!agent.startTime || !agent.endTime) return null
  const ms = new Date(agent.endTime).getTime() - new Date(agent.startTime).getTime()
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

export default function AgentCard({ agent, isLast }: AgentCardProps) {
  const cls = STATUS_CLASSES[agent.status] ?? STATUS_CLASSES.waiting
  const duration = formatDuration(agent)
  const isRunning = agent.status === 'running'
  const isCompleted = agent.status === 'completed'
  const isFailed = agent.status === 'failed'
  const isAwaiting = agent.status === 'awaiting_input'

  return (
    <div className="flex flex-col">
      <div className={`flex items-start gap-3.5 p-3.5 px-4 rounded-xl border transition-all duration-300 ${cls.container}`}>
        {/* Step number circle */}
        <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 relative ${cls.numberCircle}`}>
          {isRunning ? (
            <div className="w-4 h-4 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
          ) : isCompleted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : isFailed ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#FF1744" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : isAwaiting ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M10 15l5-5-5-5" stroke="#FFB700" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 15l5-5-5-5" stroke="#FFB700" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <span className="text-[11px] font-bold font-mono">
              {agent.step + 1}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[14.5px] font-semibold ${isRunning ? 'text-[#F0F4FF] font-bold' : isCompleted ? 'text-[#C8D0E8]' : 'text-[#8B9CC8]'}`}>
              {agent.label}
            </span>

            {agent.callsAI && (
              <span className="text-[10px] font-semibold text-[#B57BFF] bg-[#7B5EA7]/15 border border-[#7B5EA7]/30 rounded px-1.5 py-0.2">
                AI
              </span>
            )}

            <span className="ml-auto flex-shrink-0">
              <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold border rounded-md px-2 py-0.5 ${cls.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cls.dot}`} />
                {cls.label}
              </span>
            </span>
          </div>

          <p className="text-[13px] text-[#4A5580] mt-1 leading-normal">
            {agent.description}
          </p>

          {/* Duration & output */}
          {(duration ?? agent.outputSummary) && (
            <div className="flex gap-3 mt-2 flex-wrap">
              {duration && (
                <span className="text-[12px] text-[#00E676] font-mono">
                  ⏱ {duration}
                </span>
              )}
              {agent.outputSummary && (
                <span className="text-[12px] text-[#4A5580] overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px]">
                  {agent.outputSummary}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Connector line */}
      {!isLast && (
        <div className={`w-[2px] h-3 ml-7 rounded-[1px] transition-all duration-300 ${
          isCompleted 
            ? 'bg-gradient-to-b from-[#00E676] to-[#00E676]/30' 
            : 'bg-[#00D4FF]/10'
        }`} />
      )}
    </div>
  )
}
