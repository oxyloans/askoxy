import React, { useState, useEffect, useRef } from "react";
import "./StudyAbroad.css";
import "./DiwaliPage.css";
import "./Freerudraksha.css";
import axios from "axios";
import { ArrowLeft } from 'lucide-react';

import {
  FaMapMarkerAlt,
  FaUniversity,
  FaGlobe,
  FaPlane,
  FaBook,
} from "react-icons/fa"; // Import icons

import { useNavigate } from "react-router-dom";
import Image3 from "../assets/img/1.1.png";
import S1 from "../assets/img/1.2.png";
import S2 from "../assets/img/1.3.png";
import S3 from "../assets/img/1.4.png";
import S4 from "../assets/img/1.5.png";
import S5 from "../assets/img/1.6.png";

import Footer from "./Footer";
import { message } from "antd";
import BASE_URL from "../Config";

import img1 from "../assets/img/image1.png";
import img2 from "../assets/img/image2.png";
import img3 from "../assets/img/image3.png";
import img4 from "../assets/img/image4.png";
import img5 from "../assets/img/image5.png";
import img6 from "../assets/img/image6.png";
import { notification } from "antd";

const images = [
  { src: img1, alt: "Image 1" },
  { src: img2, alt: "Image 2" },
  { src: img5, alt: "Image 5" },
  { src: img6, alt: "Image 6" },
  { src: img3, alt: "Image 3" },
  { src: img4, alt: "Image 4" },
];

