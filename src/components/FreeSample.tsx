import React, { useState, useEffect } from "react";
import "./StudyAbroad.css";
import "./DiwaliPage.css";
import axios from "axios";
import { BiLogoPlayStore } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { HiOutlineDocument } from "react-icons/hi";
import BASE_URL from "../Config";

import Container from "./ContainerPolicy";
import FR from "../assets/img/WhatsApp Image 2025-01-23 at 15.50.44.png";

import Footer from "./Footer";
import { message, Modal } from "antd";

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

  const userId = localStorage.getItem("userId");
  const [issuccessOpen, setSuccessOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isprofileOpen, setIsprofileOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState<string | undefined>(undefined);
  const mobileNumber = localStorage.getItem("whatsappNumber");
  const [formData, setFormData] = useState({
    askOxyOfers: "FREESAMPLE",
    userId: userId,
    mobileNumber: mobileNumber,
    projectType: "ASKOXY",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

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

      // Redirect to the thank-you page
      navigate("/thank-you");
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
      askOxyOfers: "FREESAMPLE",
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
  const [showContainer, setShowContainer] = useState(false);

  const handleButtonClick = () => {
    window.open(
      "https://drive.google.com/file/d/1x_0b6DIt5-rbq1fubeHcIMO5Grxr46p1/view",
      "_blank"
    ); // Set state to show the container when the button is clicked
  };

  return (
    <div>
      <div>
        <header>
          {/* Buttons on the right */}
          <div className="flex flex-col md:flex-row items-center md:items-start pt-5 justify-center">
            {/* Title */}
            <h1 className="text-center text-[rgba(91,5,200,0.85)] font-bold text-2xl sm:text-3xl md:text-3xl lg:text45xl leading-tight mb-6 md:mb-0">
              Free Rice Samples & Steel Container
            </h1>
          </div>

          <div className="flex flex-col md:flex-row justify-center md:justify-end gap-4 items-center px-4 md:px-6    lg:px-8">
            {/* Button: I'm Interested */}

            {/* <div>
             
              <button
                className="bottom-8 right-8 px-4 py-2 bg-[#D32F2F] text-white rounded-lg shadow-lg hover:bg-[#B71C1C] transition-all text-sm md:text-base lg:text-lg flex items-center justify-center z-50"
                aria-label="Open Container Policy PDF"
                onClick={handleButtonClick} // Attach click handler to the button
              >
                <HiOutlineDocument className="w-5 h-5 text-white mr-2" />
                Container Policy Preview
              </button>

             
              {showContainer && <Container />}
            </div> */}

            {/* Button: Write To Us */}
            <button
              className=" bg-[#008CBA] w-full md:w-auto px-4 py-2  text-white rounded-lg shadow-md hover:bg-[#04AA6D] text-sm md:text-base lg:text-lg transition duration-300 "
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
          {/* <div className="flex flex-col items-center justify-center md:flex-row  pt-4 md:px-6 lg:px-8">

            <h3 className="text-center text-[rgba(91,5,200,0.85)] font-bold text-sm sm:text-base md:text-lg lg:text-xl">
            
            </h3>
          </div> */}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2 px-4">
          {/* Image Section */}
          <div className="flex justify-center p-4">
            <img
              src={FR}
              alt="Free Sample"
              className="w-auto h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-lg pointer-events-none select-none object-contain"
            />
          </div>

          {/* Text and Button Section */}
          <div className="text-center lg:text-left p-4 ">
            <p className="text-black mb-4 text-sm sm:text-base lg:text-lg">
              <strong>Special Offer:</strong> Free Rice Container! - Buy a 26kg
              rice bag & get a FREE rice container! (Container remains Oxy Group
              asset until ownership is earned.)
              <br />
              <strong>How to Earn Ownership:</strong>
              <div className="mt-2">
                <p>
                  <strong>Plan A:</strong> Buy 9 bags during the next 1 year,
                  and the container is yours forever.
                </p>
                <p className="my-2 text-center font-bold">OR</p>
                <p>
                  <strong>Plan B:</strong> Refer 9 people, and when they buy
                  their first bag, the container is yours forever.
                </p>
              </div>
              <br />
              <strong>Important Info:</strong>
              <ul className="list-disc list-inside ">
                <li>
                  No purchase in 45 days or gap of 45 days between purchases =
                  Container will be taken back.
                </li>
              </ul>
              <br />
              If you are interested in buying a rice bag, please click the{" "}
              <strong> I am Interested </strong>button
            </p>

            <div className="space-x-4">
              <button
                className="px-6 py-3 font-bold bg-[#04AA6D] text-white rounded-lg shadow-lg  transition-all text-sm md:text-base lg:text-lg"
                onClick={handleSubmit}
                disabled={isButtonDisabled}
                aria-label="I'm Interested"
              >
                I'm Interested
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FreeSample;
