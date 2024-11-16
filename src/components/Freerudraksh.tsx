// import React,{useState} from "react";
// import "./Freerudraksha.css";
// import WhatsApp from "../assets/img/WhatsApp.jpeg";
// import WhatsApp2 from "../assets/img/WhatsApp2.jpeg";
// import Header1 from "./Header1";
// import Footer from "./Footer";
// import Header2 from "./Header2";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
// import  './DiwaliPage.css'
// import Modal from "./Modal";
// import img1 from "../assets/img/image1.png";
// import img2 from "../assets/img/image2.png";
// import img3 from "../assets/img/image3.png";
// import img4 from "../assets/img/image4.png";
// import img5 from "../assets/img/image5.png";
// import img6 from "../assets/img/image6.png";

// const images = [
//   { src: img1, alt: "Image 1" },
//   { src: img2, alt: "Image 2" },
//   { src: img5, alt: "Image 5" },
//   { src: img6, alt: "Image 6" },
//   { src: img3, alt: "Image 3" },
//   { src: img4, alt: "Image 4" },
// ];

// const Freerudraksha: React.FC = () => {

  // const [currentIndex, setCurrentIndex] = useState(0);

  // const handleNext = () => {
  //   if (currentIndex < images.length - 1) {
  //     setCurrentIndex(currentIndex + 1);
  //   }
  // };

  // const handlePrev = () => {
  //   if (currentIndex > 0) {
  //     setCurrentIndex(currentIndex - 1);
  //   }
  // };

  // const goToPrevious = () => {
  //   const isFirstImage = currentIndex === 0;
  //   const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
  //   setCurrentIndex(newIndex);
  // };

  // const goToNext = () => {
  //   const isLastImage = currentIndex === images.length - 1;
  //   const newIndex = isLastImage ? 0 : currentIndex + 1;
  //   setCurrentIndex(newIndex);
  // };

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState(''); // 'confirmation', 'addressEntry', 'success'
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [isPopupVisible, setIsPopupVisible] = useState(false);
//   const storedPhoneNumber = localStorage.getItem('whatsappNumber');
//   const userId = localStorage.getItem('userId') || '';

//   const handleWhatsappClick = () => {
//     if (storedPhoneNumber) {
//       setPhoneNumber(storedPhoneNumber);
//       setModalType('confirmation');
//       setIsModalOpen(true);
//     } else {
//       alert('Phone number is not available in local storage.');
//     }
//   };

