import React, { useState, useEffect } from "react";
import "./Freerudraksha.css";
import "./DiwaliPage.css";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";

import TeluguShiva from "../assets/img/telugu.png";
import EnglishShiva from "../assets/img/english.png";
import Image1 from "../assets/img/WEBSITE (1).png";
import Image2 from "../assets/img/R2.png";
import Image3 from "../assets/img/images.png";
import Image4 from "../assets/img/chat-icon-2048x2048-i7er18st.png";
import Footer from "./Footer";
import { Modal, Button, Input, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import img1 from "../assets/img/image1.png";
import img2 from "../assets/img/image2.png";
import img3 from "../assets/img/image3.png";
import img4 from "../assets/img/image4.png";
import img5 from "../assets/img/image5.png";
import img6 from "../assets/img/image6.png";
import { FaSquareWhatsapp } from "react-icons/fa6";

const images = [
  { src: img1, alt: "Image 1" },
  { src: img2, alt: "Image 2" },
  { src: img5, alt: "Image 5" },
  { src: img6, alt: "Image 6" },
  { src: img3, alt: "Image 3" },
  { src: img4, alt: "Image 4" },
];

const Freerudraksha: React.FC = () => {
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

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [modalType, setModalType] = useState<string>("");
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
  const userId = localStorage.getItem("userId");
  console.log(userId);
  const handleWhatsappClick = () => {
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
      setModalType("confirmation");
      setIsModalOpen(true);
    } else {
      message.error("Phone number is not available in local storage.");
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
  const whatsappNumber = "9160463697";

  const handleMessage = (action: string) => {
    if (action === "Write to Us") {
      console.log("Navigating to 'Write to Us' feature...");
      //  window.location.href = "/contact-form";
    } else if (action === "Chat with Us") {
      console.log("Opening WhatsApp chat...");
      const message = `Hi`;
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank");
    }
  };

  const officeDetails = {
    address:
      "CC-02, Ground Floor, Block-C, Indu Fortune Fields, The Annexe Phase-13, KPHB Colony, K P H B Phase 9, Kukatpally, Hyderabad, Telangana 500085",

    VisitTimings: "Monday to Friday, 10:00 AM to 6:00 PM",
    googleMapLink: "https://maps.app.goo.gl/MC1EmbY4DSdFcpke9",
    contact: "099668 88825",
  };

  const fetchUserAddress = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://meta.oxyloans.com/api/auth-service/auth/getuserAddress?userId=${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log(address);
        setSavedAddress(address);
        setDelivery(delivery); // Assuming the API response has the address under 'address' key
        setModalType("success"); // Move to address confirmation modal
      } else {
        message.error("Failed to fetch saved address. Please try again.");
      }
    } catch (error) {
      console.error("Failed to fetch address:", error);
      message.error("An error occurred while fetching the address.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveAddress = async () => {
    if (!address.trim()) {
      message.error("Please enter an address.");
      return;
    }
    if (hasSubmitted) {
      // If the user has already submitted once, show the message with first request date
      message.info(
        `We have received your first request on ${firstRequestDate}". Every user can participate only once!`
      );
      return; // Prevent submitting again
    }

    const endpoint =
      "https://meta.oxyloans.com/api/auth-service/auth/rudhrakshaDistribution";
    const payload = { address, userId };

    try {
      setIsLoading(true);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        message.success("Address saved successfully!");
        fetchUserAddress(); // Fetch the saved address after successful save
      } else {
        const errorData = await response.json();
        console.error("Error saving address:", errorData);
        message.error("Failed to save the address. Please try again.");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle WhatsApp confirmation
  const handleConfirmPhone = () => {
    setModalType("addressEntry"); // Move to address entry modal
  };
  // Handle address confirmation
  const handleConfirmAddress = () => {
    setIsModalOpen(false); // Close the modal
    message.success("Address confirmed successfully!");
  };

  // Fetch the saved address and submission status when the component mounts
  // Fetch the saved address and submission status when the component mounts
  useEffect(() => {
    const savedHasSubmitted = localStorage.getItem(`${userId}_hasSubmitted`);
    const savedDate = localStorage.getItem(`${userId}_firstRequestDate`);

    if (savedHasSubmitted && savedDate) {
      // User has already participated
      setHasSubmitted(true);
      setFirstRequestDate(savedDate);
    }
  }, [userId]);

  const submitRequest = async (deliveryType: string) => {
    if (hasSubmitted) {
      // If the user has already submitted once, show the message with first request date
      message.info(
        `We have received your first request on ${firstRequestDate}`
      );
      return; // Prevent submitting again
    }

    const endpoint =
      "https://meta.oxyloans.com/api/auth-service/auth/rudhrakshaDistribution";
    const payload = { userId, deliveryType };

    try {
      setIsLoading(true); // Show loading spinner
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const date = new Date().toLocaleDateString(); // Get current date
        setFirstRequestDate(date);
        setHasSubmitted(true);

        // Save to localStorage with the userId as part of the key to make it specific to the user
        localStorage.setItem(`${userId}_hasSubmitted`, "true");
        localStorage.setItem(`${userId}_firstRequestDate`, date);
        message.success("Request submitted successfully!");
        setIsPopupVisible(false);
      } else {
        const errorData = await response.json();
        console.error("Error submitting request:", errorData);
        message.error("Failed to submit the request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading spinner
      setAddress("");
      setIsPopupVisible(false);
      setIsModalOpen(false);
    }
  };
  const handleDeliverySelection = (deliveryType: string) => {
    if (deliveryType === "PickInOffice") {
      setIsOfficeConfirmationVisible(true); // Show office details confirmation
    } else {
      submitRequest(deliveryType);
    }
  };
  return (
    <div>
      <header className="header relative p-4 md:p-6 lg:p-8 bg-gray-50">
        {/* Title and Buttons Container */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
          {/* Title */}
          <h1 className="text-left md:text-center text-[rgba(91,5,200,0.85)] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-6 md:mb-0"></h1>
          <h1 className="text-center md:text-center text-[rgba(91,5,200,0.85)] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-6 md:mb-0">
            The Two Worlds
          </h1>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-center md:justify-end items-center gap-4">
            <button
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 text-sm md:text-base lg:text-lg transition duration-300"
              aria-label="Write To Us"
            >
              Write To Us
            </button>
            {/* Uncomment below button if needed */}
            {/* <button
        className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 text-sm md:text-base lg:text-lg transition duration-300"
        aria-label="Chat With Us"
      >
        Chat With Us
      </button> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="worlds flex justify-center mt-8">
        <section className="spiritual-world text-center mx-4">
          <h2 id="h2" style={{ fontWeight: "bold"}}>
            Spiritual World
          </h2>
          <img src={Image1} alt="Spiritual World" className="world-image w-103 h-100" />
        </section>
        <section className="ai-world text-center mx-4">
          <h2 id="h2" style={{ fontWeight: "bold" }}>
            AI & Generative AI World
          </h2>
          <img
            src={Image2}
            alt="AI & Generative AI World"
            className="world-image"
          />
        </section>
      </div>

      {/* Details Section */}
      <div className="details">
        <strong>
          The One Lakh Rudraksharchana on 19th November was a grand success! 🌟
          Click on “I Want Free Rudraksha” now to receive the sacred Rudrakshas
          used in the Archana. They will be delivered to your doorstep at no
          cost. Inspired by this success, we aspire to host 99 more
          Rudraksharchana events to fulfill our vision of One Crore
          Rudraksharchanas! Join us on this divine journey. 🙏
        </strong>
      </div>

      <div className="details">
        <strong>
          నవంబర్ 19న నిర్వహించిన లక్ష రుద్రాక్షార్చన ఘన విజయాన్ని సాధించింది!🌟{" "}
        </strong>{" "}
        ఆర్చనలో ఉపయోగించిన పవిత్ర రుద్రాక్షలను పొందడానికి ఇప్పుడు "I want Free
        Rudraksha" పై క్లిక్ చేయండి. అవి మీ ఇంటి వద్దకు ఉచితంగా పంపబడతాయి. ఈ
        విజయంతో ప్రేరణ పొందిన మేము, మా లక్ష్యం అయిన కోటి రుద్రాక్షార్చనల సాధన
        కోసం మరో 99 రుద్రాక్షార్చన కార్యక్రమాలను నిర్వహించేందుకు సంకల్పించాము! ఈ
        దివ్య ప్రయాణంలో భాగస్వామ్యం అవ్వండి. 🙏
      </div>

      {/* Button Section */}
      <div className="flex justify-center mt-8">
        <button
          className="w-52 h-12 text-lg font-bold bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
          onClick={handleWhatsappClick}
          aria-label="Request Free Rudraksha"
        >
          I Want Free Rudraksha
        </button>
      </div>

      {/* Modals */}
      <Modal
        title=""
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)} // Close the modal
        footer={null} // Custom footer
        className="modal-responsive"
      >
        {/* Step 1: Confirm WhatsApp Number */}
        {modalType === "confirmation" && (
          <>
            <p className="text-lg text-center text-black mb-4">
              Please confirm your WhatsApp number:
              <span className="font-bold block mt-2">{phoneNumber}</span>
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                type="primary"
                onClick={handleConfirmPhone}
                className="w-full sm:w-auto"
              >
                Yes
              </Button>
              <Button
                danger
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto"
              >
                No
              </Button>
            </div>
          </>
        )}

        {modalType === "addressEntry" && (
          <>
            <p className="text-lg text-center text-black mb-4">
              Please enter your address below:
            </p>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="w-full mb-4"
            />
            <Button
              type="primary"
              block
              className="mt-4"
              onClick={saveAddress}
              loading={isLoading} // Spinner while saving
            >
              Save Address
            </Button>
          </>
        )}

        {/* Step 3: Confirm Saved Address */}
        {modalType === "success" && (
          <>
            {isLoading ? (
              <p className="text-center">Loading address...</p>
            ) : (
              <>
                <p className="text-lg text-center text-black mb-4">
                  Your saved address is:
                  <span className="font-bold block mt-2">{savedAddress}</span>
                </p>
                {/* <p className="text-lg text-center text-black mb-4">
            Your choose delivery option:
            <span className="font-bold block mt-2">{delivery}</span>
          </p> */}
                <div className="flex gap-4 justify-center">
                  <Button
                    type="primary"
                    onClick={() => {
                      handleConfirmAddress(); // Confirm address
                      setIsPopupVisible(true); // Open the delivery method modal immediately
                    }}
                    className="w-full sm:w-auto"
                  >
                    Confirm
                  </Button>
                  <Button
                    danger
                    onClick={() => setModalType("addressEntry")}
                    className="w-full sm:w-auto"
                  >
                    Edit Address
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </Modal>

      {/* Popup Modals */}
      {isPopupVisible && !isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-md">
            <p className="text-lg text-center text-black mb-4">
              Please choose your preferred delivery method:
            </p>
            <div className="flex justify-between gap-4">
              <button
                className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-all w-full"
                onClick={() => submitRequest("HomeDelivery")}
              >
                Home Delivery
              </button>
              <button
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-all w-full"
                onClick={() => handleDeliverySelection("PickInOffice")}
              >
                Collect from Office
              </button>
            </div>
          </div>
        </div>
      )}

      {isOfficeConfirmationVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-md">
            <p className="text-lg text-center text-black mb-4 font-semibold">
              Please find our address below:
            </p>

            <div className="text-center mb-4">
              <p className="text-black font-medium">
                {" "}
                <strong>Address: </strong>
                {officeDetails.address}
              </p>
              <br></br>
              <p className="text-black font-medium">
                <strong>Visit Timings: </strong>
                {officeDetails.VisitTimings}
              </p>
              <a
                href={officeDetails.googleMapLink}
                target="_blank"
                className="text-blue-600 hover:underline"
                rel="noopener noreferrer"
              >
                View Location on Google Maps
              </a>

              <p className="text-black mt-2">
                <strong>Contact: </strong>
                <span className="font-medium">{officeDetails.contact}</span>
              </p>
            </div>
            <div className="flex justify-between gap-4">
              <button
                className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-all w-full"
                onClick={() => {
                  setIsOfficeConfirmationVisible(false); // Close confirmation
                  submitRequest("PickInOffice");
                }}
              >
                Confirm and Proceed
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all w-full"
                onClick={() => setIsOfficeConfirmationVisible(false)} // Close confirmation
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Freerudraksha;
