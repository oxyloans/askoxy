import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Define the type for each chat history item
type ChatHistoryItem = {
  id: string;
  userQuations: string;
  ericeQueries: string | null;     
};

function ChatHistory1() {
  // Set the type for chat history state
  const [chathistory, setChatHistory] = useState<ChatHistoryItem[]>([]);

  useEffect(() => {
    // Fetch data from the API using axios
    const fetchChatHistory = async () => {
      const userId = localStorage.getItem("userId");
      const apiurl = userId !== null
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


  
  return (
    <div className="mt-4 overflow-y-auto max-h-80">
      {chathistory.length === 0 ? (
        <p className="text-sm text-gray-500">No history available.</p>
      ) : (
        chathistory.map((item, index) => (
            <>
            {item.ericeQueries !== null && <> 
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
          </>}
          </>
        ))
      )}
    </div>
  );
}

export default ChatHistory1;
