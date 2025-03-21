// import React, { useEffect, useState, useRef } from "react";
// import Image1 from "../assets/img/AD1 (1).jpg";
// import Image2 from "../assets/img/AD2.jpg";
// import ReactMarkdown from "react-markdown";
// import axios from "axios";
// import { FaUserCircle } from "react-icons/fa";
// import "./erice.css";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import B1 from "../assets/img/B1.jpg";
// import B2 from "../assets/img/B2.jpg";
// import { FaVolumeOff, FaVolumeUp, FaRegCopy, FaShareAlt } from "react-icons/fa";
// import ChatHistory from "./ChatHistory";
// import ChatHistory1 from "./ChatHistory1";

// import Example from "./Example";
// import AuthorInfo from "./AuthorInfo";

// interface ChatMessage {
//   type: "question" | "answer";
//   content: string;
// }

// interface Message {
//   type: "question" | "answer";
//   content: string;
// }

// interface ChatProps {
//   messages: Message[];
//   isLoading: boolean;
//   isReading: boolean;
//   handleBubbleClick: (content: string) => void;
//   handleCopy: (content: string) => void;
//   handleReadAloud: (content: string) => void;
//   handleStopReadAloud: () => void;
//   handleShare: (content: string) => void;
// }

// type ChatHistoryItem = {
//   id: string;
//   userQuations: string;
//   ericeQueries: string | null;
// };

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
// }

// const Erice = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [input, setInput] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
//   const [questionCount, setQuestionCount] = useState<number>(0);
//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   const [showSendButton, setShowSendButton] = useState(false);
//   const [showStaticBubbles, setShowStaticBubbles] = useState(true);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [showChatHistory, setShowChatHistory] = useState(false);
//   const [isReading, setIsReading] = useState(false);

//   // New State for History
//   const [history, setHistory] = useState<string[]>([]);

//   const [profileData, setProfileData] = useState<ProfileData | null>(null);

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     const apiUrl = `https://meta.oxyloans.com/api/student-service/user/profile?id=${userId}`;

//     axios
//       .get(apiUrl)
//       .then((response) => {
//         console.log(response.data);
//         setProfileData(response.data); // Set the profile data to state
//       })
//       .catch((error) => {
//         console.error("There was an error making the request:", error);
//       });
//   }, []);
//   // Load history from localStorage on component mount
//   useEffect(() => {
//     const storedHistory = localStorage.getItem("chatHistory");
//     if (storedHistory) {
//       setHistory(JSON.parse(storedHistory));
//     }
//   }, []);

//   // Save history to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem("chatHistory", JSON.stringify(history));
//   }, [history]);

//   // Toggle edit state
//   const handleEditClick = () => {
//     setIsEditing(isEditing);
//   };

//   // Handle image enlargement
//   const handleImageClick = (image: string) => {
//     setEnlargedImage(image);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !isLoading) {
//       e.preventDefault(); // Prevent default Enter key behavior
//       handleSend(input);
//     }
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

//   const handleStopReadAloud = () => {
//     window.speechSynthesis.cancel(); // Stop any ongoing speech
//     setIsReading(false); // Set reading state to false
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

//   const userId = localStorage.getItem("userId");
//   const location = useLocation();
//   const query = new URLSearchParams(location.search).get("search") || "";

//   useEffect(() => {
//     if (query) {
//       handleSend(query);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [query]);

//   const handleSend = async (queryInput: string) => {
//     if (queryInput.trim() === "") return;

//     setShowChatHistory(!showChatHistory);

//     // Add the user's question to the chat
//     setMessages((prev) => [...prev, { type: "question", content: queryInput }]);
//     setShowChatHistory(!showChatHistory);
//     // Save the query to history
//     setHistory((prevHistory) => [queryInput, ...prevHistory]);

//     setInput("");
//     setIsLoading(true);
//     setQuestionCount((prevCount) => prevCount + 1); // Increment question count

//     try {
//       const userId = localStorage.getItem("userId");
//       const apiurl =
//         userId !== null
          // ? `https://meta.oxyloans.com/api/student-service/user/Erice?userId=${userId}&prompt=${encodeURIComponent(
          //     queryInput
