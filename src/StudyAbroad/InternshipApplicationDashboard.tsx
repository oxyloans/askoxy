import React, { useMemo, useRef, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Upload,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { countryCards } from "./data/internshipData";
import FallbackImg from "../assets/img/megahero.png";

import hongkongImg from "../assets/img/hongkong.png";
import japanImg from "../assets/img/japan.png";
import mauritiusImg from "../assets/img/ma.png";
import nzImg from "../assets/img/nz.png";
import spainImg from "../assets/img/spain.png";
import uaeImg from "../assets/img/uae.png";
import usaImg from "../assets/img/usa.png";
import franceImg from "../assets/img/france.png";

type Country = (typeof countryCards)[0];

type ApplicationForm = {
  studentName: string;
  email: string;
  phoneNo: string;
  resume: File | null;
};

type FormErrors = Partial<Record<keyof ApplicationForm | "api", string>>;

const API_BASE_URL = "https://meta.oxyloans.com/api";

const localImages: Record<string, string> = {
  hongkong: hongkongImg,
  japan: japanImg,
  mauritius: mauritiusImg,
  "new zealand": nzImg,
  spain: spainImg,
  dubai: uaeImg,
  uae: uaeImg,
  usa: usaImg,
  france: franceImg,
};

const internshipTypeMap: Record<string, string> = {
  hongkong: "HONG_KONG_INTERNSHIP",
  japan: "JAPAN_INTERNSHIP",
  mauritius: "MAURITIUS_INTERNSHIP",
  "new zealand": "NEW_ZEALAND_INTERNSHIP",
  spain: "SPAIN_INTERNSHIP",
  dubai: "DUBAI_INTERNSHIP",
  uae: "DUBAI_INTERNSHIP",
  usa: "USA_INTERNSHIP",
  france: "FRANCE_INTERNSHIP",
};

const countryCodes: Record<string, string> = {
  hongkong: "HKG",
  japan: "JPN",
  mauritius: "MRU",
  "new zealand": "NZL",
  spain: "ESP",
  dubai: "DXB",
  uae: "DXB",
  usa: "USA",
  france: "FRA",
};

const defaultBenefits = [
  "Global hospitality exposure",
  "International hotel training",
  "Career growth opportunity",
  "Professional work experience",
];

function getCountryKey(country: Country) {
  const text = `${country.id || ""} ${country.title || ""} ${
    country.subtitle || ""
  }`.toLowerCase();

  if (text.includes("hong")) return "hongkong";
  if (text.includes("new zealand") || text.includes("nz")) return "new zealand";
  if (text.includes("mauritius")) return "mauritius";
  if (text.includes("dubai") || text.includes("uae")) return "dubai";
  if (text.includes("usa") || text.includes("united states")) return "usa";
  if (text.includes("france")) return "france";
  if (text.includes("japan")) return "japan";
  if (text.includes("spain")) return "spain";

  return "";
}

function getCountryName(country: Country) {
  const key = getCountryKey(country);

  const names: Record<string, string> = {
    hongkong: "Hong Kong",
    japan: "Japan",
    mauritius: "Mauritius",
    "new zealand": "New Zealand",
    spain: "Spain",
    dubai: "Dubai",
    uae: "Dubai",
    usa: "USA",
    france: "France",
  };

  return (
    names[key] ||
    country.title?.replace(/program|internship/gi, "").trim() ||
    "Country"
  );
}

function getCountryImage(country: Country) {
  const key = getCountryKey(country);
  return localImages[key] || country.image || FallbackImg;
}

function getCountryCode(country: Country) {
  const key = getCountryKey(country);
  return countryCodes[key] || getCountryName(country).slice(0, 3).toUpperCase();
}

function getInternshipType(country: Country) {
  const key = getCountryKey(country);
  return (
    internshipTypeMap[key] ||
    `${country.id || country.title}`.toUpperCase().replace(/[^A-Z0-9]+/g, "_") +
      "_INTERNSHIP"
  );
}

function getAccessToken() {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    ""
  );
}

function getUserId() {
  return (
    localStorage.getItem("userId") ||
    sessionStorage.getItem("userId") ||
    localStorage.getItem("customerId") ||
    sessionStorage.getItem("customerId") ||
    ""
  );
}

function authHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildInitialForm(): ApplicationForm {
  return {
    studentName: "",
    email: "",
    phoneNo: "",
    resume: null,
  };
}

