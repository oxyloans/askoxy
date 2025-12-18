import React, { useState } from "react";

type InfoItem = {
  label: string;
  value: string;
};

type JourneyStage = {
  title: string;
  duration?: string;
  steps: string[];
};

type Program = {
  id: string;
  title: string;
  country: string;
  bannerTagline: string;
  shortTag: string;
  highlightColor: string;

  // Top summary / course details
  position: string;
  totalFees: string;
  visaType: string;
  visaTenure: string;
  refundPolicy: string;
  salaryGuide: string;
  workingHours: string;
  overtime: string;
  accommodation: string;
  relocation: string;
  interview: string;
  bond?: string;

  overview: string;

  // For small highlight list at top of details
  quickHighlights: string[];

  // Extra chips (e.g., care focus areas for Japan)
  focusChips?: string[];

  // Extra job / salary details from the PDFs
  jobSalaryNotes?: string[];

  // Extra support info (e.g. family sponsorship)
  supportExtras?: string[];

  eligibility: InfoItem[];
  journey: JourneyStage[];
  partnerResponsibilities: string[];
};

interface GlobalProgramsPageProps {
  onNavigate?: (tab: string) => void;
}

// === All 4 programs from your PDFs ===
const programs: Program[] = [
  // 1. Ausbildung – Germany
  {
    id: "ausbildung-germany",
    title: "Ausbildung Program in Germany",
    country: "Germany",
    bannerTagline:
      "Structured, end-to-end pathway to launch your Ausbildung career in Germany.",
    shortTag: "Trainee • Healthcare, Hospitality, Food Tech & Mechatronics",
    highlightColor: "#2563eb",

    position:
      "Trainee (Healthcare, Hospitality, Food Technician & Mechatronics)",
    totalFees: "$5,680",
    visaType: "Work Visa",
    visaTenure: "3 years",
    refundPolicy:
      "Registration fee refundable if not selected after 4-week German A1 phase.",
    salaryGuide: "Earn €1,100 – €1,300 per month (on arrival)",
    workingHours: "40 hours/week",
    overtime: "Allowed as per German labour law",
    accommodation:
      "Assistance provided by employer; rent usually deducted from stipend.",
    relocation:
      "Visa support, airport pickup and post-landing guidance included.",
    interview: "Multiple interview attempts till selection.",

    overview:
      "A structured, end-to-end supported pathway covering language training, employer selection, visa processing, relocation and post-landing support so you can start your Ausbildung in Germany with confidence.",

    quickHighlights: [
      "Language training from A1 to B2 included in the pathway.",
      "Clear 4-stage journey from registration to landing in Germany.",
      "Paid trainee role from Day 1 in Germany.",
      "Employer and visa support handled by ASKOXY.AI Counselor",
    ],

    jobSalaryNotes: [
      "Stage: On arrival • Role: Trainee.",
      "Monthly stipend: €1,100 – €1,300.",
    ],

    eligibility: [
      {
        label: "Education",
        value: "Senior Secondary (stream based on chosen Ausbildung field).",
      },
      {
        label: "Age",
        value: "Below 25 years.",
      },
      {
        label: "Language",
        value:
          "No prior German proficiency is required; candidates complete German A1 to B2 during the program.",
      },
    ],

    journey: [
      {
        title: "Stage 1: Registration & German language A1 Training",
        duration: "0–1 Month",
        steps: [
          "Share your resume with ASKOXY.AI Counselor and receive admission letter.",
          "Pay $570 registration fee.",
          "Begin 4-week online A1 German class (2 hrs/day, Mon–Sat).",
          "Appear for internal A1 exam.",
          "On clearing, attend recruiter interview and receive Conditional Offer Letter (COL).",
          "Candidates who clear the interview will receive the COL and must pay the balance.",
          "Candidates who do not clear will have their registration fee refunded, excluding GST.",
          "Pay remaining $5,120 program fee (via loan or self-sponsored).",
        ],
      },
      {
        title: "Stage 2: German language A2 & B1 Preparation",
        duration: "2–6 Months",
        steps: [
          "Start A2 German class (2 hrs/day, Mon–Sat) and pass internal A2 exam.",
          "Start B1 German class (4 hrs/day, Mon–Sat).",
          "Pass internal B1 exam or institute exam (as per stream).",
          "Attend recruiter interviews and secure employer selection.",
        ],
      },
      {
        title: "Stage 3: Final Offer & Visa Process",
        duration: "6–8 Months",
        steps: [
          "Secure Final Offer Letter.",
          "ASKOXY.AI Counselor applies for deficit certificate and manages visa processing.",
          "Begin online B2 German preparation.",
          "Appear for B2/B1 Goethe or TELC exam (first attempt sponsored).",
        ],
      },
      {
        title: "Stage 4: Fly & Start Ausbildung in Germany",
        steps: [
          "On B2/B1 and visa clearance, fly to Germany (flight booked by candidate; may be reimbursed by employer as per contract).",
          "Start as Trainee in Germany with a stipend of €1,100–€1,300 per month.",
        ],
      },
    ],

    partnerResponsibilities: [
      "Source candidates.",
      "Collect updated resume and share with ASKOXY.AI Counselor",
      "Ensure payment of $570 registration fee to ASKOXY.AI Counselor",
      "Ensure payment of $5,120 balance program fee to ASKOXY.AI Counselor",
    ],
  },

  // 2. Nursing in Japan – SSW
  {
    id: "nursing-japan",
    title: "Nursing in Japan (SSW Program)",
    country: "Japan",
    bannerTagline:
      "Work as a Specified Skilled Worker (SSW) in leading Japanese care facilities.",
    shortTag: "Specified Skilled Worker • Elderly & Differently-Abled Care",
    highlightColor: "#0f766e",

    position: "Specified Skilled Worker (SSW)",
    totalFees: "$3,410 to be paid in installments",
    visaType: "SSW Visa",
    visaTenure: "3–5 years",
    refundPolicy: "Non-refundable.",
    salaryGuide: "$1,140 – $1,370 per month.",
    workingHours: "40 hours/week",
    overtime: "As per employer policy.",
    accommodation:
      "Assistance provided; rent is typically deducted from salary.",
    relocation:
      "Documentation, visa processing and flight booking handled by ASKOXY.AI Counselor (timeline: 3–4 months).",
    interview:
      "Unlimited interview attempts till selection, based on vacancies.",

    overview:
      "Start a life-changing journey as a nurse in Japan under the Specified Skilled Worker (SSW) program. Selected candidates work at top Japanese care facilities for 3–5 years, supporting elderly and differently-abled citizens.",

    quickHighlights: [
      "SSW visa pathway with 3–5 year tenure.",
      "Japanese language & culture training (N5+) included.",
      "Multiple employer interview opportunities.",
      "Structured visa, documentation and relocation support.",
    ],

    focusChips: [
      "Care for Mobility",
      "Care for Meals",
      "Care for Excretion",
      "Dressing & Disrobing Support",
      "Bathing & Bodily Cleanliness",
    ],

    jobSalaryNotes: [
      "Monthly salary: $1,140 – $1,370 per month (as per employer & role).",
    ],

    eligibility: [
      { label: "Age", value: "Below 30 years." },
      { label: "Education", value: "Senior Secondary." },
      {
        label: "Preferred Qualification",
        value: "ANM / GNM / BSc Nursing certificate.",
      },
      {
        label: "Preferred",
        value: "Willingness to learn Japanese to N5 level.",
      },
    ],

    journey: [
      {
        title: "Stage 1: Registration & N5+ Program Start",
        steps: [
          "Submit your resume.",
          "Receive admission letter from ASKOXY.AI Counselor",
          "Pay $570 as the registration fee to start your online N5+ program.",
          "Start Online Japanese Language & Culture Training (7 months).",
        ],
      },
      {
        title: "Stage 2: Recruitment Interview & COL",
        steps: [
          "After ~4 weeks of training, attend recruitment interview.",
          "If you qualify, receive Conditional Offer Letter (COL).",
          "If not selected, registration fee is refunded (GST excluded).",
          "Pay $2,840 program fee after COL is issued.",
        ],
      },
      {
        title: "Stage 3: Employer Interviews & Visa Process",
        steps: [
          "Appear for interviews with Japanese employers (SSW-passed candidates only).",
          "Documentation, visa processing and flight booking handled by ASKOXY.AI Counselor (timeline: 3–4 months).",
        ],
      },
      {
        title: "Stage 4: Fly & Start Work in Japan",
        steps: [
          "Fly to Japan.",
          "Join as SSW nurse; accommodation assistance and local onboarding provided by employer.",
        ],
      },
    ],

    partnerResponsibilities: [
      "Source and identify eligible candidates.",
      "Share updated resumes with ASKOXY.AI Counselor",
      "Ensure payment of $3,410 fees to ASKOXY.AI Counselor",
    ],
  },

  // 3. Nursing Job – Germany
  {
    id: "nursing-germany",
    title: "Nursing Job in Germany",
    country: "Germany",
    bannerTagline:
      "End-to-end pathway to work as a Registered Nurse in Germany.",
    shortTag: "Assistant Nurse → Registered Nurse (RN)",
    highlightColor: "#7c3aed",

    position: "Registered Nurse (RN)",
    totalFees: "$3,410 to be paid in installments",
    visaType: "Work Visa",
    visaTenure: "3 years",
    refundPolicy: "Non-refundable.",
    salaryGuide:
      "€2,500 – €3,000/month as Assistant Nurse; €3,200 – €3,500/month after RN recognition.",
    workingHours: "37.5 hours/week",
    overtime: "Up to 8.5 hours/week.",
    accommodation: "Employer-assisted; rent is deducted from salary.",
    relocation:
      "Relocation Scholarship of $1,760 upon arrival in Germany and $1,760 Recognition Completion Scholarship after RN registration.",
    interview:
      "Multiple attempts available until selection, subject to vacancies.",

    overview:
      "A structured support pathway for nurses to build a long-term career in Germany. Counselor helps candidates achieve B2-level German proficiency and secure nursing jobs with recognition support and scholarships.",

    quickHighlights: [
      "B2-level German training with exam support.",
      "Land as Assistant Nurse and progress to Registered Nurse.",
      "Relocation and recognition scholarships worth $3,520.",
      "Multiple employer interview opportunities.",
    ],

    jobSalaryNotes: [
      "On arrival – Assistant Nurse: €2,500 – €3,000 per month.",
      "After recognition (~6 months) – Registered Nurse: €3,200 – €3,500 per month.",
    ],

    eligibility: [
      { label: "Age", value: "Below 35 years." },
      {
        label: "Education",
        value:
          "B.Sc. Nursing with 0 years of experience OR GNM Nursing with minimum 2 years of experience.",
      },
    ],

    journey: [
      {
        title: "Stage 1: Registration & German language A1 Training",
        duration: "0–1 Month",
        steps: [
          "Share resume with ASKOXY.AI Counselor",
          "Receive admission letter from ASKOXY.AI Counselor",
          "Pay $570 registration fee.",
          "Start 4-week online A1 German class (2 hrs/day, Mon–Sat; morning or evening batches).",
          "Appear for internal A1 exam and, on passing, attend recruiter interview conducted by ASKOXY.AI Counselor",
          "Clear interview and receive conditional offer letter.",
          "Pay remaining $2,840 (via loan or self-funding).",
        ],
      },
      {
        title: "Stage 2: German language A2 & B1 Preparation",
        duration: "2–6 Months",
        steps: [
          "Start A2 German class (2 hrs/day, Mon–Sat).",
          "Pass internal A2 exam.",
          "Start B1 German class (4 hrs/day, Mon–Sat).",
          "Pass internal B1 exam.",
          "Attend multiple recruiter interviews.",
        ],
      },
      {
        title: "Stage 3: Final Offer & Visa Process",
        duration: "6–8 Months",
        steps: [
          "Secure final offer letter.",
          "ASKOXY.AI Counselor applies for a degree deficit certificate and visa.",
          "Start B2 German preparation (4 hrs/day, Mon–Sat).",
          "Appear for B2-level German language certification from GOETHE/TELC (first attempt worth $285 is sponsored; subsequent attempts are student-funded).",
        ],
      },
      {
        title: "Stage 4: Fly & Start to Work in Germany",
        steps: [
          "After B2 and visa clearance, fly to Germany.",
          "Land as Assistant Nurse (earn €2,500–€3,000/month).",
          "Receive $1,760 relocation scholarship.",
          "Start working from Day 1.",
          "Begin recognition process through employer in Germany (~6 months).",
          "After completion, become a Registered Nurse (earn €3,200–€3,500/month).",
          "Receive $1,760 recognition completion scholarship.",
        ],
      },
    ],

    partnerResponsibilities: [
      "Source candidates.",
      "Share updated resume with ASKOXY.AI Counselor",
      "Have the student pay $570 registration fees to ASKOXY.AI Counselor",
      "Have the student pay the balance $2,840 to ASKOXY.AI Counselor",
    ],
  },

  // 4. Nursing Job – USA
  {
    id: "nursing-usa",
    title: "Nursing Job in the US",
    country: "United States",
    bannerTagline:
      "Pathway for international nurses to secure jobs with approved U.S. healthcare employers.",
    shortTag: "U.S. Licensed Registered Nurse (NCLEX-RN)",
    highlightColor: "#dc2626",

    position: "Registered Nurse (U.S. Licensed)",
    totalFees:
      "$9,100 — secure your admission with $570 and pay the balance across program milestones after NCLEX-RN class commencement.",
    visaType: "Employment-Based Visa (H1B)",
    visaTenure: "Permanent Residency Pathway",
    refundPolicy: "Non-refundable.",
    salaryGuide: "$60,000 – $90,000+ per year.",
    workingHours: "36–40 hours/week",
    overtime: "Paid as per U.S. labour laws.",
    accommodation:
      "Assistance provided; accommodation costs are deducted from salary.",
    relocation:
      "Flights, visa assistance and relocation support are included in the package.",
    interview:
      "Multiple employer interviews; H1B filing and deployment supported.",
    bond: "As per employer's terms & conditions.",

    overview:
      "A structured, end-to-end pathway for qualified international nurses to become U.S. Registered Nurses, including NCLEX-RN preparation, English exams, credential evaluation, employer interviews, H1B filing and relocation assistance.",

    quickHighlights: [
      "H1B employment-based visa with a pathway to permanent residency.",
      "NCLEX-RN and IELTS/OET first-attempt exam fees included.",
      "Credential evaluation, medicals and immigration paperwork covered in the package.",
      "Family (dependent) visa sponsorship available.",
    ],

    jobSalaryNotes: [
      "Annual salary range: $60,000 – $90,000+ depending on employer, state and experience.",
    ],

    supportExtras: [
      "Family sponsorship: Dependent visa sponsorship available (candidate-funded).",
    ],

    eligibility: [
      { label: "Age", value: "Below 38 years." },
      {
        label: "Education & Experience",
        value: "B.Sc. Nursing with 2+ years of experience.",
      },
      {
        label: "Licensing Readiness",
        value:
          "Eligible for NCLEX-RN and English proficiency exams (IELTS/OET).",
      },
    ],

    journey: [
      {
        title: "Stage 1: Registration & Licensing Prep",
        duration: "0–2 Months",
        steps: [
          "Submit resume and credentials for evaluation.",
          "Receive admission confirmation.",
          "Pay registration fee of $570.",
          "Begin online NCLEX-RN preparation classes.",
          "Prepare for English proficiency exams (IELTS/OET).",
          "Complete documentation verification and credential evaluation (CGFNS or equivalent).",
          "On receiving the COL, pay $3,980; if COL is not received, the registration fee is refunded (excluding GST).",
        ],
      },
      {
        title: "Stage 2: Exam Completion & Employer Interviews",
        duration: "3–6 Months",
        steps: [
          "Sit for IELTS/OET and achieve required score – one-time fee included (IELTS 7 band or OET score 400).",
          "Complete credential evaluation process (cost included in package).",
          "Pass NCLEX-RN exam (one-time exam fee included).",
          "Attend multiple employer interviews.",
          "On receiving the final Offer Letter, pay $2,275.",
        ],
      },
      {
        title: "Stage 3: Visa Processing & Final Offer",
        duration: "6–12 Months",
        steps: [
          "Employer files for H1B visa (cost included in package).",
          "Complete medical exams, background checks and immigration paperwork (costs included in package).",
          "Receive visa approval and deployment schedule (cost included in package).",
          "Pay the remaining balance of $2,275.",
        ],
      },
      {
        title: "Stage 4: Fly & Start Work in the USA",
        steps: [
          "Relocate to the U.S. (flight & relocation support provided).",
          "Begin work as a Registered Nurse from Day 1.",
          "Receive initial relocation assistance from employer (cost included in package).",
          "Access ongoing professional integration support (housing, orientation, licensing updates).",
        ],
      },
    ],

    partnerResponsibilities: [
      "Candidate sourcing.",
      "Share updated resume with ASKOXY.AI Counselor",
      "Ensure a total program fee of $9,100 is paid to ASKOXY.AI Counselor in multiple milestones, inclusive of the registration fee.",
    ],
  },
];