//             )}`
//           : `https://meta.oxyloans.com/api/student-service/user/Erice?prompt=${encodeURIComponent(
//               queryInput
//             )}`;

//       // Make API request to the specified endpoint
//       const response = await axios.post(
//         // // `https://meta.oxyloans.com/api/student-service/user/erice?infoType=${encodeURIComponent(queryInput)}`
//         // `https://meta.oxyloans.com/api/student-service/user/erice?prompt=${encodeURIComponent(queryInput)}`
//         apiurl
//       );

//       // Process the API response and update the chat
//       setMessages((prev) => [
//         ...prev,
//         { type: "answer", content: response.data },
//       ]);
//     } catch (error) {
//       console.error("Error fetching response:", error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           type: "answer",
//           content: "Sorry, there was an error. Please try again later.",
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Dummy data for rice-related topics
  // const riceTopics = [
  //   {
  //     id: 1,
  //     title: "Rice Cooking Tip",
  //     content: "Get tips and tricks for cooking perfect rice every time.",
  //   },
  //   {
  //     id: 2,
  //     title: "Rice Varieties",
  //     content:
  //       "Learn about different types of rice such as Basmati, Jasmine, and Arborio.",
  //   },
  //   {
  //     id: 3,
  //     title: "Nutritional Information",
  //     content:
  //       "Find out about the nutritional benefits of rice, including calories, vitamins, and minerals.",
  //   },
  //   {
  //     id: 4,
  //     title: "Availability and Sourcing",
  //     content:
  //       "Explore where to buy quality rice and how to choose the best option based on your needs.",
  //   },
  // ];

//   // Handle input change to manage send button visibility and bubble visibility
//   const handleInputChangeWithVisibility = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const value = e.target.value;
//     setInput(value); // Update input value

//     // Show the send button if there is text in the input field
//     setShowSendButton(value.trim() !== "");

//     // Hide static chat bubbles when user starts typing
//     if (showStaticBubbles && value.trim() !== "") {
//       setShowStaticBubbles(false);
//     }
//   };

//   // Handle click on static chat bubble
//   const handleBubbleClick = (content: string) => {
//     console.log("Bubble clicked:", content); // Debugging log
//     setInput(content); // Set input value when a bubble is clicked
//     setShowStaticBubbles(false); // Hide static bubbles after click
//     setShowSendButton(true); // Show send button
//     if (inputRef.current) {
//       inputRef.current.focus(); // Focus the input field
//     }
//   };

//   // Handle new chat click
//   const handleNewChatClick = () => {
//     setMessages([]); // Clear the messages
//     setShowStaticBubbles(true); // Show the static chat bubbles
//     if (inputRef.current) {
//       inputRef.current.value = ""; // Clear the input field
//       setShowSendButton(false); // Hide the send button
//     }
//   };

//   // Handle history item click
//   const handleHistoryItemClick = (historyItem: string) => {
//     setInput(historyItem); // Set input to the history item
//     setShowSendButton(true); // Show send button
//     setShowStaticBubbles(false); // Hide static bubbles
//     if (inputRef.current) {
//       inputRef.current.focus(); // Focus the input field
//     }
//   };

//   const [chathistory, setChatHistory] = useState<ChatHistoryItem[]>([]);

//   useEffect(() => {
//     // Fetch data from the API using axios
//     const fetchChatHistory = async () => {
//       const userId = localStorage.getItem("userId");
//       const apiurl =
//         userId !== null
//           ? `https://meta.oxyloans.com/api/student-service/user/ericehistory?userId=${userId}`
//           : `https://meta.oxyloans.com/api/student-service/user/ricehistory`;

//       try {
//         const response = await axios.get(apiurl);
//         if (response.status === 200) {
//           console.log(response.data);
//           setChatHistory(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching chat history:", error);
//       }
//     };

//     fetchChatHistory(); // Invoke the API call
//   }, []); // Empty dependency array to run once on component mount

//   useEffect(() => {
//     // Fetch data from the API using axios
//     const fetchChatHistory = async () => {
//       const userId = localStorage.getItem("userId");
//       const apiurl =
//         userId !== null
//           ? `https://meta.oxyloans.com/api/student-service/user/ericehistory?userId=${userId}`
//           : `https://meta.oxyloans.com/api/student-service/user/ricehistory`;

