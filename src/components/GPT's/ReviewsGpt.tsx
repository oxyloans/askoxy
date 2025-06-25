// import React, { useRef, useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import Example from "../../components/Example";
// import { FaVolumeOff, FaVolumeUp, FaRegCopy, FaShareAlt } from "react-icons/fa";
// import {
//   PencilSquareIcon,
//   ChatBubbleLeftEllipsisIcon,
// } from "@heroicons/react/24/outline";
// import { IoIosSend } from "react-icons/io";
// type ChatHistoryItem = {
//   id: string;
//   userQuestions: string;
//   ericeQueries: string | null;
// };

// interface ChatMessage {
//   type: "question" | "answer";
//   content: string;
// }

// interface ProfileData {
//   userId: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   mobileNumber: string;
//   gender: string;
//   dob: string | null;
//   address: string | null;
//   city: string | null;
//   pinCode: string | null;
//   consent: string | null;
//   message: string | null;
//   organization: string | null;
//   designation: string | null;
//   educationDetailsModelList: null;
//   state: string | null;
//   country: string | null;
//   nationality: string | null;
//   emailVerified: boolean;
//   panVerified: boolean | null;
//   whatsappVerified: boolean | null;
//   name: string | null;
//   multiChainId: string | null;
//   coinAllocated: number | null;
// }

// const ReviewsGpt: React.FC = () => {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [input, setInput] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [showSendButton, setShowSendButton] = useState(false);
//   const [showStaticBubbles, setShowStaticBubbles] = useState(true);
//   const [history, setHistory] = useState<string[]>([]);
//   const scrollableRef = useRef<HTMLDivElement | null>(null);
//   const [isReading, setIsReading] = useState(false);
//   const bottomRef = useRef<HTMLDivElement | null>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [profileData, setProfileData] = useState<ProfileData | null>(null);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const userId = localStorage.getItem("userId");

//   // Scroll to the bottom when messages update
//   useEffect(() => {
//     if (bottomRef.current) {
//       bottomRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   // Handle query from URL and send it
//   useEffect(() => {
//     const query = new URLSearchParams(location.search).get("search") || "";
//     if (query) handleSend(query);
//   }, [location.search]);

//   // Send a query to the API
//   const handleSend = async (queryInput: string) => {
//     if (!queryInput.trim()) return;

//     setMessages((prev) => [...prev, { type: "question", content: queryInput }]);
//     setHistory((prev) => [queryInput, ...prev]);
//     setInput("");
//     setIsLoading(true);
//      try {
//        const userId = localStorage.getItem("userId");
//        const accessToken = localStorage.getItem("accessToken"); // Retrieve access token
//        const payload = [
//          {
//            role: "user",
//            content: queryInput,
//          },
//        ];

//        const apiurl =
//          userId !== null
//            ? `https://meta.oxyloans.com/api/student-service/user/reviews`
//            : `https://meta.oxyloans.com/api/student-service/user/reviews`;

//        // Make API request to the specified endpoint with Authorization header
//        const response = await axios.post(
//          apiurl,
//          payload,
//          // If the request body is empty, pass an empty object
//          {
//            headers: {
//              Authorization: `Bearer ${accessToken}`, // Include access token in header
//            },
//          }
//        );

//        // Process the API response and update the chat
//        setMessages((prev) => [
//          ...prev,
//          { type: "answer", content: response.data },
//        ]);
//      } catch (error) {
//        console.error("Error fetching response:", error);
//        setMessages((prev) => [
//          ...prev,
//          {
//            type: "answer",
//            content: "Sorry, there was an error. Please try again later.",
//          },
//        ]);
//      } finally {
//        setIsLoading(false);
//      }
//   };

