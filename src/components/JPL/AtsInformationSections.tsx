import React from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  BriefcaseBusiness,
  ChartNoAxesColumnIncreasing,
  LayoutTemplate,
} from "lucide-react";

const features = [
  ["01", "Complete Resume Evaluation", "Understand your overall resume score, resume grade, readability, completeness and section-level performance."],
  ["02", "Prioritized Recommendations", "See what is working, what may reduce your resume score and which improvements are worth making first."],
  ["03", "AI-Powered Improvement", "When your report is eligible, create a clearer, more professional version based on the analysis."],
  ["04", "Downloadable Resume", "Follow the generation status and download your improved resume as a ready-to-use PDF."],
] as const;

const steps = [
  ["1", "Upload Your Resume", "Select a PDF, DOC or DOCX file up to 5 MB. Your file is submitted securely for analysis."],
  ["2", "Analyze Your Resume", "We review structure, readability, completeness and screening compatibility while you follow live progress."],
  ["3", "Understand Your Results", "Review your resume score, section performance, strengths, weaknesses and focused recommendations."],
  ["4", "Improve and Download", "If eligible, generate a polished version and download the completed resume as a PDF."],
] as const;

const resources = [
  ["01", "Clear Formatting", "Make every section easy to scan", "Use familiar headings, a logical order, consistent spacing and simple formatting so your most important information is easy to find."],
  ["02", "Stronger Content", "Show evidence of your impact", "Turn responsibilities into concise achievement statements using action verbs, meaningful outcomes and measurable results where possible."],
  ["03", "Role Relevance", "Connect your experience to the opportunity", "Prioritize skills and accomplishments that genuinely match the role instead of filling your resume with repeated or unrelated keywords."],
  ["04", "Final Review", "Submit with clarity and confidence", "Check names, dates, contact details, grammar and formatting. Make sure every statement is accurate, current and easy to understand."],
] as const;

const resourceIcons = [
  LayoutTemplate,
  ChartNoAxesColumnIncreasing,
  BriefcaseBusiness,
  BadgeCheck,
] as const;

const faqs = [
  ["What does the resume checker evaluate?", "It evaluates overall resume performance, completeness, professionalism, readability and available section-level criteria. Your report also includes strengths, weaknesses and improvement suggestions."],
  ["What happens after I upload my resume?", "Your file is submitted for analysis and the progress panel updates automatically. When processing is complete, the page opens your full resume report."],
  ["Which resume formats are supported?", "You can upload PDF, DOC or DOCX files up to 5 MB. A well-formatted PDF is recommended when you want to preserve the resume layout."],
  ["How long does the resume analysis take?", "Most reports are prepared within a few moments, although processing time can vary with file size and service demand. Keep the page open and your report will appear automatically when it is ready."],
  ["Does a high resume score guarantee an interview?", "No. The resume score helps identify resume quality and compatibility issues, but hiring decisions also depend on role fit, experience, competition and the employer's process."],
  ["How can I improve a low resume score?", "Start with the highest-priority suggestions in your report. Improve unclear sections, add relevant evidence of impact, simplify formatting and make sure your skills accurately match the role you are targeting."],
  ["When can I use AI resume improvement?", "Eligibility appears inside your completed report and is based on the configured score threshold. Eligible resumes can generate an improved PDF from the report recommendations."],
  ["Should I tailor my resume for every application?", "Yes. Keep your experience truthful, but adjust your summary, skills and achievement emphasis to reflect the responsibilities and requirements of each role."],
  ["What should I review before using an improved resume?", "Check every employment date, skill, qualification and achievement for accuracy. Edit the content so it sounds like you, then proofread the final PDF before submitting it."],
] as const;

export const AtsFeaturesSection: React.FC = () => (
  <section id="features" className="ats-hero-bg px-0 py-14 sm:py-[78px]">
    <div className="ats-container">
      <SectionHeading
        title="Understand what shapes your resume score"
        description="See how your resume performs across clarity, completeness and professionalism, then focus on the improvements that matter most."
      />
      <div className="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
        {features.map(([icon, title, description], index) => (
          <MotionCard key={title} index={index} className="ats-feature-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f3f0ff] to-[#fff6e9] text-sm font-black text-[#5f4dc7]">
              {icon}
            </div>
            <h3 className="mb-2 text-lg font-extrabold">{title}</h3>
            <p className="m-0 text-sm text-[#64748b]">{description}</p>
          </MotionCard>
        ))}
      </div>
    </div>
  </section>
);

