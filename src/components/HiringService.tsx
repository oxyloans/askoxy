import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Typography, notification, message } from "antd";
import axios from "axios";
import img1 from "../assets/img/image1.png";
import img2 from "../assets/img/image2.png";
import img3 from "../assets/img/image3.png";
import img4 from "../assets/img/image4.png";
import img5 from "../assets/img/image5.png";
import img6 from "../assets/img/image6.png";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";

import Footer from "./Footer";
const { Title, Paragraph } = Typography;

const images = [
  { src: img1, alt: "Image 1" },
  { src: img2, alt: "Image 2" },
  { src: img5, alt: "Image 5" },
  { src: img6, alt: "Image 6" },
  { src: img3, alt: "Image 3" },
  { src: img4, alt: "Image 4" },
];

const HiringService: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ mobileNumber?: string }>({});
  const userId = localStorage.getItem("userId");
  const [currentIndex, setCurrentIndex] = useState(0);
 const [isLoading, setIsLoading] = useState<boolean>(false);
  const [issuccessOpen, setSuccessOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | undefined>();
  const [isprofileOpen, setIsprofileOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
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

  const mobileNumber = localStorage.getItem("whatsappNumber");
  
  const email = localStorage.getItem("email");

  const [formData, setFormData] = useState({
    askOxyOfers: "WEAREHIRING",
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
        "Thank you for showing interest in our *We Are Hiring* offer!"
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

  const handleWriteToUsSubmitButton = async () => {
    if (!query || query.trim() === "") {
      setQueryError("Please enter the query before submitting.");
      return; // Exit the function if the query is invalid
    }
    const payload = {
      email: email,
      mobileNumber: mobileNumber,
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

    const accessToken = localStorage.getItem("accessToken");

    const apiUrl = `${BASE_URL}/writetous-service/saveData`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const response = await axios.post(apiUrl, payload, { headers: headers });

      if (response.data) {
        console.log("Response:", response.data);
        setSuccessOpen(true);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error sending the query:", error);
    }
  };

  return (
    <>
      <header>
        <div className="flex flex-col md:flex-row justify-center md:justify-end gap-4 pt-4 items-center px-4 md:px-6 lg:px-8">
          <button
            className=" bg-[#04AA6D] w-full md:w-auto px-4 py-2 text-white rounded-lg shadow-md hover:bg-[#04AA6D] text-sm md:text-base lg:text-lg transition duration-300"
            onClick={handleSubmit}
            disabled={isButtonDisabled}
            aria-label="Join Us Now"
          >
            Join Us Now
          </button>

          <button
            className=" bg-[#008CBA] w-full md:w-auto px-4 py-2 text-white rounded-lg shadow-md hover:bg-[#04AA6D] text-sm md:text-base lg:text-lg transition duration-300"
            aria-label="Write To Us"
            onClick={handleWriteToUs}
          >
            Write To Us
          </button>
        </div>

        {isOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="relative bg-white rounded-lg shadow-md p-6 w-96">
              <i
                className="fas fa-times absolute top-3 right-3 text-xl text-gray-700 cursor-pointer hover:text-red-500"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              />
              <h2 className="text-xl font-bold mb-4 text-[#3d2a71]">
                Write To Us
              </h2>
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
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {queryError && (
                  <span className="text-sm text-red-600">{queryError}</span>
                )}
              </div>
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
                <h2 className="text-2xl text-[#3d2a71] font-bold">Alert...!</h2>
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
                Your query has been successfully submitted.
              </p>
              <div className="flex justify-center">
                <button
                  className="bg-[#04AA6D] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#2c8c50] focus:outline-none"
                  onClick={() => setSuccessOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="bg-gradient-to-r from-gray-50 to-white min-h-screen flex items-center justify-center p-4">
        <div className="container mx-auto px-6 lg:px-12 p-16 bg-white rounded-sm">
          <div className="text-center mb-12 px-4 sm:px-6 md:px-8">
            <Title level={2} className="text-3xl font-semibold text-[#3d2a71]">
              <span className="text-[#04AA6D]"> Digital Ambassadors</span>
            </Title>
            <Paragraph className="text-lg text-gray-600">
              Join Our Dynamic Team and Embark on a Digital Journey!
            </Paragraph>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <Title level={3} className="text-xl font-bold text-[#3d2a71]">
                  Role Overview
                </Title>
                <Paragraph className="text-lg text-gray-700">
                  As a Digital Ambassador, you will play a pivotal role in
                  driving the digital transformation of our platforms, including
                  our Study Abroad Platform and others powered by Askoxy.ai.
                </Paragraph>
              </div>
              <div>
                <Title level={3} className="text-xl font-bold text-[#3d2a71]">
                  What You'll Do
                </Title>
                <ul className="list-disc list-inside text-lg text-gray-700 space-y-3">
                  <li>Content Creation: Write engaging blogs and posts.</li>
                  <li>Social Media Engagement: Create and share videos.</li>
                  <li>
                    Customer Interaction: Visit customers to showcase our
                    platform.
                  </li>
                  <li>Community Outreach: Engage with local communities.</li>
                  <li>
                    Follow-Up Communication: Call customers and guide them.
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <Title level={3} className="text-xl font-bold text-[#3d2a71]">
                  Requirements
                </Title>
                <ul className="list-disc list-inside text-lg text-gray-700 space-y-3">
                  <li>Bring your own laptop to take on this exciting role.</li>
                  <li>Passion for content creation and customer engagement.</li>
                </ul>
              </div>
              <div>
                <Title level={3} className="text-xl font-bold text-[#3d2a71]">
                  Why Join Us?
                </Title>
                <ul className="list-disc list-inside text-lg text-gray-700 space-y-3">
                  <li>Be a part of the Study Abroad Digital Journey.</li>
                  <li>Work on platforms powered by Askoxy.ai.</li>
                  <li>
                    Gain experience in content creation, social media, and
                    customer interaction.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default HiringService;
