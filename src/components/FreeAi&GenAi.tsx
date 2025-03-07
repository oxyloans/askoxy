import React, { useState, useEffect } from "react";
import "./StudyAbroad.css";
import "./DiwaliPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from "./Footer";
import { message } from "antd";
import { ArrowLeft, ShoppingBag, Coins, Bot, Settings, X, Mail, Heart } from 'lucide-react';
import { notification } from "antd";
import BASE_URL from "../Config";

import FG from "../assets/img/genai.png";
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

const FreeAiandGenAi: React.FC = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); // Track submission status
  const [firstRequestDate, setFirstRequestDate] = useState("");
  const [issuccessOpen, setSuccessOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | undefined>(undefined);
  const userId = localStorage.getItem("userId");
  const [isprofileOpen, setIsprofileOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const mobileNumber = localStorage.getItem("whatsappNumber");
  const [formData, setFormData] = useState({
    askOxyOfers: "FREEAI",
    mobileNumber: mobileNumber,
    userId: userId,
    projectType: "ASKOXY",
  });
  
  const askOxyOfers = localStorage.getItem("askOxyOfers");
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
        "Thank you for showing interest in our *Free AI & Gen Ai Training* offer!"
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
      askOxyOfers: "FREEAI",
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
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        <div className="bg-white rounded-xl shadow-sm">
      

          {/* Main Content */}
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center justify-between">
              {/* Back Button & Title */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-center text-[rgba(91,5,200,0.85)] font-bold text-2xl sm:text-3xl md:text-3xl lg:text45xl leading-tight mb-6 md:mb-0">
              FREE AI & GEN AI TRAINING
            </h1>
              </div>

              {/* Right-Aligned Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <button
                  className="w-full md:w-auto px-4 py-2 bg-[#04AA6D] text-white rounded-lg shadow-md hover:bg-[#04AA6D] text-sm md:text-base lg:text-lg transition duration-300"
                  onClick={handleSubmit}
                  aria-label="I'm Interested"
                  disabled={isButtonDisabled} // Disable the button dynamically
                >
                  I'm Interested
                </button>

                {/* Button: Write To Us */}
                <button
                  className="w-full md:w-auto px-4 py-2 bg-[#008CBA] text-white rounded-lg shadow-md hover:bg-[#008CBA] text-sm md:text-base lg:text-lg transition duration-300"
                  aria-label="Write To Us"
                  onClick={handleWriteToUs}
                >
                  Write To Us
                </button>
              </div>
              {/* Buttons on the right */}
              <div className="flex flex-col md:flex-row justify-center md:justify-end gap-4 items-center px-4 md:px-6 lg:px-8">
                {/* Button: I'm Interested */}


                {/* Modal for "Write To Us" */}
                {isOpen && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
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
                          <p className="text-red-500 text-sm mt-1">{queryError}</p>
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

                {/* Profile Alert Modal */}
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

                {/* Success Modal */}
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
            </div>

            <div className="flex flex-col items-center justify-center sm:px-6 md:px-6 py-8">

              {/* Main Container */}
              <div className="flex flex-col md:flex-row items-center max-w-6xl w-full overflow-hidden">
                {/* Left Section - Image */}
                <div className="w-full md:w-1/2 p-6 flex justify-center">
                  <img
                    src={FG}
                    alt="AI Training Offer"
                    className="w-full max-w-md md:max-w-lg h-auto rounded-xl shadow-md"
                  />
                </div>

                {/* Right Section - Content */}
                <div className="w-full md:w-1/2 p-6 space-y-6 text-center md:text-left">
                  {/* Offer Heading */}
                  {/* <h2 className="text-[#6A1B9A] text-3xl md:text-4xl font-bold">
                🚀 Free AI & Gen AI Training
              </h2> */}

                  {/* Details */}
                  <p className="text-gray-700 text-lg leading-relaxed">
                    <strong>Unlock your career potential</strong> with{" "}
                    <span className="text-[#008CBA] font-semibold">ASKOXY.AI</span>
                    ’s free AI & Generative AI training, combined with Java and
                    Microservices expertise.
                  </p>

                  <p className="text-gray-700 text-lg leading-relaxed">
                    <strong className="text-[#D81B60]">
                      Open to all graduates, pass or fail
                    </strong>
                    , this program empowers freshers to land their first job and
                    helps experienced professionals achieve high-salary roles. 🎓
                  </p>

                  <p className="text-gray-700 text-lg leading-relaxed">
                    Gain hands-on experience with free project training, guided by
                    visionary leader{" "}
                    <strong className="text-[#D81B60]">
                      Radhakrishna Thatavarti
                    </strong>
                    , Founder & CEO of ASKOXY.AI.{" "}
                    <strong className="text-[#008CBA]">
                      Transform your future today!
                    </strong>{" "}
                    🌐
                  </p>

                  {/* Call-to-action Button */}
                  <div className="flex justify-center md:justify-start">
                    <a
                      href="https://sites.google.com/view/globalecommercemarketplace/home"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Oxyloans Training Guide"
                    >
                      <button className="px-6 py-3 text-lg font-bold bg-[#008CBA] text-white rounded-lg shadow-md hover:bg-[#006F8E] transition-transform transform hover:scale-105 focus:ring-4 focus:ring-blue-300">
                        📖 Our Training Guide
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FreeAiandGenAi;
