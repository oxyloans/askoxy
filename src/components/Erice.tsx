import React, { useEffect, useState,useRef } from 'react';
import Image1 from '../assets/img/AD1 (1).jpg';
import Image2 from '../assets/img/AD2.jpg';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import './erice.css';
import { useLocation } from 'react-router-dom';
import B1 from '../assets/img/B1.jpg';
import B2 from '../assets/img/B2.jpg';
import { FaCopy, FaVolumeUp, FaRegCopy,FaShareAlt } from 'react-icons/fa';

interface ChatMessage {
  type: 'question' | 'answer';
  content: string;
}

const Erice = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [item , setitem] =useState<boolean>(true)
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false); // Track if user is at the bottom of the chat

  // Function to determine if the user is manually scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = target.scrollHeight - target.scrollTop === target.clientHeight;
    setIsAtBottom(isAtBottom); // Update state based on whether the user is at the bottom
  };

  // Scroll to the bottom whenever messages are updated, if the user is at the bottom
  useEffect(() => {
    if (isAtBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom]);

  // Toggle edit state
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleNewChatClick = () => {
    // Handle the new chat click event
    // For example, you could clear the messages or navigate to a new chat interface
    setMessages([]);
  };

  // Handle image enlargement
  const handleImageClick = (image: string) => {
    setEnlargedImage(image);
  };

  // Close enlarged image modal
  const handleCloseImage = () => {
    setEnlargedImage(null);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault(); // Prevent default Enter key behavior
      handleSend(input);
    }
  };


  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('Message copied to clipboard!');
  };

  const handleReadAloud = (content: string) => {
    const utterance = new SpeechSynthesisUtterance(content);
    window.speechSynthesis.speak(utterance);
  };

  const handleShare = (content: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Chat Message',
        text: content,
        url: window.location.href
      }).catch(error => console.error('Error sharing:', error));
    } else {
      alert('Share functionality is not supported on this device.');
    }
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
<header className="flex flex-col md:flex-row justify-between items-center p-4 bg-[#351664] border-b-2 border-white">
      {/* Logo with Icon */}
      <div className="flex items-center m-2 space-x-2 text-2xl font-bold">
        <span className="text-white">ASK</span>
        <span className="text-[#ffa800]">OXY.AI</span>
      </div>

      {/* SignIn/SignUp Buttons */}
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
        <button className="font-medium text-white hover:text-white">Sign In</button>
        <button className="font-medium text-white hover:text-white">Sign Up</button>
      </div>
    </header>


  <main className="relative flex flex-col flex-grow p-5 md:flex-row" style={{ height: '73vh' }}>
  {/* Combined Left and Center Panel */}
  <div className="flex flex-col flex-grow overflow-hidden bg-white shadow-md md:flex-row rounded-2xl">
    {/* Left Panel */}
   <aside className="relative w-full p-3 text-black md:w-1/5">
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
        <button onClick={handleNewChatClick} className="p-1">
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
        </button>
      </div>

      {/* Editing Mode Indicator */}
      {isEditing && <p className="text-sm text-[#351664]">Editing mode enabled...</p>}
    </aside>

    {/* Center Panel */}
    <section  className="relative flex flex-col flex-grow pt-4 bg-gray-50 md:rounded-none md:w-3/4">
      {/* Chat messages */}
      <div
        className="flex-grow p-2 overflow-y-auto chat-container"
        style={{
          maxHeight: 'calc(100vh - 12rem)', // Adjust height for both mobile and desktop
        }}
        // onScroll={handleScroll}
      >
        {item && (
          <div
            className="center"
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 1,
              marginLeft: '-2rem',
              gap: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              className="image_conatiner"
              onClick={() => {
                setInput('Do you use rice for daily meals or special dishes like biryani?');
                setitem(false);
              }}
            >
              Do you use rice for daily meals or special dishes like biryani?
            </div>
            <div
              className="image_conatiner"
              onClick={() => {
                setInput('Are you looking for organic or regular rice?');
                setitem(false);
              }}
            >
              Are you looking for organic or regular rice?
            </div>
            <div
              className="image_conatiner"
              onClick={() => {
                setInput('What’s your priority when buying rice: price, quality, or origin?');
                setitem(false);
              }}
            >
              What’s your priority when buying rice: price, quality, or origin?
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            <p className="ml-4 text-black">Loading...</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble p-2 rounded-lg text-black mb-2 ${
                msg.type === 'question' ? 'self-start bg-blue-200' : 'self-end bg-green-200'
              }`}
              style={{
                maxWidth: msg.type === 'question' ? '50%' : '80%',
                wordWrap: 'break-word',
                float: msg.type === 'question' ? 'left' : 'right',
                clear: 'both',
              }}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
              {/* Action Buttons */}
              <div className="flex mt-2 space-x-2">
                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(msg.content)}
                  className="p-1 text-gray-700 bg-gray-100 rounded-full hover:text-gray-900 hover:bg-gray-200"
                  title="Copy"
                >
                  <FaRegCopy className="w-4 h-4" />
                </button>
                {/* Read Aloud Button */}
                <button
                  onClick={() => handleReadAloud(msg.content)}
                  className="p-1 text-blue-600 bg-blue-100 rounded-full hover:text-blue-800 hover:bg-blue-200"
                  title="Read Aloud"
                >
                  <FaVolumeUp className="w-4 h-4" />
                </button>
                {/* Share Button */}
                <button
                  onClick={() => handleShare(msg.content)}
                  className="p-1 text-green-600 bg-green-100 rounded-full hover:text-green-800 hover:bg-green-200"
                  title="Share"
                >
                  <FaShareAlt className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
        {/* Invisible div for automatic scrolling to the bottom */}
        {/* <div ref={bottomRef} /> */}
      </div>

      {/* Input Bar, Positioned at the Bottom */}
      <div className="absolute inset-x-0 bottom-0 flex items-center p-2 bg-white border-t border-gray-300 md:relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about rice information..."
          className="flex-grow p-2 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffa800] text-black"
        />
        <button
          onClick={() => handleSend(input)}
          className={`ml-2 bg-[#ffa800] text-white px-4 py-2 rounded-full shadow-md ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </section>
  </div>

  {/* Right Panel */}        
{questionCount >= 2 && (
  <div className="w-full mt-1 bg-white shadow-md rounded-2xl md:w-1/4">
    <div className="flex flex-col flex-grow w-full p-5">
      {/* Download App Section */}
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

      {/* Rice List */}
      <div className="flex flex-col w-full h-full p-4 space-y-2 overflow-y-auto bg-gray-100 rounded-lg">
        {[{ name: 'MAATEJA 26 KGS', available: true, image: B1 }, { name: 'GAJRAJ 26 KGS', available: false, image: B2 }, { name: 'MAATEJA 26 KGS', available: true, image: B1 }].map(
          (item, index) => (
            <div
              key={index}
              className="flex items-center p-2 space-x-4 border-b border-gray-300"
            >
              {/* Image and Badge */}
              <div className="relative flex-shrink-0">
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-16 h-16 rounded-full md:w-20 md:h-20"
                  onClick={() => handleImageClick(item.image)}
                />
              </div>
              {/* Item Name */}
              <div className="flex-grow">
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                <div
                  style={{ width: '5.1rem' }}
                  className={`m-1 px-2 py-1 text-xs font-bold text-white rounded-full ${
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
