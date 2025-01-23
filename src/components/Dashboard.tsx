import React, { useEffect, useState, useRef } from "react";
import Image1 from "../assets/img/AD1 (1).jpg";
import Image2 from "../assets/img/AD2.jpg";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import HiringService from "./HiringService";

import "./erice.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import B1 from "../assets/img/B1.jpg";
import B2 from "../assets/img/B2.jpg";
import FR from "../assets/img/R1.png";
import FR1 from "../assets/img/R22.jpg";
import FR2 from "../assets/img/freesample.jpg";
import FR3 from "../assets/img/freeaiandgenai.png";
import FR4 from "../assets/img/machines.png";
import FR5 from "../assets/img/legail.jpg";
import LegalService from "./LegalService";
import FR6 from "../assets/img/wearehiring.png";
import Pushpa2GPT from "./Pushpa2GPT";
import { FaVolumeOff, FaVolumeUp, FaRegCopy, FaShareAlt } from "react-icons/fa";
import { error } from "console";
import ChatHistory from "./ChatHistory";
import { FaSignOutAlt } from "react-icons/fa";

import Example from "./Example";
import AuthorInfo from "./AuthorInfo";
import ModalComponent from "./ModalComponent";
import ProfileCallPage from "./models/ProfileCallPage";
import Freerudraksha from "./Freerudraksh";
import StudyAbroad from "./StudyAbroad";
import Vanabhojanam from "./Vanabhojanam";
import VanabhojanammImage from "../assets/img/vanabhojanam.png";
import Pushpa from "../assets/img/3ef05659-d79c-42e9-b3dc-ebc61b63f430.png";
import { FaUserCircle } from "react-icons/fa";
import FreeSample from "./FreeSample";
import FreeAiandGenAi from "./FreeAi&GenAi";
import MachinesManufacturingServices from "./Machines&ManufacturingService";
import MyRotaryServices from "./MyRotary";
import TicketHistory from "./TicketHistory";
interface ChatMessage {
  type: "question" | "answer";
  content: string;
}

interface ProfileData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  dob: string | null;
  address: string | null;
  city: string | null;
  pinCode: string | null;
  consent: string | null;
  message: string | null;
  organization: string | null;
  designation: string | null;
  educationDetailsModelList: null;
  state: string | null;
  country: string | null;
  nationality: string | null;
  emailVerified: boolean;
  panVerified: boolean | null;
  whatsappVerified: boolean | null;
  name: string | null;
  multiChainId: string | null;
  coinAllocated: number | null;
}

type ChatHistoryItem = {
  id: string;
  userQuations: string;
  ericeQueries: string | null;
};
const Dasboard = () => {
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);

  const [showSendButton, setShowSendButton] = useState(false);
  const [riceTopicsshow, setriceTopicsshow] = useState(true);
  const [showStaticBubbles, setShowStaticBubbles] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isReading, setIsReading] = useState(false);
  const histary = useNavigate();
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [profiledata, setprofiledata] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // New State for History
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on component mount

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const [chathistory, setChatHistory] = useState<ChatHistoryItem[]>([]);

  const [showFreerudraksha, setShowFreerudraksha] = useState(false);

  const [showStudyAbroad, setShowStudyAbroad] = useState(false);
  const [showFreeSample, setShowFreeSample] = useState(false);
  const [showFreeaiandgenai, setShowFreeaiandgenai] = useState(false);
  const [showMachinesManufacturing, setShowMachinesManufacturing] =
    useState(false);
  const [showMyRotaryService, setShowMyRotaryService] = useState(false);
  const [showLegalService, setShowLegalService] = useState(false);
  const [showHiringService, setShowHiringService] = useState(false);
  const [ticketHistory, setTicketHistory] = useState(false);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect viewport size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Define your mobile breakpoint here
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    const query = params.get("query");

    // Reset all states
    setShowFreerudraksha(false);
    setShowStudyAbroad(false);
    setShowHiringService(false);
    setShowFreeSample(false);
    setShowFreeaiandgenai(false);
    setShowMachinesManufacturing(false);
    setShowMyRotaryService(false);
    setShowLegalService(false);
    setTicketHistory(false);

    // Handle section navigation (don't store in history)
    if (section) {
      switch (section) {
        case "freerudraksha":
          setShowFreerudraksha(true);
          break;
        case "study-abroad":
          setShowStudyAbroad(true);
          break;
        case "free-sample":
          setShowFreeSample(true);
          break;
        case "free-ai-gen-ai":
          setShowFreeaiandgenai(true);
          break;
        case "machines-manufacturing":
          setShowMachinesManufacturing(true);
          break;
        case "my-rotary":
          setShowMyRotaryService(true);
          break;
        case "legal-service":
          setShowLegalService(true);
          break;
        case "we-are-hiring":
          setShowHiringService(true);
          break;
        case "tickethistory":
          setTicketHistory(true);
          break;
      }
      // Clear messages when switching sections
      setMessages([]);
      setShowStaticBubbles(true);
    }

    // Handle search query (store in history)
    if (query && !section) {
      setriceTopicsshow(false); // Hide rice topics when there's a query
      handleSend(query);
    }

    // Scroll logic
    if (isMobile) {
      componentRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      scrollableRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }

    // if (scrollableRef.current) {
    //   scrollableRef.current.scrollTo({ top: 0, behavior: "smooth" });
    // }
  }, [location.search, isMobile]);

