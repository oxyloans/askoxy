import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaVolumeOff, FaVolumeUp, FaRegCopy, FaShareAlt } from 'react-icons/fa';
import './erice.css';

interface ChatMessage {
  type: 'question' | 'answer';
  content: string;
}

const ExampleComponent = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSendButton, setShowSendButton] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load chat history on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('chatHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Save chat history
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(history));
  }, [history]);

  // Handle sending a message
  const handleSend = async (queryInput: string) => {
    if (!queryInput.trim()) return;
    setMessages((prev) => [...prev, { type: 'question', content: queryInput }]);
    setHistory((prev) => [queryInput, ...prev]);
    setInput('');
    setIsLoading(true);
    setQuestionCount((prev) => prev + 1);

    try {
      const response = await axios.post(`https://meta.oxyloans.com/api/student-service/user/globalChatGpt?InfoType=${encodeURIComponent(queryInput)}`);
      setMessages((prev) => [...prev, { type: 'answer', content: response.data }]);
    } catch (error) {
      setMessages((prev) => [...prev, { type: 'answer', content: 'Sorry, there was an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change and visibility of the send button
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setShowSendButton(e.target.value.trim() !== '');
  };

  // Handle 'Enter' keypress to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend(input);
    }
  };

  // Read aloud the answer
  const handleReadAloud = (content: string) => {
    const utterance = new SpeechSynthesisUtterance(content);
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
    utterance.onend = () => setIsReading(false);
  };

  // Copy message to clipboard
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('Message copied to clipboard!');
  };

  // Share the message
  const handleShare = (content: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Chat Message',
        text: content,
        url: window.location.href,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Share functionality is not supported on this device.');
    }
  };

  // Handle user redirection after 3 questions if not logged in
  useEffect(() => {
    const isLogin = localStorage.getItem('userId');
    if (questionCount > 3 && !isLogin) {
      navigate('/login');
    }
  }, [questionCount, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:block lg:w-64 bg-gray-200 p-4"> {/* Sidebar content */} </div>
        <div className="flex-1 p-4 overflow-auto">
          <h1 className="text-3xl font-bold mb-4">Chat with us!</h1>
          <div className="grid grid-cols-8 gap-4">
            {messages.map((message, index) => (
              <div key={index} className={`col-span-8 mb-4 p-2 rounded-md ${message.type === 'question' ? 'bg-blue-200 col-span-5' : 'bg-green-200 col-span-6'}`}>
                <ReactMarkdown>{message.content}</ReactMarkdown>
                {message.type === 'answer' && (
                  <div className="mt-2">
                    <button className="mr-2" onClick={() => handleCopy(message.content)}>
                      <FaRegCopy />
                    </button>
                    {isReading ? (
                      <button className="mr-2" onClick={() => window.speechSynthesis.cancel()}>
                        <FaVolumeOff />
                      </button>
                    ) : (
                      <button className="mr-2" onClick={() => handleReadAloud(message.content)}>
                        <FaVolumeUp />
                      </button>
                    )}
                    <button onClick={() => handleShare(message.content)}>
                      <FaShareAlt />
                    </button>
                  </div>
                )}
              </div>
            ))}

{messages.map((message, index) => (
  <div
    key={index}
    className={`col-span-8 mb-4 p-2 rounded-md ${
      message.type === 'question' ? 'bg-blue-200 col-span-4' : 'bg-green-200 col-span-4'
    }`}
  >
    <p>{message.content}</p>
  </div>
))}
          </div>
          {/* Input Field */}
          <div className="mt-4 flex">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1 p-2 border rounded-md"
              placeholder="Type your message here..."
            />
            {showSendButton && (
              <button onClick={() => handleSend(input)} disabled={isLoading} className="ml-2 p-2 bg-blue-500 text-white rounded-md">
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            )}
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};

export default ExampleComponent;
