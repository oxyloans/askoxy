import React, { useState, useEffect, useRef } from "react";
import "./StudyAbroad.css";
import "./DiwaliPage.css";
import "./Freerudraksha.css";
import axios from "axios";
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

import img1 from "../assets/img/image1.png";
import img2 from "../assets/img/image2.png";
import img3 from "../assets/img/image3.png";
import img4 from "../assets/img/image4.png";
import img5 from "../assets/img/image5.png";
import img6 from "../assets/img/image6.png";

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

  const [errors, setErrors] = useState<{ mobileNumber?: string }>({});

  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    askOxyOfers: "STUDYABROAD",
    id: userId,
    mobileNumber: "",
    projectType: "ASKOXY",
  });const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time mobile number validation
    if (name === "mobileNumber") {
      if (!/^\d{0,10}$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          mobileNumber: "Please enter a valid mobile number with only digits.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, mobileNumber: undefined }));
      }
    }
  };

  const handleSubmit = async () => {
    const { mobileNumber } = formData;
    const newErrors: { mobileNumber?: string } = {};

    // Validation
    if (!mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be exactly 10 digits.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set errors if validation fails
      return; // Do not proceed with the form submission
    }

    try {
      // API request to submit the form data
      const response = await axios.post(
        "https://meta.oxyloans.com/api/auth-service/auth/askOxyOfferes",
        formData
      );
      console.log("API Response:", response.data);

      message.success("Your interest has been submitted successfully!");
      setIsModalOpen(false); // Close modal on success
    } catch (error) {
      console.error("API Error:", error);
      message.error("Failed to submit your interest. Please try again.");
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

  return (
    <div>
      <div>
        <header>
          {/* Container for layout */}

          <div className="flex flex-col items-center justify-center md:flex-row  px-4 md:px-6 lg:px-8">
            {/* Title */}
            <h3 className="text-center text-[rgba(91,5,200,0.85)] font-bold text-sm sm:text-base md:text-lg lg:text-xl">
              World's 1<sup>st</sup> AI & Blockchain based platform for
              university admissions
            </h3>
          </div>

          {/* Buttons on the right */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-end w-full px-4">
            {/* 'I'm Interested' Button */}

            {/* Dropdown Menu Button */}
            <div className="relative">
              <button
                className="px-4 py-2 text-sm md:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md transition-all"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="Navigate options"
              >
                Explore GPT'S
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <ul className="absolute bg-white text-black shadow-lg rounded-md mt-2 w-48 md:w-60 overflow-y-auto max-h-60">
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() => navigate("/accommodation-gpt")}
                  >
                    Accommodation GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() => handleNavigation("/courses-gpt")}
                  >
                    Courses GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() => handleNavigation("/foreign-exchange")}
                  >
                    Foreign Exchange GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() => handleNavigation("/placements-gpt")}
                  >
                    Placements GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() => handleNavigation("/universities-gpt")}
                  >
                    Universities GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() => handleNavigation("/testandinterview-gpt")}
                  >
                    Test & Interview Preparation GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() => handleNavigation("/universitiesagents-gpt")}
                  >
                    University Agents GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() =>
                      handleNavigation("/qualificationspecialization-gpt")
                    }
                  >
                    Qualification & Specialization GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() => handleNavigation("/reviews-gpt")}
                  >
                    University Reviews GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() =>
                      handleNavigation("/informationaboutcountries-gpt")
                    }
                  >
                    Information About Countries GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() => handleNavigation("/loans-gpt")}
                  >
                    Loans GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() => handleNavigation("/scholarships-gpt")}
                  >
                    Scholarships GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() => handleNavigation("/logistics-gpt")}
                  >
                    Logistics GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() => handleNavigation("/visa-gpt")}
                  >
                    Visa GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() => handleNavigation("/accreditations-gpt")}
                  >
                    Accreditations Recognization GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() => handleNavigation("/applicationsupport-gpt")}
                  >
                    Application Support GPT
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer break-words whitespace-normal"
                    onClick={() => handleNavigation("/applicationsupport-gpt")}
                  >
                    Offer Letter & Acceptance Visa GPT
                  </li>
                </ul>
              )}
            </div>
            <button
              className="px-4 py-2 text-sm md:text-base bg-green-600 text-white rounded-md hover:bg-green-700 shadow-md transition-all"
              onClick={() => setIsModalOpen(true)}
              aria-label="Visit our site"
            >
              I'm Interested
            </button>
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

        <div className="px-4 py-8">
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
          <div className="flex justify-center gap-4">
            {/* Button 1 */}
            <a
              href="https://bmv.money/StudentX.world/index.html"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md text-sm md:text-base transition-all"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit University Platform"
            >
              StudentX.world
            </a>

            {/* Button 2 */}
            <a
              href="https://bmv.money/bankd/index.html"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-md text-sm md:text-base transition-all"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Scholarship Platform"
            >
              bankd
            </a>
          </div>
        </div>

        {/* Details Section */}
        <div className="details px-4 py-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8 justify-center px-4">
          <div className="p-4 bg-white border rounded-lg shadow-md flex flex-col items-center">
            <FaUniversity className="w-12 h-12 mb-2 text-purple-600" />
            <h3 className="text-center font-bold mb-1 text-black">
              3000+ Students
            </h3>
            <p className="text-center text-black text-sm">
              Availed this platform and currently studying in universities
              abroad
            </p>
          </div>
          <div className="p-4 border bg-white rounded-lg shadow-md flex flex-col items-center">
            <FaGlobe className="w-12 h-12 mb-2 text-purple-600" />
            <h3 className="text-center font-bold mb-1 text-black">
              150+ Recruiters
            </h3>
            <p className="text-center text-black text-sm">
              Support in mapping students to the university and have registered
              85% accuracy in mapping
            </p>
          </div>
          <div className="p-4 border bg-white rounded-lg shadow-md flex flex-col items-center">
            <FaPlane className="w-12 h-12 mb-2 text-purple-600" />
            <h3 className="text-center font-bold mb-1 text-black">
              100+ Universities
            </h3>
            <p className="text-center text-black text-sm">
              Spread across the UK, Europe, US, Canada, Australia, New Zealand
            </p>
          </div>
          <div className="p-4 border bg-white rounded-lg shadow-md flex flex-col items-center">
            <FaBook className="w-12 h-12 mb-2 text-purple-600" />
            <h3 className="text-center font-bold mb-1 text-black">Free</h3>
            <p className="text-center text-black text-sm">
              Lifetime Access to students
            </p>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
              <div className="space-y-4">
                <label className="text-black">
                  Enter your mobile number
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  maxLength={10} // Limit the input to 10 digits
                  className={`w-full px-4 text-black py-2 border rounded ${
                    errors.mobileNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm">{errors.mobileNumber}</p>
                )}
              </div>
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <h1 className="text-center mx-4 my-12 text-3xl md:text-5xl font-bold">
          <span className="text-green-600">
            <span className="text-[#0a6fba]">OXY</span> GROUP
          </span>{" "}
          <span className="text-[#FFA500]">COMPANIES</span>
        </h1>

        <div className="event-container1">
          <div className="event-content1">
            <div className="diwali-images1">
              <div className="image-container1">
                <img src={img1} alt="Diwali Diyas" className="diwali-diya" />
              </div>
            </div>
            <div className="event-details">
              <h1 className="diwali-title1" style={{ color: "#0a6fba" }}>
                Lend & Earn 1.5% - 2.5% Monthly RoI
              </h1>
              <h3
                className="diwali-subtitle1"
                style={{ padding: "0px", margin: "0px" }}
              >
                OxyLoans.com is an RBI-approved P2P NBFC, a revolutionary
                fintech platform. We onboard tax-paying Individuals, and HNIs as
                Lenders. We enable lenders/ investors to exchange funds directly
                with borrowers. Our proprietary algorithms include credit
                scoring, underwriting, and loan agreement preparation.
              </h3>
              <h3 className="diwali-subtitle1" style={{ fontWeight: "bold" }}>
                ₹1000000000+<b>DISBURSAL</b> <br></br> 30000+ <b>LENDERS</b>
                <br></br> 270000+ <b>BORROWERS</b>
              </h3>
              <div className="buttons">
                <a
                  href="https://oxyloans.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="button demo">Start Lending</button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="event-container1">
          <div className="event-content1" style={{ borderColor: "#c26c27" }}>
            <div className="diwali-images1">
              <div className="image-container1">
                <img src={img2} alt="Diwali Diyas" className="diwali-diya" />
              </div>
            </div>
            <div className="event-details">
              <h1 className="diwali-title1" style={{ color: "#c26c27" }}>
                Fractional Investments in Lands & Buildings
              </h1>
              <h3
                className="diwali-subtitle1"
                style={{ padding: "0px", margin: "0px", paddingBottom: "20px" }}
              >
                OXYBRICKS is the first Blockchain platform that enables
                fractional investment in lands & buildings: a Blockchain tech
                platform that allows principal guarantee, monthly earnings, and
                property appreciation.
              </h3>

              <div className="buttons">
                <a
                  href="https://oxybricks.world/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="button demo"
                    style={{ backgroundColor: "#c26c27" }}
                  >
                    Know More
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="event-container1">
          <div className="event-content1" style={{ borderColor: "#583e99" }}>
            <div className="diwali-images1">
              <div className="image-container1">
                <img src={img4} alt="Diwali Diyas" className="diwali-diya" />
              </div>
            </div>
            <div className="event-details">
              <h1 className="diwali-title1" style={{ color: "#583e99" }}>
                All your ideas at one place
              </h1>
              <h3
                className="diwali-subtitle1"
                style={{ padding: "0px", margin: "0px", paddingBottom: "20px" }}
              >
                BMV.Money is an Bridgital Marketplace connecting stakeholders in
                global immigration services, property management, machinery
                purchases, startup mentoring, and job orientation programs.
              </h3>

              <div className="buttons">
                <a
                  href="https://bmv.money/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="button demo"
                    style={{ backgroundColor: "#583e99" }}
                  >
                    Know More
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="event-container1">
          <div className="event-content1" style={{ borderColor: "#189c9e" }}>
            <div className="diwali-images1">
              <div className="image-container1">
                <img src={img5} alt="Diwali Diyas" className="diwali-diya" />
              </div>
            </div>
            <div className="event-details">
              <h1 className="diwali-title1" style={{ color: "#189c9e" }}>
                Find your dream home
              </h1>
              <h3
                className="diwali-subtitle1"
                style={{ padding: "0px", margin: "0px", paddingBottom: "20px" }}
              >
                XPERT HOMES is a leading property management company offering
                transparent, high-quality services. We help property owners
                maximize ROI and find verified tenants through our comprehensive
                360° management solutions.
              </h3>

              <div className="buttons">
                <a
                  href="https://xperthomes.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="button demo"
                    style={{ backgroundColor: "#189c9e" }}
                  >
                    Know More
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Group Section */}
        <div className="px-6 py-5 bg-[#f1f1f1] md:p-10 rounded-md">
          <h1
            className="text-center my-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ fontSize: "clamp(2rem, 8vw, 50px)" }} // Responsively scales font size
          >
            <b className="text-green-600">
              <span className="text-[#0a6fba]">OXY</span> GROUP
            </b>{" "}
            <span className="text-[#FFA500]">COMPANIES</span>
          </h1>

          <div className="relative w-full max-w-[700px] mx-auto overflow-hidden">
            <button
              className="absolute z-10 p-2 text-2xl transform -translate-y-1/2 bg-blue-600 text-white rounded-full left-2 top-1/2 hover:bg-blue-700" // Adds blue background and white text color
              onClick={handlePrev}
            >
              ←
            </button>
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, idx) => (
                <div key={idx} className="flex-shrink-0 w-full">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
            <button
              className="absolute z-10 p-2 text-2xl transform -translate-y-1/2 bg-blue-600 text-white rounded-full right-2 top-1/2 hover:bg-blue-700" // Adds blue background and white text color
              onClick={handleNext}
            >
              →
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudyAbroad;
