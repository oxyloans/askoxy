import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Example from "../../components/Example";
import { FaVolumeOff, FaVolumeUp, FaRegCopy, FaShareAlt } from "react-icons/fa";
import {
  PencilSquareIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import { IoIosSend } from "react-icons/io";
type ChatHistoryItem = {
  id: string;
  userQuestions: string;
  ericeQueries: string | null;
};

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

const LoansGpt: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSendButton, setShowSendButton] = useState(false);
  const [showStaticBubbles, setShowStaticBubbles] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const [isReading, setIsReading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  // Scroll to the bottom when messages update
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle query from URL and send it
  useEffect(() => {
    const query = new URLSearchParams(location.search).get("search") || "";
    if (query) handleSend(query);
  }, [location.search]);

  // Send a query to the API
  const handleSend = async (queryInput: string) => {
    if (!queryInput.trim()) return;

    setMessages((prev) => [...prev, { type: "question", content: queryInput }]);
    setHistory((prev) => [queryInput, ...prev]);
    setInput("");
    setIsLoading(true);
     try {
       const userId = localStorage.getItem("userId");
       const accessToken = localStorage.getItem("accessToken"); // Retrieve access token
       const payload = [
         {
           role: "user",
           content: queryInput,
         },
       ];

       const apiurl =
         userId !== null
           ? `https://meta.oxyloans.com/api/student-service/user/loans`
           : `https://meta.oxyloans.com/api/student-service/user/loans`;

       // Make API request to the specified endpoint with Authorization header
       const response = await axios.post(
         apiurl,
         payload,
         // If the request body is empty, pass an empty object
         {
           headers: {
             Authorization: `Bearer ${accessToken}`, // Include access token in header
           },
         }
       );

       // Process the API response and update the chat
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

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      handleSend(input);
    }
  };

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

  // Update input and show/hide send button
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setShowSendButton(value.trim() !== "");
    if (value.trim()) setShowStaticBubbles(false);
  };

  // Start a new chat
  const handleNewChatClick = () => {
    setMessages([]);
    setShowStaticBubbles(true);
    setInput("");
    setShowSendButton(false);
    navigate("/dashboard/loans-gpt");
  };

  // Dummy rice topics
  const riceTopics = [
    {
      id: 1,
      title: "Student Loan Options for Study Abroad",
      content: "Discover useful tips!",
    },
    {
      id: 2,
      title: "US Student Loan Options",
      content: "Seek expert guidance!",
    },
    {
      id: 3,
      title: "International Student Loan Repayment",
      content: "Learn funding strategies.",
    },
    {
      id: 4,
      title: "INSEAD MBA Program Loan Options",
      content: "Find tailored solutions.",
    },
  ];

  // Handle static bubble click
  const handleBubbleClick = (content: string) => {
    setInput(content);
    setShowSendButton(true);
    setShowStaticBubbles(false);
    if (inputRef.current) inputRef.current.focus();
  };

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

  // Detect viewport size
  useEffect(() => {}, []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const query = params.get("query");

    // Handle search query (store in history)
    if (query) {
      setShowStaticBubbles(false); // Hide rice topics when there's a query
      handleSend(query);
    }

    // if (scrollableRef.current) {
    //   scrollableRef.current.scrollTo({ top: 0, behavior: "smooth" });
    // }
  }, [location.search]);

  const query = new URLSearchParams(location.search).get("search") || "";

  return (
    <main className="flex flex-col h-screen  w-full sm:p-2 ">
      {/*  //sm:left-64 */}

      {/* Header */}

      <div className="fixed top-16 left-0 lg:left-64 right-0 border-b p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between bg-white z-10 space-y-4 sm:space-y-0">
        {/* Left Side - Blockchain ID & BMVCOINS */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Blockchain ID - Full on Web, Last 5 on Mobile */}

          {/* BMVCOINS Button */}
        </div>

        {/* Right Side - New Chat Button */}
        <div
          className="flex items-center bg-gray-200 rounded-lg p-1 space-x-2 cursor-pointer hover:bg-gray-300 transition"
          onClick={handleNewChatClick}
        >
          <h3 className="font-semibold text-[#3c1973]">New Chat</h3>
          <PencilSquareIcon className="w-6 h-6 text-[#3c1973]" />
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col justify-center items-center fixed top-[177px] left-0 lg:left-64 right-0 bottom-[90px] px-4 bg-white">
        {/* Static Bubbles (Shown When Not Loading) */}
        {!isLoading && showStaticBubbles && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-75 z-10">
            <div className="grid grid-cols-2 gap-4 p-6 w-full max-w-screen-sm mx-auto">
              {riceTopics?.map((topic) => (
                <div
                  key={topic.id}
                  className="p-3 bg-gray-100 text-black rounded-lg shadow-md hover:bg-gray-300 transition cursor-pointer text-center"
                  onClick={() => {
                    handleBubbleClick(topic.title);
                    setInput(topic.title);
                  }}
                >
                  <ReactMarkdown className="font-medium">
                    {topic.title}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages Section (Non-Scrollable) */}
        <div className="w-full max-w-screen-lg flex flex-col space-y-2 flex-grow overflow-y-auto">
          {/* Loading Indicator (Centered Inside Chat Box) */}
          {isLoading ? (
            <div className="flex items-center justify-center flex-grow">
              <Example variant="loading01" />
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-md shadow-md w-full ${
                  message.type === "question"
                    ? "bg-blue-50 border border-blue-300 text-black"
                    : "bg-green-50 border border-green-300 text-black"
                }`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
                <div className="flex items-center mt-2 space-x-2">
                  <button
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
                    title="Copy"
                    onClick={() => handleCopy(message.content)}
                  >
                    <FaRegCopy />
                  </button>
                  {isReading ? (
                    <button
                      className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
                      title="Stop Read Aloud"
                      onClick={() => window.speechSynthesis.cancel()}
                    >
                      <FaVolumeOff />
                    </button>
                  ) : (
                    <button
                      className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
                      title="Read Aloud"
                      onClick={() => handleReadAloud(message.content)}
                    >
                      <FaVolumeUp />
                    </button>
                  )}
                  <button
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
                    title="Share"
                    onClick={() => handleShare(message.content)}
                  >
                    <FaShareAlt />
                  </button>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef}></div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0  lg:left-64 right-0 bg-white p-2 border-t shadow-lg">
        <div className="flex items-center max-w-screen-lg mx-auto px-4">
          <div className="flex-grow relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="Ask a question..."
              className="w-full p-4 pl-5 pr-14 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa800] text-gray-800 text-sm md:text-base shadow-md"
            />
            <button
              onClick={() => handleSend(input)}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 px-5 py-2 rounded-full text-white font-semibold shadow-lg transition ${
                isLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#ffa800] hover:bg-[#ff8c00]"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "➤"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoansGpt;
