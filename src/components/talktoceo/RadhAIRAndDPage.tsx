import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  Upload,
  Video,
  FileText,
  Sparkles,
  Download,
  Linkedin,
  CheckCircle,
  Brain,
  ArrowRight,
  X,
  Share2,
  Loader2,
  Newspaper,
} from "lucide-react";

const SOCIAL_PLATFORMS = ["LinkedIn", "YouTube", "Facebook", "Instagram", "X Twitter"];

const toast = (icon: "success" | "warning" | "error" | "info", title: string) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2200,
    background: "#07111f",
    color: "#fff",
  });
};

export default function RadhAIRAndDPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070A16] px-3 py-3 text-white sm:px-5 lg:px-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(94,221,242,0.14),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(182,242,105,0.10),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(143,116,255,0.12),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#5EDDF2_1px,transparent_1px),linear-gradient(to_bottom,#5EDDF2_1px,transparent_1px)] bg-[size:38px_38px]" />
      <main className="relative z-10 mx-auto w-full max-w-[1450px]">
        <section className="mb-4 rounded-3xl border border-white/10 bg-[#101827]/90 p-4 shadow-xl backdrop-blur-xl sm:p-6">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100 sm:text-xs">
            <Brain size={14} /> radhAI Research & Development
          </p>

          <h1 className="text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
            AI Reasoning Studio
          </h1>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400 sm:text-base">
            Upload videos or paper clippings. radhAI analyzes the content, generates outputs,
            prepares social media posts, creates blog content, extracts LinkedIn profiles and
            provides reports.
          </p>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <VideoReasoningModule />
          <PaperClippingModule />
        </div>
      </main>
    </div>
  );
}

function VideoReasoningModule() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [reasoned, setReasoned] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showBlog, setShowBlog] = useState(false);
  const [platforms, setPlatforms] = useState<string[]>([]);

  const handleReasoning = () => {
    if (!file) return toast("warning", "Please upload video file");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setReasoned(true);
      toast("success", "AI reasoning completed");
    }, 900);
  };

  const publishSocial = () => {
    if (!platforms.length) return toast("warning", "Please select social media pages");

    console.log({
      apiType: "VIDEO_SOCIAL_MEDIA_UPLOAD",
      videoFile: file?.name,
      title: "AI Jobs Vs ASKOXY.AI Vs OxyLoans Vs OXYGOLD",
      caption:
        "AI is enabling users to learn, improve skills, increase profile scores and unlock better career opportunities.",
      hashtags: "#AI #ASKOXYAI #Jobs #GenAI #CareerGrowth",
      socialPages: platforms,
    });

    toast("success", "Social media publish API committed");
  };

  const publishBlog = () => {
    console.log({
      apiType: "VIDEO_BLOG_PUBLISH",
      videoFile: file?.name,
      title: "How AI is Creating New Career Opportunities",
      description:
        "This blog explains how AI helps users improve their profile score, skill readiness and job opportunities through ASKOXY.AI.",
      hashtags: "#AI #GenAI #ASKOXYAI #Jobs #CareerGrowth",
    });

    toast("success", "Blog publish API committed");
  };

  return (
    <Card
      icon={<Video size={22} />}
      title="Video Upload & AI Reasoning"
      desc="Upload video, run AI reasoning, then publish to social media or blog."
    >
      <UploadBox
        accept="video/*"
        file={file}
        title="Upload Video File"
        subtitle="MP4, MOV, WEBM supported"
        onSelect={setFile}
        onClear={() => {
          setFile(null);
          setReasoned(false);
          setShowSocial(false);
          setShowBlog(false);
          setPlatforms([]);
        }}
      />

      <PrimaryButton loading={loading} onClick={handleReasoning}>
        Submit & AI Reasoning
      </PrimaryButton>

      {reasoned && (
        <ResultBox title="AI Reasoning Output">
          <Field
            label="Reasoning Summary"
            value="This video explains how AI can help people enter the job market by improving profile score, JD score, skill readiness and career growth."
          />
          <Field
            label="Key Message"
            value="AI is not replacing everyone. AI can become a job enabler when people learn and use it correctly."
          />

          <ActionQuestion
            text="Do you want to upload this video to social media?"
            onYes={() => setShowSocial(true)}
          />

          {showSocial && (
            <div className="space-y-3 rounded-3xl border border-cyan-300/15 bg-cyan-400/5 p-3">
              <Field label="Title" value="AI Jobs Vs ASKOXY.AI Vs OxyLoans Vs OXYGOLD" />
              <Field
                label="Caption"
                value="Learn. Earn. Grow. Protect. AI is opening new career opportunities for everyone through ASKOXY.AI."
              />
              <Field label="Hashtags" value="#AI #ASKOXYAI #Jobs #GenAI #CareerGrowth" />
              <PlatformSelector selected={platforms} setSelected={setPlatforms} />
              <PrimaryButton onClick={publishSocial}>Add to Social Media Pages</PrimaryButton>
            </div>
          )}

          <ActionQuestion
            text="Do you want to publish this video as a blog?"
            onYes={() => setShowBlog(true)}
          />

          {showBlog && (
            <div className="space-y-3 rounded-3xl border border-lime-300/15 bg-lime-400/5 p-3">
              <Field label="Blog Title" value="How AI is Creating New Career Opportunities" />
              <Field
                label="Description"
                value="AI platforms are helping users learn faster, improve profile strength, upgrade skills and prepare for job opportunities."
              />
              <Field label="Hashtags" value="#AI #GenAI #ASKOXYAI #Jobs" />
              <Field label="Media" value={file?.name || "Uploaded video file"} />
              <PrimaryButton onClick={publishBlog}>Publish Blog</PrimaryButton>
            </div>
          )}
        </ResultBox>
      )}
    </Card>
  );
}

