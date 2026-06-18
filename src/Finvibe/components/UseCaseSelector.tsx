import { useState } from 'react'
import { USE_CASE_REGISTRY } from '../hooks/useCaseRegistry'
import type { UseCase } from '../type/useCases'

interface UseCaseSelectorProps {
  value: string;
  onChange: (useCaseId: string, useCase: UseCase) => void;
  error?: string;
}

type Framework = 'ALL' | 'CBUAE' | 'RBI' | 'SAMA'

const FRAMEWORK_TABS: { key: Framework; flag: string; label: string; sub: string }[] = [
  { key: 'ALL',   flag: '🌐', label: 'All',          sub: '' },
  { key: 'CBUAE', flag: '🇦🇪', label: 'UAE',          sub: 'CBUAE' },
  { key: 'RBI',   flag: '🇮🇳', label: 'India',        sub: 'RBI' },
  { key: 'SAMA',  flag: '🇸🇦', label: 'Saudi Arabia', sub: 'SAMA' },
]

const TAB_ACTIVE: Record<Framework, string> = {
  ALL:   'border-[#00D4FF] bg-[#00D4FF]/10 text-[#00D4FF]',
  CBUAE: 'border-[#1E6FD9] bg-[#1E6FD9]/10 text-[#1E6FD9]',
  RBI:   'border-[#E85D00] bg-[#E85D00]/10 text-[#E85D00]',
  SAMA:  'border-[#00875A] bg-[#00875A]/10 text-[#00875A]',
}

const TAB_COUNT_ACTIVE: Record<Framework, string> = {
  ALL:   'text-[#00D4FF] bg-[#00D4FF]/15',
  CBUAE: 'text-[#1E6FD9] bg-[#1E6FD9]/15',
  RBI:   'text-[#E85D00] bg-[#E85D00]/15',
  SAMA:  'text-[#00875A] bg-[#00875A]/15',
}

const FRAMEWORK_BADGE: Record<string, string> = {
  CBUAE: 'text-[#1E6FD9] bg-[#1E6FD9]/10 border border-[#1E6FD9]/20',
  RBI:   'text-[#E85D00] bg-[#E85D00]/10 border border-[#E85D00]/20',
  SAMA:  'text-[#00875A] bg-[#00875A]/10 border border-[#00875A]/20',
}

const COMPLEXITY_CLASSES: Record<string, string> = {
  LOW:       'text-[#00E676] bg-[#00E676]/8 border-[#00E676]/30',
  MEDIUM:    'text-[#FFB700] bg-[#FFB700]/8 border-[#FFB700]/30',
  HIGH:      'text-[#FF9800] bg-[#FF9800]/8 border-[#FF9800]/30',
  VERY_HIGH: 'text-[#FF1744] bg-[#FF1744]/8 border-[#FF1744]/30',
}

export default function UseCaseSelector({ value, onChange, error }: UseCaseSelectorProps) {
  const [activeFramework, setActiveFramework] = useState<Framework>('ALL')
  const [search, setSearch] = useState('')
  const [customText, setCustomText] = useState('')

  const filtered = USE_CASE_REGISTRY.filter(uc => {
    const matchesFramework = activeFramework === 'ALL' || uc.framework === activeFramework
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      uc.name.toLowerCase().includes(q) ||
      uc.id.toLowerCase().includes(q) ||
      uc.category.toLowerCase().includes(q) ||
      uc.tags.some(t => t.toLowerCase().includes(q))
    return matchesFramework && matchesSearch
  })

  const selectedUC = USE_CASE_REGISTRY.find(uc => uc.id === value)

  return (
    <div className="flex flex-col gap-3">

      {/* Framework tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {FRAMEWORK_TABS.map(tab => {
          const isActive = activeFramework === tab.key
          const count = tab.key === 'ALL'
            ? USE_CASE_REGISTRY.length
            : USE_CASE_REGISTRY.filter(uc => uc.framework === tab.key).length
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFramework(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-semibold cursor-pointer transition-all duration-200 ${
                isActive
                  ? TAB_ACTIVE[tab.key]
                  : 'border-[#00D4FF]/10 text-[#4A5580] hover:text-[#8B9CC8] hover:border-[#00D4FF]/20 bg-white/[0.02]'
              }`}
            >
              <span className="text-sm">{tab.flag}</span>
              <span>{tab.label}</span>
              {tab.sub && (
                <span className="text-[9px] opacity-60 font-mono">{tab.sub}</span>
              )}
              <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-mono font-bold ${
                isActive ? TAB_COUNT_ACTIVE[tab.key] : 'text-[#4A5580] bg-white/5'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          className="bg-white/5 border border-[#00D4FF]/10 rounded-lg text-[#F0F4FF] text-[13px] px-4 py-2.5 pl-9 outline-none w-full transition-all duration-200 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/15 placeholder:text-[#4A5580]"
          placeholder="Search use cases, categories, tags..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="#4A5580" strokeWidth="2" />
          <path d="m21 21-4.35-4.35" stroke="#4A5580" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A5580] hover:text-[#F0F4FF] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* List */}
      <div className={`max-h-[280px] overflow-y-auto rounded-xl border bg-white/[0.015] ${
        error ? 'border-[#FF1744]' : 'border-[#00D4FF]/10'
      }`}>
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-[#4A5580] text-[13px]">
            No use cases match your search.
          </div>
        ) : (
          filtered.map((uc, i) => {
            const isSelected = uc.id === value
            return (
              <div
                key={uc.id}
                onClick={() => onChange(uc.id, uc)}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all duration-150 ${
                  i !== filtered.length - 1 ? 'border-b border-[#00D4FF]/5' : ''
                } ${isSelected ? 'bg-[#00D4FF]/8' : 'hover:bg-white/[0.03]'}`}
              >
                {/* Radio dot */}
                <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-150 ${
                  isSelected ? 'border-[#00D4FF] bg-[#00D4FF]' : 'border-[#00D4FF]/25'
                }`}>
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  )}
                </div>

                {/* ID + Name */}
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[#00D4FF] bg-[#00D4FF]/8 border border-[#00D4FF]/15 rounded px-1.5 py-0.5 shrink-0">
                    {uc.id}
                  </span>
                  <span className={`text-[13px] truncate ${
                    isSelected ? 'text-[#F0F4FF] font-semibold' : 'text-[#C8D0E8]'
                  }`}>
                    {uc.name}
                  </span>
                  <span className={`hidden sm:inline-flex shrink-0 text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full ${
                    FRAMEWORK_BADGE[uc.framework]
                  }`}>
                    {uc.framework}
                  </span>
                </div>

                {/* Complexity */}
                <span className={`shrink-0 text-[9px] font-bold border rounded px-1.5 py-0.5 uppercase ${
                  COMPLEXITY_CLASSES[uc.technicalComplexity]
                }`}>
                  {uc.technicalComplexity.replace('_', ' ')}
                </span>
              </div>
            )
          })
        )}
      </div>
      {/* Custom use case option */}
