import React, { useEffect, useState, useRef } from 'react';
import Image1 from '../assets/img/AD1 (1).jpg';
import Image2 from '../assets/img/AD2.jpg';
import ReactMarkdown from 'react-markdown';
import { FaUserCircle } from "react-icons/fa";
import axios from 'axios';
import './erice.css';
import { useLocation, useNavigate } from 'react-router-dom';
import B1 from '../assets/img/B1.jpg';
import B2 from '../assets/img/B2.jpg';
import { FaVolumeOff, FaVolumeUp, FaRegCopy, FaShareAlt } from 'react-icons/fa';
import { error } from 'console';
import ChatHistory from './ChatHistory';
import Example from './Example';
import AuthorInfo from './AuthorInfo';
import ModalComponent from './ModalComponent';
import ProfileCallPage from './models/ProfileCallPage';


interface ChatMessage {
  type: 'question' | 'answer';
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
  name:string|null
}


const Examplecomponet = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);


  const [showSendButton, setShowSendButton] = useState(false);
  const [chathistory  , setchathistory]=useState([])
  const [riceTopicsshow , setriceTopicsshow] = useState(true)
  const [showStaticBubbles, setShowStaticBubbles] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isReading, setIsReading] = useState(false);
  const histary = useNavigate()
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);  
  const [profiledata , setprofiledata]=useState({})

  // New State for History
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on component mount
  

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const apiUrl = `https://meta.oxyloans.com/api/student-service/user/profile?id=${userId}`;

    axios.get(apiUrl)
      .then(response => {
        console.log(response.data);
        setProfileData(response.data); // Set the profile data to state
      })
      .catch(error => {
        console.error('There was an error making the request:', error);
      });
  }, []);

  useEffect(() => {
    const storedHistory = localStorage.getItem('chatHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Save history to localStorage whenever it changes

  const handleScroll = () => {
    if (bottomRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = bottomRef.current.parentElement!;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight); // Check if the user is at the bottom
    }
  };
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(history));
  }, [history]);

  
  // Toggle edit state
  const handleEditClick = () => {
    setIsEditing(isEditing);
  };



  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);






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
      setriceTopicsshow(false)
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

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (queryInput: string) => {
    if (queryInput.trim() === '') return;

    setMessages(prev => [...prev, { type: 'question', content: queryInput }]);
    setHistory(prevHistory => [queryInput, ...prevHistory]);
    setInput('');
    setIsLoading(true);
    setQuestionCount(prevCount => prevCount + 1); // Increment question count

    try {
      const response = await axios.post(
        `https://meta.oxyloans.com/api/student-service/user/globalChatGpt?prompt=${encodeURIComponent(queryInput)}`
      );

      // Add the API response to chat
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault(); // Prevent default Enter key behavior
      handleSend(input);
    }
  };

  const handleInputChangeWithVisibility = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value); // Update input value
    setShowSendButton(value.trim() !== '');
    if (showStaticBubbles && value.trim() !== '') {
      setShowStaticBubbles(false);
    }
  };





  // Handle deleting a history item
  const handleDeleteHistoryItem = (index: number) => {
    setHistory(prevHistory => prevHistory.filter((_, i) => i !== index));
  };



  const questions = messages.filter((msg) => msg.type === 'question');
  const answers = messages.filter((msg) => msg.type === 'answer');

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

  const navigate = useNavigate(); // Initialize navigate function

  // Function to handle the click event
  const handleRedirect = () => {
    navigate('/'); // Redirect to the login page
  };
  return (
    <div className="min-h-screen bg-[#351664] text-white flex flex-col">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center p-4 bg-[#351664] border-b-2 border-white">
        {/* Logo with Icon */}
        <button
      className="flex items-center m-2 text-2xl font-bold bg-transparent border-none cursor-pointer focus:outline-none"
      onClick={handleRedirect}
    >
      <span className="text-white">ASKOXY</span>
      <span className="text-[#ffa800]">.AI</span>
    </button>
<div></div> 
    <div   
        className="sign-in-container"
        style={{
          width: 'auto',
          height: 'auto',
          backgroundColor: 'gray',
          padding: '7px 20px',
          borderRadius: '50px',
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
          position:'absolute',
          right:'5rem'
        }}
      >
        {/* SignIn button with redirection functionality */}

        <button className="" onClick={()=>{localStorage.removeItem("userId");navigate('/login')}}>
          SignOut
        </button>
      </div>

        {/* SignIn/SignUp Buttons */}
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">

        <AuthorInfo
  name={`${profileData?.firstName || ''} ${profileData?.lastName || ''}`.trim()} // Combines first and last name, falls back to empty string if either is undefined
  location={profileData?.city || 'Unknown'} // Falls back to 'Unknown' if city is null or undefined
  email={profileData?.email || 'No email available'} // Falls back to a default if email is not provided
  icon={<FaUserCircle />}// Optional, falls back to placeholder image
/>

      
        </div>
      </header>

      {/* <ModalComponent /> */}
      <main className="flex flex-col flex-grow w-full p-3 md:flex-row">
        {/* Combined Left, Center, and Right Panel */}
        <div className="flex flex-col flex-grow bg-white rounded-lg shadow-md lg:flex-row">
          {/* Left Panel */}
          <aside className="w-full p-3 text-black bg-gray-100 rounded-l-lg md:w-1/6 sidebar11">
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
              {/* <button onClick={handleNewChatClick} className="p-1 rounded-md" title="New Chat" >
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

            {/* History List */}
        <ChatHistory />
          </aside>

          {/* Center Panel */}
          <section className="relative flex flex-col flex-grow w-full p-6 md:w-1/2 bg-gray-50">
      {/* Static Rice Related Text */}
      <h1 className='fw-500' style={{ zIndex: '10', color: 'black', fontWeight: '600' }}>
  Welcome {profileData ? `${profileData.firstName} ${profileData.lastName}` : 'Guest'}
</h1>


   
   <ProfileCallPage />
    </section>


          {/* Right Panel */}
  
        </div>
      </main>
    </div>
  );
};

export default Examplecomponet;