function PaperClippingModule() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [reasoned, setReasoned] = useState(false);
  const [showBlog, setShowBlog] = useState(false);

  const handleAnalyze = () => {
    if (!file) return toast("warning", "Please upload paper clipping image");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setReasoned(true);
      toast("success", "Paper clipping AI reasoning completed");
    }, 900);
  };

  const publishBlog = () => {
    console.log({
      apiType: "PAPER_CLIPPING_BLOG_PUBLISH",
      clippingFile: file?.name,
      title: "AI Growth and BFSI Innovation Opportunities",
      description:
        "This blog is generated from the uploaded paper clipping. It summarizes people, organizations, LinkedIn references and report-related insights.",
      hashtags: "#AI #BFSI #ASKOXYAI #Innovation",
    });

    toast("success", "Paper clipping blog publish API committed");
  };

  return (
    <Card
      icon={<FileText size={22} />}
      title="Paper Clipping AI"
      desc="Upload paper clipping image and extract summary, people, organizations, LinkedIn profiles and reports."
    >
      <UploadBox
        accept="image/*,.pdf"
        file={file}
        title="Upload Paper Clipping"
        subtitle="Image or PDF supported"
        onSelect={setFile}
        onClear={() => {
          setFile(null);
          setReasoned(false);
          setShowBlog(false);
        }}
      />

      <PrimaryButton loading={loading} onClick={handleAnalyze}>
        Submit & AI Reasoning
      </PrimaryButton>

      {reasoned && (
        <ResultBox title="Paper Clipping AI Output">
          <Field
            label="Summary"
            value="The clipping highlights AI adoption, BFSI transformation and digital platform growth opportunities."
          />
          <Field label="People Involved" value="Radhakrishna Thatavarti, Industry Leaders" />
          <Field
            label="People LinkedIn Profiles"
            value="linkedin.com/in/radhakrishna-thatavarti"
          />
          <Field label="Companies / Organizations Involved" value="ASKOXY.AI, OxyLoans, OXYGOLD" />
          <Field
            label="Company LinkedIn Profiles"
            value="linkedin.com/company/askoxy-ai, linkedin.com/company/oxyloans"
          />
          <Field
            label="Report Document Check"
            value="Relevant report content found. Report document is ready for download."
          />

          <div className="grid gap-2 sm:grid-cols-2">
            <SecondaryButton icon={<Download size={15} />}>Download Report</SecondaryButton>
            <SecondaryButton icon={<Linkedin size={15} />}>LinkedIn Profiles</SecondaryButton>
          </div>

          <ActionQuestion
            text="Do you want to publish this paper clipping as a blog?"
            onYes={() => setShowBlog(true)}
          />

          {showBlog && (
            <div className="space-y-3 rounded-3xl border border-lime-300/15 bg-lime-400/5 p-3">
              <Field label="Blog Title" value="AI Growth and BFSI Innovation Opportunities" />
              <Field
                label="Description"
                value="This blog summarizes the uploaded paper clipping with key people, companies, LinkedIn profiles and report insights."
              />
              <Field label="Hashtags" value="#AI #BFSI #ASKOXYAI #Innovation" />
              <Field label="Image / Document" value={file?.name || "Uploaded paper clipping"} />
              <PrimaryButton onClick={publishBlog}>Publish Blog</PrimaryButton>
            </div>
          )}
        </ResultBox>
      )}
    </Card>
  );
}

