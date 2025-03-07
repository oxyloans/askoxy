// src/components/PdfViewer.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Legal from "../assets/img/legal.png";

import img1 from "../assets/img/image1.png";
import img2 from "../assets/img/image2.png";
import img3 from "../assets/img/image3.png";
import img4 from "../assets/img/image4.png";
import img5 from "../assets/img/image5.png";
import img6 from "../assets/img/image6.png";
import axios from "axios";
import { notification } from "antd";
import BASE_URL from "../Config";

import { message } from "antd";

const images = [
  { src: img1, alt: "Image 1" },
  { src: img2, alt: "Image 2" },
  { src: img5, alt: "Image 5" },
  { src: img6, alt: "Image 6" },
  { src: img3, alt: "Image 3" },
  { src: img4, alt: "Image 4" },
];
const LegalService: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const userId = localStorage.getItem("userId");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [issuccessOpen, setSuccessOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [isprofileOpen, setIsprofileOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState<string | undefined>(undefined);
  const mobileNumber = localStorage.getItem("whatsappNumber");
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
  // Function to handle the load event of the iframe
  const handleLoad = () => {
    setIsLoading(false);
  };

  const [formData, setFormData] = useState({
    askOxyOfers: "LEGALSERVICES",
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
        "Thank you for showing interest in our *Legal Service* offer!"
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

  const email = localStorage.getItem("email");

  const navigate = useNavigate();

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
      askOxyOfers: "LEGALSERVICES",
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
      Authorization: `Bearer ${accessToken}`, // Ensure `accessToken` is available in your scope
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
          {/* Layout container */}
          <div className="flex flex-col md:flex-row items-center md:items-start pt-5 justify-center">
            {/* Title */}
            <h1 className="text-center text-[rgba(91,5,200,0.85)] font-bold text-2xl sm:text-3xl md:text-3xl lg:text45xl leading-tight mb-6 md:mb-0">
              Legal Knowledge Hub
            </h1>
          </div>

          {/* Buttons on the right */}
          <div className="flex flex-col md:flex-row justify-center md:justify-end gap-4 items-center px-4 md:px-6 lg:px-8">
            {/* Button: I'm Interested */}
            <button
              className="w-full md:w-auto px-4 py-2 bg-[#04AA6D] text-white rounded-lg shadow-md hover:bg-[#04AA6D] text-sm md:text-base lg:text-lg transition duration-300"
              onClick={handleSubmit}
              aria-label="Visit our site"
              disabled={isButtonDisabled}
            >
              I'm Interested
            </button>

            {/* Button: Write To Us */}
            <button
              className="bg-[#008CBA] w-full md:w-auto px-4 py-2  text-white rounded-lg shadow-md hover:bg-[#04AA6D] text-sm md:text-base lg:text-lg transition duration-300"
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

        <div className="flex flex-col md:flex-row items-center justify-center mt-8 px-4">
          {/* Left Section: Image */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end mb-6 md:mb-0">
            <img
              src={Legal}
              alt="My Rotarian"
              className="w-full md:w-auto h-auto rounded-lg shadow-lg" // Adding rounded corners and shadow for a polished look
            />
          </div>

          {/* Right Section: Text */}
          <div className="w-full md:w-1/2 text-left md:pl-8 space-y-6">
            {/* Welcome Heading */}
            <div className="text-center md:text-left">
              <strong className="text-[20px] md:text-[24px] text-[#6A1B9A] font-semibold">
                Welcome, Lawyers and Advocates! Elevate Your Legal Practice with
                AskOxy.ai
              </strong>
            </div>

            {/* Details */}
            <div className="space-y-4 text-gray-800">
              <ul className="list-disc pl-6">
                <li>
                  <strong>Enhance Your Professional Presence:</strong>Increase
                  your visibility among individuals seeking legal guidance.
                </li>
                <li>
                  <strong>Share Expertise:</strong>Publish legal insights to
                  educate and establish your authority.
                </li>
                <li>
                  <strong>Collaborate on Legal Publications:</strong> Partner
                  with professionals to create impactful legal content.
                </li>

                <li>
                  <strong>Expand Your Legal Network:</strong> Be part of a
                  vibrant, trusted platform for knowledge sharing and
                  collaboration.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center my-14">
          <iframe
            src="https://drive.google.com/file/d/11AI-em7upR9UVcec1mFuxmIPh1Cfx0Ai/preview"
            frameBorder="0"
            className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-[500px] sm:h-[600px] md:h-[800px] lg:h-[1000px] max-w-full rounded-lg shadow-lg"
            title="PDF Viewer"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LegalService;
