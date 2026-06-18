import { useEngineStore } from '../hooks/engineStore'
import AgentCard from './AgentCard'

export default function AgentPipeline() {
  const { agentStatuses, runStatus } = useEngineStore()

  const completedCount = agentStatuses.filter(a => a.status === 'completed').length
  const totalCount = agentStatuses.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div>
      {/* Pipeline header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <h4 className="text-[15px] font-semibold text-[#F0F4FF]">Agent Pipeline</h4>
            <span className="font-mono text-xs text-[#8B9CC8] bg-white/5 border border-[#00D4FF]/12 rounded-md px-2 py-0.5">
              Step {completedCount} of {totalCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {runStatus === 'running' && (
              <span className="flex items-center gap-1.5 text-xs text-[#00D4FF]">
                <span className="w-3.5 h-3.5 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin shrink-0" />
                Running
              </span>
            )}
            {runStatus === 'completed' && (
              <span className="flex items-center gap-1.5 text-xs text-[#00E676]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Complete
              </span>
            )}
            {runStatus === 'failed' && (
              <span className="text-xs text-[#FF1744]">✗ Failed</span>
            )}
            {runStatus === 'awaiting_input' && (
              <span className="flex items-center gap-1.5 text-xs text-[#FFB700]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB700] animate-pulse-slow" />
                Awaiting Input
              </span>
            )}
            <span className={`text-xs font-bold ${progress === 100 ? 'text-[#00E676]' : 'text-[#00D4FF]'}`}>
              {progress}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-[#0F1525] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: runStatus === 'failed'
                ? 'linear-gradient(90deg, #FF1744, #FF6B6B)'
                : runStatus === 'awaiting_input'
                ? 'linear-gradient(90deg, #FFB700, #FF9800)'
                : 'linear-gradient(90deg, #00D4FF, #7B5EA7)',
            }}
          />
        </div>
      </div>

      {/* Agent cards */}
      <div className="flex flex-col">
        {agentStatuses.map((agent, idx) => (
          <AgentCard
            key={agent.step}
            agent={agent}
            isLast={idx === agentStatuses.length - 1}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-5 p-3 px-3.5 bg-white/[0.02] border border-[#00D4FF]/8 rounded-lg flex gap-4 flex-wrap">
        {[
          { dot: 'waiting', label: 'Waiting', colorClass: 'bg-[#4A5580]' },
          { dot: 'running', label: 'Running', colorClass: 'bg-[#00D4FF] animate-pulse-custom' },
          { dot: 'completed', label: 'Completed', colorClass: 'bg-[#00E676]' },
          { dot: 'failed', label: 'Failed', colorClass: 'bg-[#FF1744]' },
          { dot: 'awaiting_input', label: 'Awaiting Input', colorClass: 'bg-[#FFB700] animate-pulse-slow' },
        ].map(({ dot, label, colorClass }) => (
          <div key={dot} className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
            <span className="text-xs text-[#4A5580]">{label}</span>
          </div>
        ))}

        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[10px] font-semibold text-[#B57BFF] bg-[#7B5EA7]/15 border border-[#7B5EA7]/30 rounded px-1.5 py-0.2">AI</span>
          <span className="text-xs text-[#4A5580]">Uses AI provider</span>
        </div>
      </div>
    </div>
  )
}
