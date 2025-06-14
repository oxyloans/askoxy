import React, { useState, useEffect, useRef } from "react";
import "../StudyAbroad.css";
import "../DiwaliPage.css";
import "../Freerudraksha.css";
import { ArrowLeft } from "lucide-react";
import {
  FaUniversity,
  FaGlobe,
  FaPlane,
  FaBook,
  FaInfoCircle,
  FaPoundSign,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import Header1 from "../Header";
import { useNavigate } from "react-router-dom";
import Univ1 from "../../assets/img/Univ1.png";
import Univ2 from "../../assets/img/univ2.png";
import Univ3 from "../../assets/img/univ3.png";
import Univ4 from "../../assets/img/univ4.png";
import Univ5 from "../../assets/img/univ5.png";
import img1 from "../../assets/img/1.1.png";
import img2 from "../../assets/img/1.2.png";
import img3 from "../../assets/img/1.3.png";
import img4 from "../../assets/img/1.4.png";
import img5 from "../../assets/img/1.5.png";
import img6 from "../../assets/img/1.6.png";
import Footer from "../Footer";
import { message, Modal } from "antd";
import {
  checkUserInterest,
  submitInterest,
  submitWriteToUsQuery,
} from "../servicesapi";

interface BaseFee {
  program: string;
}

interface TotalFee extends BaseFee {
  total: string;
  firstYear: string;
  annual?: never;
  scholarship?: never;
  net?: never;
}

interface AnnualFee extends BaseFee {
  annual: string;
  scholarship: string;
  net: string;
  total?: never;
  firstYear?: never;
}

type Fee = TotalFee | AnnualFee;

interface University {
  name: string;
  image: string;
  intakes: string;
  highlights: string[];
  fees: Fee[];
  requirements?: string[];
}

const StudyAbroad: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  const [issuccessOpen, setSuccessOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isprofileOpen, setIsprofileOpen] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [interested, setInterested] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [expandedUniversity, setExpandedUniversity] = useState<number | null>(
    null
  );
  const submitclicks = sessionStorage.getItem("submitclicks");
  const userId = localStorage.getItem("userId");
  const whatsappNumber = localStorage.getItem("whatsappNumber");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const profileData = JSON.parse(localStorage.getItem("profileData") || "{}");
  const email = profileData.customerEmail || null;
  const finalMobileNumber = whatsappNumber || mobileNumber || null;
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    askOxyOfers: "STUDYABROAD",
    userId: userId,
    mobileNumber: finalMobileNumber,
    projectType: "ASKOXY",
  });

  const images = [
    { src: img1, alt: "Image 1" },
    { src: img2, alt: "Image 2" },
    { src: img5, alt: "Image 5" },
    { src: img6, alt: "Image 6" },
    { src: img3, alt: "Image 3" },
    { src: img4, alt: "Image 4" },
  ];

  const universities: University[] = [
    {
      name: "BPP University",
      image: Univ1,
      intakes: "Rolling Admissions",
      highlights: [
        "Career Boost: Industry-designed programs enhancing job prospects.",
        "Expert Faculty: Courses delivered by industry professionals.",
        "Flexible Learning: Study full-time, part-time, or online.",
        "Rolling Intakes: Quick service and unlimited CAS issuance.",
        "Placement Support: Programs aligned with market needs.",
        "Industry-Relevant Programs: Designed in collaboration with employers.",
        "Processing Time: Offer Letter within 48 hours.",
        "Deposit Before CAS: First-Year Tuition Fees.",
      ],
      fees: [
        { program: "UG", total: "£33,000", firstYear: "£11,000" },
        { program: "PG (Without PDP)", total: "£13,700", firstYear: "£13,700" },
        {
          program: "PG (PDP 18 months Course)",
          total: "£17,100",
          firstYear: "£13,700",
        },
      ],
      requirements: [
        "UG: 60% in HSC",
        "PG (1-5 years GAP acceptance): 55% and above",
        "PG (6-7 years GAP acceptance): 60% (First Class on degree certificate)",
        "PG (Data Analytics): 55% (1-5 years GAP)",
        "Students with STEM background: 60% (6-7 years GAP)",
        "PG (Data Analytics - Non-STEM background): 65% (case-by-case basis)",
      ],
    },
    {
      name: "University of East London",
      image: Univ2,
      intakes: "May & Sept",
      highlights: [
        "Ranked 1st in London & 3rd in the UK (NSS Ranking)",
        "92% of Research Work is Globally Recognized",
        "94% Employment Rate Before Graduation",
        "Future-Focused Education & Industry-Relevant Courses",
        "Real-World Experience with Work Placements & Industry Projects",
        "Work While Studying (Flexible Work Opportunities for Students)",
        "MWP Certification & Digital Badging for Extra Skill Recognition",
      ],
      fees: [
        {
          program: "Undergraduate (UG)",
          annual: "£14,820",
          scholarship: "£500 - £1,500",
          net: "£13,320 - £14,320",
        },
        {
          program: "Master's (PG)",
          annual: "£15,960",
          scholarship: "£500 - £1,500",
          net: "£14,500 - £15,500",
        },
        {
          program: "MBA",
          annual: "£18,060",
          scholarship: "£500 - £1,500",
          net: "£17,560",
        },
      ],
    },
    {
      name: "Ravensbourne University",
      image: Univ3,
      intakes: "May, Sept & Nov",
      highlights: [
        "Located in London: Prime location for industry exposure.",
        "Quick Turnaround Time: Fast application processing (48 hours for offers).",
        "Easy Interview Process: Simple pre-deposit interview with resit options.",
      ],
      fees: [
        {
          program: "UG",
          annual: "£17,000",
          scholarship: "£3,500",
          net: "£13,500",
        },
        {
          program: "PG",
          annual: "£18,000",
          scholarship: "£3,500",
          net: "£14,500",
        },
        {
          program: "MBA",
          annual: "£19,500",
          scholarship: "£3,500",
          net: "£16,000",
        },
        {
          program: "MFA",
          annual: "£24,000",
          scholarship: "£3,500",
          net: "£20,500",
        },
        {
          program:
            "MSc Int. Fashion Marketing & MBA Fashion & Entrepreneurship",
          annual: "£18,000 - £19,500",
          scholarship: "£5,000",
          net: "£13,000 - £14,500",
        },
        {
          program: "Business Management (IY1)",
          annual: "£17,000",
          scholarship: "£6,000 (Yr 1), £3,500 (Yr 2 & 3)",
          net: "£13,500",
        },
      ],
    },
    {
      name: "University of Roehampton",
      image: Univ4,
      intakes: "Apr, Jul, Sept & Nov",
      highlights: [
        "Top-Ranked in London: One of the highest-ranked modern universities in London",
        "High Employability: Strong career support and job opportunities after graduation",
        "Flexible Intakes: Multiple intakes per year for better admission flexibility",
        "Scholarships & Discounts: Up to £4,500 scholarships available",
        "MOI & English Language Waivers: Less restrictive English requirements for eligible students",
        "Diverse Student Community: Over 140 nationalities represented on campus",
        "Study Gaps Accepted: Flexible policies for both UG and PG applicants",
      ],
      fees: [
        {
          program: "UG",
          annual: "£16,000 - £19,000",
          scholarship: "Up to £4,500",
          net: "£14,000 - £16,000",
        },
        {
          program: "PG",
          annual: "£16,000 - £19,000",
          scholarship: "Up to £4,500",
          net: "£14,000 - £16,000",
        },
      ],
    },
    {
      name: "Anglia Ruskin University",
      image: Univ5,
      intakes: "May & Sept",
      highlights: [
        "ARU Temps: Temporary part-time job opportunities on campus",
        "Affordable Fees: Competitive tuition costs and scholarships",
        "Multiple Campuses: Study in 5 different cities",
        "1 Pound Meals: Low-cost meal options for students on campus",
      ],
      fees: [
        {
          program: "UG",
          annual: "£15,200 (Approx)",
          scholarship:
            "Up to £7,000 (£4,000 in Year 1, £1,000 in Year 2 & 3, £1,000 EPD)",
          net: "£11,200",
        },
        {
          program: "PG",
          annual: "£18,000 (Approx)",
          scholarship:
            "Up to £5,000 (50-59%: £2,000, 60%+: £4,000 & £1,000 EPD)",
          net: "£14,500",
        },
      ],
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleToggle = (role: string) => {
    setSelectedRole((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleRoleSelection = (roles: string[]) => {
    if (roles.length > 0) {
      setIsRoleModalOpen(false);
      showConfirmationModal(interested, roles.join(" "));
    }
  };

  const handleSubmit = (isAlreadyInterested: boolean) => {
    sessionStorage.setItem("submitclicks", "true");

    if (!userId) {
      navigate("/whatsappregister");
      sessionStorage.setItem("redirectPath", "/main/services/studyabroad");
      message.warning("Please login to submit your interest.");
      return;
    }

    if (isAlreadyInterested) {
      message.warning("You have already participated. Thank you!", 5);
      setTimeout(() => {
        sessionStorage.removeItem("submitclicks");
      }, 7000);
      return;
    }

    setIsRoleModalOpen(true);
  };

  const showConfirmationModal = (
    isAlreadyInterested: boolean,
    role: string
  ) => {
    if (isAlreadyInterested) {
      message.warning("You have already participated. Thank you!", 5);
      setTimeout(() => {
        sessionStorage.removeItem("submitclicks");
      }, 7000);
      return;
    }
    Modal.confirm({
      title: "Confirm Participation",
      content: `Are you sure you want to participate in the Study Abroad offer as ${
        role || "a participant"
      }?`,
      okText: "Yes, I’m sure",
      cancelText: "Cancel",
      onOk: () => submitInterestHandler(role),
      onCancel: () => {
        sessionStorage.removeItem("submitclicks");
        setSelectedRole([]);
      },
    });
  };

  const submitInterestHandler = async (role: string) => {
    if (isButtonDisabled) return;

    try {
      setIsButtonDisabled(true);
      const success = await submitInterest(
        formData.askOxyOfers,
        formData.mobileNumber,
        formData.userId,
        role
      );

      if (success) {
        message.success(
          "Thank you for showing interest in our *Study Abroad* offer!"
        );
        setInterested(true);
        localStorage.setItem("askOxyOfers", formData.askOxyOfers);
      } else {
        message.error("Failed to submit your interest. Please try again.");
        setInterested(false);
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error("Failed to submit your interest. Please try again.");
      setInterested(false);
    } finally {
      setIsButtonDisabled(false);
      sessionStorage.removeItem("submitclicks");
      setSelectedRole([]);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const handlePopUOk = () => {
    setIsOpen(false);
    navigate("/main/profile");
  };

  const handleWriteToUs = () => {
    if (
      !email ||
      email === "null" ||
      !finalMobileNumber ||
      finalMobileNumber === "null"
    ) {
      setIsprofileOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  const handleWriteToUsSubmitButton = async () => {
    if (!query || query.trim() === "") {
      setQueryError("Please enter the query before submitting.");
      return;
    }

    try {
      setIsLoading(true);
      const success = await submitWriteToUsQuery(
        email,
        finalMobileNumber,
        query,
        "STUDYABROAD",
        userId
      );

      if (success) {
        setSuccessOpen(true);
        setIsOpen(false);
        setQuery("");
        setQueryError(undefined);
      } else {
        message.error("Failed to submit your query. Please try again.");
      }
    } catch (error) {
      console.error("Error sending the query:", error);
      message.error("Failed to submit your query. Please try again.");
      setQueryError("Failed to submit your query. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUniversity = (index: number) => {
    if (expandedUniversity === index) {
      setExpandedUniversity(null);
    } else {
      setExpandedUniversity(index);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    handleLoadOffersAndCheckInterest();
  }, []);

  const handleLoadOffersAndCheckInterest = async () => {
    if (!userId) return;

    try {
      const hasInterest = await checkUserInterest(userId, "STUDYABROAD");
      setInterested(hasInterest);
      if (submitclicks) {
        handleSubmit(hasInterest);
      }
    } catch (error) {
      console.error("Error while fetching offers:", error);
      setInterested(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-4 p-2">{!userId ? <Header1 /> : null}</div>
      <div>
        <header className="bg-white shadow-md p-4">
          <div className="flex flex-col items-center justify-center md:flex-row pt-2 px-4 md:px-6 lg:px-8">
            <h1 className="text-center text-[rgba(91,5,200,0.85)] font-bold mb-6 text-xl sm:text-xl md:text-3xl lg:text-xl leading-tight md:mb-0">
              World's 1<sup>st</sup> AI & Blockchain based platform for
              university admissions
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-2 mt-6 items-center justify-between w-full px-4">
            <div className="flex items-center gap-4 flex-start">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold mt-2 text-purple-600 flex items-center gap-2">
                Study Abroad
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="relative" ref={dropdownRef}>
                <button
                  className="bg-[#ea4c89] w-full md:w-auto px-4 py-2 text-white rounded-lg shadow-md hover:bg-[#008CBA] text-sm md:text-base lg:text-lg transition duration-300"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="Navigate options"
                >
                  Explore GPTS
                </button>

                {isDropdownOpen && (
                  <ul className="absolute bg-white text-black shadow-lg rounded-md mt-2 w-48 md:w-60 overflow-y-auto max-h-60 z-10 right-0">
                    {[
                      {
                        label: "Accommodation GPT",
                        path: "/main/dashboard/accomdation-gpt",
                      },
                      {
                        label: "Accreditations Recognization GPT",
                        path: "/main/dashboard/accreditations-gpt",
                      },
                      {
                        label: "Application Support GPT",
                        path: "/main/dashboard/applicationsupport-gpt",
                      },
                      {
                        label: "Courses GPT",
                        path: "/main/dashboard/courses-gpt",
                      },
                      {
                        label: "Foreign Exchange & Predeparture GPT",
                        path: "/main/dashboard/foreign-exchange",
                      },
                      {
                        label: "Information About Countries GPT",
                        path: "/main/dashboard/informationaboutcountries-gpt",
                      },
                      { label: "Loans GPT", path: "/main/dashboard/loans-gpt" },
                      {
                        label: "Logistics GPT",
                        path: "/main/dashboard/logistics-gpt",
                      },
                      {
                        label: "Placements GPT",
                        path: "/main/dashboard/placements-gpt",
                      },
                      {
                        label: "Qualification & Specialization GPT",
                        path: "/main/dashboard/qualificationspecialization-gpt",
                      },
                      {
                        label: "Scholarships GPT",
                        path: "/main/dashboard/scholarships-gpt",
                      },
                      {
                        label: "English Test & Interview Preparation GPT",
                        path: "/main/dashboard/preparation-gpt",
                      },
                      {
                        label: "Universities GPT",
                        path: "/main/dashboard/universities-gpt",
                      },
                      {
                        label: "University Agents GPT",
                        path: "/main/dashboard/universitiesagents-gpt",
                      },
                      {
                        label: "University Reviews GPT",
                        path: "/main/dashboard/reviews-gpt",
                      },
                      { label: "Visa GPT", path: "/main/dashboard/visa-gpt" },
                    ]
                      .sort((a, b) => a.label.localeCompare(b.label))
                      .map((item) => (
                        <li
                          key={item.path}
                          className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal text-sm"
                          onClick={() => handleNavigation(item.path)}
                        >
                          {item.label}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
              <button
                className="w-full md:w-auto px-4 py-2 bg-[#04AA6D] text-white rounded-lg shadow-md hover:bg-green-600 text-sm md:text-base lg:text-lg transition duration-300"
                onClick={() => handleSubmit(interested)}
                aria-label="I'm Interested"
                disabled={isButtonDisabled || interested}
              >
                {interested ? "Already Participated" : "I'm Interested"}
              </button>
              <a
                href="https://bmv.money/bankd/index.html"
                className="w-full md:w-auto px-4 py-2 bg-[#04AA6D] text-white rounded-lg shadow-md hover:bg-[#038258] text-sm md:text-base lg:text-lg transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Scholarship Platform"
              >
                BankD
              </a>
              <button
                className="w-full md:w-auto px-4 py-2 bg-[#008CBA] text-white rounded-lg shadow-md hover:bg-blue-600 text-sm md:text-base lg:text-lg transition duration-300"
                aria-label="Write To Us"
                onClick={handleWriteToUs}
              >
                Write To Us
              </button>
            </div>
          </div>
        </header>

        <div className="mt-8 mb-6 px-4 md:px-8 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-purple-700 mb-6 flex items-center justify-center gap-2">
            <FaUniversity className="hidden sm:block" />
            Top UK Universities for International Students
          </h2>

          <div className="space-y-8">
            {universities.map((university, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
                  expandedUniversity === index
                    ? "ring-2 ring-purple-500"
                    : "hover:shadow-xl"
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 lg:w-1/5 p-4 flex items-center justify-center">
                    <img
                      src={university.image}
                      alt={university.name}
                      className="w-full max-h-full object-contain"
                    />
                  </div>

                  <div className="md:w-3/4 lg:w-4/5 p-4 md:p-6 border-l border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <h3 className="text-xl md:text-2xl font-bold text-purple-700 mb-2 sm:mb-0">
                        {university.name}
                      </h3>
                      <div className="flex items-center gap-2 bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1.5 rounded-full">
                        <FaCalendarAlt className="text-purple-600" />
                        <span>Intakes: {university.intakes}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {university.highlights
                          .slice(0, expandedUniversity === index ? 0 : 3)
                          .map((highlight, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 bg-gray-50 p-2 rounded-md"
                            >
                              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm text-gray-700">
                                {highlight}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleUniversity(index)}
                      className="text-purple-600 font-medium flex items-center gap-1 hover:text-purple-800 transition-colors py-1 px-3 rounded-full border border-purple-200 hover:bg-purple-50"
                    >
                      {expandedUniversity === index
                        ? "Show Less"
                        : "Show More Details"}
                      <span>{expandedUniversity === index ? "▲" : "▼"}</span>
                    </button>

                    <div className="mt-6 bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg shadow-sm">
                      <p className="text-purple-900 font-medium mb-3">
                        Interested in applying to {university.name}?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleWriteToUs()}
                          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md flex items-center gap-1 text-sm transition-colors"
                        >
                          <FaInfoCircle /> Request Information
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedUniversity === index && (
                  <div className="p-4 md:p-6 bg-purple-50 border-t border-purple-100 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-7">
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold mb-3 text-purple-800 flex items-center gap-2">
                            <FaInfoCircle />
                            Key Highlights
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {university.highlights.map((highlight, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 bg-white p-3 rounded-md shadow-sm"
                              >
                                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">
                                  {highlight}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {university.requirements && (
                          <div>
                            <h4 className="text-lg font-semibold mb-3 text-purple-800 flex items-center gap-2">
                              <FaBook />
                              Entry Requirements
                            </h4>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {university.requirements.map((req, reqIdx) => (
                                  <div
                                    key={reqIdx}
                                    className="flex items-start gap-2 border-l-2 border-purple-300 pl-3"
                                  >
                                    <span className="text-gray-700">{req}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-5">
                        <div>
                          <h4 className="text-lg font-semibold mb-3 text-purple-800 flex items-center gap-2">
                            <FaPoundSign />
                            Tuition Fees & Scholarships
                          </h4>
                          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-purple-100">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                    Program
                                  </th>
                                  {university.fees.length > 0 &&
                                  "annual" in university.fees[0] ? (
                                    <>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                        Annual Fee
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                        Scholarship
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                        Net Fee
                                      </th>
                                    </>
                                  ) : university.fees.length > 0 &&
                                    "total" in university.fees[0] ? (
                                    <>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                        Total Fee
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                        First Year
                                      </th>
                                    </>
                                  ) : null}
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {university.fees.map((fee, feeIdx) => (
                                  <tr
                                    key={feeIdx}
                                    className={
                                      feeIdx % 2 === 0
                                        ? "bg-white"
                                        : "bg-purple-50"
                                    }
                                  >
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                      {fee.program}
                                    </td>
                                    {"annual" in fee ? (
                                      <>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                          {fee.annual}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-green-600 font-medium">
                                          {fee.scholarship}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-purple-700">
                                          {fee.net}
                                        </td>
                                      </>
                                    ) : "total" in fee ? (
                                      <>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                          {fee.total}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-purple-700">
                                          {fee.firstYear}
                                        </td>
                                      </>
                                    ) : null}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <section className="py-12 px-4 md:px-8 bg-gray-50 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-purple-700 mb-6 flex items-center justify-center gap-2">
            <FaGlobe className="hidden sm:block" />
            Our Study Abroad
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>

        <div className="details px-6 py-8">
          <strong className="text-purple-600 text-lg sm:text-xl md:text-2xl">
            Our Mission & Vision
          </strong>
          <br />
          <strong className="block text-base sm:text-lg md:text-xl mt-2">
            To enable 1 million students to fulfill their abroad dream by 2030.
            Our vision is to connect all stakeholders seamlessly with high
            trust.
          </strong>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8 px-6 mb-5">
          <div className="p-6 bg-white border rounded-lg shadow-md flex flex-col items-center text-center">
            <FaUniversity className="w-16 h-16 mb-4 text-purple-600" />
            <h3 className="font-bold text-xl text-black mb-2">
              3000+ Students
            </h3>
            <p className="text-black text-sm">
              Availed this platform and currently studying in universities
              abroad
            </p>
          </div>
          <div className="p-6 bg-white border rounded-lg shadow-md flex flex-col items-center text-center">
            <FaGlobe className="w-16 h-16 mb-4 text-purple-600" />
            <h3 className="font-bold text-xl text-black mb-2">
              150+ Recruiters
            </h3>
            <p className="text-black text-sm">
              Support in mapping students to the university and have registered
              85% accuracy in mapping
            </p>
          </div>
          <div className="p-6 bg-white border rounded-lg shadow-md flex flex-col items-center text-center">
            <FaPlane className="w-16 h-16 mb-4 text-purple-600" />
            <h3 className="font-bold text-xl text-black mb-2">
              100+ Universities
            </h3>
            <p className="text-black text-sm">
              Spread across the UK, Europe, US, Canada, Australia, New Zealand
            </p>
          </div>
          <div className="p-6 bg-white border rounded-lg shadow-md flex flex-col items-center text-center">
            <FaBook className="w-16 h-16 mb-4 text-purple-600" />
            <h3 className="font-bold text-xl text-black mb-2">Free</h3>
            <p className="text-black text-sm">Lifetime Access to students</p>
          </div>
        </div>

        <section className="py-12 px-4 md:px-8 bg-white max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-purple-700 mb-8 flex items-center justify-center gap-2">
            <FaPlane className="hidden sm:block" />
            Why Study in the UK?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-purple-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-bold text-lg mb-3 text-purple-700">
                World-Class Education
              </h3>
              <p className="text-gray-700">
                Access to some of the world's top-ranked universities known for
                academic excellence and research opportunities.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-bold text-lg mb-3 text-purple-700">
                International Recognition
              </h3>
              <p className="text-gray-700">
                UK degrees are respected worldwide, opening doors to global
                career opportunities and further education.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-bold text-lg mb-3 text-purple-700">
                Post-Study Work Options
              </h3>
              <p className="text-gray-700">
                Graduate Route visa allows international students to work or
                look for work for 2 years after completing their degree.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-bold text-lg mb-3 text-purple-700">
                Cultural Experience
              </h3>
              <p className="text-gray-700">
                Immerse yourself in the UK's rich history, diverse culture, and
                vibrant international student community.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-bold text-lg mb-3 text-purple-700">
                Shorter Programs
              </h3>
              <p className="text-gray-700">
                UK courses are typically shorter than many other countries,
                helping you save on tuition and living expenses.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-bold text-lg mb-3 text-purple-700">
                Scholarships & Financial Support
              </h3>
              <p className="text-gray-700">
                Various scholarship opportunities and financial aid options
                available for international students.
              </p>
            </div>
          </div>
        </section>

        {isRoleModalOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-3xl mx-4">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Join ASKOXY.AI
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Choose how you'd like to participate in our STUDYABROAD
                    offer
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <button
                    className={`p-3 text-left rounded-lg border transition-all duration-300 hover:scale-105 ${
                      selectedRole.includes("PARTNER")
                        ? "bg-blue-100 border-blue-500"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => handleRoleToggle("PARTNER")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${
                          selectedRole.includes("PARTNER")
                            ? "bg-blue-600"
                            : "bg-blue-400"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                          Join as Partner
                        </h3>
                        <p className="text-xs text-gray-600">
                          Collaborate with universities and facilitate
                          admissions
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    className={`p-3 text-left rounded-lg border transition-all duration-300 hover:scale-105 ${
                      selectedRole.includes("USER")
                        ? "bg-green-100 border-green-500"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => handleRoleToggle("USER")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${
                          selectedRole.includes("USER")
                            ? "bg-green-600"
                            : "bg-green-400"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                          Join as User
                        </h3>
                        <p className="text-xs text-gray-600">
                          Apply to study abroad through our platform
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    className={`p-3 text-left rounded-lg border transition-all duration-300 hover:scale-105 ${
                      selectedRole.includes("FREELANCER")
                        ? "bg-purple-100 border-purple-500"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => handleRoleToggle("FREELANCER")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${
                          selectedRole.includes("FREELANCER")
                            ? "bg-purple-600"
                            : "bg-purple-400"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 -moon"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                          <path d="M2 17l10 5-7"></path>
                          <path d="M2 12l10 5 10-5"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                          Join as Freelancer
                        </h3>
                        <p className="text-xs text-gray-600">
                          Promote study abroad opportunities and earn
                          commissions
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="flex justify-between">
                  <button
                    className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    onClick={() => {
                      setIsRoleModalOpen(false);
                      setSelectedRole([]);
                      sessionStorage.removeItem("submitclicks");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={`py-2 px-4 rounded-lg text-white ${
                      selectedRole.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={() => handleRoleSelection(selectedRole)}
                    disabled={selectedRole.length === 0}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4 text-purple-700">
                Write To Us
              </h3>
              <div className="mb-4">
                <label
                  htmlFor="query"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Query
                </label>
                <textarea
                  id="query"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  rows={4}
                  placeholder="Enter your query here..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setQueryError(undefined);
                  }}
                />
                {queryError && (
                  <p className="text-red-500 text-xs mt-1">{queryError}</p>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  onClick={handleWriteToUsSubmitButton}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {issuccessOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <FaCheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Query Submitted Successfully!
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Thank you for your query. Our team will get back to you
                  shortly.
                </p>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 w-full"
                  onClick={() => setSuccessOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {isprofileOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4 text-purple-700">
                Profile Update Required
              </h3>
              <p className="mb-4 text-gray-700">
                Please update your profile with valid email and mobile number to
                continue.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={() => setIsprofileOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  onClick={handlePopUOk}
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default StudyAbroad;