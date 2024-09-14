import React, { useEffect, useState } from 'react';
import Image1 from'../assets/img/AD1 (1).jpg';
import Image2 from '../assets/img/AD2.jpg';
import ReactMarkdown from 'react-markdown';
import axios from 'axios'
import './erice.css'
import { useLocation } from 'react-router-dom';


interface ChatMessage {           
  type: 'question' | 'answer';
  content: string;
}
const Erice = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Toggle edit state
  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  // Handle New Chat functionality
  const handleNewChatClick = () => {
    // Implement functionality to start a new chat
    console.log("New Chat clicked");
  };

 const location = useLocation();
  const query = new URLSearchParams(location.search).get('search') || '';
  const [messages, setMessages] = useState<{ type: string; content: string }[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (query) {
      handleSend(query);
    }
  }, []);

  const handleSend = async (queryInput: string) => {
    if (queryInput.trim() === '') return;

    // Add the user's question to the chat
    setMessages([...messages, { type: 'question', content: queryInput }]);
    setInput('');
    setIsLoading(true);

    try {
      // Make API request to the specified endpoint
      const response = await axios.post(
        `http://182.18.139.138:9001/api/student-service/user/erice?InfoType=${encodeURIComponent(queryInput)}`
      );

      // Process the API response and update the chat
      setMessages([...messages, { type: 'question', content: queryInput }, { type: 'answer', content: response.data }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages([...messages, { type: 'question', content: queryInput }, { type: 'answer', content: 'Sorry, there was an error. Please try again later.' }]);
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
      <button className="text-white font-medium hover:text-[#ffa800]">Sign In</button>
      <button className="text-white font-medium hover:text-[#ffa800]">Sign Up</button>
    </div>
  </header>

  {/* Main Content */}
  <main className="flex flex-grow p-4" style={{ height: '73vh' }}>
    {/* Left Panel */}
<aside className="relative hidden w-1/6 p-4 text-black bg-white shadow-md md:block">
  {/* History Header with Edit and New Chat Icons */}
  <div className="flex items-center justify-between mt-4 mb-4 font-bold">
    {/* Edit Icon */}
    <button onClick={handleEditClick} className="p-1">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-[#351664]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.18 3.18L8.754 17.955l-4.504.5.5-4.504 11.112-11.112z" />
      </svg>
    </button>
    {/* Centered History Text */}
    <span className="flex-1 text-center">History</span>
    {/* New Chat Icon */}
    <button onClick={handleNewChatClick} className="p-1">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-[#351664]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  </div>
  {/* Editing state notification */}
  {isEditing && <p className="text-sm text-[#351664]">Editing mode enabled...</p>}
</aside>

    {/* Center Panel */}
<section className="flex flex-col justify-between w-4/6 p-6 rounded-tr-3xl rounded-br-3xl rounded-tl-3xl rounded-bl-3xl bg-gray-50 md:rounded-none">
  {/* Chat messages */}
<div className="grid grid-cols-6 gap-4 p-2 overflow-y-auto">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`chat-bubble ${msg.type === 'question' ? 'question' : 'answer'} p-3 rounded-lg break-words`}
      style={{ gridColumn: msg.type === 'question' ? 'span 3' : 'span 6' }}
    >
      <ReactMarkdown>
        {typeof msg.content === 'string' ? msg.content : String(msg.content)}
      </ReactMarkdown>
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
    />
  <button
        onClick={()=>handleSend(input)}
        className={`ml-2 bg-[#ffa800] text-white px-4 py-2 rounded-full shadow-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
  </div>
</section>





    {/* Right Panel */}
<aside className="flex-col items-start hidden w-1/4 p-4 ml-4 space-y-2 text-black bg-white md:flex md:none">
  {/* Download App Section */}
  <div className="flex items-center justify-between w-full mb-4">
    <span className="text-2xl font-bold text-yellow-500">erice.in</span>
    <a href="#" className="text-blue-500 font-small"  style={{fontSize:'14px'}}>Download Our App &gt;&gt;</a>
  </div>

  {/* Rice List */}
  <div className="flex flex-col w-full p-4 space-y-2 overflow-y-auto bg-gray-100 rounded-lg shadow-md max-h-60">
    {[
      { name: "Basmati Rice", available: true, image: "https://via.placeholder.com/50?text=Basmati" },
      { name: "Arborio Rice", available: false, image: "https://via.placeholder.com/50?text=Arborio" },
      { name: "Gajaraj Rice", available: true, image: "https://via.placeholder.com/50?text=Gajaraj" },
      { name: "Brown Rice", available: false, image: "https://via.placeholder.com/50?text=Brown" },
      { name: "Jasmine Rice", available: true, image: "https://via.placeholder.com/50?text=Jasmine" },
      { name: "Grain Rice", available: true, image: "https://via.placeholder.com/50?text=Short+Grain" },
      { name: "Grain Rice", available: true, image: "https://via.placeholder.com/50?text=Long+Grain" },
      { name: "Wild Rice", available: false, image: "https://via.placeholder.com/50?text=Wild" }
    ].map((rice, index) => (
      <div key={index} className="flex items-center justify-between w-full pb-1 border-b">
        <div className="flex items-center space-x-2">
          <img src={rice.image} alt={rice.name} className="object-cover w-10 h-10 rounded-full" />
          <span>{rice.name}</span>
        </div>
        <button
          className={`py-1 px-2 rounded-full ${rice.available ? 'bg-green-500' : 'bg-red-500'} text-white font-small`} 
          style={{ fontSize: '13px' }}
        >
          {rice.available ? "Order Now" : "Not Available"}
        </button>
      </div>
    ))}
  </div>

  {/* Advertisement Section */}
  <div className="relative flex flex-col w-full p-4 space-y-2 overflow-hidden bg-gray-100 rounded-lg shadow-md max-h-96">
    {/* Image Carousel */}
    <div className="relative w-full h-32 overflow-hidden bg-gray-200 rounded-lg">
      <div className="flex w-full h-full animate-marquee">
        {[Image1, Image2].map((src, index) => (
          <img key={index} src={src} alt={`Slide ${index + 1}`} className="object-cover w-1/2 h-full mr-4 rounded-lg shadow-lg" />
        ))}
      </div>
    </div>
  </div>
</aside>

  </main>
</div>

  );
};

export default Erice;
