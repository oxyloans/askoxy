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

const UniversityAgents: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSendButton, setShowSendButton] = useState(false);
  const [showStaticBubbles, setShowStaticBubbles] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const [isReading, setIsReading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
       const apiurl =
         userId !== null
           ? `https://meta.oxyloans.com/api/student-service/user/chat?InfoType=${encodeURIComponent(
               queryInput
             )}`
           : `https://meta.oxyloans.com/api/student-service/user/chat?InfoType=${encodeURIComponent(
               queryInput
             )}`;

       // Make API request to the specified endpoint
       const response = await axios.post(
         // // `https://meta.oxyloans.com/api/student-service/user/erice?infoType=${encodeURIComponent(queryInput)}`
         `https://meta.oxyloans.com/api/student-service/user/enterChat?prompt=${encodeURIComponent(
           queryInput
         )}`
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    navigate("/dashboard/universitiesagents-gpt");
    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the input field manually
      inputRef.current.placeholder = "Ask anything..."; // Reset the placeholder
    }
  };

  // Dummy rice topics
  const riceTopics = [
    {
      id: 1,
      title: "How do university agents help with course selection?",
      content: "Discover useful tips!",
    },
    {
      id: 2,
      title: "What services do university agents provide?",
      content: "Seek expert guidance!",
    },
    {
      id: 3,
      title: "How do I choose a reliable university agent?",
      content: "Learn funding strategies.",
    },
    {
      id: 4,
      title: "Do university agents charge fees for their services?",
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
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setInput(value); // Update input value
    setShowSendButton(value.trim() !== "");

    if (value.trim() !== "") {
      setShowStaticBubbles(false); // Hide when typing
    } else if (!isLoading && messages.length === 0) {
      setShowStaticBubbles(true); // Show only if no response is pending and no messages exist
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

      <div className="fixed top-16 left-0 lg:left-64 right-0 p-3 md:p-4 flex items-center justify-between z-10 ">
        {/* Left Side - Welcome Message */}
        <h2 className="text-[#3c1973] bg-gray-100 rounded-lg px-4 py-2 text-lg sm:text-xl tracking-wide">
          Welcome {profileData ? `${profileData.firstName}` : "Guest"}
        </h2>

        {/* Right Side - New Chat Button */}
        <button
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-[#3c1973] font-semibold px-4 py-2 rounded-lg transition duration-200 shadow-sm"
          onClick={handleNewChatClick}
        >
          <span>New Chat</span>
          {/* Uncomment below if you want an icon */}
          {/* <PencilSquareIcon className="w-5 h-5 text-[#3c1973]" /> */}
        </button>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col justify-center items-center fixed top-[177px] left-0 lg:left-64 right-0 bottom-[90px] px-4 bg-white">
        {/* Static Bubbles (Shown When Not Loading) */}
        {!isLoading && showStaticBubbles && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-75 z-10">
            <div className="grid grid-cols-2 gap-4 p-8 w-full max-w-screen-sm mx-auto">
              {riceTopics?.map((topic) => (
                <div
                  key={topic.id}
                  className="p-3 bg-purple-50 text-black rounded-lg shadow-md hover:bg-purple-100 transition cursor-pointer text-center"
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
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white p-2 border-t shadow-lg">
        <div className="max-w-screen-lg mx-auto flex items-center space-x-2">
          {/* Textarea Input */}
          <div className="flex-grow relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                handleInputChangeWithVisibility(e);
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend(input)
              }
              placeholder="Ask anything..."
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              aria-label="Type your message"
              style={{
                minHeight: "3rem",
                maxHeight: "12rem",
                overflowY: "auto",
                height: "46px",
              }}
            />
          </div>

          {/* Send Button (Outside) */}
          <button
            onClick={() => handleSend(input)}
            className={`px-5 py-2 rounded-lg text-white font-semibold shadow-md transition ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "..." : "➤"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default UniversityAgents;
