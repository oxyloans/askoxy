import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
    Plus, Clock, ChevronRight, Search,
    Copy, Volume2, VolumeX, Share2,
    X, Menu, MessageCircle, Check,
    ArrowLeft, History, Send
} from 'lucide-react';
import Example from "../components/Example";

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

const FreeChatGPTmain: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showEmptyState, setShowEmptyState] = useState<boolean>(true);
    const [isReading, setIsReading] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [inputRows, setInputRows] = useState<number>(1);

    const bottomRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const suggestedPrompts: SuggestedPrompt[] = [
        {
            id: 1,
            title: "Ask Questions",
            subtitle: "Discover useful tips and insights",
            icon: <MessageCircle className="w-6 h-6 text-purple-500" />
        },
        {
            id: 2,
            title: "Ask Mentorship",
            subtitle: "Get expert guidance for your career",
            icon: <Search className="w-6 h-6 text-green-500" />
        },
        {
            id: 3,
            title: "Ask for funds",
            subtitle: "Learn about funding opportunities",
            icon: <Plus className="w-6 h-6 text-purple-500" />
        },
        {
            id: 4,
            title: "End-to-end solution",
            subtitle: "Get comprehensive solutions",
            icon: <Clock className="w-6 h-6 text-orange-500" />
        }
    ];

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            setInputRows(Math.min(5, Math.ceil(textareaRef.current.scrollHeight / 24)));
        }
    }, [input]);

    // Auto-scroll effect
    useEffect(() => {
        if (bottomRef.current && !showEmptyState) {
            const scrollOptions: ScrollIntoViewOptions = {
                behavior: isLoading ? 'auto' : 'smooth',
                block: 'end' as ScrollLogicalPosition, // Explicitly type 'end' as ScrollLogicalPosition
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

    // Handle URL query parameters
    useEffect(() => {
        const query = new URLSearchParams(location.search).get("search");
        if (query) {
            setShowEmptyState(false);
            setIsFirstVisit(false);
            handleSend(query);
        }
    }, [location.search]);

    const loadChatHistory = () => {
        try {
            const savedHistory = localStorage.getItem("chatHistory");
            if (savedHistory) {
                const parsed = JSON.parse(savedHistory);
                setChatHistory(parsed.map((item: any) => ({
                    ...item,
                    timestamp: new Date(item.timestamp),
                    messages: item.messages.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }))
                })));
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
                title: messages[0].content.slice(0, 50) + (messages[0].content.length > 50 ? "..." : ""),
                timestamp: new Date(),
                messages: [...messages]
            };
            const updatedHistory = [newHistoryItem, ...chatHistory].slice(0, 50);
            setChatHistory(updatedHistory);
            localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
        }
    };

    const handleNewChat = () => {
        console.log("New Chat button clicked"); // Debugging
        if (messages.length > 0) {
            console.log("Saving chat history..."); // Debugging
            saveChatHistory();
        }
        console.log("Resetting chat state..."); // Debugging
        setMessages([]);
        setShowEmptyState(true);
        setInput("");
        setShowHistory(false);
        setIsFirstVisit(false);
        console.log("Navigating to /dashboard-main?active=products..."); // Debugging
        navigate("/main/dashboard/freegpts");
    };

    const handleSend = async (queryInput: string) => {
        if (!queryInput.trim() || isLoading) return;

        setShowEmptyState(false);
        setIsFirstVisit(false);
        setMessages(prev => [...prev, {
            type: "question",
            content: queryInput,
            timestamp: new Date()
        }]);
        setInput("");
        setIsLoading(true);

        try {
            const userId = localStorage.getItem("userId");
            const apiUrl = `https://meta.oxyloans.com/api/student-service/user/globalChatGpt?prompt=${encodeURIComponent(queryInput)}${userId ? `&userId=${userId}` : ''}`;
            const response = await axios.post(apiUrl);

            setMessages(prev => [...prev, {
                type: "answer",
                content: response.data,
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                type: "answer",
                content: "Sorry, there was an error processing your request. Please try again.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        }
    };

    const handleCopy = async (content: string) => {
        try {
            await navigator.clipboard.writeText(content);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
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
                    title: 'Shared from ChatGPT',
                    text: content,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
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
        const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
        setChatHistory(updatedHistory);
        localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-25">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
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
                        className={`fixed inset-y-16 right-0 w-full sm:w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40${showHistory ? 'translate-x-16' : 'translate-x-full'
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
                                    {suggestedPrompts.map((prompt) => (
                                        <button
                                            key={prompt.id}
                                            onClick={() => handleSend(prompt.title)}
                                            className="w-full p-4 sm:p-6 text-left bg-white rounded-xl border 
                          hover:border-purple-400 hover:shadow-lg transition-all 
                          duration-200 group"
                                        >
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg 
                                group-hover:bg-purple-50 transition-colors">
                                                    {prompt.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base sm:text-lg font-medium mb-1 
                                 text-gray-800 group-hover:text-purple-600 
                                 line-clamp-1">
                                                        {prompt.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm line-clamp-2">
                                                        {prompt.subtitle}
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
                                            className={`flex flex-col ${message.type === "question" ? "items-end" : "items-start"
                                                }`}
                                        >
                                            <div
                                                className={`w-full sm:max-w-[80%] rounded-lg p-3 sm:p-4 
                            ${message.type === "question"
                                                        ? "bg-purple-50 text-purple-900"
                                                        : "bg-gray-100 text-gray-900"
                                                    }`}
                                            >
                                                <div className="prose prose-sm sm:prose-base max-w-none">
                                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                                </div>

                                                {message.type === "answer" && (
                                                    <div className="flex items-center justify-end mt-3 space-x-2 
                                  border-t pt-2 border-gray-200">
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
                                        <div className="animate-spin rounded-full h-8 w-8 
                            border-b-2 border-gray-900">
                                        </div>
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
                                        e.target.style.height = `${Math.min(e.target.scrollHeight, 192)}px`; // Adjust dynamically, max 12rem
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
            </div>
        </div>
    );
};

export default FreeChatGPTmain;