export default function InternshipApplicationDashboard() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [activeCountryId, setActiveCountryId] = useState(
    countryCards[0]?.id || "",
  );
  const [applyCountry, setApplyCountry] = useState<Country | null>(null);
  const [form, setForm] = useState<ApplicationForm>(buildInitialForm());
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const activeCountry = useMemo(
    () =>
      countryCards.find((country) => country.id === activeCountryId) ||
      countryCards[0],
    [activeCountryId],
  );

  const activeBenefits = useMemo(() => {
    const source =
      activeCountry?.description && activeCountry.description.length > 0
        ? activeCountry.description
        : defaultBenefits;

    return source.slice(0, 4);
  }, [activeCountry]);

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    const name = form.studentName.trim();
    const email = form.email.trim();
    const phone = form.phoneNo.trim();

    if (!name) nextErrors.studentName = "Student name is required.";
    else if (name.length < 2)
      nextErrors.studentName = "Enter a valid student name.";

    if (!email) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Enter a valid email address.";

    if (!phone) nextErrors.phoneNo = "Phone number is required.";
    else if (!/^\+?[0-9]{10,15}$/.test(phone.replace(/\s|-/g, "")))
      nextErrors.phoneNo = "Enter a valid phone number.";

    if (!form.resume) nextErrors.resume = "Resume is required.";
    else {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      const allowedExtensions = /\.(pdf|doc|docx)$/i.test(form.resume.name);

      if (!allowedTypes.includes(form.resume.type) && !allowedExtensions) {
        nextErrors.resume = "Upload only PDF, DOC, or DOCX resume.";
      } else if (form.resume.size > 5 * 1024 * 1024) {
        nextErrors.resume = "Resume size must be below 5 MB.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAuthRedirect = () => {
    sessionStorage.setItem("redirectPath", "/student-home");
    sessionStorage.setItem("fromStudyAbroad", "true");
    navigate("/whatsappregister?primaryType=STUDENT");
  };

  const openApplyModal = (country: Country) => {
    if (!getAccessToken() || !getUserId()) {
      handleAuthRedirect();
      return;
    }

    setApplyCountry(country);
    setForm(buildInitialForm());
    setErrors({});
    setSuccessData(null);
  };

  const closeApplyModal = () => {
    setApplyCountry(null);
    setForm(buildInitialForm());
    setErrors({});
    setSuccessData(null);
    setSubmitting(false);
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applyCountry || !validateForm()) return;

    setSubmitting(true);
    setErrors({});

    try {
      const createResponse = await axios.post(
        `${API_BASE_URL}/user-service/student/createStudent`,
        {
          studentName: form.studentName.trim(),
          email: form.email.trim(),
          phoneNo: form.phoneNo.trim().replace(/\s|-/g, ""),
          internshipType: getInternshipType(applyCountry),
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
        },
      );

      const createdStudent = createResponse.data?.data || createResponse.data;
      const studentId = createdStudent?.id;

      if (!studentId) {
        throw new Error("Student created, but student id was not returned.");
      }

      const resumeFormData = new FormData();
      resumeFormData.append("studentId", String(studentId));
      resumeFormData.append("resume", form.resume as File);

      const resumeResponse = await axios.post(
        `${API_BASE_URL}/user-service/student/upload-resume`,
        resumeFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...authHeaders(),
          },
        },
      );

      setSuccessData(
        resumeResponse.data?.data || resumeResponse.data || createdStudent,
      );
    } catch (error: any) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        handleAuthRedirect();
        return;
      }

      setErrors({
        api:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Unable to submit application. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!activeCountry) return null;

  const countryMeta = activeCountry as any;
  const programSections = Array.isArray(countryMeta.programSections)
    ? countryMeta.programSections
    : [];

  const heroText =
    countryMeta.shortDescription ||
    countryMeta.details ||
    (Array.isArray(countryMeta.description)
      ? countryMeta.description.join(" ")
      : "Start your international hospitality career with practical training, global exposure, and guided application support.");

  return (
    <div className="min-h-screen bg-[#FAF7FF] text-[#221133]">
      <header className="sticky top-0 z-40 border-b border-purple-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-purple-600 sm:text-xs">
              Hospitality Internships
            </p>
            <h1 className="truncate text-lg font-black leading-tight text-purple-950 sm:text-2xl lg:text-3xl">
              Global Internship Programs
            </h1>
            <p className="hidden text-sm font-medium text-slate-500 sm:block">
              Choose your destination and apply in one simple flow.
            </p>
          </div>

          <button
            onClick={() => openApplyModal(activeCountry)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-800 via-violet-700 to-fuchsia-600 px-4 py-2.5 text-xs font-black text-white shadow-[0_12px_28px_rgba(126,34,206,0.30)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(126,34,206,0.38)] sm:px-5 sm:py-3 sm:text-sm"
          >
            Apply Now
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <section className="mb-4 overflow-hidden rounded-3xl border border-purple-100 bg-white p-3 shadow-[0_16px_45px_rgba(88,28,135,0.08)]">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-base font-black text-purple-950 sm:text-lg">
                Select Country
              </h2>
              <p className="text-xs font-medium text-slate-500">
                Tap country to view program details
              </p>
            </div>
          </div>

          <nav
            aria-label="Choose a destination"
            className="scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent overflow-x-auto pb-1"
          >
            <div className="flex min-w-max gap-2">
              {countryCards.map((country) => {
                const isActive = activeCountry.id === country.id;

                return (
                  <button
                    key={country.id}
                    onClick={() => setActiveCountryId(country.id)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 sm:px-5 ${
                      isActive
                        ? "bg-purple-800 text-white shadow-[0_10px_25px_rgba(126,34,206,0.28)]"
                        : "border border-purple-100 bg-purple-50 text-purple-800 hover:border-purple-300 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    {getCountryName(country)}
                  </button>
                );
              })}
            </div>
          </nav>
        </section>

        <AnimatePresence mode="wait">
          <motion.section
            key={activeCountry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden rounded-[28px] border border-purple-100 bg-white shadow-[0_22px_60px_rgba(88,28,135,0.10)]"
          >
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 p-3 sm:p-4 lg:p-5">
                <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-[22px] bg-white ring-1 ring-purple-100 sm:min-h-[390px] lg:min-h-[500px]">
                  <img
                    src={getCountryImage(activeCountry)}
                    alt={getCountryName(activeCountry)}
                    className="h-[260px] w-full object-contain object-center sm:h-[390px] lg:h-[500px]"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.onerror = null;
                      img.src = FallbackImg;
                    }}
                  />

                  <div className="absolute left-3 top-3 rounded-xl bg-purple-800 px-3 py-1.5 text-xs font-black tracking-widest text-white shadow-lg sm:left-4 sm:top-4">
                    {getCountryCode(activeCountry)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-8">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-purple-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-purple-700">
                  <MapPin className="h-3.5 w-3.5" />
                  Destination
                </div>

                <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-purple-950 sm:text-4xl lg:text-5xl">
                  {getCountryName(activeCountry)}
                </h2>

                <p className="mt-2 text-sm font-bold text-purple-600 sm:text-base">
                  {countryMeta.subtitle ||
                    "International Hospitality Internship"}
                </p>

                <p className="mt-4 line-clamp-5 text-sm leading-6 text-slate-600 sm:text-[15px]">
                  {heroText}
                </p>

                <ul className="mt-5 space-y-3">
                  {activeBenefits.map((item: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 rounded-2xl border border-purple-100 bg-purple-50/70 px-4 py-3 text-sm font-semibold leading-5 text-slate-700"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-700" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>
        </AnimatePresence>

        <section className="mt-5 sm:mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden rounded-[24px] border border-purple-100 bg-white shadow-[0_14px_35px_rgba(88,28,135,0.07)]"
          >
            <div className="border-l-4 border-purple-700 bg-gradient-to-r from-purple-50 via-white to-white px-4 py-3.5 sm:px-5 sm:py-4">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-purple-700">
                Overview
              </p>
              <h3 className="mt-1 text-xl font-black text-purple-950 sm:text-2xl">
                Program Details
              </h3>
            </div>
            <div className="px-4 py-3 sm:px-5 sm:py-4">
              <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                {countryMeta.details ||
                  (Array.isArray(countryMeta.description)
                    ? countryMeta.description.join(" ")
                    : heroText)}
              </p>
            </div>
          </motion.div>

          {programSections.length > 0 && (
            <div className="mt-3 grid gap-3 md:grid-cols-2 lg:gap-4">
              {programSections.map((section: any, index: number) => {
                const listItems = Array.isArray(section.content)
                  ? section.content
                  : [];
                const textContent = Array.isArray(section.content)
                  ? ""
                  : String(section.content || "");
                const isSimpleCard =
                  (listItems.length > 0 && listItems.length <= 2) ||
                  (!!textContent && textContent.length <= 180);

                return (
                  <motion.div
                    key={`${section.title}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className={`overflow-hidden rounded-[24px] border border-purple-100 bg-white shadow-[0_14px_35px_rgba(88,28,135,0.07)] ${
                      isSimpleCard ? "md:col-span-1" : "md:col-span-2"
                    }`}
                  >
                    <div className="flex items-start gap-3 border-l-4 border-purple-700 bg-gradient-to-r from-purple-50 via-white to-white px-4 py-3.5 sm:px-5 sm:py-4">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-800 text-xs font-black text-white shadow-sm">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-purple-500">
                          Program Info
                        </p>
                        <h3 className="mt-1 text-lg font-black leading-tight text-purple-950 sm:text-xl">
                          {section.title}
                        </h3>
                      </div>
                    </div>

                    <div className="px-4 py-3 sm:px-5 sm:py-4">
                      {Array.isArray(section.content) ? (
                        <ul
                          className={`grid gap-2.5 ${
                            isSimpleCard ? "grid-cols-1" : "sm:grid-cols-2"
                          }`}
                        >
                          {section.content.map(
                            (item: string, itemIndex: number) => (
                              <li
                                key={itemIndex}
                                className="flex items-start gap-3 rounded-2xl bg-purple-50/70 px-3.5 py-2.5 text-sm leading-6 text-slate-700 ring-1 ring-purple-100 sm:px-4"
                              >
                                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-purple-700" />
                                <span>{item}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      ) : (
                        <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                          {section.content}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <AnimatePresence>
        {applyCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#160526]/70 px-3 py-4 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && closeApplyModal()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 14 }}
              className="max-h-[92vh] w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-purple-900 via-purple-700 to-fuchsia-600 px-5 py-4 text-white">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-purple-100">
                    Application
                  </p>
                  <h3 className="mt-1 text-xl font-black">
                    {getCountryName(applyCountry)}
                  </h3>
                </div>

                <button
                  onClick={closeApplyModal}
                  aria-label="Close"
                  className="rounded-full bg-white/15 p-2 transition hover:bg-white/25"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[calc(92vh-76px)] overflow-y-auto p-5">
                {successData ? (
                  <div className="py-7 text-center">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-purple-700" />
                    <h4 className="mt-4 text-lg font-black text-purple-950">
                      Application Submitted
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Your application and resume were uploaded successfully.
                    </p>
                    <button
                      onClick={closeApplyModal}
                      className="mt-5 rounded-2xl bg-purple-800 px-6 py-3 text-sm font-black text-white"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitApplication} className="space-y-3.5">
                    {errors.api && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                        {errors.api}
                      </div>
                    )}

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">
                        Student Name
                      </span>
                      <span className="flex items-center gap-2.5 rounded-2xl bg-purple-50 px-4 py-3 ring-1 ring-purple-100 focus-within:ring-purple-400">
                        <User className="h-4 w-4 shrink-0 text-purple-500" />
                        <input
                          value={form.studentName}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              studentName: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                          placeholder="Enter full name"
                        />
                      </span>
                      {errors.studentName && (
                        <p className="mt-1 text-xs font-semibold text-red-600">
                          {errors.studentName}
                        </p>
                      )}
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">
                        Email
                      </span>
                      <span className="flex items-center gap-2.5 rounded-2xl bg-purple-50 px-4 py-3 ring-1 ring-purple-100 focus-within:ring-purple-400">
                        <Mail className="h-4 w-4 shrink-0 text-purple-500" />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                          placeholder="student@email.com"
                        />
                      </span>
                      {errors.email && (
                        <p className="mt-1 text-xs font-semibold text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">
                        Phone Number
                      </span>
                      <span className="flex items-center gap-2.5 rounded-2xl bg-purple-50 px-4 py-3 ring-1 ring-purple-100 focus-within:ring-purple-400">
                        <Phone className="h-4 w-4 shrink-0 text-purple-500" />
                        <input
                          type="tel"
                          value={form.phoneNo}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              phoneNo: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                          placeholder="10 digit phone number"
                        />
                      </span>
                      {errors.phoneNo && (
                        <p className="mt-1 text-xs font-semibold text-red-600">
                          {errors.phoneNo}
                        </p>
                      )}
                    </label>

                    <div>
                      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">
                        Resume
                      </span>
                      <div
                        onClick={() => fileRef.current?.click()}
                        className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/70 px-4 py-3.5 transition hover:border-purple-500"
                      >
                        <Upload className="h-4 w-4 shrink-0 text-purple-500" />
                        <span className="flex-1 truncate text-sm font-semibold text-slate-600">
                          {form.resume?.name || "Upload PDF, DOC, or DOCX"}
                        </span>
                        <FileText className="h-4 w-4 shrink-0 text-purple-400" />
                        <input
                          ref={fileRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              resume: e.target.files?.[0] || null,
                            }))
                          }
                        />
                      </div>
                      {errors.resume && (
                        <p className="mt-1 text-xs font-semibold text-red-600">
                          {errors.resume}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-800 via-violet-700 to-fuchsia-600 px-6 py-3.5 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
