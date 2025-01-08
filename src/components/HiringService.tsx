import React, { useState,useEffect } from "react";
import { Modal, Input, Button, Typography, message } from "antd";
import axios from "axios";
import img1 from "../assets/img/image1.png";
import img2 from "../assets/img/image2.png";
import img3 from "../assets/img/image3.png";
import img4 from "../assets/img/image4.png";
import img5 from "../assets/img/image5.png";
import img6 from "../assets/img/image6.png";
import { useNavigate } from "react-router-dom";
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


    const [issuccessOpen, setSuccessOpen] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
  
    
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

  const [formData, setFormData] = useState({
    askOxyOfers: "WEAREHIRING",
    id: userId,
    mobileNumber: "",
    projectType: "ASKOXY",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

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

   

    message.success("Your interest has been submitted successfully!");
    setIsModalOpen(false); // Close modal on success
  } catch (error: any) {
    
    if (error.response && error.response.status === 400) {
      // Handle duplicate participation error
      message.warning("You have already participated. Thank you!");
    } else {
      console.error("API Error:", error);
      message.error("Failed to submit your interest. Please try again.");
    }
  }
};



  const email = localStorage.getItem("email");
  const mobileNumber = localStorage.getItem("whatsappNumber");

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

  useEffect(() => {
    if (issuccessOpen) {
      const timer = setTimeout(() => {
        setSuccessOpen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [issuccessOpen]);
  const handleWriteToUsSubmitButton = async () => {
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


  return (
    <>
      <header>
        {/* Buttons on the right */}
        <div className="flex flex-col md:flex-row justify-center md:justify-end gap-4 items-center px-4 md:px-6 lg:px-8">
          {/* Button: I'm Interested */}

          {/* Button: Write To Us */}
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all text-sm md:text-base lg:text-lg"
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
                    placeholder="Write to us"
                    style={{ fontSize: "0.8rem" }}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <button
                  className="mt-3 w-full text-lg font-semibold rounded-lg px-4 py-2 text-[#3d2a71] bg-[#f9b91a] hover:bg-[#e0a019] transition-colors"
                  onClick={handleWriteToUsSubmitButton}
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {isprofileOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl text-[#3d2a71] font-bold">
                    Alert...!
                  </h2>
                  <button
                    className="font-bold text-3xl text-red-500 hover:text-red-900"
                    onClick={() => setIsprofileOpen(false)}
                  >
                    &times;
                  </button>
                </div>
                <p className="mb-2 text-black ">
                  Please fill your profile details.
                </p>
                <div className="flex justify-end">
                  <button
                    className="bg-[#f9b91a] text-white px-3 py-1 rounded "
                    onClick={handlePopUOk}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}

          {issuccessOpen && (
            <div className="fixed top-18 right-4 z-50">
              <div className="w-[200] h-[400] bg-white text-green-500 p-4 rounded shadow-lg transition-opacity duration-500 ease-in-out">
                Query submitted successfully...!
              </div>
            </div>
          )}
        </div>
      </header>
      <div className="bg-gradient-to-r  from-gray-50  min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 lg:px-12 py-16 bg-white rounded-2xl shadow-2xl">
          <div className="text-center mb-12 px-4 sm:px-6 md:px-8">
            <Title level={2}>
              Digital <span className="text-blue-400">Ambassadors</span>
            </Title>
            <Paragraph>
              Join Our Dynamic Team and Embark on a Digital Journey!
            </Paragraph>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <Title level={3} className="text-blue-500">
                  Role Overview
                </Title>
                <Paragraph>
                  As a Digital Ambassador, you will play a pivotal role in
                  driving the digital transformation of our platforms, including
                  our Study Abroad Platform and others powered by Askoxy.ai.
                </Paragraph>
              </div>
              <div>
                <Title level={3} className="text-blue-500">
                  What You'll Do
                </Title>
                <ul className="list-disc list-inside text-black">
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
                <Title level={3} className="text-blue-500">
                  Requirements
                </Title>
                <ul className="list-disc list-inside text-black">
                  <li>Bring your own laptop to take on this exciting role.</li>
                  <li>Passion for content creation and customer engagement.</li>
                </ul>
              </div>
              <div>
                <Title level={3} className="text-blue-500">
                  Why Join Us?
                </Title>
                <ul className="list-disc list-inside text-black">
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

          <div className="flex justify-center mt-16">
            <Button
              type="primary"
              size="large"
              className="rounded-lg"
              onClick={() => setIsModalOpen(true)}
            >
              Join Us Now
            </Button>
          </div>
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
        <Footer />
      </div>
    </>
  );
};

export default HiringService;