//   const handleConfirm = () => {
//     setModalType('addressEntry');
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   const saveAddress = async () => {
//     if (!address.trim()) {
//       alert('Please enter an address.');
//       return;
//     }

//     const endpoint = 'https://meta.oxyloans.com/api/auth-service/auth/rudhrakshaDistribution';
//     const payload = { address, userId };

//     try {
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         alert('Address saved successfully!');
//         setModalType('success');
//         setIsPopupVisible(true);
//       } else {
//         const errorData = await response.json();
//         console.error('Error saving address:', errorData);
//         alert('Failed to save the address. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error saving address:', error);
//       alert('An error occurred. Please try again.');
//     }
//   };

//   const submitRequest = async (deliveryType: string) => {
//     const endpoint = 'https://meta.oxyloans.com/api/auth-service/auth/rudhrakshaDistribution';
//     const payload = { userId, deliveryType };

//     try {
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         alert('Request submitted successfully!');
//       } else {
//         const errorData = await response.json();
//         console.error('Error submitting request:', errorData);
//         alert('Failed to submit the request. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error submitting request:', error);
//       alert('An error occurred. Please try again.');
//     }

//     // Reset state
//     setIsPopupVisible(false);
//     setAddress('');
//     setIsModalOpen(false);
//   };

//   return (
//     <div>
     
      
//       <div className="main-container">
//       <header className="header text-center">
//         <h1 style={{ color: "rgba(91, 5, 213, 0.85)" }}>The Two Worlds</h1>
//       </header>

//       {/* Main Content */}
//       <div className="worlds flex justify-center mt-8">
//         <section className="spiritual-world text-center mx-4">
//           <h2>Spiritual World</h2>
//           <img src={WhatsApp} alt="Spiritual World" className="world-image" />
//         </section>
//         <section className="ai-world text-center mx-4">
//           <h2>AI & Generative AI World</h2>
//           <img src={WhatsApp2} alt="AI World" className="world-image" />
//         </section>
//       </div>

//       {/* Details Section */}
//       <div className="details">
//             <p>
//               <strong>1 crore Rudra Abhishekam:</strong> After the Abhishekam,
//               Rudraksha will be distributed for free.
//             </p>
//             <p>
//             Every home will receive free training in AI and Generative AI,
//               enabling a continuous income stream.
//             </p>
//           </div>
          // <div className="details">
          //   <p>
          //     <strong>
          //       రెండు లోకాలు ఆధ్యాత్మిక లోకం ఎఐ & జనరేటివ్ ఎఐ లోకం కోటి
          //       రుద్రాభిషేకం.
          //     </strong>{" "}
          //     అభిషేకం తర్వాత రుద్రాక్షలను ఉచితంగా పంచబడతాయి.
          //   </p>
          //   <p>
          //     ప్రతి ఇంటికి ఎఐ మరియు జనరేటివ్ ఎఐలో ఉచిత శిక్షణ అందించబడుతుంది,
          //     దీని ద్వారా నిరంతర ఆదాయం సాధించగలరు.
          //   </p>
          // </div>

//       {/* Button Section */}
//            <div className="buttons flex justify-center mt-8">
       
//   {/* Address Input */}
  

//   {/* Save Address Button */}
//   <div className="flex flex-col items-center justify-center">
//   {/* Free Rudraksha Button */}
//   <button
//     className="w-52 h-12 text-lg font-bold bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
//     onClick={handleWhatsappClick} // Trigger saving address on button click
//   >
//     Free Rudraksha
//   </button>

//   {/* Confirmation Modal */}
//   {isModalOpen && modalType === 'confirmation' && (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-md">
//         <p className="text-lg text-center mb-4">
//           Please confirm your WhatsApp mobile number: <span className="font-bold">{phoneNumber}</span>
//         </p>
//         <div className="flex gap-4 justify-center">
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
//             onClick={handleConfirm}
//           >
//             Yes
//           </button>
//           <button
//             className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
//             onClick={handleCancel}
//           >
//             No
//           </button>
//         </div>
//       </div>
//     </div>
//   )}

//   {/* Address Entry Modal */}
//   {isModalOpen && modalType === 'addressEntry' && (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-md">
//         <p className="text-lg text-center mb-4">Enter your address:</p>
//         <input
//           type="text"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           placeholder="Enter address"
//           className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
//           onClick={saveAddress}
//         >
//           Save Address
//         </button>
//       </div>
//     </div>
//   )}

//   {/* Delivery Options Modal */}
//   {isPopupVisible && (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-md">
//         <p className="text-lg text-center mb-4">
//           Address saved successfully! Choose a delivery method:
//         </p>
//         <div className="flex flex-col gap-4">
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
//             onClick={() => submitRequest('Home Delivery')}
//           >
//             Home Delivery
//           </button>
//           <button
//             className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all"
//             onClick={() => submitRequest('Pick Up In Office')}
//           >
//             Pick Up In Office
//           </button>
//         </div>
//       </div>
//     </div>
//   )}
// </div>





      
    
//       <Footer />
//     </div>

//   );
// };

// export default Freerudraksha;





import React, { useState } from "react";
import "./Freerudraksha.css";
import "./DiwaliPage.css";
import WhatsApp from "../assets/img/WhatsApp.jpeg";
import WhatsApp2 from "../assets/img/WhatsApp2.jpeg";
import Footer from "./Footer";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

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

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }; const [phoneNumber, setPhoneNumber] = useState<string>("");
  
  const [address, setAddress] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
  const storedPhoneNumber = localStorage.getItem("whatsappNumber");
  const userId = localStorage.getItem("userId"); // Fetch user ID from storage if needed.

  const handleWhatsappClick = () => {
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
      setModalType("confirmation");
      setIsModalOpen(true);
    } else {
      message.error("Phone number is not available in local storage.");
    }
  };

  const handleConfirm = () => setModalType("addressEntry");

  const handleCancel = () => setIsModalOpen(false);

  const saveAddress = async () => {
    if (!address.trim()) {
      message.error("Please enter an address.");
      return;
    }

    const endpoint = "https://meta.oxyloans.com/api/auth-service/auth/rudhrakshaDistribution";
    const payload = { address, userId };

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
        message.success("Address saved successfully!");
        setModalType("success");
        setIsPopupVisible(true);
      } else {
        const errorData = await response.json();
        console.error("Error saving address:", errorData);
        message.error("Failed to save the address. Please try again.");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  const submitRequest = async (deliveryType: string) => {
    const endpoint = "https://meta.oxyloans.com/api/auth-service/auth/rudhrakshaDistribution";
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
        message.success("Request submitted successfully!");
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
  return (
    <div>
      <header className="header text-center">
        <h1 style={{ color: "rgba(91, 5, 200, 0.85)" }}><strong>The Two Worlds</strong></h1>
      </header>

      {/* Main Content */}
      <div className="worlds flex justify-center mt-8">
        <section className="spiritual-world text-center mx-4">
          <h2 id="h2">Spiritual World</h2>
          <img src={WhatsApp} alt="Spiritual World" className="world-image" />
        </section>
        <section className="ai-world text-center mx-4">
          <h2 id="h2">AI & Generative AI World</h2>
          <img src={WhatsApp2} alt="AI World" className="world-image" />
        </section>
      </div>

      {/* Details Section */}
      <div className="details">
  <p>
    <strong>Join us on the 19th for the grand 1 Crore Rudra Abhishekam</strong>, 
    a divine ceremony followed by the distribution of blessed Rudrakshas. This event 
    will bring spiritual awakening to every home.
  </p>
  
  <p>
    Alongside, we’re offering <strong>free training in Artificial Intelligence and Generative AI</strong> 
    to empower every household with the skills for sustainable income and prosperity.
  </p>
</div>

<div className="details">
  <p>
    <strong>19న, కోటి రుద్రాభిషేకం మహోత్సవం</strong> మరియు 
    రుద్రాక్షాల ఉచిత పంపిణీతో ఆధ్యాత్మిక శక్తిని ప్రతి ఇంటికి అందిస్తాము.
  </p>
  <p>
    అదనంగా, <strong>ఎఐ మరియు జనరేటివ్ ఎఐలో ఉచిత శిక్షణ</strong> 
     అందించి ప్రతి ఇంటినీ శాశ్వత ఆదాయ అవకాశాల ద్వారా శక్తివంతం చేస్తున్నాము.
  </p>
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-md">
            {modalType === "confirmation" && (
              <>
                <p className="text-lg text-center text-black mb-4">
                  Please confirm your WhatsApp mobile number:{" "}
                  <span className="font-bold">{phoneNumber}</span>
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                    onClick={handleConfirm}
                  >
                    Yes
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
                    onClick={handleCancel}
                  >
                    No
                  </button>
                </div>
              </>
            )}

            {modalType === "addressEntry" && (
              <>
                <p className="text-lg text-center text-black mb-4">Enter your address:</p>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address"
                  className="w-full p-2 mb-4 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {isConfirmVisible ? (
                  <>
                    <p className="text-lg text-center text-black mb-4">Is this your correct address?</p>
                    <p className="text-center text-gray-600 mb-4">{address}</p>
                    <div className="flex justify-between gap-4">
                      <button
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
                        onClick={saveAddress}
                      >
                        Yes
                      </button>
                      <button
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
                        onClick={() => setIsConfirmVisible(false)}
                      >
                        No
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                    onClick={() => setIsConfirmVisible(true)}
                  >
                    Confirm Address
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

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
                onClick={() => submitRequest("PickInOffice")}
              >
                Pick Up In Office
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-md flex justify-center items-center">
            <div className="loader"></div>
            <p className="text-lg text-black ml-4">Processing your request...</p>
          </div>
        </div>
      )}

<div>
        <h1 style={{ textAlign: "center", margin: "50px", fontSize: "50px" }}>
          <b style={{ color: "green" }}>
            <span style={{ color: "#0a6fba" }}>Oxy</span>Group
          </b>{" "}
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
      <h1 className="diwali-title1 text-2xl md:text-3xl font-bold" style={{ color: "#05a446" }}>
        Order . Rice . Online
      </h1>
      <h3 className="diwali-subtitle1 font-bold my-4">
        Free Delivery | All Over Hyderabad
      </h3>
      <h3 className="diwali-subtitle1 my-4">
        All types of rice brands available: Sri Lalitha, Kurnool, RRI, Cow
        brand, Sree Maateja, Kolam Rice, Surya Teja’s Brand, Gajraj Evergreen,
        Shubodayam, 5 Star, JSR
      </h3>
      <h3 className="diwali-subtitle1 font-bold my-4">
        Return & Exchange Guarantee | Available Now: Steamed & Raw Rice
      </h3>

      <div className="buttons mt-6">
        <a href="https://erice.in/" target="_blank" rel="noopener noreferrer">
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
        <h1 style={{ textAlign: "center", margin: "10px", fontSize: "50px" }}>
          <b style={{ color: "green" }}>
            <span style={{ color: "#0a6fba" }}>Oxy</span>Group
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

export default Freerudraksha;