function Card({
  children,
  icon,
  title,
  desc,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#101827]/90 p-4 shadow-xl backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6F269] to-[#5EDDF2] text-black">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-black leading-tight">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">{desc}</p>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function UploadBox({
  accept,
  file,
  title,
  subtitle,
  onSelect,
  onClear,
}: {
  accept: string;
  file: File | null;
  title: string;
  subtitle: string;
  onSelect: (file: File | null) => void;
  onClear: () => void;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-cyan-300/20 bg-[#0B1020] p-3">
      <label className="flex min-h-[125px] cursor-pointer flex-col items-center justify-center rounded-2xl bg-white/[0.035] p-4 text-center hover:bg-white/[0.06]">
        {file ? (
          <CheckCircle size={30} className="mb-3 text-lime-300" />
        ) : (
          <Upload size={30} className="mb-3 text-cyan-300" />
        )}

        <p className="max-w-full truncate text-sm font-black">
          {file ? file.name : title}
        </p>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>

        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onSelect(e.target.files?.[0] || null)}
        />
      </label>

      {file && (
        <button
          onClick={onClear}
          type="button"
          className="mt-2 inline-flex items-center gap-1 rounded-full border border-red-300/20 bg-red-500/10 px-3 py-1.5 text-[11px] font-bold text-red-200"
        >
          <X size={13} /> Remove
        </button>
      )}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  loading = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5EDDF2] to-[#B6F269] px-4 py-3 text-sm font-black text-black transition hover:brightness-110 disabled:opacity-70"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
      {children}
      {!loading && <ArrowRight size={15} />}
    </button>
  );
}

function SecondaryButton({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => toast("success", "Action completed")}
      className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-3 text-xs font-black text-cyan-100 hover:bg-cyan-400/15"
    >
      {icon}
      {children}
    </button>
  );
}

function ResultBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-3xl border border-white/10 bg-[#0B1020] p-3 sm:p-4">
      <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-lime-300">
        <CheckCircle size={14} /> {title}
      </p>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-xs leading-5 text-slate-200 sm:text-sm">
        {value}
      </div>
    </div>
  );
}

function ActionQuestion({
  text,
  onYes,
}: {
  text: string;
  onYes: () => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-3">
      <p className="mb-3 text-sm font-bold text-slate-200">{text}</p>
      <button
        type="button"
        onClick={onYes}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-lime-300/20 bg-lime-300/10 px-4 py-3 text-sm font-black text-lime-200 hover:bg-lime-300/15 sm:w-auto"
      >
        Yes, Create <Newspaper size={15} />
      </button>
    </div>
  );
}

function PlatformSelector({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: (items: string[]) => void;
}) {
  const toggle = (item: string) => {
    setSelected(
      selected.includes(item)
        ? selected.filter((x) => x !== item)
        : [...selected, item]
    );
  };

  return (
    <div>
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
        Select Social Media Pages
      </p>

      <div className="flex flex-wrap gap-2">
        {SOCIAL_PLATFORMS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => toggle(item)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-black ${
              selected.includes(item)
                ? "bg-lime-300 text-black"
                : "border border-white/10 bg-white/[0.05] text-slate-300"
            }`}
          >
            <Share2 size={12} />
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}