//       try {
//         const response = await axios.get(apiurl);
//         if (response.status === 200) {
//           console.log(response.data);
//           setChatHistory(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching chat history:", error);
//       }
//     };

//     fetchChatHistory(); // Invoke the API call
//   }, [input]);
//   // Handle deleting a history item
//   const handleDeleteHistoryItem = (index: number) => {
//     setHistory((prevHistory) => prevHistory.filter((_, i) => i !== index));
//   };

//   const imageData = [
//     {
//       oxyLoans: Image1,
//       link: "https://oxyloans.com/login",
//     },
//     {
//       oxyLoans: Image2,
//       link: "https://erice.in/",
//     },
//   ];

//   const handleSendClick = (input: any) => {
//     setShowChatHistory(!showChatHistory); // Set to true to show ChatHistory1
//   };
//   const navigate = useNavigate(); // Initialize navigate function

//   // Function to handle the click event
//   const handleRedirect = () => {
//     navigate("/"); // Redirect to the login page
//   };
//   const questions = messages.filter((msg) => msg.type === "question");
//   const answers = messages.filter((msg) => msg.type === "answer");

//   useEffect(() => {
//     const islogin = localStorage.getItem("userId");
//     if (questionCount > 3) {
//       if (islogin) {
//       } else {
//         navigate("/login");
//       }
//     }
//   }, [questionCount]);
//   return (
//     <div className="min-h-screen bg-[#351664] text-white flex flex-col">
//       {/* Header */}
//       <header className="flex flex-col md:flex-row justify-between items-center p-4 bg-[#351664] border-b-2 border-white">
//         {/* Logo with Icon */}
//         <button
//           className="flex items-center m-2 text-2xl font-bold bg-transparent border-none cursor-pointer focus:outline-none"
//           // onClick={handleRedirect}
//         >
//           <span className="text-white">ASKOXY</span>
//           <span className="text-[#ffa800]">.AI</span>
//         </button>
//         {/* SignIn/SignUp Buttons */}
//         {/* <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
//           <button className="text-white font-medium hover:text-[#ffa800]">Sign In</button>
//           <button className="text-white font-medium hover:text-[#ffa800]">Sign Up</button>
//         </div> */}
//         <div
//           className="sign-in-container"
//           style={{
//             width: "auto",
//             height: "auto",
//             backgroundColor: "gray",
//             padding: "7px 20px",
//             borderRadius: "50px",
//             color: "white",
//             textAlign: "center",
//             fontWeight: "bold",
//             position: "absolute",
//             right: "5rem",
//           }}
//         >
//           {/* SignIn button with redirection functionality */}

//           <button
//             className=""
//             onClick={() => {
//               localStorage.removeItem("userId");
//               navigate("/whatapplogin");
//             }}
//           >
//             SignOut
//           </button>
//         </div>
//         <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
//           <AuthorInfo
//             name={`${profileData?.firstName || ""} ${
//               profileData?.lastName || ""
//             }`.trim()}
//             location={profileData?.city || ""}
//             email={profileData?.email || ""}
//             number={profileData?.mobileNumber || ""}
//             icon={<FaUserCircle />}
//           />
//         </div>
//       </header>
//       <main className="flex flex-col flex-grow w-full p-3 md:flex-row">
//         {/* Combined Left, Center, and Right Panel */}
//         <div className="flex flex-col flex-grow bg-white rounded-lg shadow-md lg:flex-row">
//           {/* Left Panel */}
//           <aside className="w-full p-3 text-black bg-gray-100 rounded-l-lg md:w-1/6">
//             <div className="flex items-center justify-between mt-4 mb-4 font-bold">
//               <button onClick={handleEditClick} className="p-1">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                   className="w-5 h-5 text-[#351664]"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M16.862 3.487a2.25 2.25 0 113.18 3.18L8.754 17.955l-4.504.5.5-4.504 11.112-11.112z"
//                   />
//                 </svg>
//               </button>
//               <span className="flex-1 text-center">History</span>
//               <button
//                 onClick={handleNewChatClick}
//                 className="p-1 rounded-md"
//                 title="New Chat"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                   className="w-5 h-5 text-[#351664]"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M12 4.5v15m7.5-7.5h-15"
//                   />
//                 </svg>
//               </button>
//             </div>
//             {isEditing && (
//               <p className="text-sm text-[#351664]">Editing mode enabled...</p>
//             )}

