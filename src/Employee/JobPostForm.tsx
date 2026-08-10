import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CircleAlert,
  IndianRupee,
  LoaderCircle,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";

import BASE_URL from "../Config";
import { getCookie } from "./employeeAuthCookie";

export type JobType =
  | "fulltime"
  | "parttime"
  | "contract"
  | "temporary"
  | "internship";

export type PayRateFrequencyType = "Hourly" | "Monthly" | "Yearly";

export interface CompanyPersonJobAddDto {
  id?: string;
  jobTitle: string;
  designation?: string;
  locations: string;
  description?: string;
  experience: string;
  skills: string;
  industry?: string;
  jobType: JobType;
  companyContactPersonId: string;
  userId?: string;
  status?: boolean;
  message?: string;
  companyName?: string;
  salaryMin?: number;
  salaryMax?: number;
  payRateFrequencyType?: PayRateFrequencyType;
}

export interface SubmitJobResult {
  status: boolean;
  message: string;
  jobId?: string;
}

interface GenerateDescriptionRequest {
  jobTitle: string;
  designation?: string;
  experience: string;
  skills: string;
  industry?: string;
}

interface GenerateDescriptionApiResponse {
  status: boolean;
  message: string;
  description: string | null;
}

interface FormState {
  companyContactPersonId: string;
  jobTitle: string;
  designation: string;
  locations: string;
  description: string;
  minExperience: string;
  maxExperience: string;
  skills: string;
  industry: string;
  jobType: JobType;
  salaryMin: string;
  salaryMax: string;
  payRateFrequencyType: PayRateFrequencyType | "";
}

type FormErrors = Partial<Record<keyof FormState, string>>;

interface PopupState {
  type: "success" | "error";
  title: string;
  message: string;
}

const ALL_JOBS_ROUTE = "/employeedashboard/alljobsbycompanyemployee";
const LOGIN_ROUTE = "/companyemployeelogin";

const JOB_TYPE_OPTIONS: { value: JobType; label: string }[] = [
  { value: "fulltime", label: "Full-time" },
  { value: "parttime", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
  { value: "internship", label: "Internship" },
];

const initialState: FormState = {
  companyContactPersonId: "",
  jobTitle: "",
  designation: "",
  locations: "",
  description: "",
  minExperience: "",
  maxExperience: "",
  skills: "",
  industry: "",
  jobType: "fulltime",
  salaryMin: "",
  salaryMax: "",
  payRateFrequencyType: "",
};

async function generateJobDescription(
  request: GenerateDescriptionRequest
): Promise<string> {
  const response = await fetch(
    `${BASE_URL}/marketing-service/campgin/generate-job-description`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    }
  );

  const result = (await response
    .json()
    .catch(() => null)) as GenerateDescriptionApiResponse | null;

  if (!response.ok || !result?.status || !result.description) {
    throw new Error(
      result?.message || "Failed to generate the description. Please try again."
    );
  }

  return result.description;
}

async function submitJobPost(
  payload: CompanyPersonJobAddDto
): Promise<SubmitJobResult> {
  const response = await fetch(
    `${BASE_URL}/marketing-service/campgin/companyPersonJobAdd`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.status) {
    throw new Error(result?.message || "Failed to add the job. Please try again.");
  }

  return {
    status: true,
    message: result.message || "Job added successfully.",
    jobId: result?.savedJobIs?.id ?? result?.savedJobIs?.companyJobId,
  };
}

