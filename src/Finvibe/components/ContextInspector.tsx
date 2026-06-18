import { useState } from 'react'
import { useEngineStore } from '../hooks/engineStore'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

// ─── JSON value rendering ─────────────────────────────────────────────────────
function JsonNode({ value, depth = 0 }: { value: JsonValue; depth?: number }) {
  const [collapsed, setCollapsed] = useState(depth > 2)

  if (value === null) return <span className="text-[#FF9800]">null</span>
  if (typeof value === 'boolean') return <span className="text-[#00D4FF]">{String(value)}</span>
  if (typeof value === 'number') return <span className="text-[#00E676]">{value}</span>
  if (typeof value === 'string') {
    return <span className="text-[#FFB700]">"{value}"</span>
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-[#8B9CC8]">[]</span>
    return (
      <span>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="bg-transparent border-none cursor-pointer text-[#00D4FF] text-xs px-0.5"
        >
          {collapsed ? '▶' : '▼'}
        </button>
        <span className="text-[#8B9CC8]">[</span>
        {collapsed ? (
          <span
            onClick={() => setCollapsed(false)}
            className="text-[#4A5580] cursor-pointer text-xs select-none"
          >
            {' '}{value.length} items{' '}
          </span>
        ) : (
          <div style={{ paddingLeft: `${(depth + 1) * 14}px` }}>
            {value.map((item, i) => (
              <div key={i}>
                <JsonNode value={item as JsonValue} depth={depth + 1} />
                {i < value.length - 1 && <span className="text-[#4A5580]">,</span>}
              </div>
            ))}
          </div>
        )}
        <span className="text-[#8B9CC8]">]</span>
      </span>
    )
  }

  // Object
  const entries = Object.entries(value)
  if (entries.length === 0) return <span className="text-[#8B9CC8]">{'{}'}</span>

  return (
    <span>
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="bg-transparent border-none cursor-pointer text-[#00D4FF] text-xs px-0.5"
      >
        {collapsed ? '▶' : '▼'}
      </button>
      <span className="text-[#8B9CC8]">{'{'}</span>
      {collapsed ? (
        <span
          onClick={() => setCollapsed(false)}
          className="text-[#4A5580] cursor-pointer text-xs select-none"
        >
          {' '}{entries.length} fields{' '}
        </span>
      ) : (
        <div style={{ paddingLeft: `${(depth + 1) * 14}px` }}>
          {entries.map(([key, val], i) => (
            <div key={key} className="flex items-start gap-1">
              <span className="text-[#B57BFF] font-medium">"{key}"</span>
              <span className="text-[#4A5580]">:</span>
              <span><JsonNode value={val as JsonValue} depth={depth + 1} /></span>
              {i < entries.length - 1 && <span className="text-[#4A5580]">,</span>}
            </div>
          ))}
        </div>
      )}
      <span className="text-[#8B9CC8]">{'}'}</span>
    </span>
  )
}

// ─── ContextInspector ─────────────────────────────────────────────────────────
export default function ContextInspector() {
  const { engineContext } = useEngineStore()
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!engineContext) return
    await navigator.clipboard.writeText(JSON.stringify(engineContext, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!engineContext) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center text-[#4A5580]">
        <div className="text-3xl mb-3">🔍</div>
        <div className="text-sm">Engine context will appear here as agents complete their work.</div>
      </div>
    )
  }

  // Filter context by search
  let displayContext: JsonValue = engineContext as JsonValue
  if (search && typeof engineContext === 'object' && engineContext !== null) {
    const filtered: Record<string, JsonValue> = {}
    Object.entries(engineContext as Record<string, JsonValue>).forEach(([k, v]) => {
      if (
        k.toLowerCase().includes(search.toLowerCase()) ||
        JSON.stringify(v).toLowerCase().includes(search.toLowerCase())
      ) {
        filtered[k] = v
      }
    })
    displayContext = filtered
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-2.5 px-3.5 border-b border-[#00D4FF]/8 flex gap-2 items-center shrink-0">
        <div className="flex-1 relative">
          <input
            type="text"
            className="bg-white/5 border border-[#00D4FF]/10 rounded-lg text-[#F0F4FF] font-sans text-xs px-2.5 py-1.5 pl-8 h-8 transition-all duration-200 outline-none w-full focus:border-[#00D4FF] focus:ring-4 focus:ring-[#00D4FF]/15"
            placeholder="Search context fields..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#4A5580" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" stroke="#4A5580" strokeWidth="2" />
          </svg>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all duration-200 border ${
            copied
              ? 'bg-[#00E676]/10 border-[#00E676]/30 text-[#00E676]'
              : 'bg-white/5 border-[#00D4FF]/15 text-[#8B9CC8] hover:text-[#F0F4FF] hover:bg-white/10'
          }`}
        >
          {copied ? '✓ Copied' : 'Copy JSON'}
        </button>
      </div>

      {/* JSON tree */}
      <div className="flex-1 overflow-y-auto p-3.5 px-4 font-mono text-[13px] leading-relaxed">
        <JsonNode value={displayContext} depth={0} />
      </div>

      {/* Stats footer */}
      <div className="p-2 px-3.5 border-t border-[#00D4FF]/8 text-[11.5px] text-[#4A5580] flex gap-3 shrink-0">
        <span>{typeof engineContext === 'object' && engineContext !== null ? Object.keys(engineContext).length : 0} top-level fields</span>
        <span>{JSON.stringify(engineContext).length.toLocaleString()} chars</span>
      </div>
    </div>
  )
}