//             {/* History List */}
//             {/* <ChatHistory1 /> */}
//             {/* {showChatHistory ? <ChatHistory1 /> : <ChatHistory1 />} */}
//             <div className="mt-4 overflow-y-auto max-h-80">
//               {chathistory.length === 0 ? (
//                 <p className="text-sm text-gray-500">No history available.</p>
//               ) : (
//                 [...chathistory].reverse().map((item, index) => (
//                   <>
//                     {item.ericeQueries !== null && (
//                       <>
//                         <div
//                           key={index}
//                           className="flex items-center justify-between p-2 mb-2 bg-gray-200 rounded cursor-pointer"
//                         >
//                           {/* Link with encoded userQuations */}
//                           <Link
//                             className="text-sm text-gray-800"
//                             to={`?${encodeURIComponent(item.userQuations)}`} // Encode the userQuations
//                           >
//                             {item.ericeQueries}
//                           </Link>
//                         </div>
//                       </>
//                     )}
//                   </>
//                 ))
//               )}
//             </div>
//           </aside>

//           {/* Center Panel */}
//           <section className="relative flex flex-col flex-grow w-full p-6 md:w-1/2 bg-gray-50">
//             <h1
//               className="fw-500"
//               style={{ zIndex: "10", color: "black", fontWeight: "600" }}
//             >
//               Welcome{" "}
//               {profileData
//                 ? `    ${profileData.firstName} ${profileData.lastName}`
//                 : "Guest"}
//             </h1>
//             {/* Static Rice Related Text */}
//             {showStaticBubbles && (
//               <div className="absolute inset-0 flex items-center justify-center p-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   {/* Map over rice topics to create chat bubbles */}
//                   {riceTopics.map((topic) => (
//                     <div
//                       key={topic.id}
//                       className="flex items-center justify-center max-w-xs p-4 text-black transition duration-200 bg-gray-200 rounded-lg chat-bubble hover:bg-gray-300"
//                       style={{
//                         wordWrap: "break-word",
//                         zIndex: "10",
//                       }}
//                       onClick={() => {
//                         handleBubbleClick(topic.title);
//                         setInput(topic.title);
//                       }}
//                     >
//                       <ReactMarkdown className="text-center">
//                         {topic.title}
//                       </ReactMarkdown>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Chat messages */}
//             <div
//               className="relative flex-grow p-2 overflow-y-auto chat-container"
//               style={{ maxHeight: "calc(100vh - 12rem)" }}
//             >
//               <div>
//                 {isLoading ? (
//                   <div className="flex items-center justify-center h-24">
//                     <Example variant="loading01" />
//                   </div>
//                 ) : (
//                   <>
//                     {/* Render Questions followed by their corresponding Answers */}
//                     {messages.map((message, index) => (
//                       <div
//                         key={index}
//                         className={`col-span-8 mb-6 p-3 rounded-md ${
//                           message.type === "question"
//                             ? "bg-blue-200 col-span-3 text-black"
//                             : "bg-green-200 col-span-5 text-black"
//                         }`}
//                       >
//                         <ReactMarkdown>{message.content}</ReactMarkdown>
//                         <div className="flex mt-2 space-x-1">
//                           {/* Copy Button */}
//                           <button
//                             className="p-2 bg-white mr"
//                             onClick={() => handleCopy(message.content)}
//                             title="Copy"
//                           >
//                             <FaRegCopy />
//                           </button>

//                           {/* Speaker (Read Aloud) Button */}
//                           {isReading ? (
//                             <button
//                               className="p-2 bg-white mr"
//                               onClick={() => window.speechSynthesis.cancel()}
//                               title="Stop Read Aloud"
//                             >
//                               <FaVolumeOff />
//                             </button>
//                           ) : (
//                             <button
//                               className="p-2 bg-white mr"
//                               onClick={() => handleReadAloud(message.content)}
//                               title="Read Aloud"
//                             >
//                               <FaVolumeUp />
//                             </button>
//                           )}