const handleFreerudrakshaClick = () => {
  navigate("/dashboard?section=freerudraksha", { replace: true });

  window.scrollTo({ top: 0, behavior: "smooth" });

  // Force a reflow and then scroll
  setTimeout(() => {
    if (isMobile) {
      componentRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      scrollableRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, 50); // 50ms delay to ensure DOM updates first
};

  const handletickethistory = () => {
    navigate("/dashboard?section=tickethistory", { replace: true });

    window.scrollTo({ top: 0, behavior: "smooth" });

  setTimeout(() => {
    if (isMobile) {
      componentRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      scrollableRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, 50);
  };

  const handleStudyAbroadClick = () => {
    navigate("/dashboard?section=study-abroad", { replace: true });

    window.scrollTo({ top: 0, behavior: "smooth" });

   setTimeout(() => {
     if (isMobile) {
       componentRef.current?.scrollIntoView({ behavior: "smooth" });
     } else {
       scrollableRef.current?.scrollTo({ top: 0, behavior: "smooth" });
     }
   }, 50);
  };

  const handleFreeSampleClick = () => {
    navigate("/dashboard?section=free-sample", { replace: true });

    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      if (isMobile) {
        componentRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        scrollableRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 50);
  };

  const handleFreeAiandGenAiClick = () => {
    navigate("/dashboard?section=free-ai-gen-ai", { replace: true });

    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      if (isMobile) {
        componentRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        scrollableRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 50);
  };

  const handleMachinesandManufacturingClick = () => {
    navigate("/dashboard?section=machines-manufacturing", { replace: true });

    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      if (isMobile) {
        componentRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        scrollableRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 50);
  };
  const handledWeAreHiring = () => {
    navigate("/dashboard?section=we-are-hiring", { replace: true });

    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      if (isMobile) {
        componentRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        scrollableRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 50);
  };

  const handleMyRotaryClick = () => {
    navigate("/dashboard?section=my-rotary", { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
   setTimeout(() => {
     if (isMobile) {
       componentRef.current?.scrollIntoView({ behavior: "smooth" });
     } else {
       scrollableRef.current?.scrollTo({ top: 0, behavior: "smooth" });
     }
   }, 50);
  };

  const handledLegalServiceClick = () => {
    navigate("/dashboard?section=legal-service", { replace: true });

    window.scrollTo({ top: 0, behavior: "smooth" });
   setTimeout(() => {
     if (isMobile) {
       componentRef.current?.scrollIntoView({ behavior: "smooth" });
     } else {
       scrollableRef.current?.scrollTo({ top: 0, behavior: "smooth" });
     }
   }, 50);
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      const userId = localStorage.getItem("userId");
      const apiurl =
        userId !== null
          ? `https://meta.oxyloans.com/api/student-service/user/queries?userId=${userId}`
          : `https://meta.oxyloans.com/api/student-service/user/querie`;
      try {
        const response = await axios.get(apiurl);
        if (response.status === 200) {
          console.log(response.data);
          setChatHistory(response.data);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory(); // Invoke the API call
  }, []); // Empty dependency array to run once on component mount

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const apiUrl = `https://meta.oxyloans.com/api/student-service/user/profile?id=${userId}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setProfileData(response.data); // Set the profile data to state
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("mobileNumber", response.data.mobileNumber);
      })
      .catch((error) => {
        console.error("There was an error making the request:", error);
      });
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const userId = localStorage.getItem("userId");
      const apiurl =
        userId !== null
          ? `https://meta.oxyloans.com/api/student-service/user/queries?userId=${userId}`
          : `https://meta.oxyloans.com/api/student-service/user/querie`;
      try {
        const response = await axios.get(apiurl);
        if (response.status === 200) {
          console.log(response.data);
          setChatHistory(response.data);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory(); // Invoke the API call
  }, [input]); // Empty dependency array to run once on component mount

  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const storedHistory = localStorage.getItem("chatHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Save history to localStorage whenever it changes

  const handleScroll = () => {
    if (bottomRef.current) {
      const { scrollTop, clientHeight, scrollHeight } =
        bottomRef.current.parentElement!;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight); // Check if the user is at the bottom
    }
  };
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }, [history]);

  // Toggle edit state
  const handleEditClick = () => {
    setIsEditing(isEditing);
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const islogin = localStorage.getItem("userId");
    if (questionCount > 3) {
      if (islogin) {
      } else {
        histary("/login");
      }
    }
  }, [questionCount]);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    alert("Message copied to clipboard!");
  };

  const handleReadAloud = (content: string) => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech before starting
    const utterance = new SpeechSynthesisUtterance(content);
    window.speechSynthesis.speak(utterance);
    setIsReading(true); // Set reading state to true

    // When speech ends, set isReading to false
    utterance.onend = () => {
      setIsReading(false);
    };
  };

  const handleStopReadAloud = () => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    setIsReading(false); // Set reading state to false
  };

  const handleShare = (content: string) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Chat Message",
          text: content,
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Share functionality is not supported on this device.");
    }
  };

  const query = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => {
    if (query) {
      handleSend(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("chatHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }, [history]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const handleSend = async (queryInput: string) => {
    if (queryInput.trim() === "") return;

    setMessages((prev) => [...prev, { type: "question", content: queryInput }]);
    setHistory((prevHistory) => [queryInput, ...prevHistory]);
    setInput("");
    setIsLoading(true);
    setQuestionCount((prevCount) => prevCount + 1); // Increment question count

    const apiurl =
      userId !== null
        ? `https://meta.oxyloans.com/api/student-service/user/globalChatGpt?prompt=${encodeURIComponent(
            queryInput
          )}&userId=${userId}`
        : `https://meta.oxyloans.com/api/student-service/user/globalChatGpt?prompt=${encodeURIComponent(
            queryInput
          )}`;

    try {
      const response = await axios.post(apiurl);

      // Add the API response to chat
      setMessages((prev) => [
        ...prev,
        { type: "answer", content: response.data },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "answer",
          content: "Sorry, there was an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault(); // Prevent default Enter key behavior
      handleSend(input);
    }
  };

  const handleInputChangeWithVisibility = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setInput(value); // Update input value
    setShowSendButton(value.trim() !== "");
    if (showStaticBubbles && value.trim() !== "") {
      setShowStaticBubbles(false);
    }
  };

  // Dummy data for rice-related topics
  const riceTopics = [
    {
      id: 1,
      title: "Ask questions",
      content:
        "Discover tips on how to develop sustainable and healthy eating patterns.",
    },
    {
      id: 1,
      title: "Ask mentorship",
      content:
        "Stay updated with the latest blockbusters and independent films hitting the theaters.",
    },
    {
      id: 3,
      title: "Ask for funds",
      content:
        "Find out how to compare products and read reviews before making an online purchase.",
    },
    {
      id: 4,
      title: "Ask for end-to-end solution",
      content:
        "Understand different shipping methods and how to track your online orders.",
    },
  ];

  // Handle click on static chat bubble
  const handleBubbleClick = (content: string) => {
    if (content.includes("section=")) {
      navigate(`/dashboard?${content}`, { replace: true });
    } else {
      setInput(content);
      setShowStaticBubbles(false);
      setShowSendButton(true);
      setriceTopicsshow(true);
      // navigate(`/dashboard?query=${encodeURIComponent(content)}`, {
      //   replace: true,
      // });
      if (inputRef.current) {
        inputRef.current.focus(); // Focus the input field
      }
    }
  };

  const handleNewChatClick = () => {
    setMessages([]); // Clear the messages
    setShowFreerudraksha(false);
    setShowStudyAbroad(false);
    setShowFreeSample(false);
    setShowFreeaiandgenai(false);
    setShowMachinesManufacturing(false);
    setShowMyRotaryService(false);
    setShowLegalService(false);
    setTicketHistory(false);
    setriceTopicsshow(true);

    navigate("/dashboard"); // Navigate first
    setShowStaticBubbles(true); // Show static chat bubbles after navigation

    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the input field
      setShowSendButton(false); // Hide the send button
    }
  };

  const handleHistoryItemClick = (historyItem: string) => {
    setInput(historyItem); // Set input to the history item
    setShowSendButton(true); // Show send button
    setShowStaticBubbles(false); // Hide static bubbles
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input field
    }
  };

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = JSON.parse(
      localStorage.getItem("chathistory") || "[]"
    );
    setChatHistory(savedHistory);
  }, []);

  const navigate = useNavigate(); // Initialize navigate function

  // Function to handle the click event
  const handleRedirect = () => {
    navigate("/dashboard"); // Redirect to the login page
  };

  const truncateText = (
    text: string | null | undefined,
    length: number
  ): string => {
    if (!text) {
      return ""; // Return an empty string if the text is null or undefined
    }
    if (text.length <= length) {
      return text; // Return the text as it is if it's shorter than the specified length
    }
    return text.slice(0, length) + "..."; // Truncate text and add ellipsis
  };
  const [isHistoryVisible, setIsHistoryVisible] = useState(false); // State to control history visibility

  const handleHistoryButtonClick = () => {
    setIsHistoryVisible(!isHistoryVisible); // Toggle the drawer visibility
  };
  

  return (
    <div className="max-h-screen  fixed bg-[#351664] text-white overflow-y-auto  w-full flex flex-col">
      {/* Header */}
      <header className="flex md:flex-row items-center justify-between gap-1 p-4 bg-[#351664] border-b-4 border-white">
        {/* Logo with Icon */}
        <button
          className="flex items-center text-2xl font-bold bg-transparent border-none cursor-pointer focus:outline-none mb-4 md:mb-0"
          onClick={handleRedirect}
        >
          <span className="text-white">ASKOXY</span>
          <span className="text-[#ffa800]">.AI</span>
        </button>

        {/* Right Section: Profile and SignOut */}
        <div className="flex items-center  gap-1 bg-transparent border-none cursor-pointer focus:outline-none mb-4 md:mb-0">
          {/* Ticket History Button - Hidden on Mobile */}
          <button
            onClick={handletickethistory}
            className="text-white bg-[#04AA6D] px-4 py-2 rounded-full font-bold md:block hidden"
          >
            Ticket History
          </button>

          {/* SignOut Button */}
          <button
            onClick={() => {
              if (
                localStorage.getItem("userId") &&
                localStorage.getItem("email")
              ) {
                localStorage.removeItem("userId");
                localStorage.removeItem("email");
              }
              // Assuming navigate is a hook or function to navigate to different pages
              navigate("/");
            }}
            // bg-[#04AA6D]
            className="flex items-center 
           
            text-black bg-white  px-4 py-2 rounded-full font-bold"
          >
            <FaSignOutAlt className="mr-2" /> {/* Icon with margin-right */}
            SignOut
          </button>

          <div className="flex  items-center gap-1 sm:space-x-2">
            <AuthorInfo
              name={`${profileData?.firstName || ""} ${
                profileData?.lastName || ""
              }`}
              location={profileData?.city || ""}
              email={profileData?.email || ""}
              icon={<FaUserCircle />}
              number={profileData?.mobileNumber || ""}
            />
          </div>

          {/* Profile Info Section */}
        </div>
      </header>

      {/* <ModalComponent /> */}
      <main className="flex  flex-col flex-grow w-full overflow-y-auto p-3 md:flex-row">
        {/* Combined Left, Center, and Right Panel */}
        <div className="flex flex-col bg-white flex-grow gap-1 rounded-lg shadow-md lg:flex-row">
          {/* Left Panel */}
          {/* {showLeftPanel && ( */}
          <aside className="w-full p-3 text-black bg-gray-100 rounded-l-lg  rounded-r-lg md:w-1/6 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between font-bold ">
              <button
                onClick={handleHistoryButtonClick}
                className="rounded-md"
                title={isHistoryVisible ? "Back to Services" : "Chat History"}
              >
                <div className="hover:bg-gray-200 p-1 text-[#3c1973] rounded-lg">
                  {isHistoryVisible ? "Services" : "History"}
                </div>
              </button>
              <button
                onClick={handleNewChatClick}
                className=" rounded-md"
                title="New Chat"
              >
                <div className="hover:bg-gray-200 text-[#3c1973] p-1  rounded-lg">
                  {" "}
                  {/* Add background color here */}
                  Free ChatGPT
                </div>
              </button>
            </div>
            {/* {isEditing && (
              <p className="text-sm text-[#351664] mb-4 text-center">
                Editing mode enabled...
              </p>
            )} */}

            {!isHistoryVisible && (
              <div className="mt-4 border-t border-gray-300 ">
                {/* <div className="mt-2 flex justify-center items-center">
                <button
                  onClick={handletickethistory}
                  className="px-4 py-2 text-black bg-[#04AA6D] text-center rounded-md cursor-pointer flex items-center justify-center"
                >
                  <span className="text-white text-sm leading-tight">
                    Ticket History
                  </span>
                </button>
              </div> */}

                <div className="mt-4 flex hover:bg-gray-200 hover:rounded-lg items-center">
                  <button
                    onClick={handleFreerudrakshaClick}
                    className="px-1 py-1 text-black rounded-md cursor-pointer flex items-center"
                  >
                    <img
                      src={FR} // Replace with the actual image path
                      alt="Free Rudraksha"
                      className="w-7 h-7 mr-2 rounded-full" // Adjust image size and margin
                    />
                    <span className="text-[#3c1973] text-sm">
                      Free Rudraksha
                    </span>
                  </button>
                </div>

                <div className="mt-4 flex hover:bg-gray-200 hover:rounded-lg items-center">
                  <button
                    onClick={handleFreeAiandGenAiClick}
                    className="px-1 py-1 text-black rounded-md cursor-pointer flex items-center"
                  >
                    <img
                      src={FR3} // Replace with the actual image path
                      alt="FreeAI & GenAI"
                      className="w-7 h-7 mr-2 rounded-full"
                    />
                    <span className="text-[#3c1973] text-sm leading-tight">
                      Free AI & GenAI Training
                    </span>
                  </button>
                </div>

                <div className="mt-4 flex hover:bg-gray-200 hover:rounded-lg items-center">
                  <button
                    onClick={handleFreeSampleClick}
                    className="px-1 py-1 text-black rounded-md cursor-pointer flex items-center"
                  >
                    <img
                      src={FR2} // Replace with the actual image path
                      alt="Free Rice Samples"
                      className="w-7 h-7 mr-2 rounded-full"
                    />
                    <span className="text-[#3c1973] text-sm leading-tight">
                      Free Rice Samples & Steel Container
                    </span>
                  </button>
                </div>

                <div className="mt-4 flex hover:bg-gray-200 hover:rounded-lg items-center">
                  <button
                    onClick={handleStudyAbroadClick}
                    className="px-1 py-1 text-black rounded-md cursor-pointer flex items-center"
                  >
                    <img
                      src={FR1} // Replace with the actual image path
                      alt="Study Abroad"
                      className="w-7 h-7 mr-2 rounded-full"
                    />
                    <span className="text-[#3c1973] text-sm leading-tight">
                      Study Abroad
                    </span>
                  </button>
                </div>

                <div className="mt-4 flex hover:bg-gray-200 hover:rounded-lg items-center">
                  <button
                    onClick={handledLegalServiceClick}
                    className="px-1 py-1 text-black rounded-md cursor-pointer flex items-center"
                  >
                    <img
                      src={FR5} // Replace with the actual image path
                      alt="Legail Service"
                      className="w-7 h-7 mr-2 rounded-full"
                    />
                    <span className="text-[#3c1973] text-sm leading-tight">
                      Legal Service
                    </span>
                  </button>
                </div>

                <div className="mt-4 flex hover:bg-gray-200 hover:rounded-lg items-center">
                  <button
                    onClick={handleMyRotaryClick}
                    className="px-1 py-1 text-black rounded-md cursor-pointer flex items-center"
                  >
                    <img
                      src={FR3} // Replace with the actual image path
                      alt="My Rotary"
                      className="w-7 h-7 mr-2 rounded-full"
                    />
                    <span className=" text-[#3c1973] text-sm leading-tight">
                      My Rotary
                    </span>
                  </button>
                </div>

                <div className="mt-4 flex hover:bg-gray-200 hover:rounded-lg items-center">
                  <button
                    onClick={handleMachinesandManufacturingClick}
                    className="px-1 py-1 text-black rounded-md cursor-pointer flex items-center"
                  >
                    <img
                      src={FR4} // Replace with the actual image path
                      alt="Machines and Manufacturing Services"
                      className="w-7 h-7 rounded-full"
                    />
                    <span className=" text-[#3c1973] ml-2 text-sm leading-tight">
                      Machines & Manufacturing Services
                    </span>
                  </button>
                </div>

                <div className="mt-4 flex hover:bg-gray-200 hover:rounded-lg items-center">
                  <button
                    onClick={handledWeAreHiring}
                    className="px-1 py-1 text-black rounded-md cursor-pointer flex items-center"
                  >
                    <img
                      src={FR6} // Replace with the actual image path
                      alt="We Are Hiring"
                      className="w-7 h-7 rounded-full"
                    />
                    <span className=" text-[#3c1973] text-sm ml-2 leading-tight">
                      We Are Hiring
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div
              className={`mt-2 h-80 border-gray-300 pt-2 transition-all duration-300 ${
                isHistoryVisible ? "block" : "hidden"
              }`}
            >
              <div className="flex mt-3 mb-2 ml-2 text-[#3c1973] text-md">
                Previous History
              </div>
              {chathistory.length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center">
                  No history available.
                </p>
              ) : (
                chathistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 mb-4 bg-gray-200 rounded cursor-pointer"
                    onClick={() => handleHistoryItemClick(item.userQuations)} // Update input with selected history item
                  >
                    <Link
                      className="text-sm text-gray-800"
                      to={`?${encodeURIComponent(item.userQuations)}`}
                    >
                      {truncateText(item.userQuations, 25)}
                    </Link>
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* Center Panel */}
          <section
            ref={scrollableRef}
            className="relative overflow-y-auto rounded-r-lg  rounded-l-lg flex flex-col flex-grow w-full  p-6 md:w-1/2 bg-gray-50"
          >
            {showFreerudraksha && (
              <div ref={componentRef}>
                <Freerudraksha />
              </div>
            )}
            {showStudyAbroad && (
              <div ref={componentRef}>
                <StudyAbroad />
              </div>
            )}
            {showFreeSample && (
              <div ref={componentRef}>
                <FreeSample />
              </div>
            )}
            {showFreeaiandgenai && (
              <div ref={componentRef}>
                <FreeAiandGenAi />
              </div>
            )}
            {showMachinesManufacturing && (
              <div ref={componentRef}>
                <MachinesManufacturingServices />
              </div>
            )}
            {showMyRotaryService && (
              <div ref={componentRef}>
                <MyRotaryServices />
              </div>
            )}
            {showHiringService && (
              <div ref={componentRef}>
                <HiringService />{" "}
              </div>
            )}
            {showLegalService && (
              <div ref={componentRef}>
                <LegalService />
              </div>
            )}
            {ticketHistory && (
              <div ref={componentRef}>
                <TicketHistory />
              </div>
            )}
            {!showFreerudraksha &&
              !showHiringService &&
              !showStudyAbroad &&
              !showFreeSample &&
              !showFreeaiandgenai &&
              !showMachinesManufacturing &&
              !showMyRotaryService &&
              !ticketHistory &&
              !showLegalService && (
                <>
                  {/* Static Rice Related Text */}
                  {
                    <div className="flex items-center justify-between p-2">
                      {/* Left side: Welcome Text */}
                      <h2
                        className="fw-500"
                        style={{
                          zIndex: "10",
                          color: "black",
                          fontWeight: "700",
                        }}
                      >
                        Welcome{" "}
                        {profileData
                          ? `    ${profileData.firstName} ${profileData.lastName}`
                          : "Guest"}
                      </h2>

                      {/* <button
                        className="bg-[#04AA6D] text-white px-4 py-2 rounded-full font-bold"
                        
                      >
                        Multi Chain ID
                      </button> */}
                    </div>
                  }

                  {showStaticBubbles && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-70">
                          {" "}
                          {/* Add max-height and overflow */}
                          {riceTopicsshow && (
                            <>
                              {riceTopics.map((topic) => (
                                <div
                                  key={topic.id}
                                  className="flex items-center justify-center max-w-xs p-3 text-black transition duration-200 bg-gray-200 rounded-lg chat-bubble hover:bg-gray-300"
                                  style={{
                                    wordWrap: "break-word",
                                    zIndex: "10",
                                  }}
                                  onClick={() => {
                                    handleBubbleClick(topic.title);
                                    setInput(topic.title);
                                  }}
                                >
                                  <ReactMarkdown className="text-center">
                                    {topic.title}
                                  </ReactMarkdown>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Chat messages */}
                  <div
                    className="relative flex-grow p-4  chat-container"
                    // style={{ maxHeight: "calc(100vh - 12rem)" }}
                  >
                    <div>
                      {isLoading ? (
                        <div className="flex items-center justify-center h-24">
                          <Example variant="loading01" />
                        </div>
                      ) : (
                        <>
                          {/* Render Questions followed by their corresponding Answers */}
                          {messages.map((message, index) => (
                            <div
                              key={index}
                              className={`col-span-8 mb-6 p-3 rounded-md ${
                                message.type === "question"
                                  ? "bg-blue-200 col-span-3 text-black"
                                  : "bg-green-200 col-span-5 text-black"
                              }`}
                            >
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                              <div className="flex mt-2 space-x-1">
                                {/* Copy Button */}
                                <button
                                  className="p-2 bg-white rounded-full mr"
                                  onClick={() => handleCopy(message.content)}
                                  title="Copy"
                                >
                                  <FaRegCopy />
                                </button>

                                {/* Speaker (Read Aloud) Button */}
                                {isReading ? (
                                  <button
                                    className="p-2 bg-white mr rounded-full"
                                    onClick={() =>
                                      window.speechSynthesis.cancel()
                                    }
                                    title="Stop Read Aloud"
                                  >
                                    <FaVolumeOff />
                                  </button>
                                ) : (
                                  <button
                                    className="p-2 bg-white mr rounded-full"
                                    onClick={() =>
                                      handleReadAloud(message.content)
                                    }
                                    title="Read Aloud"
                                  >
                                    <FaVolumeUp />
                                  </button>
                                )}

                                {/* Share Button */}
                                <button
                                  className="p-2 bg-white rounded-full mr"
                                  onClick={() => handleShare(message.content)}
                                  title="Share"
                                >
                                  <FaShareAlt />
                                </button>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                    <div ref={bottomRef} />{" "}
                    {/* This ref will be used to scroll to the bottom */}
                  </div>
                  {/* Input Bar */}
                  <div className="absolute inset-x-0 bottom-0 flex items-center p-2 bg-white border-t border-gray-300 md:relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={handleInputChangeWithVisibility}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask question..."
                      className="flex-grow p-2 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa800] text-black text-sm md:text-base"
                    />
                    {showSendButton && (
                      <button
                        onClick={() => handleSend(input)}
                        className={`ml-2 bg-[#ffa800] text-white px-3 py-1 md:px-4 md:py-2 rounded-full shadow-md ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send"}
                      </button>
                    )}
                  </div>
                </>
              )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dasboard;
