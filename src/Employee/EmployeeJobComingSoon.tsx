import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Clock3,
  IndianRupee,
  MapPin,
  PlusCircle,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

import BASE_URL from '../Config';
import { getEmployeeAuth } from './employeeAuthCookie';

interface EmployeeJob {
  id: string;
  userId?: string | null;
  userId1?: string | null;
  companyId?: string | null;
  companyLogo?: string | null;
  jobTitle?: string | null;
  jobDesignation?: string | null;
  companyName?: string | null;
  industry?: string | null;
  jobLocations?: string | null;
  jobType?: string | null;
  description?: string | null;
  benefits?: string | null;
  skills?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  qualifications?: string | null;
  workMode?: string | null;
  applicationDeadLine?: number | string | null;
  experience?: string | null;
  contactNumber?: string | null;
  countryCode?: string | null;
  jobStatus?: boolean | null;
  jobSource?: string | null;
  companyEmail?: string | null;
  companyWebsiteUrl?: string | null;
  companyLinkedinUrl?: string | null;
  companyAddress?: string | null;
  companyHeadQuarterLocation?: string | null;
  createdAt?: number | string | null;
  updatedAt?: number | string | null;
  payRateFrequencyType?: string | null;
  hideCompanyName?: boolean | null;
}

type StatusFilter = 'all' | 'active' | 'inactive';

const ADD_JOB_ROUTE = '/employeedashboard/addjobbycompanyemployee';
const LOGIN_ROUTE = '/companyemployeelogin';

