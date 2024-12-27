import React, { useEffect, useState, useRef } from "react";
import Image1 from "../assets/img/AD1 (1).jpg";
import Image2 from "../assets/img/AD2.jpg";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import "./erice.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import B1 from "../assets/img/B1.jpg";
import B2 from "../assets/img/B2.jpg";
import { FaVolumeOff, FaVolumeUp, FaRegCopy, FaShareAlt } from "react-icons/fa";
import ChatHistory from "./ChatHistory";
import ChatHistory1 from "./ChatHistory1";

import Example from "./Example";
import AuthorInfo from "./AuthorInfo";

interface ChatMessage {
  type: "question" | "answer";
  content: string;
}

interface Message {
  type: "question" | "answer";
  content: string;
}

interface ChatProps {
  messages: Message[];
  isLoading: boolean;
  isReading: boolean;
  handleBubbleClick: (content: string) => void;
  handleCopy: (content: string) => void;
  handleReadAloud: (content: string) => void;
  handleStopReadAloud: () => void;
  handleShare: (content: string) => void;
}

type ChatHistoryItem = {
  id: string;
  userQuations: string;
  ericeQueries: string | null;
};

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
}

const Erice = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [showSendButton, setShowSendButton] = useState(false);
  const [showStaticBubbles, setShowStaticBubbles] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [isReading, setIsReading] = useState(false);

  // New State for History
  const [history, setHistory] = useState<string[]>([]);

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const apiUrl = `https://meta.oxyloans.com/api/student-service/user/profile?id=${userId}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setProfileData(response.data); // Set the profile data to state
      })
      .catch((error) => {
        console.error("There was an error making the request:", error);
      });
  }, []);
  // Load history from localStorage on component mount
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

  // Toggle edit state
  const handleEditClick = () => {
    setIsEditing(isEditing);
  };

  // Handle image enlargement
  const handleImageClick = (image: string) => {
    setEnlargedImage(image);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault(); // Prevent default Enter key behavior
      handleSend(input);
    }
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

  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => {
    if (query) {
      handleSend(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSend = async (queryInput: string) => {
    if (queryInput.trim() === "") return;

    setShowChatHistory(!showChatHistory);

    // Add the user's question to the chat
    setMessages((prev) => [...prev, { type: "question", content: queryInput }]);
    setShowChatHistory(!showChatHistory);
    // Save the query to history
    setHistory((prevHistory) => [queryInput, ...prevHistory]);

    setInput("");
    setIsLoading(true);
    setQuestionCount((prevCount) => prevCount + 1); // Increment question count

    try {
      const userId = localStorage.getItem("userId");
      const apiurl =
        userId !== null
          ? `https://meta.oxyloans.com/api/student-service/user/Erice?userId=${userId}&prompt=${encodeURIComponent(
              queryInput
            )}`
          : `https://meta.oxyloans.com/api/student-service/user/Erice?prompt=${encodeURIComponent(
              queryInput
            )}`;

      // Make API request to the specified endpoint
      const response = await axios.post(
        // // `https://meta.oxyloans.com/api/student-service/user/erice?infoType=${encodeURIComponent(queryInput)}`
        // `https://meta.oxyloans.com/api/student-service/user/erice?prompt=${encodeURIComponent(queryInput)}`
        apiurl
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

  // Dummy data for rice-related topics
  const riceTopics = [
    {
      id: 1,
      title: "Rice Cooking Tip",
      content: "Get tips and tricks for cooking perfect rice every time.",
    },
    {
      id: 2,
      title: "Rice Varieties",
      content:
        "Learn about different types of rice such as Basmati, Jasmine, and Arborio.",
    },
    {
      id: 3,
      title: "Nutritional Information",
      content:
        "Find out about the nutritional benefits of rice, including calories, vitamins, and minerals.",
    },
    {
      id: 4,
      title: "Availability and Sourcing",
      content:
        "Explore where to buy quality rice and how to choose the best option based on your needs.",
    },
  ];

  // Handle input change to manage send button visibility and bubble visibility
  const handleInputChangeWithVisibility = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setInput(value); // Update input value

    // Show the send button if there is text in the input field
    setShowSendButton(value.trim() !== "");

    // Hide static chat bubbles when user starts typing
    if (showStaticBubbles && value.trim() !== "") {
      setShowStaticBubbles(false);
    }
  };

  // Handle click on static chat bubble
  const handleBubbleClick = (content: string) => {
    console.log("Bubble clicked:", content); // Debugging log
    setInput(content); // Set input value when a bubble is clicked
    setShowStaticBubbles(false); // Hide static bubbles after click
    setShowSendButton(true); // Show send button
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input field
    }
  };

  // Handle new chat click
  const handleNewChatClick = () => {
    setMessages([]); // Clear the messages
    setShowStaticBubbles(true); // Show the static chat bubbles
    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the input field
      setShowSendButton(false); // Hide the send button
    }
  };

  // Handle history item click
  const handleHistoryItemClick = (historyItem: string) => {
    setInput(historyItem); // Set input to the history item
    setShowSendButton(true); // Show send button
    setShowStaticBubbles(false); // Hide static bubbles
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input field
    }
  };

  const [chathistory, setChatHistory] = useState<ChatHistoryItem[]>([]);

  useEffect(() => {
    // Fetch data from the API using axios
    const fetchChatHistory = async () => {
      const userId = localStorage.getItem("userId");
      const apiurl =
        userId !== null
          ? `https://meta.oxyloans.com/api/student-service/user/ericehistory?userId=${userId}`
          : `https://meta.oxyloans.com/api/student-service/user/ricehistory`;

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
    // Fetch data from the API using axios
    const fetchChatHistory = async () => {
      const userId = localStorage.getItem("userId");
      const apiurl =
        userId !== null
          ? `https://meta.oxyloans.com/api/student-service/user/ericehistory?userId=${userId}`
          : `https://meta.oxyloans.com/api/student-service/user/ricehistory`;

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
  }, [input]);
  // Handle deleting a history item
  const handleDeleteHistoryItem = (index: number) => {
    setHistory((prevHistory) => prevHistory.filter((_, i) => i !== index));
  };

  const imageData = [
    {
      oxyLoans: Image1,
      link: "https://oxyloans.com/login",
    },
    {
      oxyLoans: Image2,
      link: "https://erice.in/",
    },
  ];

  const handleSendClick = (input: any) => {
    setShowChatHistory(!showChatHistory); // Set to true to show ChatHistory1
  };
  const navigate = useNavigate(); // Initialize navigate function

  // Function to handle the click event
  const handleRedirect = () => {
    navigate("/"); // Redirect to the login page
  };
  const questions = messages.filter((msg) => msg.type === "question");
  const answers = messages.filter((msg) => msg.type === "answer");

  useEffect(() => {
    const islogin = localStorage.getItem("userId");
    if (questionCount > 3) {
      if (islogin) {
      } else {
        navigate("/login");
      }
    }
  }, [questionCount]);
  return (
    <div className="min-h-screen bg-[#351664] text-white flex flex-col">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center p-4 bg-[#351664] border-b-2 border-white">
        {/* Logo with Icon */}
        <button
          className="flex items-center m-2 text-2xl font-bold bg-transparent border-none cursor-pointer focus:outline-none"
          // onClick={handleRedirect}
        >
          <span className="text-white">ASKOXY</span>
          <span className="text-[#ffa800]">.AI</span>
        </button>
        {/* SignIn/SignUp Buttons */}
        {/* <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
          <button className="text-white font-medium hover:text-[#ffa800]">Sign In</button>
          <button className="text-white font-medium hover:text-[#ffa800]">Sign Up</button>
        </div> */}
        <div
          className="sign-in-container"
          style={{
            width: "auto",
            height: "auto",
            backgroundColor: "gray",
            padding: "7px 20px",
            borderRadius: "50px",
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            position: "absolute",
            right: "5rem",
          }}
        >
          {/* SignIn button with redirection functionality */}

          <button
            className=""
            onClick={() => {
              localStorage.removeItem("userId");
              navigate("/whatapplogin");
            }}
          >
            SignOut
          </button>


          
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
          <AuthorInfo
            name={`${profileData?.firstName || ""} ${
              profileData?.lastName || ""
            }`.trim()}
            location={profileData?.city || ""}
            email={profileData?.email || ""}
            icon={<FaUserCircle />}
          />
        </div>
      </header>
      <main className="flex flex-col flex-grow w-full p-3 md:flex-row">
        {/* Combined Left, Center, and Right Panel */}
        <div className="flex flex-col flex-grow bg-white rounded-lg shadow-md lg:flex-row">
          {/* Left Panel */}
          <aside className="w-full p-3 text-black bg-gray-100 rounded-l-lg md:w-1/6">
            <div className="flex items-center justify-between mt-4 mb-4 font-bold">
              <button onClick={handleEditClick} className="p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-[#351664]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 3.487a2.25 2.25 0 113.18 3.18L8.754 17.955l-4.504.5.5-4.504 11.112-11.112z"
                  />
                </svg>
              </button>
              <span className="flex-1 text-center">History</span>
              <button
                onClick={handleNewChatClick}
                className="p-1 rounded-md"
                title="New Chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-[#351664]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </div>
            {isEditing && (
              <p className="text-sm text-[#351664]">Editing mode enabled...</p>
            )}

            {/* History List */}
            {/* <ChatHistory1 /> */}
            {/* {showChatHistory ? <ChatHistory1 /> : <ChatHistory1 />} */}
            <div className="mt-4 overflow-y-auto max-h-80">
              {chathistory.length === 0 ? (
                <p className="text-sm text-gray-500">No history available.</p>
              ) : (
                [...chathistory].reverse().map((item, index) => (
                  <>
                    {item.ericeQueries !== null && (
                      <>
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 mb-2 bg-gray-200 rounded cursor-pointer"
                        >
                          {/* Link with encoded userQuations */}
                          <Link
                            className="text-sm text-gray-800"
                            to={`?${encodeURIComponent(item.userQuations)}`} // Encode the userQuations
                          >
                            {item.ericeQueries}
                          </Link>
                        </div>
                      </>
                    )}
                  </>
                ))
              )}
            </div>
          </aside>

          {/* Center Panel */}
          <section className="relative flex flex-col flex-grow w-full p-6 md:w-1/2 bg-gray-50">
            <h1
              className="fw-500"
              style={{ zIndex: "10", color: "black", fontWeight: "600" }}
            >
              Welcome{" "}
              {profileData
                ? `    ${profileData.firstName} ${profileData.lastName}`
                : "Guest"}
            </h1>
            {/* Static Rice Related Text */}
            {showStaticBubbles && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Map over rice topics to create chat bubbles */}
                  {riceTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-center max-w-xs p-4 text-black transition duration-200 bg-gray-200 rounded-lg chat-bubble hover:bg-gray-300"
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
                </div>
              </div>
            )}

            {/* Chat messages */}
            <div
              className="relative flex-grow p-2 overflow-y-auto chat-container"
              style={{ maxHeight: "calc(100vh - 12rem)" }}
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
                            className="p-2 bg-white mr"
                            onClick={() => handleCopy(message.content)}
                            title="Copy"
                          >
                            <FaRegCopy />
                          </button>

                          {/* Speaker (Read Aloud) Button */}
                          {isReading ? (
                            <button
                              className="p-2 bg-white mr"
                              onClick={() => window.speechSynthesis.cancel()}
                              title="Stop Read Aloud"
                            >
                              <FaVolumeOff />
                            </button>
                          ) : (
                            <button
                              className="p-2 bg-white mr"
                              onClick={() => handleReadAloud(message.content)}
                              title="Read Aloud"
                            >
                              <FaVolumeUp />
                            </button>
                          )}

                          {/* Share Button */}
                          <button
                            className="p-2 bg-white mr"
                            onClick={() => handleShare(message.content)}
                            title="Share"
                          >
                            <FaShareAlt />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}{" "}
                <div ref={bottomRef} />
              </div>
            </div>
            {/* Input Bar */}
            <div className="absolute inset-x-0 bottom-0 flex items-center p-2 bg-white border-t border-gray-300 md:relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChangeWithVisibility}
                onKeyDown={handleKeyDown}
                placeholder="Ask about rice information..."
                className="flex-grow p-2 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa800] text-black"
              />
              {showSendButton && (
                <button
                  onClick={() => {
                    handleSend(input);
                    handleSendClick(input);
                  }}
                  className={`ml-2 bg-[#ffa800] text-white px-4 py-2 rounded-full shadow-md ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              )}
            </div>
          </section>

          {/* Right Panel */}
          {/* {questionCount >= 3 && (
            <div className="w-full bg-white rounded-lg shadow-md md:w-1/4">
              <div className="flex flex-col flex-grow w-full p-5">
                <div className="flex items-center justify-between w-full mb-4">
                  <span className="text-2xl font-bold text-yellow-500">erice.in</span>
                  <a
                    href="https://play.google.com/store/apps/details?id=erice.customer&hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-500"
                  >
                    Download Our App &gt;
                  </a>
                </div>

           
                <div className="flex flex-col w-full h-full p-4 space-y-2 overflow-y-auto rounded-lg shadow bg-gray-50">
                  {[
                    { name: 'MAATEJA 26 KGS', available: true, image: B1 },
                    { name: 'GAJRAJ 26 KGS', available: false, image: B2 },
                    { name: 'MAATEJA 26 KGS', available: true, image: B1 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center p-2 space-x-4 text-white bg-gray-200 rounded-xl">
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-cover w-16 h-16 rounded-full cursor-pointer md:w-17 md:h-17"
                          onClick={() => handleImageClick(item.image)}
                        />
                      </div>
                      <div className="flex-grow">
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-bold ${item.available ? 'text-green-700' : 'text-red-700'}`}>
                          {item.available ? 'Available' : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>


                <div className="w-full shadow mt-9 bg-gray-50">
                  <div className="relative pb-4 overflow-hidden">
                    <div className="flex mt-4 space-x-1 animate-slider">
                      {imageData.map((image, index) => (
                        <div key={index} className="flex-shrink-0 w-40 mx-2 bg-white rounded-md shadow-lg h-18 md:w-80 md:h-36">
                          <a href={image.link} target="_blank" rel="noopener noreferrer">
                            <img
                              src={image.oxyLoans}
                              alt={`Slider image ${index + 1}`}
                              className="object-cover w-full h-full rounded-md"
                            />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </main>
    </div>
  );
};

export default Erice;
