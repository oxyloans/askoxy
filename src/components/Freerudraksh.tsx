import React, { useState, useEffect } from "react";
import "./Freerudraksha.css";
import "./DiwaliPage.css";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";
import ScrollToTop from "./ScrollToTop";
import TeluguShiva from "../assets/img/telugu.png";
import EnglishShiva from "../assets/img/english.png";
import Image1 from "../assets/img/WEBSITE (1).png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Image2 from "../assets/img/R2.png";
import Image3 from "../assets/img/images.png";
import Image4 from "../assets/img/chat-icon-2048x2048-i7er18st.png";
import Footer from "./Footer";
import { Modal, Button, Input, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/img/image1.png";
import img2 from "../assets/img/image2.png";
import img3 from "../assets/img/image3.png";
import img4 from "../assets/img/image4.png";
import img5 from "../assets/img/image5.png";
import img6 from "../assets/img/image6.png";
import { FaSquareWhatsapp } from "react-icons/fa6";
import BASE_URL from "../Config";

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
  const [issuccessOpen, setSuccessOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const storedPhoneNumber = localStorage.getItem("whatsappNumber");
  // Fetch user ID from storage if needed.
  const [hasSubmitted, setHasSubmitted] = useState(false); // Track submission status
  const [firstRequestDate, setFirstRequestDate] = useState("");
  const [isOfficeConfirmationVisible, setIsOfficeConfirmationVisible] =
    useState(false);
  const [savedAddress, setSavedAddress] = useState<string>("");

  const [delivery, setDelivery] = useState<string>("");
  const [isprofileOpen, setIsprofileOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState<string>("");
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
        `${BASE_URL}/auth-service/auth/getuserAddress?userId=${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log(address);
        setSavedAddress(address);
        setDelivery(delivery);
        setModalType("success");
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

    const endpoint = `${BASE_URL}/marketing-service/campgin/rudhrakshaDistribution`;
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

    const endpoint = `${BASE_URL}/marketing-service/campgin/rudhrakshaDistribution`;
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

  const email = localStorage.getItem("email");
  const mobileNumber = localStorage.getItem("whatsappNumber");

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

  useEffect(() => {
    if (issuccessOpen) {
      const timer = setTimeout(() => {
        setSuccessOpen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [issuccessOpen]);
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
      askOxyOfers: "FREERUDRAKSHA",
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
      <header>
        {/* Title and Buttons Container */}
        <div className="flex flex-col md:flex-row items-center md:items-start pt-5 justify-center">
          {/* Title */}
          <h1 className="text-center text-[rgba(91,5,200,0.85)] font-bold text-2xl sm:text-3xl md:text-3xl lg:text45xl leading-tight mb-6 md:mb-0">
            The Two Worlds
          </h1>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-center md:justify-end gap-4 items-center px-4 md:px-6 lg:px-8">
          <button
            className="w-full md:w-auto px-4 py-2 bg-[#04AA6D] text-white rounded-lg shadow-md hover:bg-[#04AA6D] text-sm md:text-base lg:text-lg transition duration-300"
            onClick={handleWhatsappClick}
            aria-label="Request Free Rudraksha"
          >
            I Want Free Rudraksha
          </button>

          <button
            className="w-full md:w-auto px-4 py-2 bg-[#008CBA] text-white rounded-lg shadow-md hover:bg-[#008CBA] text-sm md:text-base lg:text-lg transition duration-300"
            aria-label="Write To Us"
            onClick={handleWriteToUs}
          >
            Write To Us
          </button>

          {/* Uncomment below button if needed */}
          {/* <button
            className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 text-sm md:text-base lg:text-lg transition duration-300"
            aria-label="Chat With Us"
          >
           Ticket History
          </button> */}

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
                    placeholder="Write to us"
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
      </header>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-center mt-8 px-4">
        {/* Spiritual World Section */}
        <section className="spiritual-world text-center mx-4 mb-8 md:mb-0">
          <h2
            id="h2"
            className="font-bold text-xl sm:text-2xl md:text-3xl text-[#6A1B9A]"
          >
            Spiritual World
          </h2>
          <img
            src={Image1}
            alt="Spiritual World"
            className="world-image w-full sm:w-80 md:w-96 h-auto rounded-lg shadow-lg mt-4"
          />
        </section>

        {/* AI & Generative AI World Section */}
        <section className="ai-world text-center mx-4 mb-8 md:mb-0">
          <h2
            id="h2"
            className="font-bold text-xl sm:text-2xl md:text-3xl text-[#6A1B9A]"
          >
            AI & Generative AI World
          </h2>
          <img
            src={Image2}
            alt="AI & Generative AI World"
            className="world-image w-full sm:w-80 md:w-96 h-auto rounded-lg shadow-lg mt-4"
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

     
      <Footer />
    </div>
  );
};

export default Freerudraksha;
