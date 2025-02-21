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

interface Image {
  imageId: string;
  imageUrl: string;
  status: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onSelect: (text: string) => void;
  toggleSidebar: () => void; // Function to close the sidebar
  onNewChat: () => void; // Add the onNewChat prop here
}

interface Campaign {
  imageUrls: Image[];
  campaignType: string;
  message: string | null;
  campaignTypeAddBy: string;
  campaignDescription: string;
  campaignStatus: string;
}

const Sidebar: React.FC<SidebarProps> = ({
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
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campigningType, setCampigningType] = useState("");
  const [showcampaigns, setshowcampaigns] = useState(false);

  const items = [
    {
      text: "Free Rudraksha",
      image: FR,
      link: "/dashboard/freerudraksha",
    },
    {
      text: "Free AI & GenAI Training",
      image: FR3,
      link: "/dashboard/freeai-genai",
    },
    {
      text: "Free Rice Samples & Steel Container",
      image: FR2,
      link: "/dashboard/freesample-steelcontainer",
    },
    {
      text: "Study Abroad",
      image: FR1,
      link: "/dashboard/studyabroad",
    },
    {
      text: "Legal Knowledge Hub",
      image: FR5,
      link: "/dashboard/legalservice",
    },
    {
      text: "My Rotary",
      image: FR3,
      link: "/dashboard/myrotary",
    },
    {
      text: "Machines & Manufacturing Services",
      image: FR4,
      link: "/dashboard/machines-manufacturing",
    },
    {
      text: "We Are Hiring",
      image: FR6,
      link: "/dashboard/we-are-hiring",
    },
  ];

  const handleClick = (item: { text: string; link?: string }) => {
    if (item.link) {
      navigate(item.link);
    } else {
      onSelect(item.text);
    }
    toggleSidebar(); // Close the sidebar when an item is clicked
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
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get<Campaign[]>(
          "https://meta.oxyloans.com/api/auth-service/auth/getAllCampaignDetails"
        );
        setCampaigns(response.data);
      } catch (err) {
        console.error(err);
      } finally {
      }
    };

    fetchCampaigns();
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

  const handleCampaignsClick = (campaignType: string) => {
    navigate(`/dashboard/campaign/${campaignType}`);
    toggleSidebar();
  };

  return (
    <aside
      className={`bg-gray-100 text-[#3c1973] text-sm fixed overflow-y-auto font-semibold h-screen transform transition-transform duration-300 z-40 w-64 shadow-lg ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <button
          className="hover:bg-gray-200 p-2 rounded-md transition-all duration-150"
          onClick={handleHistoryButtonClick}
          title={isHistoryVisible ? "Back to Free Services" : "Chat History"}
        >
          <span className="font-medium">
            {isHistoryVisible ? "Free Services" : "Chat History"}
          </span>
        </button>
        <button
          className="hover:bg-gray-200 p-2 rounded-md transition-all duration-150"
          onClick={() => {
            navigate("/dashboard/free-chatgpt");
            toggleSidebar();
          }}
        >
          <span className="font-medium">Free ChatGPT</span>
        </button>
      </div>

      {!isHistoryVisible && (
        <div className="pb-20">
          {" "}
          {/* Add padding-bottom to main container */}
          {/* First Section */}
          <div className="pt-4 px-4 space-y-3">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => handleClick(item)}
                className="flex items-center w-full text-left py-2 px-4 hover:bg-gray-200 rounded-lg transition-all duration-150"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.text}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-[#3c1973] text-sm ml-2 font-medium leading-tight">
                  {item.text}
                </span>
              </button>
            ))}
          </div>
          {/* Second Section */}
          <div className="px-4 space-y-3">
            {campaigns.map((campaign, index) => {
              if (campaign.campaignStatus) {
                return (
                  <button
                    key={`${campaign.campaignType}-${index}`}
                    onClick={() => handleCampaignsClick(campaign.campaignType)}
                    className="flex items-center w-full text-left py-2 px-4 hover:bg-gray-200 rounded-lg transition-all duration-150"
                  >
                    <img
                      src={
                        campaign.imageUrls?.length
                          ? campaign.imageUrls[0]?.imageUrl
                          : ""
                      }
                      alt={campaign.campaignType}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-[#3c1973] text-sm ml-2 font-medium leading-tight">
                      {campaign.campaignType}
                    </span>
                  </button>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* Chat History Section */}
      {isHistoryVisible && (
        <div className="mt-4 p-3 border-t border-gray-300">
          <h3 className="text-md font-semibold text-[#3c1973]">
            Previous History
          </h3>
          {chathistory.length === 0 ? (
            <p className="text-sm text-gray-500 italic text-center mt-2">
              No history available.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {chathistory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 transition-all duration-150"
                  onClick={() => handleHistoryItemClick(item.userQuations)}
                >
                  <Link
                    className="text-sm text-gray-800 truncate w-full"
                    to={`?${encodeURIComponent(item.userQuations)}`}
                  >
                    {truncateText(item.userQuations, 25)}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
