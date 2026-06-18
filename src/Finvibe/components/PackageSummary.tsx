import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEngineStore } from '../hooks/engineStore'

interface FileNode {
  name: string;
  description: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

const PACKAGE_MANIFEST: FileNode[] = [
  {
    name: 'backend/', type: 'folder', description: 'Java Spring Boot application', children: [
      { name: 'src/main/java/', type: 'folder', description: 'Application source code', children: [
        { name: 'Application.java', type: 'file', description: 'Spring Boot entry point' },
        { name: 'controller/LoanController.java', type: 'file', description: 'REST API endpoints' },
        { name: 'service/LoanService.java', type: 'file', description: 'Business logic with AI integration' },
        { name: 'service/AIDecisionService.java', type: 'file', description: 'AI-powered decisioning service' },
        { name: 'service/ComplianceEngine.java', type: 'file', description: 'Regulatory compliance enforcement' },
        { name: 'repository/LoanRepository.java', type: 'file', description: 'JPA data access layer' },
        { name: 'model/LoanApplication.java', type: 'file', description: 'JPA entity with compliance fields' },
        { name: 'dto/', type: 'folder', description: 'Request/Response DTOs' },
        { name: 'config/SecurityConfig.java', type: 'file', description: 'Spring Security configuration' },
        { name: 'config/AIProviderConfig.java', type: 'file', description: 'AI provider integration config' },
      ]},
      { name: 'src/main/resources/', type: 'folder', description: 'Configuration files', children: [
        { name: 'application.yml', type: 'file', description: 'Application configuration' },
        { name: 'application-prod.yml', type: 'file', description: 'Production overrides' },
      ]},
      { name: 'pom.xml', type: 'file', description: 'Maven build file with all dependencies' },
    ],
  },
  {
    name: 'frontend/', type: 'folder', description: 'React TypeScript application', children: [
      { name: 'src/pages/', type: 'folder', description: 'Application screens' },
      { name: 'src/components/', type: 'folder', description: 'Reusable UI components' },
      { name: 'src/services/apiClient.ts', type: 'file', description: 'Axios-based API client' },
      { name: 'src/store/', type: 'folder', description: 'State management (Zustand)' },
      { name: 'package.json', type: 'file', description: 'Node.js dependencies' },
      { name: 'vite.config.ts', type: 'file', description: 'Vite build configuration' },
    ],
  },
  {
    name: 'database/', type: 'folder', description: 'Database migration scripts', children: [
      { name: 'V1__create_schema.sql', type: 'file', description: 'Initial schema creation' },
      { name: 'V2__create_indexes.sql', type: 'file', description: 'Performance indexes' },
      { name: 'V3__seed_compliance_rules.sql', type: 'file', description: 'Regulatory rules seed data' },
      { name: 'V4__create_audit_tables.sql', type: 'file', description: 'Audit trail tables' },
    ],
  },
  {
    name: 'tests/', type: 'folder', description: 'Test suites', children: [
      { name: 'unit/LoanServiceTest.java', type: 'file', description: 'Unit tests for business logic' },
      { name: 'unit/ComplianceEngineTest.java', type: 'file', description: 'Compliance rule validation tests' },
      { name: 'integration/LoanAPITest.java', type: 'file', description: 'API integration tests' },
      { name: 'compliance/RegulatoryTest.java', type: 'file', description: 'Framework compliance tests' },
      { name: 'e2e/ApplicationFlowTest.java', type: 'file', description: 'End-to-end flow tests' },
    ],
  },
  {
    name: 'config/', type: 'folder', description: 'Deployment configuration', children: [
      { name: 'docker-compose.yml', type: 'file', description: 'Docker Compose with all services' },
      { name: 'Dockerfile', type: 'file', description: 'Backend container definition' },
      { name: '.env.example', type: 'file', description: 'Environment variables template' },
      { name: 'nginx.conf', type: 'file', description: 'Nginx reverse proxy config' },
    ],
  },
  {
    name: 'docs/', type: 'folder', description: 'Documentation', children: [
      { name: 'README.md', type: 'file', description: 'Setup and usage guide' },
      { name: 'API_SPEC.yaml', type: 'file', description: 'OpenAPI specification' },
      { name: 'COMPLIANCE_GUIDE.md', type: 'file', description: 'Regulatory compliance documentation' },
      { name: 'ARCHITECTURE.md', type: 'file', description: 'Architecture overview document' },
    ],
  },
]

function countFiles(nodes: FileNode[]): number {
  return nodes.reduce((acc, node) => {
    if (node.type === 'file') return acc + 1
    return acc + countFiles(node.children ?? [])
  }, 0)
}

// ─── File Tree Node ───────────────────────────────────────────────────────────
function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [open, setOpen] = useState(depth === 0)

