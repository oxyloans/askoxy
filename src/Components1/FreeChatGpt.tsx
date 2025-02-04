import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Example from "../components/Example";
import { FaVolumeOff, FaVolumeUp, FaRegCopy, FaShareAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { IoIosSend } from "react-icons/io";
import {
  PencilSquareIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
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

const FreeChatGpt: React.FC = () => {
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

    const apiurl = userId
      ? `https://meta.oxyloans.com/api/student-service/user/globalChatGpt?prompt=${encodeURIComponent(
          queryInput
        )}&userId=${userId}`
      : `https://meta.oxyloans.com/api/student-service/user/globalChatGpt?prompt=${encodeURIComponent(
          queryInput
        )}`;

    try {
      const response = await axios.post(apiurl);
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

 const handleNewChatClick = () => {
   setMessages([]); // Clear the messages


   navigate("/dashboard"); // Navigate first
   setShowStaticBubbles(true); // Show static chat bubbles after navigation

   if (inputRef.current) {
     inputRef.current.value = ""; // Clear the input field
     setShowSendButton(false); // Hide the send button
   }
 };

  // Dummy rice topics
  const riceTopics = [
    { id: 1, title: "Ask questions", content: "Discover useful tips!" },
    { id: 2, title: "Ask mentorship", content: "Seek expert guidance!" },
    { id: 3, title: "Ask for funds", content: "Learn funding strategies." },
    {
      id: 4,
      title: "End-to-end solution",
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
    useEffect(() => {
     
  
     
    }, []);
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
  <main className="flex flex-col h-screen sm:p-2">
    {/* Main Content Section */}
    <div className="flex flex-col flex-grow">
      {/* Header */}
      <div className="flex w-full justify-between items-center p-4 bg-white border-b border-gray-300 shadow-md">
        <h2 className="text-[#3c1973] text-lg sm:text-xl tracking-wide">
          Welcome {profileData ? `${profileData.firstName} ` : "Guest"}
        </h2>
        <div
          className="flex items-center bg-gray-200 rounded-lg p-1 space-x-2 cursor-pointer"
          onClick={handleNewChatClick}
        >
          <h3 className="font-semibold text-[#3c1973]">New Chat</h3>
          <PencilSquareIcon className="w-6 h-6 text-[#3c1973]" />
        </div>
      </div>

      {/* Scrollable Chat Container */}
      <div
        className="flex-grow overflow-y-auto border border-gray-300 bg-white shadow-md relative"
        style={{ maxHeight: "calc(100vh - 120px)" }} // Adjust height for header and input bar
      >
        {/* Static Bubbles - Centered */}
        {showStaticBubbles && (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-opacity-75 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {riceTopics &&
                riceTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-3 bg-gray-100 text-black rounded-lg shadow hover:bg-gray-300 transition duration-200 cursor-pointer text-center"
                    style={{ wordWrap: "break-word" }}
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

        {/* Chat Messages */}
        <div className="space-y-4 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Example variant="loading01" />
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-md shadow-md ${
                  message.type === "question"
                    ? "bg-blue-100 text-black"
                    : "bg-green-100 text-black"
                }`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
                <div className="flex items-center mt-2 space-x-2">
                  <button
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
                    onClick={() => handleCopy(message.content)}
                    title="Copy"
                  >
                    <FaRegCopy />
                  </button>
                  {isReading ? (
                    <button
                      className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
                      onClick={() => window.speechSynthesis.cancel()}
                      title="Stop Read Aloud"
                    >
                      <FaVolumeOff />
                    </button>
                  ) : (
                    <button
                      className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
                      onClick={() => handleReadAloud(message.content)}
                      title="Read Aloud"
                    >
                      <FaVolumeUp />
                    </button>
                  )}
                  <button
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
                    onClick={() => handleShare(message.content)}
                    title="Share"
                  >
                    <FaShareAlt />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div ref={bottomRef}></div>
      </div>

      {/* Input Bar (Fixed at Bottom) */}
      <div className="sticky bottom-0 w-full bg-white p-3 border-t border-gray-300 shadow-lg">
        <div className="flex items-center">
          <div className="flex-grow relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChangeWithVisibility}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="w-full p-4 pl-5 pr-14 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa800] text-gray-800 text-sm md:text-base shadow-md"
            />
            {showSendButton && (
              <button
                onClick={() => handleSend(input)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 px-5 py-2 rounded-full text-white font-semibold shadow-lg transition ${
                  isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#ffa800] hover:bg-[#ff8c00]"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Sending" : "➤"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </main>
);

};

export default FreeChatGpt;