<div
  onClick={() => {
    const customUC: UseCase = {
      id: 'CUSTOM',
      name: customText.trim().slice(0, 60) || 'Custom Use Case',
      framework: 'CBUAE',
      geography: 'Custom',
      category: 'Custom',
      description: customText.trim() || 'User-defined custom use case',
      tags: ['custom'],
      technicalComplexity: 'MEDIUM',
    }
    onChange('CUSTOM', customUC)
  }}
  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-lg border transition-all duration-150 ${
    value === 'CUSTOM'
      ? 'border-[#00D4FF]/30 bg-[#00D4FF]/8'
      : 'border-[#00D4FF]/10 bg-white/[0.015] hover:bg-white/[0.03] hover:border-[#00D4FF]/20'
  }`}
>
  <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-150 ${
    value === 'CUSTOM' ? 'border-[#00D4FF] bg-[#00D4FF]' : 'border-[#00D4FF]/25'
  }`}>
    {value === 'CUSTOM' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
  </div>
  <div className="flex-1 min-w-0">
    <span className="text-[13px] text-[#8B9CC8]">
      Other —{' '}
      <span className={value === 'CUSTOM' ? 'text-[#00D4FF]' : 'text-[#C8D0E8]'}>
        describe your own use case
      </span>
    </span>
  </div>
  <span className="text-[9px] font-bold border rounded px-1.5 py-0.5 uppercase text-[#8B9CC8] bg-white/5 border-[#00D4FF]/10">
    CUSTOM
  </span>
</div>

{/* Custom use case text input — shown when CUSTOM is selected */}
{value === 'CUSTOM' && (
  <div className="flex flex-col gap-1.5">
    <textarea
      autoFocus
      rows={3}
      className="bg-white/5 border border-[#00D4FF]/20 rounded-lg text-[#F0F4FF] text-[13px] px-4 py-3 outline-none w-full transition-all duration-200 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/15 placeholder:text-[#4A5580] resize-none leading-relaxed"
      placeholder="e.g. Real-time fraud detection for cross-border SWIFT transactions under CBUAE guidelines..."
      value={customText}
      onChange={e => {
        setCustomText(e.target.value)
        const customUC: UseCase = {
          id: 'CUSTOM',
          name: e.target.value.trim().slice(0, 60) || 'Custom Use Case',
          framework: 'CBUAE',
          geography: 'Custom',
          category: 'Custom',
          description: e.target.value || 'User-defined custom use case',
          tags: ['custom'],
          technicalComplexity: 'MEDIUM',
        }
        onChange('CUSTOM', customUC)
      }}
    />
    <p className="text-[10px] text-[#4A5580]">
      Describe your use case in plain language — the engine will analyze and generate accordingly.
    </p>
  </div>
)}

      {error && (
        <span className="text-[11px] text-[#FF6B6B]">⚠ {error}</span>
      )}

      {/* Selected use case detail card */}
      {selectedUC && (
        <div className="p-3.5 bg-[#00D4FF]/5 border border-[#00D4FF]/15 rounded-lg">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[13px] font-semibold text-[#F0F4FF]">{selectedUC.name}</span>
            <span className={`text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full ${
              FRAMEWORK_BADGE[selectedUC.framework]
            }`}>
              {selectedUC.framework}
            </span>
            <span className={`text-[9px] font-bold border rounded px-1.5 py-0.5 uppercase ml-auto ${
              COMPLEXITY_CLASSES[selectedUC.technicalComplexity]
            }`}>
              {selectedUC.technicalComplexity.replace('_', ' ')}
            </span>
          </div>
          <p className="text-[12px] text-[#8B9CC8] leading-relaxed mb-2">
            {selectedUC.description}
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {selectedUC.tags.slice(0, 5).map(tag => (
              <span key={tag} className="px-1.5 py-0.5 bg-white/5 border border-[#00D4FF]/10 rounded text-[10px] text-[#4A5580] font-mono">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}