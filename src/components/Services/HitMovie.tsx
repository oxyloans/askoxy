import React, { useState, useEffect } from "react";
import Footer from "../Footer";
import { message, Modal } from "antd";

import Image1 from "../../assets/img/3ef05659-d79c-42e9-b3dc-ebc61b63f430.png";
import img1 from "../../assets/img/image1.png";
import img2 from "../../assets/img/image2.png";
import img3 from "../../assets/img/image3.png";
import img4 from "../../assets/img/image4.png";
import img5 from "../../assets/img/image5.png";
import img6 from "../../assets/img/image6.png";

const images = [
  { src: img1, alt: "Image 1" },
  { src: img2, alt: "Image 2" },
  { src: img5, alt: "Image 5" },
  { src: img6, alt: "Image 6" },
  { src: img3, alt: "Image 3" },
  { src: img4, alt: "Image 4" },
];

const HitMovie: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scriptId, setScriptId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

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

  const userid = localStorage.getItem("userId");

  useEffect(() => {
    if (userid) {
      const savedHasSubmitted = localStorage.getItem(`${userid}_hasSubmitted`);
      if (savedHasSubmitted === "true") {
        setHasSubmitted(true);
      }
    }
  }, [userid]);

  const handledscriptId = async () => {
    if (!scriptId.trim()) {
      message.error("Please enter a valid script ID to proceed.");
      return;
    }

    if (hasSubmitted) {
      message.info("You have already participated in the contest.");
      return;
    }

    const endpoint =
      "https://meta.oxyloans.com/api/auth-service/auth/rudhrakshaDistribution";
    const payload = { userId: userid, userScriptId: scriptId };

    try {
      setIsLoading(true);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setHasSubmitted(true);
        localStorage.setItem(`${userid}_hasSubmitted`, "true");
        setIsLoading(false);
        setShowConfirmationModal(false);

        Modal.success({
          title: "Success!",
          content:
            "Your submission was successful. Stay tuned for the announcement of the winners. Best of luck!",
          onOk: () => {
            setShowModal(false);
          },
          centered: true,
        });
      } else {
        const errorData = await response.json();
        message.error(
          errorData.message || "Failed to submit scriptId. Please try again."
        );
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handledscriptidmodel = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 flex justify-center">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-6 bg-white shadow-lg border-2 border-gray-200 rounded-lg max-w-7xl w-full">
          {/* Left: Image */}
          <div className="w-full md:w-2/5 flex justify-center md:justify-start p-2">
            <img
              src={Image1}
              alt="Spiritual World"
              className="w-full max-w-md h-auto object-contain"
            />
          </div>

          {/* Right: Heading and Text */}
          <div className="w-full md:w-3/5 flex flex-col justify-between gap-3 md:gap-4 px-2 md:px-4 text-left">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-700 mb-2 md:mb-3">
                Pushpa 2 GPT: Let AI Write the Story, Win 2 Tickets!
              </h1>
              <p className="text-gray-600 text-sm md:text-base mb-2 md:mb-3">
                Predict Pushpa's final story in 5 steps or prompts, starting
                with a given choice. Uncover his motives: power, redemption, or
                protection. Choose his path—don, reformer, or mystery. Define
                allies and enemies, add suspense with betrayal or sacrifice, &
                decide his legacy: hero or legend. Start Now!!
              </p>
              <div className="text-gray-500 text-sm md:text-md">
                <strong>Details:</strong>
                <p className="mt-1">
                  You will be redirected to Pushpa 2 GPT, customized using
                  ChatGPT. Click on
                  <a
                    href="https://chatgpt.com/g/g-67329e4fa1808190a9f3673eec58adf8-pushpa-2-gpt-let-ai-write-story-win-2-tickets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-800 font-bold text-sm md:text-base py-1 px-2 md:px-3 transition-colors inline-block mx-1"
                    aria-label="Start the process"
                  >
                    <strong className="text-base md:text-lg lg:text-xl">
                      Start Now!
                    </strong>
                  </a>
                  to begin the process.
                </p>
                <p className="mt-2">
                  <strong>Exciting rewards await participants:</strong>
                  <br />
                  Only 100 lucky winners will be selected, and each winner will
                  receive 2 movie tickets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Script ID Button */}
      <div className="flex flex-col items-center justify-center my-6 md:my-8">
        <button
          onClick={handledscriptidmodel}
          className="w-40 md:w-48 h-10 md:h-12 text-sm md:text-base font-bold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-md"
        >
          Publish Your Script ID
        </button>
      </div>

      {/* Company Header */}
      <h1 className="text-center mx-4 my-8 md:my-12 text-2xl md:text-4xl lg:text-5xl font-bold">
        <span className="text-green-600">
          <span className="text-[#0a6fba]">Oxy</span>Group
        </span>{" "}
        <span className="text-[#FFA500]">Companies</span>
      </h1>

      {/* Company Cards */}
      <div className="px-4 md:px-6 lg:px-8">
        {/* Oxyloans Card */}
        <div className="event-container1 mb-6 md:mb-8">
          <div className="event-content1 border-2 rounded-lg p-4 md:p-6 shadow-md">
            <div className="diwali-images1">
              <div className="image-container1 flex justify-center">
                <img
                  src={img1}
                  alt="Oxyloans"
                  className="w-full max-w-xs md:max-w-sm h-auto object-contain"
                />
              </div>
            </div>
            <div className="event-details px-2 md:px-4">
              <h1
                className="diwali-title1 text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3"
                style={{ color: "#0a6fba" }}
              >
                Lend & Earn 1.5% - 2.5% Monthly RoI
              </h1>
              <h3 className="diwali-subtitle1 text-sm md:text-base mb-2 md:mb-3">
                OxyLoans.com is an RBI-approved P2P NBFC, a revolutionary
                fintech platform. We onboard tax-paying Individuals, and HNIs as
                Lenders. We enable lenders/investors to exchange funds directly
                with borrowers. Our proprietary algorithms include credit
                scoring, underwriting, and loan agreement preparation.
              </h3>
              <h3 className="diwali-subtitle1 text-sm md:text-base font-bold mb-3 md:mb-4">
                ₹1000000000+ <b>DISBURSAL</b> <br />
                30000+ <b>LENDERS</b> <br />
                270000+ <b>BORROWERS</b>
              </h3>
              <div className="flex justify-center md:justify-start mt-3 md:mt-4">
                <a
                  href="https://oxyloans.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-[#0a6fba] text-white px-4 md:px-6 py-2 md:py-3 rounded-md hover:bg-blue-700 transition-all text-sm md:text-base font-medium">
                    Start Lending
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Oxybricks Card */}
        <div className="event-container1 mb-6 md:mb-8">
          <div
            className="event-content1 border-2 rounded-lg p-4 md:p-6 shadow-md"
            style={{ borderColor: "#c26c27" }}
          >
            <div className="diwali-images1">
              <div className="image-container1 flex justify-center">
                <img
                  src={img2}
                  alt="Oxybricks"
                  className="w-full max-w-xs md:max-w-sm h-auto object-contain"
                />
              </div>
            </div>
            <div className="event-details px-2 md:px-4">
              <h1
                className="diwali-title1 text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3"
                style={{ color: "#c26c27" }}
              >
                Fractional Investments in Lands & Buildings
              </h1>
              <h3 className="diwali-subtitle1 text-sm md:text-base mb-4 md:mb-6">
                OXYBRICKS is the first Blockchain platform that enables
                fractional investment in lands & buildings: a Blockchain tech
                platform that allows principal guarantee, monthly earnings, and
                property appreciation.
              </h3>
              <div className="flex justify-center md:justify-start mt-3 md:mt-4">
                <a
                  href="https://oxybricks.world/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="px-4 md:px-6 py-2 md:py-3 rounded-md text-white hover:opacity-90 transition-all text-sm md:text-base font-medium"
                    style={{ backgroundColor: "#c26c27" }}
                  >
                    Know More
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* eRice Card */}
        <div className="event-container1 mb-6 md:mb-8">
          <div
            className="event-content1 border-2 rounded-lg p-4 md:p-6 shadow-md"
            style={{ borderColor: "#05a446" }}
          >
            <div className="diwali-images1">
              <div className="image-container1 flex justify-center">
                <img
                  src={img6}
                  alt="eRice"
                  className="w-full max-w-xs md:max-w-sm h-auto object-contain"
                />
              </div>
            </div>
            <div className="event-details px-2 md:px-4 text-center">
              <h1
                className="diwali-title1 text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3"
                style={{ color: "#05a446" }}
              >
                Order . Rice . Online
              </h1>
              <h3 className="diwali-subtitle1 text-sm md:text-base font-bold mb-2 md:mb-3">
                Free Delivery | All Over Hyderabad
              </h3>
              <h3 className="diwali-subtitle1 text-sm md:text-base mb-2 md:mb-3">
                All types of rice brands available: Sri Lalitha, Kurnool, RRI,
                Cow brand, Sree Maateja, Kolam Rice, Surya Teja's Brand, Gajraj
                Evergreen, Shubodayam, 5 Star, JSR
              </h3>
              <h3 className="diwali-subtitle1 text-sm md:text-base font-bold mb-3 md:mb-4">
                Return & Exchange Guarantee | Available Now: Steamed & Raw Rice
              </h3>
              <div className="flex justify-center mt-3 md:mt-4">
                <a
                  href="https://erice.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="px-4 md:px-6 py-2 md:py-3 rounded-md text-white hover:opacity-90 transition-all text-sm md:text-base font-medium"
                    style={{ backgroundColor: "#05a446" }}
                  >
                    Order Rice
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BMV Money Card */}
        <div className="event-container1 mb-6 md:mb-8">
          <div
            className="event-content1 border-2 rounded-lg p-4 md:p-6 shadow-md"
            style={{ borderColor: "#583e99" }}
          >
            <div className="diwali-images1">
              <div className="image-container1 flex justify-center">
                <img
                  src={img4}
                  alt="BMV Money"
                  className="w-full max-w-xs md:max-w-sm h-auto object-contain"
                />
              </div>
            </div>
            <div className="event-details px-2 md:px-4">
              <h1
                className="diwali-title1 text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3"
                style={{ color: "#583e99" }}
              >
                All your ideas at one place
              </h1>
              <h3 className="diwali-subtitle1 text-sm md:text-base mb-4 md:mb-6">
                BMV.Money is a Bridgital Marketplace connecting stakeholders in
                global immigration services, property management, machinery
                purchases, startup mentoring, and job orientation programs.
              </h3>
              <div className="flex justify-center md:justify-start mt-3 md:mt-4">
                <a
                  href="https://bmv.money/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="px-4 md:px-6 py-2 md:py-3 rounded-md text-white hover:opacity-90 transition-all text-sm md:text-base font-medium"
                    style={{ backgroundColor: "#583e99" }}
                  >
                    Know More
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Xpert Homes Card */}
        <div className="event-container1 mb-6 md:mb-8">
          <div
            className="event-content1 border-2 rounded-lg p-4 md:p-6 shadow-md"
            style={{ borderColor: "#189c9e" }}
          >
            <div className="diwali-images1">
              <div className="image-container1 flex justify-center">
                <img
                  src={img5}
                  alt="Xpert Homes"
                  className="w-full max-w-xs md:max-w-sm h-auto object-contain"
                />
              </div>
            </div>
            <div className="event-details px-2 md:px-4">
              <h1
                className="diwali-title1 text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3"
                style={{ color: "#189c9e" }}
              >
                Find your dream home
              </h1>
              <h3 className="diwali-subtitle1 text-sm md:text-base mb-4 md:mb-6">
                XPERT HOMES is a leading property management company offering
                transparent, high-quality services. We help property owners
                maximize ROI and find verified tenants through our comprehensive
                360° management solutions.
              </h3>
              <div className="flex justify-center md:justify-start mt-3 md:mt-4">
                <a
                  href="https://xperthomes.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="px-4 md:px-6 py-2 md:py-3 rounded-md text-white hover:opacity-90 transition-all text-sm md:text-base font-medium"
                    style={{ backgroundColor: "#189c9e" }}
                  >
                    Know More
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Group Section */}
      <div className="px-4 md:px-8 py-6 md:py-10 bg-[#f1f1f1] rounded-md mx-4 md:mx-6 lg:mx-8 mb-8">
        <h1 className="text-center my-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
          <span className="text-[#0a6fba]">Oxy</span>
          <span className="text-green-600">Group</span>{" "}
          <span className="text-[#FFA500]">Companies</span>
        </h1>

        {/* Image Carousel */}
        <div className="relative w-full max-w-[700px] mx-auto overflow-hidden my-6">
          <button
            className="absolute z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xl md:text-2xl transform -translate-y-1/2 bg-blue-600 text-white rounded-full left-2 top-1/2 hover:bg-blue-700"
            onClick={handlePrev}
            aria-label="Previous image"
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
                  className="w-full h-auto object-contain"
                />
              </div>
            ))}
          </div>
          <button
            className="absolute z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xl md:text-2xl transform -translate-y-1/2 bg-blue-600 text-white rounded-full right-2 top-1/2 hover:bg-blue-700"
            onClick={handleNext}
            aria-label="Next image"
          >
            →
          </button>
        </div>
      </div>

      {/* Script ID Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 px-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
              Submit Script ID
            </h3>
            <label className="block mb-4 text-sm font-medium text-black">
              Enter Your Script ID:
              <input
                type="text"
                value={scriptId}
                onChange={(e) => setScriptId(e.target.value)}
                placeholder="Enter your script ID"
                className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </label>

            {/* Action Buttons */}
            <div className="flex justify-between gap-3 mt-4">
              <button
                className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all text-sm md:text-base"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className={`flex-1 px-3 py-2 text-white rounded-md text-sm md:text-base ${
                  isLoading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } transition-all`}
                onClick={handledscriptId}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 px-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
            <h3 className="text-lg md:text-xl font-bold text-green-700 mb-2">
              Success!
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Your script ID has been successfully submitted. Winners will be
              announced soon. Good luck!
            </p>
            <div className="mt-4 text-center">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm md:text-base"
                onClick={() => setShowConfirmationModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HitMovie;
