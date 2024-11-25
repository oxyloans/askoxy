import React,{useState,useEffect} from "react";
import "./Freerudraksha.css";
import WhatsApp from "../assets/img/WhatsApp.jpeg";
import WhatsApp2 from "../assets/img/WhatsApp2.jpeg";
import Header1 from "./Header1";
import VanabhojanamImage from '../assets/img/WhatsApp Image 2024-11-25 at 10.38.19.png'
import Footer from "./Footer";
import Header2 from "./Header2";
import  './DiwaliPage.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import axios from "axios";

import img1 from "../assets/img/image1.png";
import img2 from "../assets/img/image2.png";
import img3 from "../assets/img/image3.png";
import img4 from "../assets/img/image4.png";
import img5 from "../assets/img/image5.png";
import img6 from "../assets/img/image6.png";
import { Modal, Button, Input,message } from "antd";
const images = [
  { src: img1, alt: "Image 1" },
  { src: img2, alt: "Image 2" },
  { src: img5, alt: "Image 5" },
  { src: img6, alt: "Image 6" },
  { src: img3, alt: "Image 3" },
  { src: img4, alt: "Image 4" },
];
interface ConfirmationDetails {
  phoneNumber: string;
  familyCount: number;
  transportation:string;
  name:string;
}
const Vanabhojanam: React.FC = () => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [familyCount, setFamilyCount] = useState(0); 
  const [transportation, setTransportation] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [hasParticipated, setHasParticipated] = useState(false); 
  const [storedPhoneNumber, setStoredPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");

  const [confirmationDetails, setConfirmationDetails] = useState<ConfirmationDetails>({
    phoneNumber: "",
    familyCount: 0,
    transportation:"",
    name:""
  });
const [showConfirmationModal, setShowConfirmationModal] = useState(false);


  useEffect(() => {
    const phoneNumber = localStorage.getItem("whatsappNumber"); // Get the phone number from localStorage
    if (phoneNumber) {
      setStoredPhoneNumber(phoneNumber); // Set the state with the phone number if available
    }
  }, []);


  // Update localStorage and state when the phone number changes
  const handlePhoneNumberChange = (newPhoneNumber: string) => {
    localStorage.setItem("whatsappNumber", newPhoneNumber); // Store in localStorage
    setStoredPhoneNumber(newPhoneNumber); // Update the state to trigger a re-render
  };
  const userId = localStorage.getItem("userId");
  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

   // Effect to check participation status when the component mounts
  //  useEffect(() => {
  //   if (userId) {
  //     const participated = localStorage.getItem(`hasParticipated_${userId}`) === "true";
  //     setHasParticipated(participated); 
  //   }
  // }, [userId]);
  const [isClicked, setIsClicked] = useState(false);

  
    // Add your confirmation logic here
  // Hide the button after it's clicked

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };




  const handleWhatsappClick = () => {
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
      setModalType("confirmation");
      setIsModalOpen(true);
    } 
  };
  const handleParticipationClick = () => {
   

    setShowModal(true); // Open the modal if not participated
  };
  
  const handleSubmit = () => {
    setLoading(true);
    setMessage("");
  
    // Set the details for confirmation modal before displaying it
    setConfirmationDetails({
      name: name,
      phoneNumber: storedPhoneNumber,
      familyCount: familyCount,
      transportation:transportation
    });
  
    // Show the confirmation modal with entered details
    setShowConfirmationModal(true);
    setShowModal(false); // Close the input modal after submission
  };

  const handleConfirm = async () => {
    setLoading(true);
    setMessage(""); // Clear any previous message
  
    try {
      // Make both requests concurrently using Promise.all
      await Promise.all([
        axios.post(
          "https://meta.oxyloans.com/api/auth-service/auth/rudhrakshaDistribution",
          {
            userId: userId,
            trvellType: transportation,
            familyCount,
          }
        ),
        axios.patch(
          "https://meta.oxyloans.com/api/student-service/user/profile/update",
          {
            userId: userId, // Example of data to send
            firstName: name, // Assuming you have a name field
            // Add other fields as necessary
          }
        ),
      ]);
  
      // If both requests succeed, show success message
      setMessage("Submitted successfully!");
      
  
      // Optional: Automatically close modals after a success message
      setTimeout(() => {
        setShowConfirmationModal(false); // Close the confirmation modal
        setShowModal(false); // Close the input modal if necessary
      }, 50); // Close after 2 seconds
  
    } catch (error) {
      console.error("Error during submission:", error);
      setMessage("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
  
    // Remove any characters that are not letters or spaces
    input = input.replace(/[^A-Za-z\s]/g, '');
  
    // Update the name state with the filtered input
    setName(input);
  
    // Validate the input
    if (!input) {
      setErrorMessage("Name is required.");
    } else if (input.length < 2) {
      setErrorMessage("Name must be at least 2 characters long.");
    } else {
      setErrorMessage(""); // Clear the error if the input is valid
    }
  };
  
  

  return (
    <div>
      
   <div className="main-container">
 <div className="container mx-auto p-2 max-w-screen-xl">
  {/* Header */}
  <header className="text-center py-4">
  <h5 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-green-700 text-center">
  VANABHOJANAM
</h5>

</header>

  {/* Main Content */}
  <div className="worlds my-8">
    <section className="spiritual-world flex justify-center">
      <img
        src={VanabhojanamImage}
        alt="Urban spring santo"
        className="world-image rounded-xl shadow-xl w-full sm:w-3/4 lg:w-2/3"
      />
    </section>
  </div>

  {/* Details Section */}
  <div className="details space-y-6 mt-8">
  <p>
  <strong>Join us for a Vana Bhojanam at Urban Springs, Nawabpet, on Saturday, November 30th, 2024!</strong> 
  <strong>Enjoy a fun-filled day</strong> with a bus ride from Miyapur Metro, <strong>snacks, games, a cricket league, a delicious vegetarian lunch,</strong> and <strong>entertainment,</strong> including visits to <strong>Urban Santo and Urban Groove.</strong> 
  <strong>This exciting event is brought to you by ASKOXY.AI and OXY Group Companies!</strong>
</p>

  </div>

  {/* Details Section in Telugu */}
  <div className="details space-y-2 mt-4">
  <p>
  <strong>అర్బన్ స్ప్రింగ్స్, నవాబుపేటలో నవంబర్ 30, 2024, శనివారం నాడు వనభోజనానికి మాతో చేరండి!</strong> 
  <strong>మియాపూర్ మెట్రో నుండి బస్ రైడ్, తినుబండారాలు, ఆటలు, క్రికెట్ లీగ్, రుచికరమైన శాకాహార భోజనం మరియు </strong>
  <strong>వినోదంతో కూడిన అర్బన్ సాంటో మరియు  అర్బన్ గ్రూవ్ సందర్శనలతో ఆనందభరితమైన రోజును ఆస్వాదించండి.</strong> 
  <strong>ఈ ఆహ్లాదకరమైన కార్యక్రమాన్ని ASKOXY.AI మరియు OXY గ్రూప్ కంపెనీలు మీ కోసం అందిస్తున్నాయి!</strong>
</p>

  </div>
  <div className="flex justify-center mt-8">
        <button
          className="w-52 h-12 text-lg font-bold bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
          onClick={handleParticipationClick}
          aria-label="Request Free Rudraksha"
        >
       Confirm Participation
        </button>
</div>
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md mx-4 sm:mx-auto">
      <p className="text-lg text-center text-black mb-4">
        Your WhatsApp number:
        <span className="font-bold block mt-2">{storedPhoneNumber}</span>
      </p>

        {/* Add Name Input */}
        <label className="block mb-4 text-sm font-medium text-black">
        Enter Your Name:
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter your Name"
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
        />
      </label>
      {errorMessage && (
        <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
      )}
      <h2 className="text-lg font-bold mb-4 text-black text-center">
        We’re excited to have your loved ones join us! <br />
        How many family members or friends will accompany you?
      </h2>
      <label className="block mb-4 text-sm font-medium text-black">
  Total family members or friends:
  <input
    type="text" // Keep type as "text" to handle non-numeric input filtering
    value={familyCount}
    onChange={(e) => {
      const value = e.target.value;

      // Allow only numbers and ensure value is between 1 and 100
      if (/^\d*$/.test(value)) { // /^\d*$/ means only allow digits (no other characters)
        const numValue = Number(value);
        if (numValue < 1) {
          setMessage("Please enter a value between 1 and 100.");
          setFamilyCount(0);
        } else if (numValue > 100) {
          setMessage("Please enter a value between 1 and 100.");
          setFamilyCount(100);
        } else {
          setMessage("");
          setFamilyCount(numValue);
        }
      }
    }}
    onKeyDown={(e) => {
      // Allow only numeric input or backspace key (key code 8)
      if (!/\d/.test(e.key) && e.key !== 'Backspace') {
        e.preventDefault(); // Prevent non-numeric input (e.g. letters, symbols)
      }
    }}
    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
  />
</label>



      {/* Transportation Dropdown */}
      <label className="block mb-4 text-sm font-medium text-black">
        <strong>Would you prefer to use your own transportation or join us on our bus from Miyapur Metro for the VanaBhojanam event?</strong><br></br> Please let us know your choice!
        <select
          value={transportation}
          onChange={(e) => setTransportation(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
        >
          <option value="">Select Transportation</option>
          <option value="BUSTRANSPORT">Bus</option>
          <option value="OWNTRANSPORT">Own Transportation</option>
        </select>
      </label>

      {message && <p className="text-sm text-red-600 mb-4">{message}</p>}

      <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
        {/* Edit/Submit Button */}
        {!showConfirmationModal && (
          <button
            className={`px-4 py-2 text-white rounded-md ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} transition-all`}
            onClick={handleSubmit} // Submit action
            disabled={loading || familyCount <= 0 || !transportation || !name}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        )}

        {/* Button to Edit after confirmation */}
        {showConfirmationModal && confirmationDetails && (
          <button
            className="px-4 py-2 text-white rounded-md bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setShowConfirmationModal(false); // Close confirmation modal
              setShowModal(true); // Reopen input modal for editing
              setLoading(false)
            }}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  </div>
)}

{showConfirmationModal && confirmationDetails && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md mx-4 sm:mx-auto">
      <h2 className="text-lg font-bold mb-4 text-black text-center">
        Confirmation Details
      </h2>
      <p className="text-sm text-black mb-2">
        <strong>Name:</strong> {confirmationDetails.name}
      </p>
      <p className="text-sm text-black mb-2">
        <strong>WhatsApp Number:</strong> {confirmationDetails.phoneNumber}
      </p>
      <p className="text-sm text-black mb-2">
        <strong> Total family members or friends:</strong> {confirmationDetails.familyCount}
      </p>
      <p className="text-sm text-black mb-2">
        <strong>Transportation:</strong> {confirmationDetails.transportation === "BUSTRANSPORT" ? "Bus Transport" : "Own Transport"}
      </p>
      <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all"
          onClick={() => {
            setShowConfirmationModal(false); // Close confirmation modal
            setShowModal(true);
            setLoading(false); // Reopen input modal for editing
          }}
        >
          Edit
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
          onClick={handleConfirm} 
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}


      {/* Feedback Message */}
      {message && (
        <p className="mt-4 text-center text-lg font-medium text-green-700">
          {message}
        </p>
      )}
</div>

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

        <div className="event-container1">
          <div className="event-content1" style={{ borderColor: "#05a446" }}>
            <div className="diwali-images1">
              <div className="image-container1">
                <img src={img6} alt="Diwali Diyas" className="diwali-diya" />
              </div>
            </div>
            <div className="event-details">
              <h1 className="diwali-title1" style={{ color: "#05a446" }}>
                Order . Rice . Online
              </h1>
              <h3
                className="diwali-subtitle1"
                style={{
                  padding: "0px",
                  margin: "0px",
                  paddingBottom: "20px",
                  fontWeight: "bold",
                }}
              >
                Free Delivery | All Over Hyderabad
              </h3>
              <h3
                className="diwali-subtitle1"
                style={{ padding: "0px", margin: "0px", paddingBottom: "20px" }}
              >
                All type of rice brands available. Sri Lalitha, Kurnool, RRI,
                Cow brand, Sree Maateja, Kolam Rice, Surya Teja’s Brand, Gajraj
                Evergreen, Shubodayam, 5 Star, JSR
              </h3>
              <h3
                className="diwali-subtitle1"
                style={{
                  padding: "0px",
                  margin: "0px",
                  paddingBottom: "20px",
                  fontWeight: "bold",
                }}
              >
                Return & Exchange Guarantee | Available Now : Steamed & Raw Rice
              </h3>

              <div className="buttons">
                <a
                  href="https://erice.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="button demo"
                    style={{ backgroundColor: "#05a446" }}
                  >
                    order rice
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
        <div className="px-6 py-5 bg-[#f1f1f1] md:p-10">
        <h1 style={{ textAlign: "center", margin: "10px", fontSize: "50px" }}>
          <b style={{ color: "green" }}>
            <span style={{ color: "#0a6fba" }}>Oxy</span>Group
          </b>{" "}
          <span className="text-[#FFA500]">Companies</span>
        </h1>


  <div className="relative w-full max-w-[800px] mx-auto overflow-hidden">
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
      </div>
      <Footer />
    </div>
  );
};

export default Vanabhojanam;