const GlobalProgramsPage: React.FC<GlobalProgramsPageProps> = ({
  onNavigate,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="global-programs"
      className="py-10 sm:py-14 bg-gradient-to-b from-white via-purple-50/40 to-blue-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 shadow-sm border border-purple-100">
            <span className="h-2 w-2 rounded-full bg-purple-600 " />
            <span className="text-[13px] font-semibold uppercase tracking-wide text-purple-700">
              Work Abroad Pathways
            </span>
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
            Global Nursing & Ausbildung Programs
          </h2>

          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Built-for-you career pathways to{" "}
            <span className="font-semibold text-purple-700">Germany</span>,{" "}
            <span className="font-semibold text-emerald-700">Japan</span> and{" "}
            <span className="font-semibold text-red-600">the USA</span> with{" "}
            <span className="font-semibold text-gray-800">
              language, job &amp; visa.
            </span>
            .
          </p>
        </div>

        {/* Program Cards */}
        <div className="mt-8 space-y-6">
          {programs.map((program) => {
            const isExpanded = expandedId === program.id;

            return (
              <article
                key={program.id}
                className={`relative overflow-hidden rounded-2xl border bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg ${
                  isExpanded
                    ? "ring-2 ring-purple-500/70 border-transparent translate-y-0.5"
                    : "border-gray-200"
                }`}
              >
                {/* Accent Color Bar */}
                <div
                  className="absolute inset-y-0 left-0 w-1.5"
                  style={{ backgroundColor: program.highlightColor }}
                />

                <div className="relative p-5 sm:p-6 md:p-7">
                  {/* Top row: country + tag + key badges */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2 pl-3">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {program.country}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-[11px] font-medium text-purple-700">
                        {program.shortTag}
                      </span>
                    </div>

                    {/* Key numbers badges */}
                    <div className="flex flex-wrap gap-2 pl-3 sm:pl-0">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                        💰 {program.salaryGuide}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
                        🎓 {program.position}
                      </span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div className="md:max-w-2xl">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {program.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm font-medium text-gray-700">
                        {program.bannerTagline}
                      </p>
                    </div>

                    {/* Mini “At a glance” for desktop */}
                    <div className="hidden md:flex flex-col items-end gap-1 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">
                        ⏱ Journey:{" "}
                        <span className="font-semibold text-amber-800">
                          Multi-stage guided process
                        </span>
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Ideal for:{" "}
                        <span className="font-medium text-gray-700">
                          Serious candidates ready to commit to language +
                          relocation
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Overview */}
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    {program.overview}
                  </p>

                  {/* Quick Summary Row */}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                    <div className="rounded-xl bg-gray-50 px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Position
                      </p>
                      <p className="mt-1 text-gray-900">{program.position}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Total Program Fees
                      </p>
                      <p className="mt-1 text-gray-900">
                        <span className="font-semibold text-purple-700">
                          {program.totalFees}
                        </span>
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Visa &amp; Duration
                      </p>
                      <p className="mt-1 text-gray-900">
                        {program.visaType} • {program.visaTenure}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Salary / Stipend Guide
                      </p>
                      <p className="mt-1 text-gray-900">
                        {program.salaryGuide}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-6 border-t border-dashed border-gray-200 pt-5 space-y-6">
                      {/* Optional focus chips */}
                      {program.focusChips && (
                        <div className="flex flex-wrap gap-2">
                          {program.focusChips.map((chip) => (
                            <span
                              key={chip}
                              className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Why this Program */}
                      <section>
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          ⭐ Why this Program?
                        </h4>
                        <ul className="mt-2 space-y-1.5 text-sm text-gray-700 list-disc list-inside">
                          {program.quickHighlights.map((h, idx) => (
                            <li key={idx}>{h}</li>
                          ))}
                        </ul>
                      </section>

                      {/* Job & Salary + Support & Benefits */}
                      <section className="grid gap-4 md:grid-cols-2 text-sm text-gray-700">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            💼 Job &amp; Salary Details
                          </h4>
                          <ul className="mt-2 space-y-1.5 list-disc list-inside">
                            <li>
                              <strong>Working Hours:</strong>{" "}
                              {program.workingHours}
                            </li>
                            <li>
                              <strong>Overtime:</strong> {program.overtime}
                            </li>
                            <li>
                              <strong>Interview Opportunities:</strong>{" "}
                              {program.interview}
                            </li>
                            <li>
                              <strong>Salary (Guide):</strong>{" "}
                              {program.salaryGuide}
                            </li>
                            {program.jobSalaryNotes?.map((note, idx) => (
                              <li key={idx}>{note}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            🎯 Support &amp; Benefits
                          </h4>
                          <ul className="mt-2 space-y-1.5 list-disc list-inside">
                            <li>
                              <strong>Accommodation:</strong>{" "}
                              {program.accommodation}
                            </li>
                            <li>
                              <strong>Relocation Assistance:</strong>{" "}
                              {program.relocation}
                            </li>
                            <li>
                              <strong>Refund Policy:</strong>{" "}
                              {program.refundPolicy}
                            </li>
                            {program.bond && (
                              <li>
                                <strong>Bond:</strong> {program.bond}
                              </li>
                            )}
                            {program.supportExtras?.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </section>

                      {/* Eligibility */}
                      <section>
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          ✅ Eligibility Checklist
                        </h4>
                        <div className="mt-2 grid gap-3 sm:grid-cols-2">
                          {program.eligibility.map((item) => (
                            <div
                              key={item.label}
                              className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5"
                            >
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                {item.label}
                              </p>
                              <p className="mt-1 text-sm text-gray-800">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Student Journey */}
                      <section>
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          🧭 Student Journey (Step-by-step)
                        </h4>
                        <ol className="mt-3 space-y-4 text-sm text-gray-700">
                          {program.journey.map((stage, idx) => (
                            <li
                              key={idx}
                              className="flex gap-3 rounded-xl bg-white/70 p-3 shadow-sm"
                            >
                              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                                {idx + 1}
                              </div>
                              <div className="w-full">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="font-semibold text-gray-900">
                                    {stage.title}
                                  </p>
                                  {stage.duration && (
                                    <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                                      {stage.duration}
                                    </span>
                                  )}
                                </div>
                                <ul className="mt-1.5 space-y-1.5 list-disc list-inside">
                                  {stage.steps.map((step, sIdx) => (
                                    <li key={sIdx}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </section>

                      {/* Partner Responsibilities */}
                      <section>
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          🤝 Partner Responsibilities
                        </h4>
                        <ul className="mt-2 space-y-1.5 text-sm text-gray-700 list-disc list-inside">
                          {program.partnerResponsibilities.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </section>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <button
                      type="button"
                      onClick={() => handleToggle(program.id)}
                      className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
                        isExpanded
                          ? "border-transparent bg-purple-600 text-white hover:bg-purple-700"
                          : "border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white"
                      }`}
                    >
                      {isExpanded
                        ? "Hide Full Details"
                        : "View Full Program Details"}
                    </button>

                    <a
                      href="tel:+918919636330"
                      className="inline-flex items-center text-sm font-semibold text-purple-700 hover:text-purple-900"
                    >
                      📲 +91&nbsp;89196&nbsp;36330
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GlobalProgramsPage;