//                           {/* Share Button */}
//                           <button
//                             className="p-2 bg-white mr"
//                             onClick={() => handleShare(message.content)}
//                             title="Share"
//                           >
//                             <FaShareAlt />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </>
//                 )}{" "}
//                 <div ref={bottomRef} />
//               </div>
//             </div>
//             {/* Input Bar */}
//             <div className="absolute inset-x-0 bottom-0 flex items-center p-2 bg-white border-t border-gray-300 md:relative">
//               <input
//                 ref={inputRef}
//                 type="text"
//                 value={input}
//                 onChange={handleInputChangeWithVisibility}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Ask about rice information..."
//                 className="flex-grow p-2 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa800] text-black"
//               />
//               {showSendButton && (
//                 <button
//                   onClick={() => {
//                     handleSend(input);
//                     handleSendClick(input);
//                   }}
//                   className={`ml-2 bg-[#ffa800] text-white px-4 py-2 rounded-full shadow-md ${
//                     isLoading ? "opacity-50 cursor-not-allowed" : ""
//                   }`}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Sending..." : "Send"}
//                 </button>
//               )}
//             </div>
//           </section>

//           {/* Right Panel */}
//           {/* {questionCount >= 3 && (
//             <div className="w-full bg-white rounded-lg shadow-md md:w-1/4">
//               <div className="flex flex-col flex-grow w-full p-5">
//                 <div className="flex items-center justify-between w-full mb-4">
//                   <span className="text-2xl font-bold text-yellow-500">erice.in</span>
//                   <a
//                     href="https://play.google.com/store/apps/details?id=erice.customer&hl=en"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-sm font-medium text-blue-500"
//                   >
//                     Download Our App &gt;
//                   </a>
//                 </div>

           
//                 <div className="flex flex-col w-full h-full p-4 space-y-2 overflow-y-auto rounded-lg shadow bg-gray-50">
//                   {[
//                     { name: 'MAATEJA 26 KGS', available: true, image: B1 },
//                     { name: 'GAJRAJ 26 KGS', available: false, image: B2 },
//                     { name: 'MAATEJA 26 KGS', available: true, image: B1 },
//                   ].map((item, index) => (
//                     <div key={index} className="flex items-center p-2 space-x-4 text-white bg-gray-200 rounded-xl">
//                       <div className="relative flex-shrink-0">
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           className="object-cover w-16 h-16 rounded-full cursor-pointer md:w-17 md:h-17"
//                           onClick={() => handleImageClick(item.image)}
//                         />
//                       </div>
//                       <div className="flex-grow">
//                         <span className="text-sm font-medium text-gray-900">{item.name}</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <span className={`text-xs font-bold ${item.available ? 'text-green-700' : 'text-red-700'}`}>
//                           {item.available ? 'Available' : 'Out of stock'}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>


//                 <div className="w-full shadow mt-9 bg-gray-50">
//                   <div className="relative pb-4 overflow-hidden">
//                     <div className="flex mt-4 space-x-1 animate-slider">
//                       {imageData.map((image, index) => (
//                         <div key={index} className="flex-shrink-0 w-40 mx-2 bg-white rounded-md shadow-lg h-18 md:w-80 md:h-36">
//                           <a href={image.link} target="_blank" rel="noopener noreferrer">
//                             <img
//                               src={image.oxyLoans}
//                               alt={`Slider image ${index + 1}`}
//                               className="object-cover w-full h-full rounded-md"
//                             />
//                           </a>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )} */}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Erice;










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

import AskOxyLogo from "../../assets/img/askoxylogostatic.png";

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

const AccomidationGpt: React.FC = () => {
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
    navigate("/main/dashboard/accomdation-gpt");
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
      const apiUrl = `https://meta.oxyloans.com/api/student-service/user/Erice?userId=${userId}&prompt=${encodeURIComponent(queryInput
      )}`;
      const response = await axios.post(apiUrl);

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
                className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                aria-label="Send message"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-5 h-5" />
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

export default AccomidationGpt;