//   // Handle Enter key press
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !isLoading) {
//       e.preventDefault();
//       handleSend(input);
//     }
//   };

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     const apiUrl = `https://meta.oxyloans.com/api/student-service/user/profile?id=${userId}`;

//     axios
//       .get(apiUrl)
//       .then((response) => {
//         console.log(response.data);
//         setProfileData(response.data); // Set the profile data to state
//         localStorage.setItem("email", response.data.email);
//         localStorage.setItem("mobileNumber", response.data.mobileNumber);
//       })
//       .catch((error) => {
//         console.error("There was an error making the request:", error);
//       });
//   }, []);

//   // Update input and show/hide send button
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setInput(value);
//     setShowSendButton(value.trim() !== "");
//     if (value.trim()) setShowStaticBubbles(false);
//   };

//   // Start a new chat
//   const handleNewChatClick = () => {
//     setMessages([]);
//     setShowStaticBubbles(true);
//     setInput("");
//     setShowSendButton(false);
//     navigate("/dashboard/reviews-gpt");
//   };

//   // Dummy rice topics
//   const riceTopics = [
//     {
//       id: 1,
//       title: "University of Toronto Reviews",
//       content: "Discover useful tips!",
//     },
//     {
//       id: 2,
//       title: "US Computer Science Universities",
//       content: "Seek expert guidance!",
//     },
//     {
//       id: 3,
//       title: "Pros and Cons of ANU",
//       content: "Learn funding strategies.",
//     },
//     {
//       id: 4,
//       title: "INSEAD MBA Program Reviews",
//       content: "Find tailored solutions.",
//     },
//   ];

//   // Handle static bubble click
//   const handleBubbleClick = (content: string) => {
//     setInput(content);
//     setShowSendButton(true);
//     setShowStaticBubbles(false);
//     if (inputRef.current) inputRef.current.focus();
//   };

//   const handleCopy = (content: string) => {
//     navigator.clipboard.writeText(content);
//     alert("Message copied to clipboard!");
//   };
//   const handleReadAloud = (content: string) => {
//     window.speechSynthesis.cancel(); // Stop any ongoing speech before starting
//     const utterance = new SpeechSynthesisUtterance(content);
//     window.speechSynthesis.speak(utterance);
//     setIsReading(true); // Set reading state to true

//     // When speech ends, set isReading to false
//     utterance.onend = () => {
//       setIsReading(false);
//     };
//   };
//   const handleShare = (content: string) => {
//     if (navigator.share) {
//       navigator
//         .share({
//           title: "Chat Message",
//           text: content,
//           url: window.location.href,
//         })
//         .catch((error) => console.error("Error sharing:", error));
//     } else {
//       alert("Share functionality is not supported on this device.");
//     }
//   };

//   const handleInputChangeWithVisibility = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const value = e.target.value;
//     setInput(value); // Update input value
//     setShowSendButton(value.trim() !== "");
//     if (showStaticBubbles && value.trim() !== "") {
//       setShowStaticBubbles(false);
//     }
//   };

//   // Detect viewport size
//   useEffect(() => {}, []);
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);

//     const query = params.get("query");

//     // Handle search query (store in history)
//     if (query) {
//       setShowStaticBubbles(false); // Hide rice topics when there's a query
//       handleSend(query);
//     }

//     // if (scrollableRef.current) {
//     //   scrollableRef.current.scrollTo({ top: 0, behavior: "smooth" });
//     // }
//   }, [location.search]);

//   const query = new URLSearchParams(location.search).get("search") || "";

//   return (
//     <main className="flex flex-col h-screen  w-full sm:p-2 ">
//       {/*  //sm:left-64 */}

//       {/* Header */}

//       <div className="fixed top-16 left-0 lg:left-64 right-0 border-b p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between bg-white z-10 space-y-4 sm:space-y-0">
//         {/* Left Side - Blockchain ID & BMVCOINS */}
//         <div className="flex flex-wrap items-center gap-2 sm:gap-4">
//           {/* Blockchain ID - Full on Web, Last 5 on Mobile */}

//           {/* BMVCOINS Button */}
//         </div>

//         {/* Right Side - New Chat Button */}
//         <div
//           className="flex items-center bg-gray-200 rounded-lg p-1 space-x-2 cursor-pointer hover:bg-gray-300 transition"
//           onClick={handleNewChatClick}
//         >
//           <h3 className="font-semibold text-[#3c1973]">New Chat</h3>
//           <PencilSquareIcon className="w-6 h-6 text-[#3c1973]" />
//         </div>
//       </div>

