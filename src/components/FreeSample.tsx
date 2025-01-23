import React, { useState, useEffect } from "react";
import "./StudyAbroad.css";
import "./DiwaliPage.css";
import axios from "axios";
import { BiLogoPlayStore } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { HiOutlineDocument } from "react-icons/hi";

import Container from "./ContainerPolicy";
import FR from "../assets/img/WhatsApp Image 2025-01-23 at 15.50.44.png"

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
      "https://meta.oxyloans.com/api/auth-service/auth/askOxyOfferes",
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
    navigate("/user-profile");
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

    const apiUrl = `https://meta.oxyloans.com/api/write-to-us/student/saveData`;
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
              className="px-4 py-2 bg-[#008CBA] text-white rounded-lg shadow-lg hover:bg-[#008CBA] transition-all text-sm md:text-base lg:text-lg"
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
                    >
                      Submit Query
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
          <div className="flex flex-col items-center justify-center md:flex-row  pt-4 md:px-6 lg:px-8">
            {/* Title */}
            <h3 className="text-center text-[rgba(91,5,200,0.85)] font-bold text-sm sm:text-base md:text-lg lg:text-xl">
              Free Rice Samples & Steel Container
            </h3>
          </div>
        </header>

        {/* Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2 px-4">
          {/* Image Section */}
          <div className="flex justify-center p-4">
            <img
              src={FR}
              alt="Free Sample"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-lg object-cover"
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

      <div>
        <h1 className="text-center mx-4 my-12 text-3xl md:text-5xl font-bold">
          <span className="text-[#04AA6D]">
            <span className="text-[#0a6fba]">OXY</span> GROUP
          </span>{" "}
          <span className="text-[#FFA400]">COMPANIES</span>
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
        {/* <div className="px-6 py-5 bg-[#f1f1f1] md:p-10 rounded-md">
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
        </div> */}
      </div>
      <Footer />
    </div>
  );
};

export default FreeSample;
