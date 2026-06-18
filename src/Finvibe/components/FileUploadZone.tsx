import { useRef, useState } from 'react'

interface FileUploadZoneProps {
  onChange: (file: File | null) => void;
  accept?: string;
  label?: string;
  value?: File | null;
}

const ACCEPTED_FORMATS = ['swagger.json', 'openapi.yaml', 'openapi.json', 'postman_collection.json']

function detectFileType(file: File): string {
  const name = file.name.toLowerCase()
  if (name.includes('postman')) return 'Postman Collection'
  if (name.endsWith('.yaml') || name.endsWith('.yml')) return 'OpenAPI / Swagger YAML'
  if (name.endsWith('.json')) return 'OpenAPI / Swagger JSON'
  return 'API Specification'
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileUploadZone({
  onChange,
  accept = '.json,.yaml,.yml',
  label = 'API Specification',
  value,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFile = (file: File) => {
    onChange(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => setIsDragOver(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {value ? (
        // File selected state
        <div className="bg-[#00D4FF]/5 border border-[#00D4FF]/30 rounded-xl p-4 px-5 flex items-center gap-3.5">
          {/* File icon */}
          <div className="w-11 h-11 rounded-lg bg-[#00D4FF]/10 flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#00D4FF" strokeWidth="1.5" />
              <polyline points="14 2 14 8 20 8" stroke="#00D4FF" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[14.5px] font-semibold text-[#F0F4FF] truncate">
              {value.name}
            </div>
            <div className="flex gap-2 mt-1 flex-wrap">
              <span className="text-xs text-[#8B9CC8]">
                {formatBytes(value.size)}
              </span>
              <span className="text-[11px] font-semibold text-[#00D4FF] bg-[#00D4FF]/10 border border-[#00D4FF]/25 rounded px-1.5 py-0.2">
                {detectFileType(value)}
              </span>
            </div>
          </div>

          <button
            onClick={handleClear}
            className="w-8 h-8 rounded-lg bg-[#FF1744]/10 border border-[#FF1744]/30 text-[#FF1744] hover:bg-[#FF1744]/20 cursor-pointer flex items-center justify-center transition-all duration-200 shrink-0"
            title="Remove file"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ) : (
        // Drop zone
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 px-6 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-[#00D4FF] bg-[#00D4FF]/7 shadow-[0_0_24px_rgba(0,212,255,0.2)]'
              : 'border-[#00D4FF]/25 bg-white/[0.02]'
          }`}
        >
          {/* Upload icon */}
          <div className={`w-13 h-13 mx-auto mb-4 rounded-xl border flex items-center justify-center transition-all duration-200 ${
            isDragOver ? 'bg-[#00D4FF]/15 border-[#00D4FF]/30' : 'bg-white/4 border-[#00D4FF]/20'
          }`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" className={isDragOver ? 'stroke-[#00D4FF]' : 'stroke-[#8B9CC8]'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="font-semibold text-[#F0F4FF] mb-1.5">
            {isDragOver ? 'Drop your file here' : `Drag & drop your ${label}`}
          </div>
          <div className="text-sm text-[#8B9CC8] mb-4">
            or <span className="text-[#00D4FF] font-semibold">browse to upload</span>
          </div>

          {/* Accepted formats */}
          <div className="flex gap-1.5 justify-center flex-wrap">
            {ACCEPTED_FORMATS.map(fmt => (
              <span key={fmt} className="inline-flex items-center px-2 py-0.5 bg-white/5 border border-[#00D4FF]/10 rounded text-[11px] text-[#8B9CC8] font-mono">
                {fmt}
              </span>
            ))}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  )
}
