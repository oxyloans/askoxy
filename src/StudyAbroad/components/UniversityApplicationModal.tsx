import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  GraduationCap,
  MapPin,
  Send,
  User,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Award,
  Languages,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface University {
  id: number;
  universityId: string;
  name: string;
  country: string;
  location?: string;
  image: string;
  intake: string[];
}

interface Props {
  isOpen: boolean;
  university: University | null;
  onClose: () => void;
}

const ENGLISH_TESTS = ["IELTS", "TOEFL", "PTE", "Not Yet Appeared"] as const;
type EnglishTest = (typeof ENGLISH_TESTS)[number];

const scoreLabel: Record<string, string> = {
  IELTS: "IELTS Overall Band Score",
  TOEFL: "TOEFL Total Score",
  PTE: "PTE Overall Score",
};

const scorePlaceholder: Record<string, string> = {
  IELTS: "e.g. 6.5",
  TOEFL: "e.g. 90",
  PTE: "e.g. 65",
};

const SUBMIT_APPLICATION_API_URL =
  "http://65.0.147.157:9024/api/user-service/applications/submitApplication";

const UniversityApplicationModal: React.FC<Props> = ({
  isOpen,
  university,
  onClose,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [courseLevel, setCourseLevel] = useState<"UG" | "PG" | "">("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    preferredCourse: "",
    preferredIntake: "",
    academicScore: "",
    englishTest: "" as EnglishTest | "",
    englishScore: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    setSubmitted(false);
    setLoading(false);
    setErrorMsg("");
    setCourseLevel("");
    setForm({
      fullName:
        localStorage.getItem("userName") ||
        localStorage.getItem("userFirstName") ||
        "",
      email:
        localStorage.getItem("userEmail") ||
        localStorage.getItem("customerEmail") ||
        "",
      mobile:
        localStorage.getItem("mobileNumber") ||
        localStorage.getItem("userMobile") ||
        "",
      preferredCourse: "",
      preferredIntake: "",
      academicScore: "",
      englishTest: "",
      englishScore: "",
    });
  }, [isOpen, university?.id]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleEnglishTestChange = (test: EnglishTest) => {
    setForm((p) => ({ ...p, englishTest: test, englishScore: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!university) return;

    setLoading(true);
    setErrorMsg("");

    const academicScoreNumber = parseFloat(form.academicScore);

    const payload = {
      fullName: form.fullName,
      email: form.email,
      mobileNumber: form.mobile,
      courseLevel: courseLevel,
      preferredCourse: form.preferredCourse,
      preferredIntake: form.preferredIntake,
      twelfthPercentage:
        courseLevel === "UG" && !Number.isNaN(academicScoreNumber)
          ? academicScoreNumber
          : 0,
      graduationCgpa:
        courseLevel === "PG" && !Number.isNaN(academicScoreNumber)
          ? academicScoreNumber
          : 0,
      englishTest: form.englishTest,
      englishTestScore:
        form.englishTest === "Not Yet Appeared" ? "" : form.englishScore,
      universityId: university.universityId,
    };

    try {
      const response = await fetch(SUBMIT_APPLICATION_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Submission failed with status ${response.status}`);
      }

      await response.json();

      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      setLoading(false);
      setErrorMsg(
        "We couldn't submit your application right now. Please try again."
      );
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setErrorMsg("");
    onClose();
  };

  const showScoreField =
    form.englishTest &&
    form.englishTest !== "Not Yet Appeared" &&
    scoreLabel[form.englishTest];

  if (!university) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl bg-white sm:rounded-3xl rounded-t-3xl shadow-[0_32px_80px_rgba(0,0,0,0.28)] max-h-[96vh] overflow-y-auto z-10 scrollbar-thin"
            style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-red-50 hover:text-red-500 rounded-full shadow-md transition-all duration-200 border border-gray-100"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {submitted ? (
              /* ── Success State ── */
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-200"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                  Application Submitted!
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-8">
                  Your application to{" "}
                  <span className="font-semibold text-purple-700">
                    {university.name}
                  </span>{" "}
                  has been received. Our admissions team will contact you within{" "}
                  <span className="font-semibold text-purple-700">
                    7 working days
                  </span>
                  .
                </p>
                <button
                  onClick={handleClose}
                  className="px-10 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl text-sm hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                {/* ── Hero Image ── */}
                <div className="relative h-44 sm:h-52 overflow-hidden sm:rounded-t-3xl rounded-t-3xl">
                  <img
                    src={university.image}
                    alt={university.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      7-Day Offer Letter
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 p-5 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight drop-shadow-sm">
                      {university.name}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1.5 text-white/80 text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      {university.location || university.country}
                    </div>
                  </div>
                </div>

                {/* ── Purple Banner ── */}
                <div className="bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-white/80 flex-shrink-0" />
                    <p className="text-white text-xs font-semibold">
                      Receive your offer letter in{" "}
                      <span className="font-extrabold">7 working days</span>
                    </p>
                  </div>
                  <span className="text-white/60 text-[10px] font-medium hidden sm:block">
                    Powered by AskOxy.ai
                  </span>
                </div>

                {/* ── Form ── */}
                <form
                  onSubmit={handleSubmit}
                  className="p-6 sm:p-8 space-y-7"
                >
                  {/* Personal Information */}
                  <Section icon={<User className="w-3.5 h-3.5" />} title="Personal Information">
                    <Field label="Full Name" required icon={<User className="w-3.5 h-3.5 text-gray-400" />}>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={form.fullName}
                        onChange={(e) => set("fullName", e.target.value)}
                        required
                        className={inp}
                      />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Email Address" required icon={<Mail className="w-3.5 h-3.5 text-gray-400" />}>
                        <input
                          type="email"
                          placeholder="you@email.com"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          required
                          className={inp}
                        />
                      </Field>
                      <Field label="Mobile Number" required icon={<Phone className="w-3.5 h-3.5 text-gray-400" />}>
                        <input
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={form.mobile}
                          onChange={(e) => set("mobile", e.target.value)}
                          required
                          className={inp}
                        />
                      </Field>
                    </div>
                  </Section>

                  {/* Study Preferences */}
                  <Section icon={<BookOpen className="w-3.5 h-3.5" />} title="Study Preferences">
                    <Field label="Course Level" required>
                      <div className="flex gap-3">
                        {(["UG", "PG"] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setCourseLevel(lvl)}
                            className={`flex-1 py-3 rounded-2xl text-sm font-bold border-2 transition-all duration-200 ${
                              courseLevel === lvl
                                ? "border-purple-600 bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200"
                                : "border-gray-200 text-gray-500 hover:border-purple-300 hover:bg-purple-50 bg-white"
                            }`}
                          >
                            {lvl === "UG" ? "🎓 Undergraduate" : "🏅 Postgraduate"}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Preferred Course" required icon={<BookOpen className="w-3.5 h-3.5 text-gray-400" />}>
                      <input
                        type="text"
                        placeholder="e.g. MSc Data Science, MBA, BBA"
                        value={form.preferredCourse}
                        onChange={(e) => set("preferredCourse", e.target.value)}
                        required
                        className={inp}
                      />
                    </Field>
                    <Field label="Preferred Intake" required icon={<Calendar className="w-3.5 h-3.5 text-gray-400" />}>
                      <select
                        value={form.preferredIntake}
                        onChange={(e) => set("preferredIntake", e.target.value)}
                        required
                        className={inp}
                      >
                        <option value="">Select intake</option>
                        {university.intake.map((i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </Field>
                  </Section>

                  {/* Academic Information */}
                  <Section icon={<Award className="w-3.5 h-3.5" />} title="Academic Information">
                    <Field
                      label={
                        courseLevel === "PG"
                          ? "Graduation CGPA / Percentage"
                          : "12th Percentage / CGPA"
                      }
                      required
                      icon={<Award className="w-3.5 h-3.5 text-gray-400" />}
                    >
                      <input
                        type="text"
                        placeholder={
                          courseLevel === "PG"
                            ? "e.g. 7.5 CGPA or 72%"
                            : "e.g. 78%"
                        }
                        value={form.academicScore}
                        onChange={(e) => set("academicScore", e.target.value)}
                        required
                        className={inp}
                      />
                    </Field>
                  </Section>

                  {/* English Language Proficiency */}
                  <Section icon={<Languages className="w-3.5 h-3.5" />} title="English Language Proficiency">
                    <div className="grid grid-cols-2 gap-2.5">
                      {ENGLISH_TESTS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handleEnglishTestChange(t)}
                          className={`py-3 px-3 rounded-2xl text-sm font-semibold border-2 transition-all duration-200 ${
                            form.englishTest === t
                              ? t === "Not Yet Appeared"
                                ? "border-amber-500 bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200"
                                : "border-purple-600 bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200"
                              : "border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50 bg-white"
                          }`}
                        >
                          {t === "Not Yet Appeared" ? "⏳ Not Yet Appeared" : `📝 ${t}`}
                        </button>
                      ))}
                    </div>

                    {/* Conditional Score Field */}
                    <AnimatePresence>
                      {showScoreField && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-4">
                            <Field
                              label={scoreLabel[form.englishTest as string]}
                              required
                              icon={<Award className="w-3.5 h-3.5 text-purple-400" />}
                            >
                              <input
                                type="text"
                                placeholder={scorePlaceholder[form.englishTest as string]}
                                value={form.englishScore}
                                onChange={(e) => set("englishScore", e.target.value)}
                                required
                                className={`${inp} bg-white border-purple-200 focus:border-purple-500`}
                              />
                            </Field>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Section>

                  {/* Error Message */}
                  {errorMsg && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold px-4 py-3 rounded-2xl">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={
                        loading ||
                        !courseLevel ||
                        !form.englishTest ||
                        (showScoreField ? !form.englishScore : false)
                      }
                      className="w-full py-4 bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600 text-white font-extrabold rounded-2xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2.5 shadow-xl shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5 text-base tracking-wide"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Application
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px] text-gray-400 mt-3">
                      🔒 Your information is secure and will only be used for admission purposes.
                    </p>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* ── Shared Styles ── */
const inp =
  "w-full px-4 py-3 border-2 border-gray-100 rounded-2xl text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-100 focus:bg-white transition-all duration-200 placeholder:text-gray-400";

const Section: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      {icon && (
        <span className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
          {icon}
        </span>
      )}
      <p className="text-xs font-extrabold text-purple-700 uppercase tracking-widest">
        {title}
      </p>
      <div className="flex-1 h-px bg-gradient-to-r from-purple-100 to-transparent" />
    </div>
    {children}
  </div>
);

const Field: React.FC<{
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, required, icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
      {icon}
      {label}
      {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

export default UniversityApplicationModal;