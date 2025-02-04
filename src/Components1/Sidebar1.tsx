import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import FR from "../assets/img/R1.png";
import FR1 from "../assets/img/R22.jpg";
import FR2 from "../assets/img/freesample.jpg";
import FR3 from "../assets/img/freeaiandgenai.png";
import FR4 from "../assets/img/machines.png";
import FR5 from "../assets/img/legail.jpg";
import FR6 from "../assets/img/wearehiring.png";

type ChatHistoryItem = {
  id: string;
  userQuations: string;
  ericeQueries: string | null;
};
interface SidebarProps {
  isOpen: boolean;
  onSelect: (text: string) => void;
  toggleSidebar: () => void; // Function to close the sidebar
  onNewChat: () => void; // Add the onNewChat prop here
}

const Sidebar1: React.FC<SidebarProps> = ({
  isOpen,
  onSelect,
  toggleSidebar,
  onNewChat,
}) => {
  const navigate = useNavigate();
  const [chathistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [input, setInput] = useState<string>("");
  const [showSendButton, setShowSendButton] = useState(false);
  // New State for History
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

//   const items = [
//     {
//       text: "Free Rudraksha",
//       image: FR,
//       link: "/dashboard/freerudraksha",
//     },
//     {
//       text: "Free AI & GenAI Training",
//       image: FR3,
//       link: "/dashboard/freeai-genai",
//     },
//     {
//       text: "Free Rice Samples & Steel Container",
//       image: FR2,
//       link: "/dashboard/freesample-steelcontainer",
//     },
//     {
//       text: "Study Abroad",
//       image: FR1,
//       link: "/dashboard/studyabroad",
//     },
//     {
//       text: "Legal Services",
//       image: FR5,
//       link: "/dashboard/legalservice",
//     },
//     {
//       text: "My Rotary",
//       image: FR3,
//       link: "/dashboard/myrotary",
//     },
//     {
//       text: "Machines & Manufacturing Services",
//       image: FR4,
//       link: "/dashboard/machines-manufacturing",
//     },
//     {
//       text: "We Are Hiring",
//       image: FR6,
//       link: "/dashboard/we-are-hiring",
//     },
//   ];

//   const handleClick = (item: { text: string; link?: string }) => {
//     if (item.link) {
//       navigate(item.link);
//     } else {
//       onSelect(item.text);
//     }
//     toggleSidebar(); // Close the sidebar when an item is clicked
//   };
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
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }, [history]);

  const handleHistoryItemClick = (historyItem: string) => {
    setInput(historyItem); // Set input to the history item
    setShowSendButton(true); // Show send button
    // Hide static bubbles
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
    setIsHistoryVisible(!isHistoryVisible);
    // Toggle the drawer visibility
  };

  return (
    <aside
      className={`bg-gray-100 text-[#3c1973] text-sm fixed  overflow-y-auto font-bold  h-full transform transition-transform duration-300 z-40 w-64 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="flex items-center pt-2 px-2 justify-between font-bold border-b pb-2 border-gray-300">
        <button
          className="hover:bg-gray-200 p-2 rounded-md"

        >
          <div className="hover:bg-gray-200 p-1 text-[#3c1973] rounded-lg">
          Chat History
          </div>
        </button>
        <button
          className="hover:bg-gray-200 p-2 rounded-md"
          onClick={() => {
            navigate("/normal");
            toggleSidebar(); // Close Sidebar after clicking
          }}
        >
          Free ChatGPT
        </button>
      </div>

     
      <div
        className={`mt-2 h-80 border-gray-300 pt-2 transition-all  duration-300`}
      >
        <div className="flex mt-3 mb-2 ml-2 border-b border-gray-100 text-[#3c1973] text-md">
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
  );
};

export default Sidebar1;