//       {/* Chat Section */}
//       <div className="flex flex-col justify-center items-center fixed top-[177px] left-0 lg:left-64 right-0 bottom-[90px] px-4 bg-white">
//         {/* Static Bubbles (Shown When Not Loading) */}
//         {!isLoading && showStaticBubbles && (
//           <div className="absolute inset-0 flex items-center justify-center bg-opacity-75 z-10">
//             <div className="grid grid-cols-2 gap-4 p-6 w-full max-w-screen-sm mx-auto">
//               {riceTopics?.map((topic) => (
//                 <div
//                   key={topic.id}
//                   className="p-3 bg-gray-100 text-black rounded-lg shadow-md hover:bg-gray-300 transition cursor-pointer text-center"
//                   onClick={() => {
//                     handleBubbleClick(topic.title);
//                     setInput(topic.title);
//                   }}
//                 >
//                   <ReactMarkdown className="font-medium">
//                     {topic.title}
//                   </ReactMarkdown>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Chat Messages Section (Non-Scrollable) */}
//         <div className="w-full max-w-screen-lg flex flex-col space-y-2 flex-grow overflow-y-auto">
//           {/* Loading Indicator (Centered Inside Chat Box) */}
//           {isLoading ? (
//             <div className="flex items-center justify-center flex-grow">
//               <Example variant="loading01" />
//             </div>
//           ) : (
//             messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`p-4 rounded-md shadow-md w-full ${
//                   message.type === "question"
//                     ? "bg-blue-50 border border-blue-300 text-black"
//                     : "bg-green-50 border border-green-300 text-black"
//                 }`}
//               >
//                 <ReactMarkdown>{message.content}</ReactMarkdown>
//                 <div className="flex items-center mt-2 space-x-2">
//                   <button
//                     className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
//                     title="Copy"
//                     onClick={() => handleCopy(message.content)}
//                   >
//                     <FaRegCopy />
//                   </button>
//                   {isReading ? (
//                     <button
//                       className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
//                       title="Stop Read Aloud"
//                       onClick={() => window.speechSynthesis.cancel()}
//                     >
//                       <FaVolumeOff />
//                     </button>
//                   ) : (
//                     <button
//                       className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
//                       title="Read Aloud"
//                       onClick={() => handleReadAloud(message.content)}
//                     >
//                       <FaVolumeUp />
//                     </button>
//                   )}
//                   <button
//                     className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
//                     title="Share"
//                     onClick={() => handleShare(message.content)}
//                   >
//                     <FaShareAlt />
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//           <div ref={bottomRef}></div>
//         </div>
//       </div>

//       {/* Input Bar */}
//       <div className="fixed bottom-0 left-0  lg:left-64 right-0 bg-white p-2 border-t shadow-lg">
//         <div className="flex items-center max-w-screen-lg mx-auto px-4">
//           <div className="flex-grow relative">
//             <input
//               ref={inputRef}
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
//               placeholder="Ask a question..."
//               className="w-full p-4 pl-5 pr-14 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa800] text-gray-800 text-sm md:text-base shadow-md"
//             />
//             <button
//               onClick={() => handleSend(input)}
//               className={`absolute right-4 top-1/2 transform -translate-y-1/2 px-5 py-2 rounded-full text-white font-semibold shadow-lg transition ${
//                 isLoading
//                   ? "bg-gray-300 cursor-not-allowed"
//                   : "bg-[#ffa800] hover:bg-[#ff8c00]"
//               }`}
//               disabled={isLoading}
//             >
//               {isLoading ? "Sending..." : "➤"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default ReviewsGpt;






import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  Plus,
  Clock,
  ChevronRight,
  Search,
  Copy,
  Volume2,
  VolumeX,
  Share2,
  X,
  Menu,
  MessageCircle,
  Check,
  ArrowLeft,
  History,
  Send,
  User,
} from "lucide-react";

import AskOxyLogo from "../../assets/img/askoxylogoblack.png";

interface ChatMessage {
  type: "question" | "answer";
  content: string;
  timestamp: Date;
}

interface SuggestedPrompt {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: Date;
  messages: ChatMessage[];
}