export const AtsHowItWorksSection: React.FC = () => (
  <section id="how" className="ats-hero-bg px-0 py-14 sm:py-[78px]">
    <div className="ats-container">
      <SectionHeading
        title="From upload to a clear resume score"
        description="Follow four simple steps from secure upload to focused feedback, with clear progress updates throughout the experience."
      />
      <div className="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
        {steps.map(([number, title, description], index) => (
          <MotionCard key={number} index={index} className="ats-step-card rounded-2xl p-[22px]">
            <div className="ats-step-num mb-4 grid h-9 w-9 place-items-center rounded-[10px] text-sm font-black">{number}</div>
            <h3 className="mb-1.5 text-[17px] font-extrabold text-[#0f172a]">{title}</h3>
            <p className="m-0 text-sm text-[#64748b]">{description}</p>
          </MotionCard>
        ))}
      </div>
    </div>
  </section>
);

export const AtsResourcesSection: React.FC = () => (
  <section id="resources" className="ats-hero-bg px-0 py-14 sm:py-[78px]">
    <div className="ats-container">
      <SectionHeading
        title="Build a resume recruiters can understand"
        description="A strong resume should be easy to scan, relevant to the role and supported by credible evidence. Use these practical principles with your report to make every section clearer and more persuasive."
      />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {resources.map(([number, tag, title, description], index) => {
          const ResourceIcon = resourceIcons[index];
          return (
          <motion.article key={number} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={{ y: -6 }} className="overflow-hidden rounded-[18px] border border-[#e2e8f0] bg-white transition-shadow hover:border-[#cfc7f0] hover:shadow-[0_18px_40px_rgba(95,77,199,0.1)]">
            <div className="grid h-[110px] place-items-center bg-gradient-to-br from-[#f3f0ff] to-[#fff6e9] text-[#5f4dc7]">
              <span className="grid h-16 w-16 place-items-center rounded-2xl border border-[#d8d1f3] bg-white shadow-[0_10px_24px_rgba(95,77,199,0.12)]">
                <ResourceIcon size={32} strokeWidth={1.7} aria-hidden="true" />
              </span>
            </div>
            <div className="p-[23px]">
              <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[#5f4dc7]">{tag}</span>
              <h3 className="my-2 text-[19px] font-extrabold">{title}</h3>
              <p className="m-0 text-sm text-[#64748b]">{description}</p>
              <a href="#checker" className="mt-[17px] inline-block text-[13px] font-extrabold text-[#5f4dc7] no-underline transition hover:text-[#d87945]">Generate Resume Score <span aria-hidden="true">→</span></a>
            </div>
          </motion.article>
          );
        })}
      </div>
    </div>
  </section>
);

export const AtsFaqSection: React.FC = () => (
  <section id="faq" className="ats-hero-bg px-0 py-14 sm:py-[78px]">
    <div className="ats-container">
      <SectionHeading title="Frequently asked questions" description="Quick answers about resume analysis, supported files, scoring and AI-powered improvement." />
      <div className="mx-auto max-w-[820px]">
        {faqs.map(([question, answer]) => (
          <details key={question} className="ats-faq mb-3 rounded-[13px] border border-[#e2e8f0] bg-white px-[18px]">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-[18px] font-extrabold text-[#0f172a] [&::-webkit-details-marker]:hidden">
              {question}<span className="ats-faq-toggle" aria-hidden="true" />
            </summary>
            <p className="mb-[18px] mt-0 text-[#64748b]">{answer}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export const AtsFinalCtaSection: React.FC = () => (
  <section className="ats-hero-bg px-0 py-14 sm:py-[78px]">
    <div className="ats-container">
      <div className="ats-cta-panel flex flex-col items-center justify-between gap-8 p-8 text-center sm:flex-row sm:p-10 sm:text-left">
        <div>
          <h2 className="ats-section-title mb-2 text-[clamp(26px,4vw,34px)] font-black">Ready to understand your resume score?</h2>
          <p className="m-0 text-[#64748b]">Generate a structured report with clear feedback and focused recommendations before submitting your next application.</p>
        </div>
        <a href="#checker" className="ats-white-btn w-full whitespace-nowrap rounded-[12px] px-[19px] py-[13px] text-center font-black no-underline sm:w-auto">Generate Resume Score <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>
);

export const AtsInformationSections: React.FC = () => (
  <>
    <AtsFeaturesSection />
    <AtsHowItWorksSection />
    <AtsResourcesSection />
    <AtsFaqSection />
    <AtsFinalCtaSection />
  </>
);

const SectionHeading: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
  <div className="mx-auto mb-10 max-w-[760px] text-center">
    <h2 className="ats-section-title mb-2.5 text-[clamp(28px,4vw,40px)] font-black tracking-[-1px]">{title}</h2>
    {description && <p className="m-0 text-[#64748b]">{description}</p>}
  </div>
);

const MotionCard: React.FC<{ index: number; className: string; children: React.ReactNode }> = ({ index, className, children }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={{ y: -4 }} className={className}>
    {children}
  </motion.div>
);