export default function JobPostForm(): JSX.Element {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [checkingSession, setCheckingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);

  useEffect(() => {
    const employeeSession = getCookie("companyContactPersonId");

    if (!employeeSession?.id) {
      navigate(LOGIN_ROUTE, { replace: true });
      return;
    }

    setForm((previous) => ({
      ...previous,
      companyContactPersonId: employeeSession.id,
    }));
    setCheckingSession(false);
  }, [navigate]);

  const completedRequiredFields = useMemo(() => {
    const requiredValues = [
      form.jobTitle,
      form.locations,
      form.minExperience,
      form.maxExperience,
      form.skills,
      form.description,
    ];
    return requiredValues.filter((value) => value.trim()).length;
  }, [form]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const field = event.target.name as keyof FormState;
    const value = event.target.value;

    setForm((previous) => ({ ...previous, [field]: value } as FormState));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    if (field === "description") setAiError(null);
  };

  const validate = (state: FormState): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!state.companyContactPersonId.trim()) {
      nextErrors.companyContactPersonId = "Your employee session could not be verified.";
    }

    if (!state.jobTitle.trim()) nextErrors.jobTitle = "Job title is required.";

    const locations = state.locations.trim();
    if (!locations) {
      nextErrors.locations = "Enter at least one location.";
    } else if (locations.split(",").some((location) => !location.trim())) {
      nextErrors.locations =
        "Remove empty locations between commas (example: Hyderabad, Bengaluru, Remote).";
    }

    if (!state.skills.trim()) nextErrors.skills = "Skills are required.";
    if (!state.description.trim()) {
      nextErrors.description =
        "Add a description or use AI to generate an editable draft.";
    }

    if (!state.minExperience.trim()) {
      nextErrors.minExperience = "Minimum experience is required.";
    } else if (Number.isNaN(Number(state.minExperience)) || Number(state.minExperience) < 0) {
      nextErrors.minExperience = "Enter a valid non-negative number.";
    }

    if (!state.maxExperience.trim()) {
      nextErrors.maxExperience = "Maximum experience is required.";
    } else if (Number.isNaN(Number(state.maxExperience)) || Number(state.maxExperience) < 0) {
      nextErrors.maxExperience = "Enter a valid non-negative number.";
    }

    if (
      !nextErrors.minExperience &&
      !nextErrors.maxExperience &&
      Number(state.maxExperience) < Number(state.minExperience)
    ) {
      nextErrors.maxExperience = "Maximum experience cannot be below the minimum.";
    }

    const hasMinimumSalary = Boolean(state.salaryMin.trim());
    const hasMaximumSalary = Boolean(state.salaryMax.trim());
    const hasFrequency = Boolean(state.payRateFrequencyType);
    const hasAnySalary = hasMinimumSalary || hasMaximumSalary || hasFrequency;

    if (hasAnySalary) {
      if (!hasMinimumSalary) nextErrors.salaryMin = "Enter the minimum salary.";
      if (!hasMaximumSalary) nextErrors.salaryMax = "Enter the maximum salary.";
      if (!hasFrequency) nextErrors.payRateFrequencyType = "Select a pay frequency.";
    }

    if (hasMinimumSalary && (Number.isNaN(Number(state.salaryMin)) || Number(state.salaryMin) < 0)) {
      nextErrors.salaryMin = "Enter a valid non-negative amount.";
    }

    if (hasMaximumSalary && (Number.isNaN(Number(state.salaryMax)) || Number(state.salaryMax) < 0)) {
      nextErrors.salaryMax = "Enter a valid non-negative amount.";
    }

    if (
      hasMinimumSalary &&
      hasMaximumSalary &&
      !nextErrors.salaryMin &&
      !nextErrors.salaryMax &&
      Number(state.salaryMax) < Number(state.salaryMin)
    ) {
      nextErrors.salaryMax = "Maximum salary cannot be below the minimum.";
    }

    return nextErrors;
  };

  const handleGenerateDescription = async () => {
    setAiError(null);

    if (!form.jobTitle.trim()) {
      setAiError("Add the job title before generating a description.");
      return;
    }

    if (!form.minExperience.trim() || !form.maxExperience.trim()) {
      setAiError("Add the minimum and maximum experience first.");
      return;
    }

    if (
      Number.isNaN(Number(form.minExperience)) ||
      Number.isNaN(Number(form.maxExperience)) ||
      Number(form.maxExperience) < Number(form.minExperience)
    ) {
      setAiError("Check the experience range before generating a description.");
      return;
    }

    if (!form.skills.trim()) {
      setAiError("Add the required skills before generating a description.");
      return;
    }

    setAiGenerating(true);

    try {
      const description = await generateJobDescription({
        jobTitle: form.jobTitle.trim(),
        designation: form.designation.trim() || undefined,
        experience: `${form.minExperience}-${form.maxExperience} years`,
        skills: form.skills.trim(),
        industry: form.industry.trim() || undefined,
      });

      setForm((previous) => ({ ...previous, description }));
      setErrors((previous) => ({ ...previous, description: undefined }));
    } catch (error) {
      setAiError(
        error instanceof Error ? error.message : "Failed to generate the description."
      );
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) {
      const firstInvalidField = Object.keys(validationErrors)[0];
      document.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)?.focus();
      return;
    }

    const normalizedLocations = form.locations
      .split(",")
      .map((location) => location.trim())
      .filter(Boolean)
      .join(", ");

    const payload: CompanyPersonJobAddDto = {
      companyContactPersonId: form.companyContactPersonId.trim(),
      jobTitle: form.jobTitle.trim(),
      designation: form.designation.trim() || undefined,
      locations: normalizedLocations,
      description: form.description.trim(),
      experience: `${form.minExperience}-${form.maxExperience} years`,
      skills: form.skills.trim(),
      industry: form.industry.trim() || "IT",
      jobType: form.jobType,
    };

    if (form.salaryMin && form.salaryMax && form.payRateFrequencyType) {
      payload.salaryMin = Number(form.salaryMin);
      payload.salaryMax = Number(form.salaryMax);
      payload.payRateFrequencyType = form.payRateFrequencyType;
    }

    setSubmitting(true);

    try {
      const result = await submitJobPost(payload);
      setPopup({
        type: "success",
        title: "Job published",
        message: result.message,
      });
    } catch (error) {
      setPopup({
        type: "error",
        title: "Unable to publish",
        message: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForAnotherJob = () => {
    setForm((previous) => ({
      ...initialState,
      companyContactPersonId: previous.companyContactPersonId,
    }));
    setErrors({});
    setAiError(null);
    setPopup(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (checkingSession) {
    return (
      <div className="jpf-session" role="status" aria-live="polite">
        <style>{jobPostStyles}</style>
        <LoaderCircle />
        <span>Verifying your workspace…</span>
      </div>
    );
  }

  return (
    <section className="jpf-page" aria-labelledby="jpf-title">
      <style>{jobPostStyles}</style>

      <header className="jpf-page-header">
        <div className="jpf-heading-wrap">
          <button
            type="button"
            className="jpf-back-button"
            onClick={() => navigate(ALL_JOBS_ROUTE)}
            aria-label="Back to all jobs"
          >
            <ArrowLeft />
          </button>

          <div>
            <span className="jpf-eyebrow">Job Management</span>
            <h1 id="jpf-title">Create a new job</h1>
            <p>Add the role details, requirements and salary information.</p>
          </div>
        </div>

        <div className="jpf-header-tools">
          <div className="jpf-progress" aria-label={`${completedRequiredFields} of 6 required sections completed`}>
            <span>{completedRequiredFields}/6 complete</span>
            <div aria-hidden="true">
              <i style={{ width: `${(completedRequiredFields / 6) * 100}%` }} />
            </div>
          </div>

          <div className="jpf-header-buttons">
            <button
              type="button"
              className="jpf-secondary-button"
              onClick={() => navigate(ALL_JOBS_ROUTE)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="employee-job-post-form"
              className="jpf-primary-button jpf-header-publish"
              disabled={submitting}
            >
              {submitting ? <LoaderCircle className="jpf-spin" /> : <BriefcaseBusiness />}
              <span>{submitting ? "Publishing…" : "Publish job"}</span>
            </button>
          </div>
        </div>
      </header>

      <form
        id="employee-job-post-form"
        className="jpf-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <FormSection
          number="01"
          icon={<BriefcaseBusiness />}
          title="Role details"
          description="Start with the job title, designation and employment type."
        >
          <div className="jpf-grid jpf-grid-three">
            <Field label="Job title" required error={errors.jobTitle} htmlFor="job-title">
              <input
                id="job-title"
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                placeholder="Senior Frontend Developer"
                autoComplete="off"
                aria-invalid={Boolean(errors.jobTitle)}
              />
            </Field>

            <Field label="Designation" error={errors.designation} htmlFor="designation">
              <input
                id="designation"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="Team Lead (optional)"
                autoComplete="off"
              />
            </Field>

            <Field label="Job type" required error={errors.jobType} htmlFor="job-type">
              <select id="job-type" name="jobType" value={form.jobType} onChange={handleChange}>
                {JOB_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="jpf-grid jpf-grid-three">
            <Field label="Industry" htmlFor="industry" hint="Defaults to IT if left empty.">
              <div className="jpf-input-icon">
                <Building2 />
                <input
                  id="industry"
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  placeholder="Information Technology"
                  autoComplete="off"
                />
              </div>
            </Field>

            <Field
              label="Minimum experience"
              required
              error={errors.minExperience}
              htmlFor="min-experience"
            >
              <div className="jpf-number-field">
                <input
                  id="min-experience"
                  type="number"
                  min="0"
                  step="0.5"
                  name="minExperience"
                  value={form.minExperience}
                  onChange={handleChange}
                  placeholder="2"
                  aria-invalid={Boolean(errors.minExperience)}
                />
                <span>years</span>
              </div>
            </Field>

            <Field
              label="Maximum experience"
              required
              error={errors.maxExperience}
              htmlFor="max-experience"
            >
              <div className="jpf-number-field">
                <input
                  id="max-experience"
                  type="number"
                  min="0"
                  step="0.5"
                  name="maxExperience"
                  value={form.maxExperience}
                  onChange={handleChange}
                  placeholder="5"
                  aria-invalid={Boolean(errors.maxExperience)}
                />
                <span>years</span>
              </div>
            </Field>
          </div>
        </FormSection>

        <FormSection
          number="02"
          icon={<MapPin />}
          title="Location and skills"
          description="Tell candidates where the role is based and what expertise is needed."
        >
          <div className="jpf-grid jpf-grid-two">
            <Field
              label="Locations"
              required
              error={errors.locations}
              htmlFor="locations"
              hint="Separate multiple locations with commas."
            >
              <div className="jpf-input-icon">
                <MapPin />
                <input
                  id="locations"
                  name="locations"
                  value={form.locations}
                  onChange={handleChange}
                  placeholder="Hyderabad, Bengaluru, Remote"
                  autoComplete="off"
                  aria-invalid={Boolean(errors.locations)}
                />
              </div>
            </Field>

            <Field
              label="Required skills"
              required
              error={errors.skills}
              htmlFor="skills"
              hint="Use commas to keep the list easy to scan."
            >
              <input
                id="skills"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, TypeScript, REST APIs"
                autoComplete="off"
                aria-invalid={Boolean(errors.skills)}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          number="03"
          icon={<Sparkles />}
          title="Job description"
          description="Write the description yourself or create an editable AI draft."
          action={
            <button
              type="button"
              className="jpf-ai-button"
              onClick={handleGenerateDescription}
              disabled={aiGenerating}
            >
              {aiGenerating ? <LoaderCircle className="jpf-spin" /> : <Sparkles />}
              <span>{aiGenerating ? "Generating draft…" : "Generate with AI"}</span>
            </button>
          }
        >
          <Field
            label="Description"
            required
            error={errors.description}
            htmlFor="description"
            hint="The generated content is fully editable before you publish."
          >
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={10}
              placeholder="Describe the role, responsibilities, qualifications and work environment…"
              aria-invalid={Boolean(errors.description)}
            />
          </Field>

          {aiError && (
            <div className="jpf-inline-alert" role="alert">
              <CircleAlert />
              <span>{aiError}</span>
            </div>
          )}
        </FormSection>

        <FormSection
          number="04"
          icon={<IndianRupee />}
          title="Salary details"
          description="Optional. If you add salary information, complete all three fields."
        >
          <div className="jpf-grid jpf-grid-three">
            <Field label="Minimum salary" error={errors.salaryMin} htmlFor="salary-min">
              <div className="jpf-input-icon">
                <IndianRupee />
                <input
                  id="salary-min"
                  type="number"
                  min="0"
                  name="salaryMin"
                  value={form.salaryMin}
                  onChange={handleChange}
                  placeholder="50000"
                  inputMode="decimal"
                  aria-invalid={Boolean(errors.salaryMin)}
                />
              </div>
            </Field>

            <Field label="Maximum salary" error={errors.salaryMax} htmlFor="salary-max">
              <div className="jpf-input-icon">
                <IndianRupee />
                <input
                  id="salary-max"
                  type="number"
                  min="0"
                  name="salaryMax"
                  value={form.salaryMax}
                  onChange={handleChange}
                  placeholder="90000"
                  inputMode="decimal"
                  aria-invalid={Boolean(errors.salaryMax)}
                />
              </div>
            </Field>

            <Field
              label="Pay frequency"
              error={errors.payRateFrequencyType}
              htmlFor="pay-frequency"
            >
              <select
                id="pay-frequency"
                name="payRateFrequencyType"
                value={form.payRateFrequencyType}
                onChange={handleChange}
                aria-invalid={Boolean(errors.payRateFrequencyType)}
              >
                <option value="">Select frequency</option>
                <option value="Hourly">Hourly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </Field>
          </div>
        </FormSection>

      </form>

      {popup && (
        <div className="jpf-modal" role="dialog" aria-modal="true" aria-labelledby="jpf-modal-title">
          <div className={`jpf-modal-card jpf-modal-${popup.type}`}>
            <button
              type="button"
              className="jpf-modal-close"
              onClick={() => setPopup(null)}
              aria-label="Close message"
            >
              <X />
            </button>

            <span className="jpf-modal-icon" aria-hidden="true">
              {popup.type === "success" ? <CheckCircle2 /> : <CircleAlert />}
            </span>
            <h2 id="jpf-modal-title">{popup.title}</h2>
            <p>{popup.message}</p>

            {popup.type === "success" ? (
              <div className="jpf-modal-actions">
                <button type="button" className="jpf-secondary-button" onClick={resetForAnotherJob}>
                  Post another
                </button>
                <button type="button" className="jpf-primary-button" onClick={() => navigate(ALL_JOBS_ROUTE)}>
                  View all jobs
                </button>
              </div>
            ) : (
              <button type="button" className="jpf-primary-button" onClick={() => setPopup(null)}>
                Try again
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

interface FormSectionProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({
  number,
  icon,
  title,
  description,
  action,
  children,
}) => (
  <section className="jpf-card">
    <header className="jpf-card-header">
      <div className="jpf-section-heading">
        <span className="jpf-section-icon" aria-hidden="true">
          {icon}
        </span>
        <div>
          <small>Step {number}</small>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {action && <div className="jpf-card-action">{action}</div>}
    </header>
    <div className="jpf-card-body">{children}</div>
  </section>
);

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}) => (
  <div className={`jpf-field ${error ? "jpf-field-error" : ""}`}>
    <label htmlFor={htmlFor}>
      {label}
      {required && <span aria-hidden="true"> *</span>}
    </label>
    {children}
    {error ? (
      <span className="jpf-error" role="alert">
        <CircleAlert /> {error}
      </span>
    ) : (
      hint && <small className="jpf-hint">{hint}</small>
    )}
  </div>
);

const jobPostStyles = `
  /* Component-scoped theme: avoid document-level selectors here. */
  .jpf-page,
  .jpf-page *,
  .jpf-session,
  .jpf-session * { box-sizing: border-box; }

  @keyframes jpf-spin { to { transform: rotate(360deg); } }
  @keyframes jpf-pop {
    from { opacity: 0; transform: translateY(12px) scale(.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .jpf-page {
    width: 100%;
    max-width: 1080px;
    margin: 0 auto;
    color: #f7f8ff;
    color-scheme: dark;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .jpf-session {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    min-height: 55vh;
    color: rgba(235, 239, 255, .68);
    font: 600 .84rem Inter, system-ui, sans-serif;
  }

  .jpf-session svg { width: 18px; animation: jpf-spin .8s linear infinite; }

  .jpf-page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 22px;
  }

  .jpf-heading-wrap { display: flex; align-items: flex-start; gap: 14px; min-width: 0; flex: 1 1 auto; }

  .jpf-back-button,
  .jpf-modal-close {
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    color: #edf0ff;
    border: 1px solid rgba(255,255,255,.13);
    background: rgba(255,255,255,.06);
    cursor: pointer;
    transition: .18s ease;
  }

  .jpf-back-button { width: 42px; height: 42px; border-radius: 13px; }
  .jpf-back-button:hover { background: rgba(255,255,255,.11); transform: translateX(-2px); }
  .jpf-back-button svg { width: 18px; }

  .jpf-eyebrow {
    display: block;
    color: #9fafff;
    font-size: .67rem;
    font-weight: 800;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .jpf-page-header h1 { margin: 7px 0 0; font-size: clamp(1.75rem, 3vw, 2.35rem); line-height: 1.08; letter-spacing: -.045em; }
  .jpf-page-header p { margin: 8px 0 0; color: rgba(229,234,255,.58); font-size: .84rem; line-height: 1.55; }

  .jpf-header-tools { display: flex; align-items: flex-end; flex: 0 0 auto; flex-direction: column; gap: 11px; }
  .jpf-header-buttons { display: flex; align-items: center; justify-content: flex-end; gap: 9px; }
  .jpf-header-publish { min-width: 142px; }
  .jpf-progress { width: 190px; padding-bottom: 1px; }
  .jpf-progress > span { display: block; margin-bottom: 8px; color: rgba(232,236,255,.62); font-size: .7rem; font-weight: 700; text-align: right; }
  .jpf-progress > div { height: 5px; overflow: hidden; border-radius: 99px; background: rgba(255,255,255,.09); }
  .jpf-progress i { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #6978ff, #55d9ff, #73ebbd); transition: width .25s ease; }

  .jpf-form { display: grid; gap: 16px; }

  .jpf-card {
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.105);
    border-radius: 22px;
    background: linear-gradient(155deg, rgba(255,255,255,.075), rgba(255,255,255,.025));
    box-shadow: inset 0 1px 0 rgba(255,255,255,.07), 0 20px 48px rgba(0,0,0,.18);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .jpf-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 20px 22px;
    border-bottom: 1px solid rgba(255,255,255,.075);
    background: rgba(255,255,255,.018);
  }

  .jpf-section-heading { display: flex; align-items: center; gap: 13px; min-width: 0; }
  .jpf-section-icon {
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    width: 42px;
    height: 42px;
    color: #e9edff;
    border: 1px solid rgba(255,255,255,.13);
    border-radius: 13px;
    background: linear-gradient(145deg, rgba(101,113,255,.38), rgba(148,82,246,.18));
  }
  .jpf-section-icon svg { width: 18px; height: 18px; }
  .jpf-section-heading small { color: #9aa9fb; font-size: .6rem; font-weight: 800; letter-spacing: .11em; text-transform: uppercase; }
  .jpf-section-heading h2 { margin: 3px 0 0; color: #fff; font-size: 1rem; line-height: 1.25; }
  .jpf-section-heading p { margin: 4px 0 0; color: rgba(229,234,255,.48); font-size: .7rem; line-height: 1.45; }

  .jpf-card-body { display: grid; gap: 20px; padding: 22px; }
  .jpf-grid { display: grid; gap: 17px; }
  .jpf-grid-three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .jpf-grid-two { grid-template-columns: repeat(2, minmax(0, 1fr)); }

  .jpf-field { min-width: 0; }
  .jpf-field > label { display: block; margin-bottom: 8px; color: rgba(245,247,255,.78); font-size: .72rem; font-weight: 700; line-height: 1.35; }
  .jpf-field > label span { color: #ff8ebd; }

  .jpf-field input,
  .jpf-field select,
  .jpf-field textarea {
    display: block;
    width: 100%;
    min-width: 0;
    min-height: 46px;
    padding: 11px 13px;
    color: #f8f9ff;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 12px;
    outline: none;
    background: rgba(4,8,24,.48);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
    font: 500 .78rem/1.45 Inter, system-ui, sans-serif;
    transition: border-color .18s ease, background .18s ease, box-shadow .18s ease;
  }

  .jpf-field input::placeholder,
  .jpf-field textarea::placeholder { color: rgba(218,224,248,.30); }

  .jpf-field select { color-scheme: dark; cursor: pointer; }
  .jpf-field textarea { min-height: 210px; resize: vertical; line-height: 1.65; }
  .jpf-field input:focus,
  .jpf-field select:focus,
  .jpf-field textarea:focus {
    border-color: rgba(111,131,255,.72);
    background: rgba(6,11,32,.68);
    box-shadow: 0 0 0 3px rgba(94,110,245,.14);
  }

  .jpf-field-error input,
  .jpf-field-error select,
  .jpf-field-error textarea { border-color: rgba(255,103,139,.65); }

  .jpf-input-icon { position: relative; }
  .jpf-input-icon > svg { position: absolute; z-index: 1; left: 13px; top: 50%; width: 16px; height: 16px; color: rgba(198,207,244,.44); transform: translateY(-50%); pointer-events: none; }
  .jpf-input-icon input { padding-left: 40px; }

  .jpf-number-field { position: relative; }
  .jpf-number-field input { padding-right: 58px; }
  .jpf-number-field span { position: absolute; right: 12px; top: 50%; color: rgba(218,224,248,.4); font-size: .65rem; pointer-events: none; transform: translateY(-50%); }

  .jpf-hint { display: block; margin-top: 7px; color: rgba(221,226,248,.38); font-size: .62rem; line-height: 1.45; }
  .jpf-error,
  .jpf-inline-alert { display: flex; align-items: flex-start; gap: 6px; color: #ff9db6; font-size: .63rem; line-height: 1.45; }
  .jpf-error { margin-top: 7px; }
  .jpf-error svg,
  .jpf-inline-alert svg { flex: 0 0 auto; width: 13px; height: 13px; margin-top: 1px; }
  .jpf-inline-alert { padding: 11px 13px; border: 1px solid rgba(255,104,140,.2); border-radius: 12px; background: rgba(255,83,128,.075); }

  .jpf-ai-button,
  .jpf-primary-button,
  .jpf-secondary-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 42px;
    padding: 0 15px;
    border-radius: 12px;
    font: 750 .72rem Inter, system-ui, sans-serif;
    cursor: pointer;
    transition: transform .18s ease, background .18s ease, opacity .18s ease;
  }

  .jpf-ai-button {
    color: #eef1ff;
    border: 1px solid rgba(148,164,255,.28);
    background: linear-gradient(135deg, rgba(91,105,245,.3), rgba(171,75,241,.18));
  }
  .jpf-ai-button:hover:not(:disabled) { background: linear-gradient(135deg, rgba(91,105,245,.45), rgba(171,75,241,.26)); }
  .jpf-ai-button svg,
  .jpf-primary-button svg { width: 15px; height: 15px; }

  .jpf-modal-actions { display: flex; align-items: center; justify-content: flex-end; gap: 9px; }

  .jpf-primary-button { color: #fff; border: 1px solid rgba(255,255,255,.16); background: linear-gradient(135deg, #5d6df2, #7658ed 55%, #2ebada); box-shadow: 0 12px 26px rgba(82,91,228,.25); }
  .jpf-secondary-button { color: rgba(240,243,255,.74); border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.045); }
  .jpf-primary-button:hover:not(:disabled),
  .jpf-secondary-button:hover:not(:disabled),
  .jpf-ai-button:hover:not(:disabled) { transform: translateY(-1px); }
  .jpf-primary-button:disabled,
  .jpf-secondary-button:disabled,
  .jpf-ai-button:disabled { cursor: not-allowed; opacity: .55; }
  .jpf-spin { animation: jpf-spin .8s linear infinite; }

  .jpf-modal {
    position: fixed;
    z-index: 80;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 18px;
    background: rgba(2,5,17,.74);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .jpf-modal-card {
    position: relative;
    width: min(100%, 430px);
    padding: 30px;
    color: #fff;
    border: 1px solid rgba(255,255,255,.15);
    border-radius: 24px;
    background: linear-gradient(150deg, rgba(29,39,83,.97), rgba(26,18,61,.97));
    box-shadow: 0 34px 90px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.12);
    text-align: center;
    animation: jpf-pop .22s ease-out both;
  }
  .jpf-modal-close { position: absolute; top: 14px; right: 14px; width: 34px; height: 34px; border-radius: 10px; }
  .jpf-modal-close svg { width: 15px; }
  .jpf-modal-icon { display: grid; place-items: center; width: 58px; height: 58px; margin: 0 auto; border-radius: 18px; }
  .jpf-modal-icon svg { width: 25px; height: 25px; }
  .jpf-modal-success .jpf-modal-icon { color: #78ecc1; background: rgba(57,206,151,.12); border: 1px solid rgba(101,232,184,.22); }
  .jpf-modal-error .jpf-modal-icon { color: #ff91ae; background: rgba(255,88,131,.11); border: 1px solid rgba(255,128,158,.2); }
  .jpf-modal-card h2 { margin: 17px 0 0; font-size: 1.35rem; }
  .jpf-modal-card p { margin: 9px auto 22px; color: rgba(231,235,255,.61); font-size: .78rem; line-height: 1.6; }
  .jpf-modal-card > .jpf-primary-button { width: 100%; }
  .jpf-modal-actions > button { flex: 1 1 0; }

  @media (max-width: 900px) {
    .jpf-grid-three { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .jpf-card-header { align-items: flex-start; }
  }

  @media (max-width: 760px) {
    .jpf-page-header { align-items: stretch; flex-direction: column; gap: 16px; margin-bottom: 18px; }
    .jpf-header-tools { width: 100%; align-items: stretch; gap: 10px; }
    .jpf-progress { width: 100%; }
    .jpf-progress > span { text-align: left; }
    .jpf-header-buttons { width: 100%; }
    .jpf-header-buttons > button { min-height: 48px; }
    .jpf-header-buttons .jpf-secondary-button { flex: 0 1 38%; }
    .jpf-header-publish { flex: 1 1 62%; min-width: 0; }
  }

  @media (max-width: 640px) {
    .jpf-back-button { width: 38px; height: 38px; border-radius: 12px; }
    .jpf-page-header h1 { font-size: 1.65rem; }
    .jpf-page-header p { font-size: .76rem; }
    .jpf-card { border-radius: 18px; }
    .jpf-card-header { flex-direction: column; padding: 17px 16px; }
    .jpf-card-body { padding: 17px 16px; }
    .jpf-grid,
    .jpf-grid-three,
    .jpf-grid-two { grid-template-columns: 1fr; gap: 16px; }
    .jpf-card-action,
    .jpf-ai-button { width: 100%; }
    .jpf-modal-card { padding: 27px 18px 20px; border-radius: 20px; }
  }

  @media (max-width: 390px) {
    .jpf-heading-wrap { gap: 10px; }
    .jpf-page-header h1 { font-size: 1.45rem; }
    .jpf-section-icon { width: 38px; height: 38px; }
    .jpf-section-heading p { display: none; }
    .jpf-modal-actions { flex-direction: column-reverse; }
    .jpf-modal-actions > button { width: 100%; }
    .jpf-header-buttons { gap: 7px; }
    .jpf-header-buttons > button { padding-inline: 12px; }
  }

  /* Final form readability and touch-target pass */
  .jpf-page-header p { font-size: .88rem; }
  .jpf-section-heading small { font-size: .64rem; }
  .jpf-section-heading h2 { font-size: 1.08rem; }
  .jpf-section-heading p { font-size: .76rem; }
  .jpf-field > label { font-size: .78rem; }
  .jpf-field input,
  .jpf-field select,
  .jpf-field textarea { min-height: 48px; font-size: .83rem; }
  .jpf-hint,
  .jpf-error,
  .jpf-inline-alert { font-size: .68rem; }
  .jpf-ai-button,
  .jpf-primary-button,
  .jpf-secondary-button { min-height: 44px; font-size: .76rem; }

  @media (max-width: 640px) {
    .jpf-page-header p { font-size: .8rem; }
    .jpf-section-heading h2 { font-size: 1rem; }
    .jpf-section-heading p { font-size: .72rem; }
    .jpf-field > label { font-size: .8rem; }
    .jpf-field input,
    .jpf-field select,
    .jpf-field textarea { min-height: 50px; font-size: .86rem; }
    .jpf-primary-button,
    .jpf-secondary-button,
    .jpf-ai-button { min-height: 48px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .jpf-spin { animation: none; }
    .jpf-modal-card { animation: none; }
    .jpf-primary-button,
    .jpf-secondary-button,
    .jpf-ai-button,
    .jpf-back-button { transition: none; }
  }
`;
