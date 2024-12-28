import React, { useState, useEffect } from "react";
import "./StudyAbroad.css";
import "./DiwaliPage.css";
import axios from "axios";
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
import Image3 from "../assets/img/R33.jpg";
import Image2 from "../assets/img/R2.png";
import Image5 from "../assets/img/images.png";
import Image4 from "../assets/img/chat-icon-2048x2048-i7er18st.png";
import Footer from "./Footer";
import { Modal, Button, Input, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import FG from "../assets/img/GEN AI (1).png";
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
    const [query, setQuery] = useState("");
  const [isModalOpen1, setIsModalOpen1] = useState<boolean>(false);
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
    askOxyOfers: "FREEAI",
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
   const handleMessage = (action: string) => {
     if (action === "Write to Us") {
       console.log("Navigating to 'Write to Us' feature...");
       window.location.href = "/contact-form";
     } else if (action === "Chat with Us") {
       const phoneNumber = "7093485208"; // Replace with your WhatsApp number
       const message = "Hello, I am interested in your services."; // Replace with your message
       const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
         message
       )}`;
       window.open(url, "_blank");
     }
   };
  return (
    <div>
      <div className="bg-gray-100">
        <header className="header text-center">
          <h3 style={{ color: "rgba(91, 5, 200, 0.85)" }}>
            <strong>
              Free AI and Gen AI Training: Unlock the Power of Artificial
              Intelligence
            </strong>
          </h3>
        </header>
        {/* Main Content */}
        <div className="worlds flex justify-center mt-8">
          <section className="spiritual-world text-center mx-4">
            <img src={FG} alt="FREE AI & GEN AI" className="world-image" />
          </section>
        </div>
        <div className=" p-3 space-y-6">
          {/* Offer Heading */}
          <div className="text-center">
            <strong style={{ color: "#6A1B9A", fontSize: "24px" }}>
              Our Offer: FREE AI & GEN AI TRAINING
            </strong>
          </div>
        </div>
        <div className="details">
          <strong>
            🌟 Unlock your career potential with ASKOXY.AI’s free AI &
            Generative AI training, combined with Java and Microservices
            expertise. 🎓 Open to all graduates, pass or fail, this program
            empowers freshers to land their first job and experienced
            professionals to achieve high-salary roles. 💼 Gain hands-on
            experience with free project training, guided by visionary leader
            Radhakrishna Thatavarti, Founder & CEO of ASKOXY.AI. 🚀 Transform
            your future today! 🌐
          </strong>
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
        <div className="flex justify-center mt-8 space-x-10">
          <button
            className="w-52 h-12 text-lg font-bold bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
            onClick={() => setIsModalOpen(true)}
            aria-label="Visit our site"
          >
            I'm interested
          </button>
          <a
            href="https://sites.google.com/view/globalecommercemarketplace/home" // Replace with your Google site link
            target="_blank"
            rel="Oxyloans Training Guide"
          >
            <button
              className="w-52 h-12 text-lg font-bold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
              aria-label="Our Training Guide"
            >
              Our Training Guide
            </button>
          </a>
        </div>
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 flex flex-col items-end space-y-4">
          {/* Write to Us Button */}
          <button
            onClick={() => setIsModalOpen1(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 w-full max-w-xs md:max-w-md"
          >
            <img
              src={Image5} // Replace with your icon path or fallback
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
        <h1 className="text-gray-100">{"hello "}</h1>s
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
            <span className="text-[#0a6fba]">Oxy</span> Group
          </span>{" "}
          <span className="text-[#FFA500]">Companies</span>
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

        <div className="event-container1 ">
          <div
            className="event-content1 border-2 rounded-lg p-4 md:p-6 lg:p-8"
            style={{ borderColor: "#05a446" }}
          >
            <div className="diwali-images1">
              <div className="image-container1 flex justify-center">
                <img
                  src={img6}
                  alt="Diwali Diyas"
                  className="diwali-diya w-full max-w-xs sm:max-w-sm md:max-w-md"
                />
              </div>
            </div>
            <div className="event-details text-center mt-4">
              <h1
                className="diwali-title1 text-2xl md:text-3xl font-bold"
                style={{ color: "#05a446" }}
              >
                Order . Rice . Online
              </h1>
              <h3 className="diwali-subtitle1 font-bold my-4">
                Free Delivery | All Over Hyderabad
              </h3>
              <h3 className="diwali-subtitle1 my-4">
                All types of rice brands available: Sri Lalitha, Kurnool, RRI,
                Cow brand, Sree Maateja, Kolam Rice, Surya Teja’s Brand, Gajraj
                Evergreen, Shubodayam, 5 Star, JSR
              </h3>
              <h3 className="diwali-subtitle1 font-bold my-4">
                Return & Exchange Guarantee | Available Now: Steamed & Raw Rice
              </h3>

              <div className="buttons mt-6">
                <a
                  href="https://erice.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="button demo text-white px-6 py-3 rounded-lg"
                    style={{ backgroundColor: "#05a446" }}
                  >
                    Order Rice
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
              <span className="text-[#0a6fba]">Oxy</span> Group
            </b>{" "}
            <span className="text-[#FFA500]">Companies</span>
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

export default FreeAiandGenAi;