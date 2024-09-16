import React, { useEffect, useState } from 'react';
import Image1 from '../assets/img/AD1 (1).jpg';
import Image2 from '../assets/img/AD2.jpg';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import './erice.css';
import { useLocation } from 'react-router-dom';
import B1 from '../assets/img/B1.jpg';
import B2 from '../assets/img/B2.jpg';

interface ChatMessage {
  type: 'question' | 'answer';
  content: string;
}

const Erice = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);

  // Toggle edit state
  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  // Handle New Chat functionality
  const handleNewChatClick = () => {
    // Implement functionality to start a new chat
    console.log("New Chat clicked");
  };

  // Handle image enlargement
  const handleImageClick = (image: string) => {
    setEnlargedImage(image);
  };

  // Close enlarged image modal
  const handleCloseImage = () => {
    setEnlargedImage(null);
  };

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    if (query) {
      handleSend(query);
    }
  }, [query]);

  const handleSend = async (queryInput: string) => {
    if (queryInput.trim() === '') return;

    // Add the user's question to the chat
    setMessages((prev) => [...prev, { type: 'question', content: queryInput }]);
    setInput('');
    setIsLoading(true);
    setQuestionCount((prevCount) => prevCount + 1); // Increment question count

    try {
      // Make API request to the specified endpoint
      const response = await axios.post(
        `https://meta.oxyloans.com/api/student-service/user/erice?InfoType=${queryInput}`
      );

      // Process the API response and update the chat
      setMessages((prev) => [...prev, { type: 'answer', content: response.data }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((prev) => [
        ...prev,
        { type: 'answer', content: 'Sorry, there was an error. Please try again later.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#351664] text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-[#351664] border-b-2 border-white">
        {/* Logo with Icon */}
        <div className="flex items-center m-2 space-x-2 text-2xl font-bold">
          <span className="text-white">ASK</span>
          <span className="text-[#ffa800]">OXY.AI</span>
        </div>
        {/* SignIn/SignUp Buttons */}
        <div className="flex space-x-4">
          <button className="text-white font-medium hover:text-[#ffa800] buttonsing">Sign In</button>
          <button className="text-white font-medium hover:text-[#ffa800] buttonsing">Sign Up</button>
        </div>
      </header>

      <main className="flex flex-grow p-5" style={{ height: '73vh' }}>
        {/* Combined Left and Center Panel */}
        <div className="flex flex-grow overflow-hidden bg-white shadow-md rounded-2xl">
          {/* Left Panel */}
          <aside className="relative hidden w-1/6 p-4 text-black md:block">
            {/* History Header with Edit and New Chat Icons */}
            <div className="flex items-center justify-between mt-4 mb-4 font-bold">
              {/* Edit Icon */}
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
              {/* Centered History Text */}
              <span className="flex-1 text-center">History</span>
              {/* New Chat Icon */}
              {/* <button onClick={handleNewChatClick} className="p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-[#351664]"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button> */}
            </div>
            {isEditing && <p className="text-sm text-[#351664]">Editing mode enabled...</p>}
          </aside>

          {/* Center Panel */}
          <section className="flex flex-col justify-between w-5/6 p-6 rounded-tr-3xl rounded-br-3xl bg-gray-50 md:rounded-none">
  {/* Chat messages */}
          <div 
  className={`p-2 overflow-y-auto chat-container ${questionCount >= 1 ? "cardsize" : "minsize"}`}
  style={{ 
    maxHeight: '70vh', 
    maxWidth: questionCount >= 1 ? 'auto' : '64vw', 
    scrollBehavior: 'smooth' 
  }}
>
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`chat-bubble p-3 rounded-lg text-black mb-2 ${
        msg.type === 'question' ? 'self-start bg-blue-200' : 'self-end bg-green-200'
      }`}
      style={{
        maxWidth: msg.type === 'question' ? '50%' : '80%', // Different width based on message type
        wordWrap: 'break-word',
        float: msg.type === 'question' ? 'left' : 'right', // Float left for questions, right for answers
        clear: 'both', // Ensure messages don't overlap
      }}
    >
      <ReactMarkdown>{typeof msg.content === 'string' ? msg.content : String(msg.content)}</ReactMarkdown>
    </div>
  ))}
</div>


  {/* Input bar with send button */}
<div className="flex items-center p-2 border-t border-gray-300">
  <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Ask about rice information..."
    className="flex-grow p-2 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa800] text-black"
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        handleSend(input);  // Trigger API call on Enter
      }
    }}
  />
  <button
    onClick={() => handleSend(input)}
    className={`ml-2 bg-[#ffa800] text-white px-4 py-2 rounded-full shadow-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    disabled={isLoading}
  >
    {isLoading ? 'Sending...' : 'Send'}
  </button>
</div>

</section>

        </div>

        {/* Right Panel */}
        {questionCount >= 3 && (
  <div className="flex-col hidden w-1/4 ml-4 space-y-2 bg-white shadow-md lg:flex rounded-2xl">
    <div className="flex flex-col flex-grow w-full p-4">
      {/* Download App Section */}
      <div className="flex items-center justify-between w-full mb-4">
        <span className="text-2xl font-bold text-yellow-500">erice.in</span>
        <a href="#" className="text-sm text-blue-500 font-small">
          Download Our App &gt;&gt;
        </a>
      </div>

      {/* Rice List */}
      <div className="flex flex-col w-full h-full p-4 space-y-2 overflow-y-auto bg-gray-100 rounded-lg">
  {[{ name: 'MAATEJA 26 KGS', available: true, image: B1 }, { name: 'GAJRAJ 26 KGS', available: false, image: B2 },{ name: 'MAATEJA 26 KGS', available: true, image: B1 }].map(
    (item, index) => (
      <div key={index} className="flex items-center p-2 space-x-4 border-b border-gray-300">
        {/* Image and Badge */}
        <div className="relative flex-shrink-0">
          {/* Image */}
          <img src={item.image} alt={item.name} className="object-cover w-16 h-16 rounded-full" 
                 onClick={() => handleImageClick(item.image)} />
          {/* Badge */}
        
        </div>
        {/* Item Name */}
        <div className="flex-grow">
          <span className="text-sm font-medium text-gray-700">{item.name}</span>
          <div

                   style={{width:'5.1rem'}}
            className={`m-1 px-2 py-1 text-xs font-bold text-white rounded-full w-6rem ${
              item.available ? 'bg-green-500' : 'bg-red-500'
            }`}   
          >
            {item.available ? 'Available' : 'Unavailable'}
          </div>
        </div>
      </div>
    )
  )}
</div>

    </div>
  </div>
)}


      </main>

      {/* Image Modal for Enlarged Image */}
      {enlargedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <img
            src={enlargedImage}
            alt="Enlarged Rice"
            className="object-cover max-w-full max-h-full sm:max-w-md sm:max-h-md md:max-w-lg md:max-h-lg"
          />
          <button onClick={handleCloseImage} className="absolute top-0 right-0 p-4 text-white">
            Close
          </button>
        </div>
      )}

    </div>
  );
};

export default Erice;