  return (
    <div>
      <div
        onClick={() => node.type === 'folder' && setOpen(!open)}
        style={{ paddingLeft: `${8 + depth * 18}px` }}
        className={`flex items-start gap-2 p-1 rounded cursor-pointer transition-all duration-150 bg-transparent hover:bg-white/5 ${
          node.type === 'folder' ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        {/* Icon */}
        <span className="text-sm shrink-0 mt-[1px]">
          {node.type === 'folder' ? (open ? '📂' : '📁') : '📄'}
        </span>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <span className={`font-mono text-xs ${
            node.type === 'folder' ? 'text-[#00D4FF] font-semibold' : 'text-[#C8D0E8] font-normal'
          }`}>
            {node.name}
          </span>
          {node.description && (
            <span className="text-[11.5px] text-[#4A5580] ml-2">
              — {node.description}
            </span>
          )}
        </div>

        {/* Expand icon for folders */}
        {node.type === 'folder' && (
          <svg
            className={`shrink-0 transition-transform duration-200 mt-1 ${open ? 'rotate-90' : ''}`}
            width="12" height="12" viewBox="0 0 24 24" fill="none"
          >
            <path d="M9 18l6-6-6-6" stroke="#4A5580" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {node.type === 'folder' && open && node.children && (
        <div>
          {node.children.map((child, i) => (
            <FileTreeNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── PackageSummary ───────────────────────────────────────────────────────────
export default function PackageSummary() {
  const { downloadUrl, stage1Data, sessionId } = useEngineStore()
  const navigate = useNavigate()
  const [expandedStep, setExpandedStep] = useState<number | null>(0)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)


  const handleDownload = async () => {
    if (!downloadUrl) return
    setDownloading(true)
    setDownloadError(null)
    try {
      const response = await fetch(downloadUrl)
      if (!response.ok) throw new Error(`Server returned ${response.status}`)

      // Try to extract filename from Content-Disposition header
      let filename = `generated-package.zip`
      const cd = response.headers.get('content-disposition')
      if (cd) {
        // Try RFC 5987 format first: filename*=UTF-8''name.zip
        const rfc5987 = cd.match(/filename\*=UTF-8''([^;\s]+)/i)
        if (rfc5987) {
          filename = decodeURIComponent(rfc5987[1])
        } else {
          // Fallback: filename="name.zip" or filename=name.zip
          const plain = cd.match(/filename="?([^"]+)"?/i)
          if (plain) filename = plain[1]
        }
      }
      if (!filename.endsWith('.zip')) filename += '.zip'

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objectUrl)
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Download failed')
    } finally {
      setDownloading(false)
    }
  }

  const totalFiles = countFiles(PACKAGE_MANIFEST)

  const nextSteps = [
    {
      title: '1. Setup Environment',
      content: (
        <div className="font-mono text-xs">
          <div className="text-[#4A5580] mb-2"># Copy environment file and configure values</div>
          <div className="text-[#00E676]">cp .env.example .env</div>
          <div className="text-[#00E676]">vi .env  # Set API keys and DB credentials</div>
        </div>
      ),
    },
    {
      title: '2. Run with Docker',
      content: (
        <div className="font-mono text-xs">
          <div className="text-[#4A5580] mb-2"># Start all services (Backend + Frontend + PostgreSQL)</div>
          <div className="text-[#00E676]">docker-compose up -d</div>
          <div className="text-[#8B9CC8] mt-2">Backend: http://localhost:3001</div>
          <div className="text-[#8B9CC8]">Frontend: http://localhost:3000</div>
        </div>
      ),
    },
    {
      title: '3. Configure External APIs',
      content: (
        <div className="text-[13px] text-[#8B9CC8] leading-relaxed">
          Update <code className="text-[#00D4FF] bg-[#00D4FF]/10 px-1 py-0.2 rounded border border-[#00D4FF]/20 font-mono text-xs">application.yml</code> with your sandbox/production API keys for{' '}
          {stage1Data?.regulatoryFramework === 'CBUAE' ? 'AECB, UAE Pass' :
           stage1Data?.regulatoryFramework === 'RBI' ? 'CIBIL, Aadhaar, NPCI' :
           'Simah, Saudi Payments'} and other regulatory APIs.
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Success header */}
      <div className="p-7 bg-[#00E676]/5 border border-[#00E676]/30 rounded-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00E676]/15 border-2 border-[#00E676] flex items-center justify-center">
          <svg className="animate-check-in" width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-[#00E676] mb-1.5">Package Ready!</h3>
        <p className="text-xs text-[#8B9CC8] mb-5">
          Your production-ready banking service has been generated successfully.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { value: `${totalFiles}+`, label: 'Files Generated' },
            { value: '4', label: 'Test Suites' },
            { value: '~30m', label: 'Est. Setup Time' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-[#00E676]/5 border border-[#00E676]/20 rounded-xl p-3 py-2">
              <div className="text-xl font-extrabold text-[#00E676]">{value}</div>
              <div className="text-[11px] text-[#4A5580] mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Download button */}
        {downloadUrl && (
          <>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-lg font-sans text-[15px] font-semibold cursor-pointer border-none transition-all duration-200 bg-gradient-to-r from-[#FFB700] to-[#CC8800] text-black shadow-[0_4px_16px_rgba(255,183,0,0.3)] hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(255,183,0,0.5)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed w-full"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  ⬇ Download ZIP Package
                </>
              )}
            </button>
            {downloadError && (
              <div className="text-[12px] text-[#FF6B6B] text-center mt-1">
                ⚠ {downloadError}
              </div>
            )}
          </>
        )}
      </div>

      {/* File manifest */}
      <div className="bg-white/[0.03] border border-[#00D4FF]/10 rounded-2xl overflow-hidden">
        <div className="p-3.5 px-4.5 border-b border-[#00D4FF]/8 flex items-center gap-2">
          <span className="text-sm font-semibold text-[#F0F4FF]">📦 Package Manifest</span>
          <span className="text-[10px] text-[#8B9CC8] bg-white/5 border border-[#00D4FF]/10 rounded-full px-2 py-0.2 font-mono">
            {totalFiles}+ files
          </span>
        </div>

        <div className="p-2 max-h-[280px] overflow-y-auto">
          {PACKAGE_MANIFEST.map((node, i) => (
            <FileTreeNode key={i} node={node} depth={0} />
          ))}
        </div>
      </div>

      {/* Next steps */}
      <div className="bg-white/[0.03] border border-[#00D4FF]/10 rounded-2xl overflow-hidden">
        <div className="p-3.5 px-4.5 border-b border-[#00D4FF]/8">
          <span className="text-sm font-semibold text-[#F0F4FF]">🚀 Next Steps</span>
        </div>

        <div className="p-2 flex flex-col gap-1.5">
          {nextSteps.map((step, i) => (
            <div key={i} className="border border-[#00D4FF]/10 rounded-lg overflow-hidden transition-all duration-200">
              <div
                className="flex items-center justify-between p-3.5 px-4 bg-white/5 hover:bg-white/[0.07] cursor-pointer select-none transition-all duration-200"
                onClick={() => setExpandedStep(expandedStep === i ? null : i)}
              >
                <span className="text-[14px] font-semibold text-[#F0F4FF]">
                  {step.title}
                </span>
                <svg
                  className={`transition-transform duration-200 ${expandedStep === i ? 'rotate-90' : ''}`}
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                >
                  <path d="M9 18l6-6-6-6" stroke="#8B9CC8" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              {expandedStep === i && (
                <div className="p-3.5 px-4 bg-[#0F1525] border-t border-[#00D4FF]/10">
                  {step.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Run another button */}
      <button
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-sans text-[15px] font-semibold cursor-pointer border transition-all duration-200 bg-white/5 text-[#F0F4FF] border-[#00D4FF]/10 hover:border-[#00D4FF] hover:text-[#00D4FF] w-full"
        onClick={() => navigate('/generate')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Generate Another Use Case
      </button>
    </div>
  )
}
