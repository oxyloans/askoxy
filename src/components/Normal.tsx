import React, { useEffect, useState, useRef } from 'react';
import Image1 from '../assets/img/AD1 (1).jpg';
import Image2 from '../assets/img/AD2.jpg';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import './erice.css';
import { useLocation, useNavigate } from 'react-router-dom';
import B1 from '../assets/img/B1.jpg';
import B2 from '../assets/img/B2.jpg';
import { FaVolumeOff, FaVolumeUp, FaRegCopy, FaShareAlt } from 'react-icons/fa';
import { error } from 'console';
import ChatHistory from './ChatHistory';

interface ChatMessage {
  type: 'question' | 'answer';
  content: string;
}

const Normal = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [showSendButton, setShowSendButton] = useState(false);
  const [chathistory  , setchathistory]=useState([])
  const [riceTopicsshow , setriceTopicsshow] = useState(false)
  const [showStaticBubbles, setShowStaticBubbles] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isReading, setIsReading] = useState(false);
  const histary = useNavigate()

  // New State for History
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('chatHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(history));
  }, [history]);

  
  // Toggle edit state
  const handleEditClick = () => {
    setIsEditing(isEditing);
  };

    let queryString = window.location.search;
  useEffect(() => {

    

  
    
// Remove the first "?" from the string
  const result = queryString.replace('?', '').replace(/%20/g, ' ');
    console.log(result); // Output: "data"

    const handleSend = async (queryInput: string) => {
     
    if (queryInput.trim() === '') return;

    // Add the user's question to the chat
    setMessages(prev => [...prev, { type: 'question', content: queryInput }]);

    // Save the query to history
    setHistory(prevHistory => [queryInput, ...prevHistory]);

    setInput('');
    setIsLoading(true);
    setQuestionCount(prevCount => prevCount + 1); // Increment question count

    try {    
      // Make API request to the specified endpoint
      const response = await axios.post(
        
        `https://meta.oxyloans.com/api/student-service/user/globalChatGpt?InfoType=${encodeURIComponent(queryInput)}`
      );

      // Process the API response and update the chat
      setMessages(prev => [...prev, { type: 'answer', content: response.data }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prev => [
        ...prev,
        { type: 'answer', content: 'Sorry, there was an error. Please try again later.' },
      ]);
    } finally {
      setIsLoading(false);
    }
    };
    handleSend(result);
    
  },[queryString])
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
  useEffect(() => {
   const islogin= localStorage.getItem("userId")
    if (questionCount > 3) {
      if (islogin) {
        
      } else {
        histary("/login")
      }
    }
  },[questionCount])
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
      navigator.share({
        title: 'Chat Message',
        text: content,
        url: window.location.href,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSend = async (queryInput: string) => {
    if (queryInput.trim() === '') return;

    // Add the user's question to the chat
    setMessages(prev => [...prev, { type: 'question', content: queryInput }]);

    // Save the query to history
    setHistory(prevHistory => [queryInput, ...prevHistory]);

    setInput('');
    setIsLoading(true);
    setQuestionCount(prevCount => prevCount + 1); // Increment question count

    try {    
      // Make API request to the specified endpoint
      const response = await axios.post(

        `https://meta.oxyloans.com/api/student-service/user/globalChatGpt?InfoType=${encodeURIComponent(queryInput)}`
      );

      // Process the API response and update the chat
      setMessages(prev => [...prev, { type: 'answer', content: response.data }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prev => [
        ...prev,
        { type: 'answer', content: 'Sorry, there was an error. Please try again later.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Dummy data for rice-related topics
  const riceTopics = [
    { id: 1, title: 'Rice Cooking Tip', content: 'Get tips and tricks for cooking perfect rice every time.' },
    { id: 2, title: 'Rice Varieties', content: 'Learn about different types of rice such as Basmati, Jasmine, and Arborio.' },
    { id: 3, title: 'Nutritional Information', content: 'Find out about the nutritional benefits of rice, including calories, vitamins, and minerals.' },
    { id: 4, title: 'Availability and Sourcing', content: 'Explore where to buy quality rice and how to choose the best option based on your needs.' },
  ];

  // Handle input change to manage send button visibility and bubble visibility
  const handleInputChangeWithVisibility = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value); // Update input value

    // Show the send button if there is text in the input field
    setShowSendButton(value.trim() !== '');

    // Hide static chat bubbles when user starts typing
    if (showStaticBubbles && value.trim() !== '') {
      setShowStaticBubbles(false);
    }
  };

  // Handle click on static chat bubble
  const handleBubbleClick = (content: string) => {
 
    console.log('Bubble clicked:', content); // Debugging log
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
      inputRef.current.value = ''; // Clear the input field
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

  // Handle deleting a history item
  const handleDeleteHistoryItem = (index: number) => {
    setHistory(prevHistory => prevHistory.filter((_, i) => i !== index));
  };

  const imageData = [
    {
      oxyLoans: Image1,
      link: 'https://oxyloans.com/login',
    },
    {
      oxyLoans: Image2,
      link: 'https://erice.in/',
    },
  ];

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
          <button className="text-white font-medium hover:text-[#ffa800]">Sign In</button>
          <button className="text-white font-medium hover:text-[#ffa800]">Sign Up</button>
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
              <button onClick={handleNewChatClick} className="p-1 rounded-md" title="New Chat" >
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
            {isEditing && <p className="text-sm text-[#351664]">Editing mode enabled...</p>}

            {/* History List */}
        <ChatHistory />
          </aside>

          {/* Center Panel */}
          <section className="relative flex flex-col flex-grow w-full p-6 md:w-1/2 bg-gray-50">
            {/* Static Rice Related Text */}
            {showStaticBubbles && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Map over rice topics to create chat bubbles */}
                  {riceTopicsshow && <>      {riceTopics.map(topic => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-center max-w-xs p-4 text-black transition duration-200 bg-gray-200 rounded-lg chat-bubble hover:bg-gray-300"
                      style={{
                        wordWrap: 'break-word',
                        zIndex:'10'
                      }}
                      onClick={() => { handleBubbleClick(topic.title); setInput(topic.title)}}
                    >
                      <ReactMarkdown className="text-center">{topic.title}</ReactMarkdown>
                    </div>
                  ))}</>}
            
                </div>
              </div>
            )}

            {/* Chat messages */}
            <div
              className="relative flex-grow p-2 overflow-y-auto chat-container"
              style={{ maxHeight: 'calc(100vh - 12rem)' }}
            >
              <div>
                {isLoading ? (
                  <div className="flex items-center justify-center h-24">
                    <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                    <p className="ml-4 text-black">Loading...</p>
                  </div>
                ) : (
                  <>
                    {/* Chat bubbles from messages */}
                    {messages.map((msg, index) => (
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
                        onClick={() => handleBubbleClick(msg.content)}
              //                   onClick={() => {
              //   setInput('Do you use rice for daily meals or special dishes like biryani?');
              //   setitem(false);
              // }}
                      >
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                        <div className="flex mt-2 space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(msg.content);
                            }}
                            className="p-1 text-gray-700 bg-white rounded-full hover:text-gray-900 hover:bg-gray-200"
                            title="Copy"
                          >
                            <FaRegCopy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              isReading ? handleStopReadAloud() : handleReadAloud(msg.content); // Ternary to toggle functionality
                            }}
                            className={`${
                              isReading ? 'text-red-600 hover:text-red-800 bg-red-200' : 'text-blue-600 hover:text-blue-800 bg-blue-200'
                            } bg-white rounded-full p-1 ml-2`}
                            title={isReading ? 'Stop Read Aloud' : 'Read Aloud'}
                          >
                            {isReading ? <FaVolumeOff className="w-4 h-4" /> : <FaVolumeUp className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(msg.content);
                            }}
                            className="p-1 text-green-600 bg-white rounded-full hover:text-green-800 hover:bg-green-200"
                            title="Share"
                          >
                            <FaShareAlt className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div ref={bottomRef} />
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
                  onClick={() => handleSend(input)}
                  className={`ml-2 bg-[#ffa800] text-white px-4 py-2 rounded-full shadow-md ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              )}
            </div>
          </section>

          {/* Right Panel */}
  
        </div>
      </main>
    </div>
  );
};

export default Normal;