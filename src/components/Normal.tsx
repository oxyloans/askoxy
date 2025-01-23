import React, { useEffect, useState, useRef } from "react";
import Image1 from "../assets/img/AD1 (1).jpg";
import Image2 from "../assets/img/AD2.jpg";
import ReactMarkdown from "react-markdown";
import axios from "axios";
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
import Pushpa2GPT from "./Pushpa2GPT";
import { FaVolumeOff, FaVolumeUp, FaRegCopy, FaShareAlt } from "react-icons/fa";
import { error } from "console";
import ChatHistory from "./ChatHistory";
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
}

type ChatHistoryItem = {
  id: string;
  userQuations: string;
  ericeQueries: string | null;
};
const Normal = () => {
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
  const scrollableRef = useRef<HTMLDivElement | null>(null);

  // New State for History
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on component mount

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const [chathistory, setChatHistory] = useState<ChatHistoryItem[]>([]);

 



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

  let queryString = window.location.search;
  useEffect(() => {
    // Remove the first "?" from the string
    const result = queryString.replace("?", "").replace(/%20/g, " ");
    console.log(result); // Output: "data"

    const handleSend = async (queryInput: string) => {
      if (queryInput.trim() === "") return;

      // Add the user's question to the chat
      setMessages((prev) => [
        ...prev,
        { type: "question", content: queryInput },
      ]);

      // Save the query to history
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
        // Make API request to the specified endpoint
        setriceTopicsshow(false);
        const response = await axios.post(apiurl);

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
    handleSend(result);
  }, [queryString]);
  // Handle image enlargement
  const handleImageClick = (image: string) => {
    setEnlargedImage(image);
  };

  // useEffect(() => {
  //   const response = axios.get("http://65.0.147.157:9001/api/student-service/user/queries");
  //   response.then((data) => {
  //     console.log(data)
  //     if (data.status === 200) {
  //       console.log(data.data)
  //       setchathistory(data.data)
  //     }

  //   }).catch((error) => {
  //     console.log(error)
  //   })

  // },[])
  // useEffect(() => {
  //   const islogin = localStorage.getItem("userId");
  //   if (questionCount > 3) {
  //     if (islogin) {
  //     } else {
  //       histary("/login");
  //     }
  //   }
  // }, [questionCount]);

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

  const location = useLocation();
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
      const response = await axios.post(
       
        apiurl
      );

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
      navigate(`/normal?${content}`, { replace: true });
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
  // const handleBackToChatClick = () => {
  //   setShowFreerudraksha(false);    // Hide the Freerudraksha component
  //   setShowLeftPanel(true);
  //   setShowVanabhojanam(false)     // Show the left panel again
  // };
  // Handle new chat click
 const handleNewChatClick = () => {
   setMessages([]); // Clear messages
  setriceTopicsshow(true);
  
   navigate("/normal");
   setShowStaticBubbles(true); 
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
    navigate("/normal"); // Redirect to the login page
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
     
        

          {/* SignOut Button */}
          <button
            onClick={() => {
             
             
              navigate("/whatapplogin");
            }}
            // bg-[#04AA6D]
            className="flex items-center 
           
            text-black bg-white   px-4 py-2 rounded-full font-bold"
          >
            
            SignIn
          </button>

         

         
        </div>
      </header>

      {/* <ModalComponent /> */}
      <main className="flex hidden md:block flex-col flex-grow w-full overflow-y-auto p-3 md:flex-row">
        {/* Combined Left, Center, and Right Panel */}
        <div className="flex flex-col  flex-grow bg-white rounded-lg shadow-md lg:flex-row">
          {/* Left Panel */}
          {/* {showLeftPanel && ( */}
          <aside className=" w-full p-3 text-black bg-gray-100 rounded-l-lg md:w-1/6 flex flex-col overflow-y-auto">
            <div className="flex items-center  justify-between font-bold">
              {/* Edit Button */}
              <button
                onClick={() => handleEditClick()}
                className="rounded-md"
                title="Edit"
              >
                <div className="hover:bg-gray-200 p-2 rounded-full">
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
                </div>
              </button>

              {/* History Title */}
              <span className="flex-1 text-center text-[#351664]">History</span>

              {/* New Chat Button */}
              <button
                onClick={handleNewChatClick}
                className="rounded-md"
                title="New Chat"
              >
                <div className="hover:bg-gray-200 p-2 rounded-full">
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
                </div>
              </button>
            </div>

            {/* Editing Mode Indicator */}
            {isEditing && (
              <p className="text-sm text-[#351664] mb-4 text-center">
                Editing mode enabled...
              </p>
            )}

            {/* Chat History */}
            <div className="mt-4 hidden md:block h-80 border-t border-gray-300 pt-2">
              {chathistory.length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center">
                  No history available.
                </p>
              ) : (
                chathistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 mb-4 bg-gray-200 rounded cursor-pointer"
                    onClick={() => handleHistoryItemClick(item.userQuations)}
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

          {/* }) */}

          {/* Center Panel */}
          <section
            ref={scrollableRef}
            className="relative overflow-y-auto rounded-r-lg  rounded-l-lg flex flex-col flex-grow w-full  p-6 md:w-1/2 bg-gray-50"
          >
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
                                onClick={() => window.speechSynthesis.cancel()}
                                title="Stop Read Aloud"
                              >
                                <FaVolumeOff />
                              </button>
                            ) : (
                              <button
                                className="p-2 bg-white mr rounded-full"
                                onClick={() => handleReadAloud(message.content)}
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
          </section>

          {/* Right Panel */}
        </div>
      </main>
    </div>
  );
};

export default Normal;
