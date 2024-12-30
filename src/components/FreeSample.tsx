import React, { useState, useEffect } from "react";
import "./StudyAbroad.css";
import "./DiwaliPage.css";
import axios from "axios";
import { BiLogoPlayStore } from "react-icons/bi";
import {
  FaMapMarkerAlt,
  FaUniversity,
  FaGlobe,
  FaPlane,
  FaBook,
} from "react-icons/fa"; // Import icons
import { FaSquareWhatsapp } from "react-icons/fa6";
import TeluguShiva from "../assets/img/telugu.png";
import EnglishShiva from "../assets/img/english.png";
import Image1 from "../assets/img/WEBSITE.png";
import FR from "../assets/img/ricesample (1).png";
import Image3 from "../assets/img/images.png";
import Image4 from "../assets/img/chat-icon-2048x2048-i7er18st.png";
import Image2 from "../assets/img/R2.png";
import Footer from "./Footer";
import { Modal, Button, Input, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import img1 from "../assets/img/image1.png";
import img2 from "../assets/img/image2.png";
import img3 from "../assets/img/image3.png";
import img4 from "../assets/img/image4.png";
import img5 from "../assets/img/image5.png";
import img6 from "../assets/img/soon.png";
import ricesample1kgGif from "../assets/img/ricesample1kg.gif";
import ricebag26kgsGif from "../assets/img/ricebag26kgsGif.gif";

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

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [address, setAddress] = useState<string>("");
    const [query, setQuery] = useState("");
  const [isModalOpen1, setIsModalOpen1] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
  const storedPhoneNumber = localStorage.getItem("whatsappNumber");
  // Fetch user ID from storage if needed.
  const [hasSubmitted, setHasSubmitted] = useState(false); // Track submission status
  const [firstRequestDate, setFirstRequestDate] = useState("");
  const [isOfficeConfirmationVisible, setIsOfficeConfirmationVisible] =
    useState(false);
  const [savedAddress, setSavedAddress] = useState<string>("");
  const [delivery, setDelivery] = useState<string>("");
const [errors, setErrors] = useState<{ mobileNumber?: string }>({});
  const userId = localStorage.getItem("userId");
  console.log(userId);
  const handleWhatsappClick = () => {
    const phoneNumber = "YOUR_WHATSAPP_NUMBER"; // Replace with your WhatsApp number
    const message = "Hello, I am interested in your services."; // Replace with your message
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  const [formData, setFormData] = useState({
    askOxyOfers: "FREESAMPLE",
    id: userId,
    mobileNumber: "",
    projectType: "ASKOXY",
  });
  
   const handleSend = () => {
     if (query.trim()) {
       // Handle sending the query
       console.log("User Query:", query);
       setIsModalOpen(false);
       setQuery("");
       alert("Your query has been sent successfully!");
     } else {
       alert("Please write a query before submitting.");
     }
   };
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
  
   const handleMessage = (action: string) => {
     if (action === "Write to Us") {
       console.log("Navigating to 'Write to Us' feature...");
       window.location.href = "/contact-form";
     } else if (action === "Chat with Us") {
       console.log("Opening WhatsApp chat...");
       window.open(
         "https://wa.me/<7093485208>?text=Hi, I need assistance!",
         "_blank"
       );
     }
   };

 
  return (
    <div>
      <div>
        <header className="header text-center">
          <h3 style={{ color: "rgba(91, 5, 200, 0.85)" }}>
            <strong>
              Order Rice Online – Free Rice Samples & Steel Container from
              OxyRice{" "}
            </strong>
          </h3>
        </header>

        {/* Main Content */}
        <div className="worlds flex justify-center mt-8">
          <section className="spiritual-world text-center mx-4">
            <img src={FR} alt="Spiritual World" className="world-image" />
          </section>
        </div>

        {/* Details Section */}

        <div className="details p-3 space-y-6">
          {/* Offer Heading */}
          <div className="text-center mt-4">
            <strong style={{ color: "purple", fontSize: "24px" }}>
              Our Offer: Free Rice Sample and Steel Container
            </strong>
          </div>

          {/* Offer Details Section */}
          {/* <div className="text-left">
            <strong className="text-purple-600 text-xl">Offer Details</strong>
            <p>
              Purchase any rice bag and receive a free steel container
              proportional to your purchase:
            </p>
            <ul className="list-disc ml-6">
              <li>
                <strong>1 kg rice bag</strong>: Free <strong>1+ kg</strong>{" "}
                steel container
              </li>
              <li>
                <strong>5 kg rice bag</strong>: Free <strong>5+ kg</strong>{" "}
                steel container
              </li>
              <li>
                <strong>10 kg rice bag</strong>: Free <strong>10+ kg</strong>{" "}
                steel container
              </li>
              <li>
                <strong>26 kg rice bag</strong>: Free <strong>26+ kg</strong>{" "}
                steel container
              </li>
            </ul>
            <br></br>
            <strong className="text-purple-600 text-xl">
              Container Policy
            </strong>
            <ul className="list-disc ml-6">
              <li>
                The container delivery will take time as it is ordered based on
                demand.
              </li>
              <li>
                The container remains the property of OXY Group and is provided
                as a free asset for your usage, as long as you continue
                purchasing rice from us.
              </li>
            </ul>

            <strong className="text-purple-600 text-xl">
              Usage and Recovery Terms
            </strong>
            <ul className="list-disc ml-6">
              <li>
                If no purchase is made within <strong>45 days</strong>, you will
                receive an alert.
              </li>
              <li>
                If no purchase is made within <strong>60 days</strong>,{" "}
                <strong>
                  OXY Group reserves the right to recover the container
                </strong>
                .
              </li>
            </ul>
          </div> */}

          <div className="details mt-4">
            <strong>
              ASKOXY.AI offers an exclusive deal: get 1 KG of free rice samples
              with a free steel container. This sleek container ensures
              freshness and sustainability, reflecting ASKOXY.AI's commitment to
              quality. Download the app now from the App Store or Google Play by
              scanning the QR code and enjoy premium rice ordering online!
            </strong>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 justify-center">
        <div className="p-2 border rounded-lg shadow-md flex flex-col items-center">
          <FaUniversity className="w-12 h-12 mb-2 text-purple-600" />
          <h3 className="text-center font-bold mb-1 text-black">
            3000+ Students
          </h3>
          <p className="text-center text-black text-sm">
            Availed this platform and currently studying in universities abroad
          </p>
        </div>
        <div className="p-2 border rounded-lg shadow-md flex flex-col items-center">
          <FaGlobe className="w-12 h-12 mb-2 text-purple-600" />
          <h3 className="text-center font-bold mb-1 text-black">
            150+ Recruiters
          </h3>
          <p className="text-center text-black text-sm">
            Support in mapping students to the university and have registered
            85% accuracy in mapping
          </p>
        </div>
        <div className="p-2 border rounded-lg shadow-md flex flex-col items-center">
          <FaPlane className="w-12 h-12 mb-2 text-purple-600" />
          <h3 className="text-center font-bold mb-1 text-black">
            100+ Universities
          </h3>
          <p className="text-center text-black text-sm">
            Spread across the UK, Europe, US, Canada, Australia, Newzealand
          </p>
        </div>
        <div className="p-2 border rounded-lg shadow-md flex flex-col items-center">
          <FaBook className="w-12 h-12 mb-2 text-purple-600" />
          <h3 className="text-center font-bold mb-1 text-black">Free</h3>
          <p className="text-center text-black text-sm">
            Life time Access to students
          </p>
        </div>
      </div> */}

        {/* Button Section */}
        <div className="flex justify-center">
          <button
            className="w-52 h-12 mb-4 text-lg font-bold bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
            onClick={() => setIsModalOpen(true)}
            aria-label="Visit our site"
          >
            I'm interested
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-center mt-4 space-y-6 md:space-y-0 md:space-x-5">
          {/* Rice Sample 1kg */}
          <div className="w-full md:w-[450px] h-[350px] text-center bg-white shadow-lg p-4 rounded">
            <img
              src={ricesample1kgGif}
              alt="Rice Sample 1kg"
              className="w-full h-full object-cover rounded-lg"
            />
            <h5 className="text-blue-600 font-bold mt-5">Rice Sample 1kg</h5>
          </div>

          {/* Rice Bag 26kgs */}
          <div className="w-full md:w-[450px] h-[350px] text-center bg-white shadow-lg p-4 rounded">
            <img
              src={ricebag26kgsGif}
              alt="Rice Bag 26kgs"
              className="w-full h-full object-cover rounded-lg"
            />
            <h5 className="text-blue-600 font-bold mt-5">Rice Bag 26kgs</h5>
          </div>
        </div>

        {/* Playstore Button */}
        <div className="flex justify-center mt-4">
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

        {/* New Image Section */}
        <div className="flex justify-center mt-4">
          <img
            src={img6} // Replace with the actual image path
            alt="New Image"
            style={{ width: "1000px", height: "300px", objectFit: "contain" }}
          />
        </div>

        <h1 className="text-gray-100">{"hello "}</h1>
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 flex flex-col items-end space-y-4">
          {/* Write to Us Button */}
          <button
            onClick={() => setIsModalOpen1(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 w-full max-w-xs md:max-w-md"
          >
            <img
              src={Image3} // Replace with your icon path or fallback
              alt="Write to Us"
              className="w-6 h-6 mr-2"
            />
            <span className="font-medium text-sm md:text-base">
              Write to Us
            </span>
          </button>

          {/* Modal */}
          {isModalOpen1 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                {/* Modal content */}
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Write to Us
                </h2>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full border text-black border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your query here..."
                />
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={() => setIsModalOpen1(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat with Us Button */}
          <button
            onClick={() => handleMessage("Chat with Us")}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 w-full max-w-xs md:max-w-md"
          >
            {/* <img
                     src={Image4 || "/default-icon.png"} // Replace with your fallback icon path if needed
                     alt="Chat with Us"
                     className="w-6 h-6 mr-2"
                   /> */}
            <FaSquareWhatsapp className="w-7 h-7 text-white mr-2" />{" "}
            {/* Adjust size and spacing */}
            <span className="font-medium text-sm md:text-base">
              Chat with Us
            </span>
          </button>
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

          <div className="relative w-full max-w-[700px] mx-auto overflow-hidden min-w-[300px] min-h-[200px]">
            <button
              className="absolute z-10 p-2 text-2xl transform -translate-y-1/2 bg-blue-600 text-white rounded-full left-2 top-1/2 hover:bg-blue-700"
              onClick={handlePrev}
            >
              ←
            </button>
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, idx) => (
                <div key={idx} className="flex-shrink-0 w-full min-w-[300px]">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto max-h-[400px] object-cover"
                  />
                </div>
              ))}
            </div>
            <button
              className="absolute z-10 p-2 text-2xl transform -translate-y-1/2 bg-blue-600 text-white rounded-full right-2 top-1/2 hover:bg-blue-700"
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