const StudyAbroad: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [issuccessOpen, setSuccessOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
 const [isLoading, setIsLoading] = useState<boolean>(false);
  const userId = localStorage.getItem("userId");
  const [isprofileOpen, setIsprofileOpen] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState("");
  const mobileNumber = localStorage.getItem("whatsappNumber");
  const [formData, setFormData] = useState({
    askOxyOfers: "STUDYABROAD",
    userId: userId,
    mobileNumber: mobileNumber,
    projectType: "ASKOXY",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const handleSubmit = async () => {
    try {
      setIsButtonDisabled(true);
      // API request to submit the form data
      const response = await axios.post(
        `${BASE_URL}/marketing-service/campgin/askOxyOfferes`,
        formData
      );
      console.log("API Response:", response.data);
      localStorage.setItem("askOxyOfers", response.data.askOxyOfers);

      // Display success message in the UI (you can implement this based on your UI library)
      message.success(
        "Thank you for showing interest in our *Study Abroad* offer!"
      );
    } catch (error: any) {
      if (error.response.status === 500 || error.response.status === 400) {
        // Handle duplicate participation error
        message.warning("You have already participated. Thank you!");
      } else {
        console.error("API Error:", error);
        message.error("Failed to submit your interest. Please try again.");
      }
      setIsButtonDisabled(false);
    }
  };

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path); // Programmatic navigation
    setIsDropdownOpen(false);
  };

  const email = localStorage.getItem("email");

  const handlePopUOk = () => {
    setIsOpen(false);
    navigate("/main/profile");
  };

  const handleWriteToUs = () => {
    if (
      !email ||
      email === "null" ||
      !mobileNumber ||
      mobileNumber === "null"
    ) {
      setIsprofileOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  // useEffect(() => {
  //   if (issuccessOpen) {
  //     const timer = setTimeout(() => {
  //       setSuccessOpen(false);
  //     }, 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [issuccessOpen]);
  const handleWriteToUsSubmitButton = async () => {
    if (!query || query.trim() === "") {
      setQueryError("Please enter the query before submitting.");
      return; // Exit the function if the query is invalid
    }
    // Payload with the data to send to the API
    const payload = {
      email: email, // You might want to replace this with dynamic values
      mobileNumber: mobileNumber, // You might want to replace this with dynamic values
      queryStatus: "PENDING",
      projectType: "ASKOXY",
      askOxyOfers: "STUDYABROAD",
      adminDocumentId: "",
      comments: "",
      id: "",
      resolvedBy: "",
      resolvedOn: "",
      status: "",
      userDocumentId: "",
      query: query,
      userId: userId,
    };

    // Log the query to check the input before sending
    console.log("Query:", query);
    const accessToken = localStorage.getItem("accessToken");

    const apiUrl = `${BASE_URL}/writetous-service/saveData`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      // Sending the POST request to the API
      const response = await axios.post(apiUrl, payload, { headers: headers });

      // Check if the response was successful
      if (response.data) {
        console.log("Response:", response.data);
        setSuccessOpen(true);
        setIsOpen(false);
      }
    } catch (error) {
      // Handle error if the request fails
      console.error("Error sending the query:", error);
      // alert("Failed to send query. Please try again.");
    }
  };

  return (
    <div>
      <div>
        <header>
          {/* Container for layout */}

          <div className="flex flex-col items-center justify-center md:flex-row pt-5 px-4 md:px-6 lg:px-8">
            {/* Title */}
            <h1 className="text-center text-[rgba(91,5,200,0.85)] font-bold text-xl sm:text-xl md:text-3xl lg:text-xl leading-tight mb-6 md:mb-0">
              World's 1<sup>st</sup> AI & Blockchain based platform for
              university admissions
            </h1>
          </div>

          {/* Buttons on the right */}
          <div className="flex flex-col md:flex-row gap-4 mb-2 mt-2 items-center justify-between w-full px-4">
            {/* 'I'm Interested' Button */}

            <div className="flex items-center gap-4 flex-start">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-purple-600 flex items-center gap-2">
                  Study Abroad
                </h1>
              </div>

            {/* Dropdown Menu Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="relative">
              <button
                className="bg-[#ea4c89] w-full md:w-auto px-4 py-2  text-white rounded-lg shadow-md hover:bg-[#008CBA] text-sm md:text-base lg:text-lg transition duration-300"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="Navigate options"
              >
                Explore GPTS
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <ul className="absolute bg-white text-black shadow-lg rounded-md mt-2 w-48 md:w-60 overflow-y-auto max-h-60">
                  {[
                    {
                      label: "Accommodation GPT",
                      path: "/dashboard/accommodation-gpt",
                    },
                    {
                      label: "Accreditations Recognization GPT",
                      path: "/dashboard/accreditations-gpt",
                    },
                    {
                      label: "Application Support GPT",
                      path: "/dashboard/applicationsupport-gpt",
                    },
                    { label: "Courses GPT", path: "/courses-gpt" },
                    {
                      label: "Foreign Exchange & Predeparture GPT",
                      path: "/dashboard/foreign-exchange",
                    },
                    {
                      label: "Information About Countries GPT",
                      path: "/dashboard/informationaboutcountries-gpt",
                    },
                    { label: "Loans GPT", path: "/dashboard/loans-gpt" },
                    {
                      label: "Logistics GPT",
                      path: "/dashboard/logistics-gpt",
                    },
                    {
                      label: "Offer Letter& Acceptance Letter GPT",
                      path: "/dashboard/applicationsupport-gpt",
                    },
                    {
                      label: "Placements GPT",
                      path: "/dashboard/placements-gpt",
                    },
                    {
                      label: "Qualification & Specialization GPT",
                      path: "/dashboard/qualificationspecialization-gpt",
                    },
                    {
                      label: "Scholarships GPT",
                      path: "/dashboard/scholarships-gpt",
                    },
                    {
                      label: "English Test & Interview Preparation GPT",
                      path: "/testandinterview-gpt",
                    },
                    {
                      label: "Universities GPT",
                      path: "/dashboard/universities-gpt",
                    },
                    {
                      label: "University Agents GPT",
                      path: "/dashboard/universitiesagents-gpt",
                    },
                    {
                      label: "University Reviews GPT",
                      path: "/dashboard/reviews-gpt",
                    },
                    { label: "Visa GPT", path: "/dashboard/visa-gpt" },
                  ]
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map((item) => (
                      <li
                        key={item.path}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                        onClick={() => handleNavigation(item.path)}
                      >
                        {item.label}
                      </li>
                    ))}
                </ul>
              )}
            </div>
            <button
              className="w-full md:w-auto px-4 py-2 bg-[#04AA6D] text-white rounded-lg shadow-md hover:bg-[#04AA6D] text-sm md:text-base lg:text-lg transition duration-300"
              onClick={handleSubmit}
              aria-label="Visit our site"
              disabled={isButtonDisabled}
            >
              I'm Interested
            </button>
            <button
              className="w-full md:w-auto px-4 py-2 bg-[#008CBA] text-white rounded-lg shadow-md hover:bg-[#008CBA] text-sm md:text-base lg:text-lg transition duration-300"
              aria-label="Write To Us"
              onClick={handleWriteToUs}
            >
              Write To Us
            </button>

            {isOpen && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                <div className="relative bg-white rounded-lg shadow-md p-6 w-96">
                  {/* Close Button */}
                  <i
                    className="fas fa-times absolute top-3 right-3 text-xl text-gray-700 cursor-pointer hover:text-red-500"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close"
                  />

                  {/* Modal Content */}
                  <h2 className="text-xl font-bold mb-4 text-[#3d2a71]">
                    Write To Us
                  </h2>

                  {/* Mobile Number Field */}
                  <div className="mb-4">
                    <label
                      className="block text-m text-black font-medium mb-1"
                      htmlFor="phone"
                    >
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      disabled={true}
                      value={mobileNumber || ""}
                      // value={"9908636995"}
                      className="block w-full text-black px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3d2a71] focus:border-[#3d2a71] transition-all duration-200"
                      placeholder="Enter your mobile number"
                      style={{ fontSize: "0.8rem" }}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="mb-4">
                    <label
                      className="block text-m text-black font-medium mb-1"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email || ""}
                      // value={"kowthavarapuanusha@gmail.com"}
                      disabled={true}
                      className="block w-full text-black px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3d2a71] focus:border-[#3d2a71] transition-all duration-200"
                      placeholder="Enter your email"
                      style={{ fontSize: "0.8rem" }}
                    />
                  </div>

                  {/* Query Field */}
                  <div className="mb-4">
                    <label
                      className="block text-m text-black font-medium mb-1"
                      htmlFor="query"
                    >
                      Query
                    </label>
                    <textarea
                      id="query"
                      rows={3}
                      className="block w-full text-black px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3d2a71] focus:border-[#3d2a71] transition-all duration-200"
                      placeholder="Enter your query"
                      style={{ fontSize: "0.8rem" }}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {queryError && (
                      <p className="text-red-500 text-sm">{queryError}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <button
                      className="px-4 py-2 bg-[#3d2a71] text-white rounded-lg shadow-lg hover:bg-[#3d2a71] transition-all text-sm md:text-base lg:text-lg"
                      onClick={handleWriteToUsSubmitButton}
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Submit Query"}
                    </button>
                  </div>
                </div>
              </div>
            )}
</div>
            {isprofileOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm transform transition-transform scale-105">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl text-[#3d2a71] font-bold">
                      Alert...!
                    </h2>
                    <button
                      className="font-bold text-2xl text-red-500 hover:text-red-700 focus:outline-none"
                      onClick={() => setIsprofileOpen(false)}
                    >
                      &times;
                    </button>
                  </div>
                  <p className="text-center text-black mb-6">
                    Please fill your profile details.
                  </p>
                  <div className="flex justify-center">
                    <button
                      className="bg-[#f9b91a] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#f4a307] focus:outline-none"
                      onClick={handlePopUOk}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}

            {issuccessOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm transform transition-transform scale-105 text-center">
                  <h2 className="text-xl text-green-600 font-bold mb-4">
                    Success!
                  </h2>
                  <p className="text-black mb-6">
                    Query submitted successfully...!
                  </p>
                  <div className="flex justify-center">
                    <button
                      className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 focus:outline-none"
                      onClick={() => setSuccessOpen(false)}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-100">
          <section>
            <img
              src={S5}
              alt="Spiritual World"
              className="w-full h-70 object-cover rounded"
            />
          </section>
          <section>
            <img
              src={Image3}
              alt="Spiritual World"
              className="w-full h-70 object-cover rounded"
            />
          </section>
          <section>
            <img
              src={S1}
              alt="Spiritual World"
              className="w-full h-70 object-cover rounded"
            />
          </section>
          <section>
            <img
              src={S3}
              alt="Spiritual World"
              className="w-full h-70 object-cover rounded"
            />
          </section>
          <section>
            <img
              src={S4}
              alt="Spiritual World"
              className="w-full h-70 object-cover rounded"
            />
          </section>

          <section>
            <img
              src={S2}
              alt="Spiritual World"
              className="w-full h-70 object-cover rounded"
            />
          </section>
        </div>

        <div className="px-6 py-8">
          {/* Text Section */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">
              Students Studying Abroad
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              Join thousands of students making their study abroad dreams a
              reality. Discover top universities with
              <strong className="text-purple-600">
                {" "}
                StudentX.world, the World's 1st AI & Blockchain-powered platform{" "}
              </strong>
              for university admissions. Access
              <strong className="text-purple-600">
                {" "}
                bAnkD's innovative education loan marketplace{" "}
              </strong>
              , connecting students with leading Banks and NBFCs to finance
              their global education journey.
            </p>
          </div>

          {/* Button Section */}
          <div className="flex justify-center gap-6 mt-6">
            {/* Button 1 */}
            <a
              href="https://bmv.money/StudentX.world/index.html"
              className="px-6 py-3 bg-[#008CBA] text-white rounded-md hover:bg-[#005F75] shadow-md text-sm md:text-base transition-all"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit University Platform"
            >
              StudentX.world
            </a>

            {/* Button 2 */}
            <a
              href="https://bmv.money/bankd/index.html"
              className="px-6 py-3 bg-[#04AA6D] text-white rounded-md hover:bg-[#038258] shadow-md text-sm md:text-base transition-all"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Scholarship Platform"
            >
              BankD
            </a>
          </div>
        </div>

        {/* Details Section */}
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

        {/* Stats Section */}
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
      </div>
      <Footer />
    </div>
  );
};

export default StudyAbroad;
