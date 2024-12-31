import React, { useState } from "react";
import "./StudyAbroad.css";
import "./DiwaliPage.css";
import axios from "axios";
import { BiLogoPlayStore } from "react-icons/bi";

import FR from "../assets/img/ricesample (2).png";

import Footer from "./Footer";
import { Modal, Button, Input, message } from "antd";


import img1 from "../assets/img/image1.png";
import img2 from "../assets/img/image2.png";
import img3 from "../assets/img/image3.png";
import img4 from "../assets/img/image4.png";
import img5 from "../assets/img/image5.png";
import img6 from "../assets/img/soon.png";
import ricesample1kgGif from "../assets/img/ricesample1kg (1).gif";
import ricebag26kgsGif from "../assets/img/ricebag26kgsGif (1).gif";

const images = [
  { src: img1, alt: "Image 1" },
  { src: img2, alt: "Image 2" },
  { src: img5, alt: "Image 5" },
  { src: img6, alt: "Image 6" },
  { src: img3, alt: "Image 3" },
  { src: img4, alt: "Image 4" },
];

const FreeSample: React.FC = () => {
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
 
const [errors, setErrors] = useState<{ mobileNumber?: string }>({});
  const userId = localStorage.getItem("userId");


  const [formData, setFormData] = useState({
    askOxyOfers: "FREESAMPLE",
    id: userId,
    mobileNumber: "",
    projectType: "ASKOXY",
  });
  

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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


 
  return (
    <div>
      <div>
        <header className="relative p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            {/* Empty space on the left */}
            <div className="hidden md:block w-1/3"></div>

            {/* Title in the center */}
            <h3 className="text-[rgba(91,5,200,0.85)] font-bold text-base md:text-lg lg:text-xl text-center leading-relaxed">
              <strong>Free Rice Samples & Steel Container</strong>
            </h3>

            {/* Buttons on the right */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Button: I'm Interested */}
              <button
                className="px-4 py-2 text-sm md:text-base lg:text-lg bg-green-600 text-white rounded-md hover:bg-green-700 shadow-lg transition-all"
                onClick={() => setIsModalOpen(true)}
                aria-label="Visit our site"
              >
                I'm Interested
              </button>

              {/* Button: Write To Us */}
              <button
                className="px-4 py-2 text-sm md:text-base lg:text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-lg transition-all"
                aria-label="Write To Us"
              >
                Write To Us
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row justify-center mt-4 space-y-6 md:space-y-0 md:space-x-5">
          {/* Rice Sample 1kg */}
          <div className="w-full md:w-[450px] h-[450px] text-center bg-white shadow-lg p-4 rounded">
            <img
              src={ricesample1kgGif}
              alt="Rice Sample 1kg"
              className="w-full h-full object-cover rounded-lg"
            />
            <h5 className="text-blue-600 font-bold mt-5">Rice Sample 1kg</h5>
          </div>

          {/* Rice Bag 26kgs */}
          <div className="w-full md:w-[450px] h-[450px] text-center bg-white shadow-lg p-4 rounded">
            <img
              src={ricebag26kgsGif}
              alt="Rice Bag 26kgs"
              className="w-full h-full object-cover rounded-lg"
            />
            <h5 className="text-blue-600 font-bold mt-5">Rice Bag 26kgs</h5>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex flex-col md:flex-row items-center justify-center mt-10 px-4">
          {/* Left Section: Image */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end mb-6 md:mb-0">
            <img src={FR} alt="Free Sample" />
          </div>

          {/* Right Section: Text */}
          <div className="w-full md:w-1/2 text-left md:pl-8 space-y-6">
            {/* Offer Heading */}
            <div className="text-center md:text-left p-3 space-y-6">
              <strong className="text-[#6A1B9A] text-[24px]">
                Free Rice Samples & Steel Container
              </strong>
            </div>

            {/* Details */}
            <div className="space-y-4 text-gray-800">
              <p>
                <strong>ASKOXY.AI</strong> offers an exclusive deal: get{" "}
                <strong>1 KG of free rice samples</strong> with a{" "}
                <strong>free steel container</strong>. This sleek container
                ensures freshness and sustainability, reflecting{" "}
                <strong>ASKOXY.AI's commitment to quality</strong>.{" "}
                <strong>Download the app now</strong> from the{" "}
                <strong>App Store or Google Play</strong> by scanning the QR
                code, and enjoy premium rice ordering online!
              </p>
            </div>

            {/* Playstore Button */}
            <div className="flex justify-center mt-6">
              <a
                href="https://play.google.com/store/apps/details?id=com.oxyrice.oxyrice_customer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-52 h-12 mt-4 text-lg font-bold bg-blue-600 text-white rounded-md hover:bg-blue-800 transition-all flex items-center justify-center"
              >
                <BiLogoPlayStore className="w-6 h-6 mr-2" />
                Download App
              </a>
            </div>
          </div>
        </div>

        {/* New Image Section */}
        <div className="flex justify-center mt-8">
          <img
            src={img6} // Replace with the actual image path
            alt="New Image"
            className="w-full max-w-5xl h-auto object-contain"
          />
        </div>

        {/* Modal Section */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-96">
              <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
              <div className="space-y-4">
                <label className="text-black">
                  Enter your mobile number
                  <span className="text-red-500">*</span>
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
              {/* <h2 className="subtitle2" >
                Oxyloans is a P2P NBFC
              </h2> */}
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

export default FreeSample;