const ReviewsGpt: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showEmptyState, setShowEmptyState] = useState<boolean>(true);
  const [isReading, setIsReading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [lastQuery, setLastQuery] = useState<string>("");
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [inputRows, setInputRows] = useState<number>(1);
  const [hasProcessedUrlQuery, setHasProcessedUrlQuery] =
    useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [questionCount, setQuestionCount] = useState<number>(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setInputRows(
        Math.min(5, Math.ceil(textareaRef.current.scrollHeight / 24))
      );
    }
  }, [input]);

  // Check login status and show modal after 3 questions if not logged in
  // Modified: Check login status and show modal after 4 questions (on the 5th question)
  useEffect(() => {
    const isLogin = localStorage.getItem("userId");
    // Show modal when user tries to ask their 5th question
    if (questionCount >= 4 && !isLogin) {
      setShowModal(true);
    }
  }, [questionCount]);

  // Auto-scroll effect
  useEffect(() => {
    if (bottomRef.current && !showEmptyState) {
      const scrollOptions: ScrollIntoViewOptions = {
        behavior: isLoading ? "auto" : "smooth",
        block: "end" as ScrollLogicalPosition,
      };
      bottomRef.current.scrollIntoView(scrollOptions);
    }
  }, [messages, isLoading, showEmptyState]);

  // Load chat history and handle first visit
  useEffect(() => {
    loadChatHistory();
    const firstVisit = localStorage.getItem("firstVisit");
    if (!firstVisit) {
      setIsFirstVisit(true);
      localStorage.setItem("firstVisit", "false");
    } else {
      setIsFirstVisit(false);
    }
  }, []);

   const riceTopics = [
    {
      id: 1,
      title: "University of Toronto Reviews",
      content: "Discover useful tips!",
    },
    {
      id: 2,
      title: "US Computer Science Universities",
      content: "Seek expert guidance!",
    },
    {
      id: 3,
      title: "Pros and Cons of ANU",
      content: "Learn funding strategies.",
    },
    {
      id: 4,
      title: "INSEAD MBA Program Reviews",
      content: "Find tailored solutions.",
    },
  ];


  // Handle URL query parameters - fixed to prevent duplicate processing
  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query && !hasProcessedUrlQuery) {
      setShowEmptyState(false);
      setIsFirstVisit(false);
      handleSend(query); // <- This triggers the API call when URL has "query"
      setHasProcessedUrlQuery(true); // This flag prevents duplicate in that file
    }
  }, [location.search, hasProcessedUrlQuery]);

  const loadChatHistory = () => {
    try {
      const savedHistory = localStorage.getItem("chatHistory");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setChatHistory(
          parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
            messages: item.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }))
        );
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      localStorage.removeItem("chatHistory");
    }
  };

  const saveChatHistory = () => {
    if (messages.length > 0) {
      const newHistoryItem: ChatHistoryItem = {
        id: crypto.randomUUID(),
        title:
          messages[0].content.slice(0, 50) +
          (messages[0].content.length > 50 ? "..." : ""),
        timestamp: new Date(),
        messages: [...messages],
      };
      const updatedHistory = [newHistoryItem, ...chatHistory].slice(0, 50);
      setChatHistory(updatedHistory);
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      saveChatHistory();
    }
    setMessages([]);
    setShowEmptyState(true);
    setInput("");
    setShowHistory(false);
    setIsFirstVisit(false);
    setHasProcessedUrlQuery(false);
    setLastQuery(""); // Clear last query on new chat
    // Don't reset question count - we want to track this across new chats for the login modal
    navigate("/main/dashboard/reviews-gpt");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSend = async (queryInput: string) => {
    const trimmedQuery = queryInput.trim();

    if (!trimmedQuery || isLoading) return;

    // Skip sending if the query is exactly the same as the last one
    if (trimmedQuery === lastQuery) {
      console.warn("Duplicate query detected, skipping.");
      return;
    }

    setLastQuery(trimmedQuery); // Update last processed query

    setShowEmptyState(false);
    setIsFirstVisit(false);

    // Increment question count before API call
    setQuestionCount((prevCount) => prevCount + 1);

    setMessages((prev) => [
      ...prev,
      {
        type: "question",
        content: trimmedQuery,
        timestamp: new Date(),
      },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");
      const payload = [{ role: "user", content: queryInput }];

      const apiurl =
        userId !== null
          ? `https://meta.oxyloans.com/api/student-service/user/reviews`
          : `https://meta.oxyloans.com/api/student-service/user/reviews`;

      const response = await axios.post(apiurl, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include access token in header
        },
      });
      setMessages((prev) => [
        ...prev,
        {
          type: "answer",
          content: response.data,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          type: "answer",
          content:
            "Sorry, there was an error processing your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleReadAloud = (content: string) => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  const handleShare = async (content: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: content, // Shares only the text content
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      console.warn("Web Share API is not supported in this browser.");
    }
  };

  const loadChatFromHistory = (chat: ChatHistoryItem) => {
    setMessages(chat.messages);
    setShowEmptyState(false);
    setIsFirstVisit(false);
    setShowHistory(false);
  };

  const deleteChatFromHistory = (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedHistory = chatHistory.filter((chat) => chat.id !== chatId);
    setChatHistory(updatedHistory);
    localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
  };

  const handleSignIn = () => {
    navigate("/whatsapplogin");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                          >
                            <ArrowLeft className="h-6 w-6" />
                          </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <History className="w-5 h-5" />
              <span className="hidden sm:inline">History</span>
            </button>
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {/* Chat History Sidebar */}
        {showHistory && (
          <div
            className={`fixed inset-y-16 right-0 w-full sm:w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40${
              showHistory ? "translate-x-16" : "translate-x-full"
            }`}
          >
            <div className="h-full flex flex-col mt-5">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-lg font-semibold">Chat History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <MessageCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p>No chat history yet</p>
                  </div>
                ) : (
                  chatHistory.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => loadChatFromHistory(chat)}
                      className="group flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors mb-2 border border-transparent hover:border-gray-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {chat.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(chat.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => deleteChatFromHistory(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div
          className="h-[calc(100vh-8rem)] overflow-y-auto px-4 py-6"
          ref={chatContainerRef}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full">
            {showEmptyState ? (
              <div className="space-y-6 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {riceTopics.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handleSend(prompt.title)}
                      className="w-full p-4 sm:p-6 text-left bg-white rounded-xl border 
                          hover:border-purple-400 hover:shadow-lg transition-all 
                          duration-200 group"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className="flex-shrink-0 p-2 bg-gray-50 rounded-lg 
                                group-hover:bg-purple-50 transition-colors"
                        >
                          {/* {prompt.icon} */}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-base sm:text-lg font-medium mb-1 
                                 text-gray-800 group-hover:text-purple-600 
                                 line-clamp-1"
                          >
                            {prompt.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {prompt.content}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4 sm:space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex flex-col ${
                        message.type === "question"
                          ? "items-end"
                          : "items-start"
                      }`}
                    >
                      <div
                        className={`w-full sm:max-w-[80%] rounded-lg p-3 sm:p-4 
                            ${
                              message.type === "question"
                                ? "bg-purple-50 text-purple-900"
                                : "bg-gray-100 text-gray-900"
                            }`}
                      >
                        <div className="prose prose-sm sm:prose-base max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>

                        {message.type === "answer" && (
                          <div
                            className="flex items-center justify-end mt-3 space-x-2 
                                  border-t pt-2 border-gray-200"
                          >
                            <button
                              onClick={() => handleCopy(message.content)}
                              className="p-1.5 text-gray-500 hover:text-gray-700 
                                 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              {isCopied ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleReadAloud(message.content)}
                              className="p-1.5 text-gray-500 hover:text-gray-700 
                                 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              {isReading ? (
                                <VolumeX className="w-4 h-4" />
                              ) : (
                                <Volume2 className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleShare(message.content)}
                              className="p-1.5 text-gray-500 hover:text-gray-700 
                                 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 mt-1 px-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>

                {isLoading && (
                  <div className="flex justify-center py-4">
                    <div
                      className="animate-spin rounded-full h-8 w-8 
                            border-b-2 border-gray-900"
                    ></div>
                  </div>
                )}
                <div ref={bottomRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-4 py-3 sticky bottom-0 z-30">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 w-full max-w-3xl mx-auto">
              {/* Textarea Container */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "3rem"; // Reset height
                    e.target.style.height = `${Math.min(
                      e.target.scrollHeight,
                      192
                    )}px`; // Adjust dynamically, max 12rem
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(input);
                    }
                  }}
                  placeholder="Type your message..."
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  style={{
                    minHeight: "3rem",
                    maxHeight: "12rem",
                    overflowY: "auto",
                  }}
                  aria-label="Type your message"
                />
                {/* Character Limit (Optional) */}
                {input.length > 0 && (
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded">
                    {input.length}/500
                  </div>
                )}
              </div>

              {/* Send Button */}
            <button
                            onClick={() => handleSend(input)}
                            disabled={isLoading || !input.trim()}
                            className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            aria-label="Send message"
                          >
                            {isLoading ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                              <Send className="w-6 h-5" />
                            )}
                          </button>
            </div>
          </div>
        </div>

        {/* Login Modal */}
        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => setShowModal(false)} // Close modal when clicking outside
          >
            <div
              className="bg-white rounded-lg p-6 shadow-lg max-w-sm sm:max-w-md w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()} // Prevent modal close on content click
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ❌
              </button>

              {/* Modal Title */}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sign in for unlimited access
              </h3>

              {/* Modal Message */}
              <p className="text-sm text-gray-600 mb-6">
                You've reached the limit for guest users. To continue asking
                questions and unlock all features, please sign in to your
                account.
              </p>

              {/* Action Buttons */}
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Continue as Guest
                </button>
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Sign In Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsGpt;