const EmployeeJobComingSoon: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<EmployeeJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [updatingStatusIds, setUpdatingStatusIds] = useState<Set<string>>(new Set());
  const [statusErrors, setStatusErrors] = useState<Record<string, string>>({});

  const loadJobs = useCallback(
    async (signal?: AbortSignal, isRefresh = false) => {
      // getEmployeeAuth() validates the cookie's shape AND that
      // primaryType === "JOBS" in one call. A missing/corrupt cookie or a
      // wrong-role session sends the employee back to login instead of
      // letting this page fire a request with a bad/missing id.
      const auth = getEmployeeAuth();

      if (!auth) {
        navigate(LOGIN_ROUTE, { replace: true });
        return;
      }

      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError('');

      try {
        const response = await fetch(
          `${BASE_URL}/marketing-service/campgin/getalljobsbyuserid?userId=${encodeURIComponent(
            auth.id
          )}`,
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
            signal,
          }
        );

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            result?.message || `Unable to load jobs. Server returned ${response.status}.`
          );
        }

        const receivedJobs: EmployeeJob[] = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.jobs)
          ? result.jobs
          : Array.isArray(result?.content)
          ? result.content
          : [];

        setJobs(receivedJobs);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;

        setJobs([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load jobs. Please try again.'
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [navigate]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadJobs(controller.signal);
    return () => controller.abort();
  }, [loadJobs]);

  const counts = useMemo(() => {
    const active = jobs.filter((job) => job.jobStatus === true).length;
    const inactive = jobs.length - active;

    return {
      total: jobs.length,
      active,
      inactive,
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && job.jobStatus === true) ||
        (statusFilter === 'inactive' && job.jobStatus !== true);

      if (!matchesStatus) return false;
      if (!normalizedSearch) return true;

      const searchableContent = [
        job.jobTitle,
        job.jobDesignation,
        job.companyName,
        job.industry,
        job.jobLocations,
        job.jobType,
        job.skills,
        job.experience,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableContent.includes(normalizedSearch);
    });
  }, [jobs, searchTerm, statusFilter]);

  const handleRefresh = () => {
    loadJobs(undefined, true);
  };

  const handleStatusChange = async (jobId: string, currentStatus: boolean) => {
    if (updatingStatusIds.has(jobId)) return;

    // Re-validate right before mutating anything. If the session expired
    // or lost JOBS access while this page was open, block the update and
    // send the employee back to login instead of firing a stale request.
    const auth = getEmployeeAuth();
    if (!auth) {
      navigate(LOGIN_ROUTE, { replace: true });
      return;
    }

    const nextStatus = !currentStatus;
    setUpdatingStatusIds((current) => new Set(current).add(jobId));
    setStatusErrors((current) => {
      const next = { ...current };
      delete next[jobId];
      return next;
    });

    try {
      const response = await fetch(
        `${BASE_URL}/marketing-service/campgin/updatejobstatus`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: jobId,
            jobStatus: nextStatus,
          }),
        }
      );

      const result = await response.json().catch(() => null);
      const explicitlyFailed =
        result?.success === false ||
        result?.status === 'failed' ||
        result?.status === 'error';

      if (!response.ok || explicitlyFailed) {
        throw new Error(result?.message || 'Unable to update the job status.');
      }

      setJobs((current) =>
        current.map((job) =>
          job.id === jobId ? { ...job, jobStatus: nextStatus } : job
        )
      );
    } catch (requestError) {
      setStatusErrors((current) => ({
        ...current,
        [jobId]:
          requestError instanceof Error
            ? requestError.message
            : 'Unable to update the job status. Please try again.',
      }));
    } finally {
      setUpdatingStatusIds((current) => {
        const next = new Set(current);
        next.delete(jobId);
        return next;
      });
    }
  };

  return (
    <section className="ejjobs-page" aria-labelledby="employee-jobs-title">
      <style>{employeeJobsStyles}</style>

      <header className="ejjobs-header">
        <div className="ejjobs-heading">
          <span className="ejjobs-heading-icon" aria-hidden="true">
            <BriefcaseBusiness />
          </span>
          <div>
            <span className="ejjobs-eyebrow">Recruitment Workspace</span>
            <h1 id="employee-jobs-title">Your jobs</h1>
            <p>View and manage every role created from your employee account.</p>
          </div>
        </div>

        <div className="ejjobs-header-actions">
          <button
            type="button"
            className="ejjobs-refresh"
            onClick={handleRefresh}
            disabled={loading || refreshing}
          >
            <RefreshCw className={refreshing ? 'ejjobs-spin' : ''} />
            <span>{refreshing ? 'Refreshing…' : 'Refresh'}</span>
          </button>
          <button
            type="button"
            className="ejjobs-add-button"
            onClick={() => navigate(ADD_JOB_ROUTE)}
          >
            <PlusCircle />
            <span>Add new job</span>
          </button>
        </div>
      </header>

      <div className="ejjobs-stats" aria-label="Job summary">
        <SummaryCard
          label="Total jobs"
          value={counts.total}
          icon={<BriefcaseBusiness />}
          tone="violet"
        />
        <SummaryCard
          label="Active jobs"
          value={counts.active}
          icon={<CheckCircle2 />}
          tone="green"
        />
        <SummaryCard
          label="Inactive jobs"
          value={counts.inactive}
          icon={<Clock3 />}
          tone="pink"
        />
      </div>

      <div className="ejjobs-toolbar">
        <label className="ejjobs-search" htmlFor="employee-job-search">
          <Search aria-hidden="true" />
          <input
            id="employee-job-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by title, company, location or skill…"
          />
        </label>

        <div className="ejjobs-filter-wrap">
          <span className="ejjobs-filter-label">
            <SlidersHorizontal /> Status
          </span>
          <div className="ejjobs-filters" role="group" aria-label="Filter jobs by status">
            {(['all', 'active', 'inactive'] as StatusFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                className={statusFilter === filter ? 'ejjobs-filter-active' : ''}
                onClick={() => setStatusFilter(filter)}
                aria-pressed={statusFilter === filter}
              >
                {filter === 'all' ? 'All' : filter === 'active' ? 'Active' : 'Inactive'}
                <small>
                  {filter === 'all'
                    ? counts.total
                    : filter === 'active'
                    ? counts.active
                    : counts.inactive}
                </small>
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <JobSkeletons />
      ) : error ? (
        <div className="ejjobs-state-card ejjobs-error" role="alert">
          <span aria-hidden="true"><CircleAlert /></span>
          <h2>Unable to load your jobs</h2>
          <p>{error}</p>
          <button type="button" onClick={handleRefresh}>
            <RefreshCw /> Try again
          </button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="ejjobs-state-card">
          <span aria-hidden="true"><Sparkles /></span>
          <h2>{jobs.length ? 'No matching jobs' : 'No jobs posted yet'}</h2>
          <p>
            {jobs.length
              ? 'Try a different keyword or select another status filter.'
              : 'Create your first role and it will appear here automatically.'}
          </p>
          {jobs.length ? (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              Clear filters
            </button>
          ) : (
            <button type="button" onClick={() => navigate(ADD_JOB_ROUTE)}>
              <PlusCircle /> Add your first job
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="ejjobs-result-line">
            <span>
              Showing <strong>{filteredJobs.length}</strong>{' '}
              {filteredJobs.length === 1 ? 'job' : 'jobs'}
            </span>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="ejjobs-grid">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                expanded={expandedJobId === job.id}
                updatingStatus={updatingStatusIds.has(job.id)}
                statusError={statusErrors[job.id]}
                onStatusChange={() => handleStatusChange(job.id, job.jobStatus === true)}
                onToggle={() =>
                  setExpandedJobId((current) => (current === job.id ? null : job.id))
                }
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: 'violet' | 'green' | 'pink';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, icon, tone }) => (
  <article className={`ejjobs-stat-card ejjobs-stat-${tone}`}>
    <span aria-hidden="true">{icon}</span>
    <div>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  </article>
);

interface JobCardProps {
  job: EmployeeJob;
  expanded: boolean;
  updatingStatus: boolean;
  statusError?: string;
  onStatusChange: () => void;
  onToggle: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  expanded,
  updatingStatus,
  statusError,
  onStatusChange,
  onToggle,
}) => {
  const skills = splitCommaValues(job.skills);
  const title = job.jobTitle || job.jobDesignation || 'Untitled role';
  const companyName = job.hideCompanyName
    ? 'Confidential company'
    : job.companyName || 'Company not specified';
  const statusIsActive = job.jobStatus === true;

  return (
    <article className={`ejjobs-card ${expanded ? 'ejjobs-card-expanded' : ''}`}>
      <div className="ejjobs-card-top">
        <CompanyMark companyName={companyName} logo={job.companyLogo} />

        <div className="ejjobs-card-title">
          <div className="ejjobs-card-badges">
            <span className={statusIsActive ? 'ejjobs-active' : 'ejjobs-inactive'}>
              <i /> {statusIsActive ? 'Active' : 'Inactive'}
            </span>
            {job.jobType && <span>{formatJobType(job.jobType)}</span>}
          </div>
          <h2>{title}</h2>
          <p><Building2 /> {companyName}</p>
        </div>
      </div>

      <div className="ejjobs-meta">
        <span><MapPin /> {job.jobLocations || 'Location not specified'}</span>
        <span><BriefcaseBusiness /> {job.experience || 'Experience not specified'}</span>
        <span><IndianRupee /> {formatSalary(job)}</span>
        <span><CalendarDays /> Posted {formatDate(job.createdAt)}</span>
      </div>

      {skills.length > 0 && (
        <div className="ejjobs-skills" aria-label="Required skills">
          {skills.slice(0, expanded ? 12 : 4).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
          {!expanded && skills.length > 4 && <span>+{skills.length - 4} more</span>}
        </div>
      )}

      {expanded && (
        <div className="ejjobs-details">
          <div className="ejjobs-detail-grid">
            <DetailItem label="Designation" value={job.jobDesignation || title} />
            <DetailItem label="Industry" value={job.industry || 'Not specified'} />
            <DetailItem label="Work mode" value={job.workMode || 'Not specified'} />
            <DetailItem
              label="Application deadline"
              value={formatOptionalDate(job.applicationDeadLine)}
            />
          </div>

          <div className="ejjobs-description">
            <strong>Job description</strong>
            <p>{cleanDescription(job.description) || 'No description was provided.'}</p>
          </div>
        </div>
      )}

      {statusError && (
        <div className="ejjobs-status-error" role="alert">
          <CircleAlert />
          <span>{statusError}</span>
        </div>
      )}

      <footer className="ejjobs-card-footer">
        <div className="ejjobs-footer-left">
          <span>Job ID: {shortId(job.id)}</span>
          <button
            type="button"
            className={`ejjobs-status-toggle ${statusIsActive ? 'ejjobs-status-toggle-active' : ''}`}
            onClick={onStatusChange}
            disabled={updatingStatus}
            aria-pressed={statusIsActive}
            aria-label={`${statusIsActive ? 'Deactivate' : 'Activate'} ${title}`}
          >
            <i aria-hidden="true"><b /></i>
            <span>{updatingStatus ? 'Updating…' : statusIsActive ? 'Active' : 'Inactive'}</span>
          </button>
        </div>

        <button className="ejjobs-details-button" type="button" onClick={onToggle} aria-expanded={expanded}>
          {expanded ? 'Hide details' : 'View details'}
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </button>
      </footer>
    </article>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <div>
    <small>{label}</small>
    <strong>{value}</strong>
  </div>
);

const CompanyMark: React.FC<{ companyName: string; logo?: string | null }> = ({
  companyName,
  logo,
}) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const initials = companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('') || 'CO';

  return (
    <span className="ejjobs-company-mark" aria-hidden="true">
      {logo && !logoFailed ? (
        <img src={logo} alt="" onError={() => setLogoFailed(true)} />
      ) : (
        <strong>{initials}</strong>
      )}
    </span>
  );
};

const JobSkeletons: React.FC = () => (
  <div className="ejjobs-grid" aria-label="Loading jobs" role="status">
    {[0, 1, 2, 3].map((item) => (
      <div className="ejjobs-skeleton" key={item} aria-hidden="true">
        <span />
        <i />
        <i />
        <i />
      </div>
    ))}
    <span className="ejjobs-visually-hidden">Loading your jobs…</span>
  </div>
);

function splitCommaValues(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatJobType(value: string): string {
  const normalized = value.replace(/[_-]/g, ' ').trim();
  const spaced = normalized.replace(/([a-z])([A-Z])/g, '$1 $2');
  const compact = spaced.toLowerCase().replace(/\s+/g, '');

  if (compact === 'fulltime') return 'Full-time';
  if (compact === 'parttime') return 'Part-time';

  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

function formatSalary(job: EmployeeJob): string {
  const minimum = job.salaryMin;
  const maximum = job.salaryMax;

  if (minimum == null && maximum == null) return 'Salary not disclosed';

  const formatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  });

  const range =
    minimum != null && maximum != null
      ? `₹${formatter.format(minimum)} – ₹${formatter.format(maximum)}`
      : minimum != null
      ? `From ₹${formatter.format(minimum)}`
      : `Up to ₹${formatter.format(maximum as number)}`;

  return job.payRateFrequencyType ? `${range} / ${job.payRateFrequencyType}` : range;
}

function formatDate(value?: number | string | null): string {
  if (value == null || value === '') return 'Recently';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatOptionalDate(value?: number | string | null): string {
  if (value == null || value === '') return 'Not specified';
  return formatDate(value);
}

function cleanDescription(value?: string | null): string {
  if (!value) return '';

  return value
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^[-*]\s+/gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function shortId(value: string): string {
  return value ? `${value.slice(0, 8)}…${value.slice(-4)}` : 'Unavailable';
}

const employeeJobsStyles = `
  /* Component-scoped theme: avoid document-level selectors here. */
  .ejjobs-page,
  .ejjobs-page * { box-sizing: border-box; }

  @keyframes ejjobs-spin { to { transform: rotate(360deg); } }
  @keyframes ejjobs-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .ejjobs-page {
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    color: #f8f9ff;
    color-scheme: dark;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .ejjobs-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 20px;
  }

  .ejjobs-heading,
  .ejjobs-heading-icon,
  .ejjobs-header-actions,
  .ejjobs-refresh,
  .ejjobs-add-button,
  .ejjobs-stat-card,
  .ejjobs-search,
  .ejjobs-filter-label,
  .ejjobs-result-line,
  .ejjobs-card-top,
  .ejjobs-card-badges,
  .ejjobs-card-title p,
  .ejjobs-meta span,
  .ejjobs-card-footer,
  .ejjobs-footer-left,
  .ejjobs-card-footer button,
  .ejjobs-state-card > button {
    display: flex;
    align-items: center;
  }

  .ejjobs-heading { min-width: 0; gap: 14px; }
  .ejjobs-heading-icon {
    justify-content: center;
    flex: 0 0 auto;
    width: 48px;
    height: 48px;
    color: #fff;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 16px;
    background: linear-gradient(145deg, #5d6ef2, #8059ed 55%, #2bbbd9);
    box-shadow: 0 15px 32px rgba(73,83,218,.28), inset 0 1px 0 rgba(255,255,255,.23);
  }
  .ejjobs-heading-icon svg { width: 20px; }
  .ejjobs-eyebrow { display: block; color: #9faeff; font-size: .62rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
  .ejjobs-heading h1 { margin: 5px 0 0; font-size: clamp(1.8rem, 3.2vw, 2.5rem); line-height: 1.05; letter-spacing: -.045em; }
  .ejjobs-heading p { margin: 7px 0 0; color: rgba(229,234,255,.54); font-size: .76rem; line-height: 1.5; }

  .ejjobs-header-actions { flex: 0 0 auto; gap: 9px; }
  .ejjobs-refresh,
  .ejjobs-add-button,
  .ejjobs-state-card > button {
    justify-content: center;
    gap: 8px;
    min-height: 42px;
    padding: 0 14px;
    border-radius: 12px;
    font: 750 .68rem Inter, system-ui, sans-serif;
    cursor: pointer;
    transition: transform .18s ease, background .18s ease, opacity .18s ease;
  }
  .ejjobs-refresh { color: rgba(238,241,255,.71); border: 1px solid rgba(255,255,255,.11); background: rgba(255,255,255,.045); }
  .ejjobs-add-button,
  .ejjobs-state-card > button { color: #fff; border: 1px solid rgba(255,255,255,.15); background: linear-gradient(135deg, #5c6df2, #7558ed 58%, #2dbbd9); box-shadow: 0 12px 26px rgba(75,84,220,.22); }
  .ejjobs-refresh:hover:not(:disabled),
  .ejjobs-add-button:hover,
  .ejjobs-state-card > button:hover { transform: translateY(-1px); }
  .ejjobs-refresh:disabled { cursor: not-allowed; opacity: .52; }
  .ejjobs-refresh svg,
  .ejjobs-add-button svg,
  .ejjobs-state-card > button svg { width: 15px; height: 15px; }
  .ejjobs-spin { animation: ejjobs-spin .8s linear infinite; }

  .ejjobs-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 11px;
    margin-bottom: 15px;
  }
  .ejjobs-stat-card {
    gap: 12px;
    min-width: 0;
    padding: 14px;
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 17px;
    background: linear-gradient(155deg, rgba(255,255,255,.062), rgba(255,255,255,.018));
    box-shadow: inset 0 1px 0 rgba(255,255,255,.06);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }
  .ejjobs-stat-card > span { display: grid; place-items: center; flex: 0 0 auto; width: 38px; height: 38px; border-radius: 12px; }
  .ejjobs-stat-card > span svg { width: 17px; }
  .ejjobs-stat-violet > span { color: #bac2ff; background: rgba(110,105,245,.16); }
  .ejjobs-stat-green > span { color: #76e8be; background: rgba(71,211,160,.12); }
  .ejjobs-stat-pink > span { color: #ff9fc3; background: rgba(240,84,151,.11); }
  .ejjobs-stat-card div { display: flex; min-width: 0; flex-direction: column; }
  .ejjobs-stat-card strong { color: #fff; font-size: 1.15rem; line-height: 1; }
  .ejjobs-stat-card small { margin-top: 5px; color: rgba(225,230,255,.42); font-size: .59rem; }

  .ejjobs-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 15px;
    padding: 12px;
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 17px;
    background: rgba(255,255,255,.028);
  }
  .ejjobs-search { position: relative; flex: 1 1 360px; min-width: 180px; }
  .ejjobs-search > svg { position: absolute; left: 12px; width: 16px; color: rgba(218,224,248,.38); pointer-events: none; }
  .ejjobs-search input {
    width: 100%;
    min-height: 42px;
    padding: 0 13px 0 38px;
    color: #f7f8ff;
    border: 1px solid rgba(255,255,255,.105);
    border-radius: 12px;
    outline: none;
    background: rgba(4,8,24,.44);
    font: 500 .7rem Inter, system-ui, sans-serif;
  }
  .ejjobs-search input::placeholder { color: rgba(218,224,248,.3); }
  .ejjobs-search input:focus { border-color: rgba(111,131,255,.68); box-shadow: 0 0 0 3px rgba(94,110,245,.12); }
  .ejjobs-filter-wrap { display: flex; align-items: center; gap: 9px; }
  .ejjobs-filter-label { gap: 6px; color: rgba(226,231,255,.42); font-size: .6rem; font-weight: 700; }
  .ejjobs-filter-label svg { width: 14px; }
  .ejjobs-filters { display: flex; gap: 5px; }
  .ejjobs-filters button {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 36px;
    padding: 0 10px;
    color: rgba(234,238,255,.56);
    border: 1px solid transparent;
    border-radius: 10px;
    background: transparent;
    font: 700 .61rem Inter, system-ui, sans-serif;
    cursor: pointer;
  }
  .ejjobs-filters button small { display: grid; place-items: center; min-width: 18px; height: 18px; padding: 0 4px; color: rgba(232,236,255,.45); border-radius: 6px; background: rgba(255,255,255,.06); font-size: .53rem; }
  .ejjobs-filters button.ejjobs-filter-active { color: #fff; border-color: rgba(150,162,255,.17); background: linear-gradient(135deg, rgba(91,106,241,.3), rgba(36,184,215,.11)); }

  .ejjobs-result-line { justify-content: space-between; gap: 12px; margin: 0 2px 10px; color: rgba(226,231,255,.4); font-size: .61rem; }
  .ejjobs-result-line strong { color: rgba(245,247,255,.77); }
  .ejjobs-result-line button { padding: 0; color: #9fafff; border: 0; background: none; font: 700 .59rem Inter, system-ui, sans-serif; cursor: pointer; }

  .ejjobs-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 13px; }
  .ejjobs-card {
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.095);
    border-radius: 20px;
    background:
      radial-gradient(circle at 100% 0, rgba(80,198,239,.065), transparent 31%),
      linear-gradient(155deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
    box-shadow: inset 0 1px 0 rgba(255,255,255,.065), 0 18px 42px rgba(0,0,0,.16);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    transition: border-color .18s ease, transform .18s ease;
  }
  .ejjobs-card:hover { border-color: rgba(152,166,255,.18); transform: translateY(-2px); }
  .ejjobs-card-expanded { grid-column: 1 / -1; }
  .ejjobs-card-top { align-items: flex-start; gap: 12px; padding: 17px 17px 0; }
  .ejjobs-company-mark { display: grid; place-items: center; flex: 0 0 auto; width: 46px; height: 46px; overflow: hidden; color: #fff; border: 1px solid rgba(255,255,255,.13); border-radius: 14px; background: linear-gradient(145deg, rgba(93,109,241,.52), rgba(141,80,232,.32)); box-shadow: inset 0 1px 0 rgba(255,255,255,.1); }
  .ejjobs-company-mark img { width: 100%; height: 100%; object-fit: cover; }
  .ejjobs-company-mark strong { font-size: .7rem; letter-spacing: .03em; }
  .ejjobs-card-title { min-width: 0; flex: 1; }
  .ejjobs-card-badges { flex-wrap: wrap; gap: 6px; }
  .ejjobs-card-badges > span { display: inline-flex; align-items: center; gap: 5px; min-height: 23px; padding: 0 7px; color: rgba(229,234,255,.53); border: 1px solid rgba(255,255,255,.075); border-radius: 999px; background: rgba(255,255,255,.03); font-size: .52rem; font-weight: 750; }
  .ejjobs-card-badges > span i { width: 5px; height: 5px; border-radius: 50%; }
  .ejjobs-card-badges .ejjobs-active { color: #88e8c6; border-color: rgba(91,218,171,.15); background: rgba(66,203,153,.07); }
  .ejjobs-card-badges .ejjobs-active i { background: #65e1b4; }
  .ejjobs-card-badges .ejjobs-inactive { color: #ff9fb8; border-color: rgba(240,98,139,.14); background: rgba(238,77,126,.065); }
  .ejjobs-card-badges .ejjobs-inactive i { background: #ff82a4; }
  .ejjobs-card-title h2 { margin: 8px 0 0; overflow: hidden; color: #fff; font-size: .94rem; line-height: 1.3; text-overflow: ellipsis; white-space: nowrap; }
  .ejjobs-card-title p { gap: 6px; margin: 5px 0 0; overflow: hidden; color: rgba(229,234,255,.46); font-size: .61rem; line-height: 1.35; text-overflow: ellipsis; white-space: nowrap; }
  .ejjobs-card-title p svg { flex: 0 0 auto; width: 12px; }

  .ejjobs-meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin: 15px 17px 0; padding: 12px; border: 1px solid rgba(255,255,255,.065); border-radius: 14px; background: rgba(3,7,22,.22); }
  .ejjobs-meta span { min-width: 0; gap: 6px; overflow: hidden; color: rgba(226,231,255,.43); font-size: .56rem; line-height: 1.35; text-overflow: ellipsis; white-space: nowrap; }
  .ejjobs-meta svg { flex: 0 0 auto; width: 12px; height: 12px; color: #929ff0; }

  .ejjobs-skills { display: flex; flex-wrap: wrap; gap: 6px; margin: 13px 17px 0; }
  .ejjobs-skills span { display: inline-flex; align-items: center; min-height: 25px; padding: 0 8px; color: rgba(235,239,255,.56); border: 1px solid rgba(255,255,255,.07); border-radius: 8px; background: rgba(255,255,255,.035); font-size: .53rem; font-weight: 650; }

  .ejjobs-details { margin: 15px 17px 0; padding-top: 15px; border-top: 1px solid rgba(255,255,255,.07); }
  .ejjobs-detail-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .ejjobs-detail-grid > div { min-width: 0; padding: 10px; border-radius: 11px; background: rgba(255,255,255,.026); }
  .ejjobs-detail-grid small,
  .ejjobs-detail-grid strong { display: block; }
  .ejjobs-detail-grid small { color: rgba(226,231,255,.34); font-size: .51rem; }
  .ejjobs-detail-grid strong { margin-top: 4px; overflow: hidden; color: rgba(244,246,255,.72); font-size: .59rem; text-overflow: ellipsis; white-space: nowrap; }
  .ejjobs-description { margin-top: 12px; padding: 13px; border: 1px solid rgba(255,255,255,.065); border-radius: 13px; background: rgba(3,7,22,.2); }
  .ejjobs-description strong { color: rgba(246,248,255,.8); font-size: .64rem; }
  .ejjobs-description p { max-height: 260px; overflow-y: auto; margin: 8px 0 0; padding-right: 7px; color: rgba(227,232,255,.5); font-size: .62rem; line-height: 1.68; white-space: pre-line; }

  .ejjobs-status-error {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    margin: 13px 17px 0;
    padding: 9px 10px;
    color: #ffb0c5;
    border: 1px solid rgba(255,117,156,.16);
    border-radius: 11px;
    background: rgba(237,69,117,.08);
    font-size: .61rem;
    line-height: 1.45;
  }
  .ejjobs-status-error svg { flex: 0 0 auto; width: 14px; height: 14px; margin-top: 1px; }

  .ejjobs-card-footer { justify-content: space-between; gap: 14px; margin-top: auto; padding: 14px 17px 16px; }
  .ejjobs-footer-left { min-width: 0; gap: 12px; }
  .ejjobs-footer-left > span { overflow: hidden; color: rgba(225,230,255,.32); font-size: .53rem; text-overflow: ellipsis; white-space: nowrap; }
  .ejjobs-card-footer button { flex: 0 0 auto; font-family: Inter, system-ui, sans-serif; cursor: pointer; }
  .ejjobs-card-footer button:focus-visible { outline: 2px solid #a6b1ff; outline-offset: 3px; }

  .ejjobs-status-toggle {
    gap: 7px;
    min-height: 34px;
    padding: 0 9px 0 7px;
    color: rgba(229,233,250,.62);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 10px;
    background: rgba(255,255,255,.035);
    font-size: .61rem;
    font-weight: 760;
    transition: border-color .2s ease, background .2s ease, color .2s ease, opacity .2s ease;
  }
  .ejjobs-status-toggle > i {
    position: relative;
    display: block;
    width: 27px;
    height: 16px;
    border-radius: 999px;
    background: rgba(255,255,255,.13);
    box-shadow: inset 0 1px 2px rgba(0,0,0,.28);
    transition: background .2s ease;
  }
  .ejjobs-status-toggle > i > b {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(245,247,255,.78);
    box-shadow: 0 2px 5px rgba(0,0,0,.25);
    transition: transform .2s ease, background .2s ease;
  }
  .ejjobs-status-toggle-active {
    color: #a7f3d0;
    border-color: rgba(61,220,158,.2);
    background: rgba(34,197,126,.08);
  }
  .ejjobs-status-toggle-active > i { background: #32bf87; }
  .ejjobs-status-toggle-active > i > b { transform: translateX(11px); background: #fff; }
  .ejjobs-status-toggle:disabled { cursor: wait; opacity: .62; }

  .ejjobs-details-button {
    gap: 5px;
    min-height: 34px;
    padding: 0 2px;
    color: #a9b5ff;
    border: 0;
    background: none;
    font-size: .64rem;
    font-weight: 760;
  }
  .ejjobs-details-button svg { width: 13px; }

  .ejjobs-state-card { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 350px; padding: 38px 20px; border: 1px solid rgba(255,255,255,.095); border-radius: 22px; background: linear-gradient(155deg, rgba(255,255,255,.055), rgba(255,255,255,.018)); text-align: center; }
  .ejjobs-state-card > span { display: grid; place-items: center; width: 58px; height: 58px; color: #b6c0ff; border: 1px solid rgba(255,255,255,.12); border-radius: 18px; background: rgba(107,105,241,.12); }
  .ejjobs-state-card > span svg { width: 23px; }
  .ejjobs-state-card h2 { margin: 17px 0 0; font-size: 1.1rem; }
  .ejjobs-state-card p { max-width: 420px; margin: 8px 0 20px; color: rgba(229,234,255,.5); font-size: .7rem; line-height: 1.6; }
  .ejjobs-error > span { color: #ff9db8; background: rgba(240,78,130,.1); }

  .ejjobs-skeleton { min-height: 260px; padding: 18px; border: 1px solid rgba(255,255,255,.07); border-radius: 20px; background: rgba(255,255,255,.025); }
  .ejjobs-skeleton span,
  .ejjobs-skeleton i { display: block; border-radius: 9px; background: linear-gradient(90deg, rgba(255,255,255,.035), rgba(255,255,255,.09), rgba(255,255,255,.035)); background-size: 200% 100%; animation: ejjobs-shimmer 1.35s linear infinite; }
  .ejjobs-skeleton span { width: 46px; height: 46px; border-radius: 14px; }
  .ejjobs-skeleton i { width: 72%; height: 12px; margin-top: 16px; }
  .ejjobs-skeleton i:nth-child(3) { width: 94%; height: 58px; }
  .ejjobs-skeleton i:nth-child(4) { width: 55%; }
  .ejjobs-visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }

  @media (max-width: 960px) {
    .ejjobs-grid { grid-template-columns: 1fr; }
    .ejjobs-card-expanded { grid-column: auto; }
    .ejjobs-toolbar { align-items: stretch; flex-direction: column; }
    .ejjobs-search { flex-basis: auto; }
    .ejjobs-filter-wrap { justify-content: space-between; }
  }

  @media (max-width: 700px) {
    .ejjobs-header { align-items: flex-start; flex-direction: column; gap: 15px; }
    .ejjobs-header-actions { width: 100%; }
    .ejjobs-header-actions > button { flex: 1; }
    .ejjobs-stats { gap: 8px; }
    .ejjobs-stat-card { padding: 11px; }
    .ejjobs-stat-card > span { width: 34px; height: 34px; }
    .ejjobs-stat-card strong { font-size: 1rem; }
    .ejjobs-detail-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 520px) {
    .ejjobs-heading { align-items: flex-start; gap: 11px; }
    .ejjobs-heading-icon { width: 42px; height: 42px; border-radius: 14px; }
    .ejjobs-heading h1 { font-size: 1.6rem; }
    .ejjobs-heading p { font-size: .68rem; }
    .ejjobs-refresh span { display: none; }
    .ejjobs-refresh { flex: 0 0 44px !important; padding: 0; }
    .ejjobs-stats { display: flex; overflow-x: auto; padding-bottom: 3px; scrollbar-width: none; }
    .ejjobs-stats::-webkit-scrollbar { display: none; }
    .ejjobs-stat-card { flex: 0 0 145px; }
    .ejjobs-toolbar { padding: 9px; }
    .ejjobs-filter-label { display: none; }
    .ejjobs-filters { width: 100%; }
    .ejjobs-filters button { flex: 1; justify-content: center; padding-inline: 7px; }
    .ejjobs-card { border-radius: 18px; }
    .ejjobs-card-top { padding: 14px 14px 0; }
    .ejjobs-company-mark { width: 42px; height: 42px; }
    .ejjobs-card-title h2 { font-size: .84rem; }
    .ejjobs-meta { grid-template-columns: 1fr; margin: 13px 14px 0; }
    .ejjobs-skills,
    .ejjobs-details { margin-left: 14px; margin-right: 14px; }
    .ejjobs-status-error { margin-left: 14px; margin-right: 14px; }
    .ejjobs-card-footer { padding: 13px 14px 14px; }
    .ejjobs-state-card { min-height: 320px; padding-inline: 16px; border-radius: 19px; }
  }

  @media (max-width: 360px) {
    .ejjobs-heading-icon { display: none; }
    .ejjobs-detail-grid { grid-template-columns: 1fr; }
    .ejjobs-footer-left > span { display: none; }
  }

  /* Final readability and touch-target pass */
  .ejjobs-heading p { font-size: .84rem; }
  .ejjobs-refresh,
  .ejjobs-add-button,
  .ejjobs-state-card > button { min-height: 44px; font-size: .72rem; }
  .ejjobs-stat-card { padding: 16px; }
  .ejjobs-stat-card strong { font-size: 1.35rem; }
  .ejjobs-stat-card small { font-size: .65rem; }
  .ejjobs-search input { min-height: 44px; font-size: .76rem; }
  .ejjobs-filters button { min-height: 38px; font-size: .67rem; }
  .ejjobs-card-title h2 { font-size: 1.02rem; }
  .ejjobs-card-title p { font-size: .68rem; }
  .ejjobs-card-badges > span { font-size: .58rem; }
  .ejjobs-meta span { font-size: .63rem; }
  .ejjobs-skills span { font-size: .59rem; }
  .ejjobs-detail-grid small { font-size: .57rem; }
  .ejjobs-detail-grid strong { font-size: .65rem; }
  .ejjobs-description strong { font-size: .7rem; }
  .ejjobs-description p { font-size: .69rem; }
  .ejjobs-card-footer button { min-height: 34px; }

  @media (max-width: 520px) {
    .ejjobs-heading p { font-size: .74rem; }
    .ejjobs-stat-card { padding: 13px; }
    .ejjobs-card-title h2 { font-size: .92rem; }
    .ejjobs-meta span { font-size: .66rem; }
    .ejjobs-card-footer { align-items: flex-end; }
    .ejjobs-footer-left { align-items: flex-start; flex-direction: column; gap: 6px; }
    .ejjobs-card-footer button { min-height: 38px; }
    .ejjobs-status-toggle { padding-inline: 8px 10px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ejjobs-spin,
    .ejjobs-skeleton span,
    .ejjobs-skeleton i { animation: none; }
    .ejjobs-card,
    .ejjobs-refresh,
    .ejjobs-add-button { transition: none; }
  }
`;

export default EmployeeJobComingSoon;






















