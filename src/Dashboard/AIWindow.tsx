import React, { useState, useRef, useEffect } from "react";
import { message as antdMessage } from "antd";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";

const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY;
const PRODUCT_API = `${BASE_URL}/product-service/showGroupItemsForCustomrs`;
const OFFERS_API = `${BASE_URL}/product-service/getComboActiveInfo`;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: "text" | "products" | "error" | "offers";
  products?: any[];
  offers?: any[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIChatWindowProps {
  botName?: string;
  language?: string;
  isMobile?: boolean;
  onClose?: () => void;
  onExternalRequest?: (message: string) => void;
}

const AIChatWindow: React.FC<AIChatWindowProps> = ({
  botName = "ASKOXY.AI",
  isMobile = false,
  onClose,
  onExternalRequest,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello! I'm ${botName}. How can I help you today?`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>(
    []
  );
  const [productsCache, setProductsCache] = useState<any[]>([]);
  const [offersCache, setOffersCache] = useState<any[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    loadInitialData();

    // Listen for external requests from other pages
    const handleExternalRequest = (event: CustomEvent) => {
      const { message } = event.detail;
      if (message) {
        processExternalMessage(message);
      }
    };

    window.addEventListener(
      "aiChatExternalRequest",
      handleExternalRequest as EventListener
    );

    return () => {
      window.removeEventListener(
        "aiChatExternalRequest",
        handleExternalRequest as EventListener
      );
    };
  }, []);

  const processExternalMessage = (message: string) => {
    const externalMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, externalMessage]);
    setInputText("");
    setIsLoading(true);

    setTimeout(() => {
      processUserMessage(message);
    }, 100);
  };

  const loadInitialData = async () => {
    try {
      const [productsRes, offersRes] = await Promise.all([
        fetch(PRODUCT_API),
        fetch(OFFERS_API),
      ]);

      const productsData = await productsRes.json();
      const offersData = await offersRes.json();

      const flattenedProducts: any[] = [];
      productsData.forEach((group: any) => {
        group.categories.forEach((cat: any) => {
          cat.itemsResponseDtoList.forEach((item: any) => {
            flattenedProducts.push({
              ...item,
              groupName: group.groupName,
              categoryName: cat.categoryName,
            });
          });
        });
      });

      setProductsCache(flattenedProducts);
      setOffersCache(offersData);
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Failed to load initial data:", error);
      antdMessage.error("Failed to load data");
    }
  };

  const createSystemPrompt = () =>
    `You are a smart assistant for an e-commerce platform that sells: rice (like HMT, Sonamasoori), groceries, gold, combo offers, and festival items (like rakhis).

Respond with:
1. A helpful, one-sentence natural reply to the user's message.
2. 3–5 keywords from the input, only if they match platform items.

Rules:
- Answer the question normally in the description.
- Always include specific item names (like hmt, rakhi, sonamasoori) in keywords if mentioned.
- If user mentions **offers, deals, discounts, or today’s specials**, include "offers" in keywords.
- If only general rice is asked (e.g., “what rice do you sell”), use "rice" in keyword. If specific rice is asked (e.g., “what is HMT”), include only "hmt".
- For valid festival items (e.g., "rakhi"), describe them in the reply and include them in keywords.
- If it’s a casual message (e.g., “hi”), respond politely and leave keywords blank.
- Never include unrelated categories like electronics or fashion.

Format:
Description: <helpful reply>
Keywords: <comma-separated keywords or leave blank>`;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsLoading(true);

    await processUserMessage(currentInput);
  };

  const processUserMessage = async (userInput: string) => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              { role: "system", content: createSystemPrompt() },
              ...conversationHistory,
              { role: "user", content: userInput },
            ],
            temperature: 0.5,
          }),
        }
      );

      const result = await response.json();
      const content = result.choices[0]?.message?.content?.trim() || "";

      const descriptionMatch = content.match(/Description:\s*(.*)/i);
      const keywordsMatch = content.match(/Keywords:\s*(.*)/i);

      const description = descriptionMatch?.[1]?.trim() || "";
      const extractedKeywords =
        keywordsMatch?.[1]
          ?.split(",")
          .map((k: any) => k.trim().toLowerCase())
          .filter(Boolean) || [];

      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: userInput },
        { role: "assistant", content },
      ]);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: description,
          isUser: false,
          timestamp: new Date(),
        },
      ]);

      if (extractedKeywords.includes("offers")) {
        displayOffers();
        return;
      }

      if (extractedKeywords.length > 0 && isDataLoaded) {
        filterAndDisplayResults(extractedKeywords);
      }
    } catch (err) {
      console.error("Processing error:", err);
      antdMessage.error("Failed to process your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayOffers = () => {
    if (offersCache.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "🎉 Check out these exciting combo offers:",
          isUser: false,
          timestamp: new Date(),
          type: "offers",
          offers: offersCache,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "No combo offers are available right now.",
          isUser: false,
          timestamp: new Date(),
          type: "error",
        },
      ]);
    }
  };

  const filterAndDisplayResults = (keywords: string[]) => {
    const matchedProducts = productsCache.filter((item: any) => {
      const searchText =
        `${item.itemName} ${item.itemDescription} ${item.groupName} ${item.categoryName}`.toLowerCase();
      return keywords.some((keyword) => searchText.includes(keyword));
    });

    if (matchedProducts.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "🛒 Matching products for you:",
          isUser: false,
          timestamp: new Date(),
          type: "products",
          products: matchedProducts.slice(0, 10),
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Currently, these items are not available.",
          isUser: false,
          timestamp: new Date(),
          type: "error",
        },
      ]);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        text: `Hello! I'm ${botName}. How can I help you today?`,
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setConversationHistory([]);
    antdMessage.success("Chat cleared successfully!");
  };

  // Three dots loading component
  const ThreeDotsLoading = () => (
    <div className="flex items-center space-x-1">
      <div
        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  );

  // Mobile styles
  const mobileStyles = isMobile
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100vh",
        zIndex: 50,
        borderRadius: 0,
      }
    : {};

  const containerClass = isMobile
    ? `fixed inset-0 w-3/4 h-full bg-white flex flex-col z-50`
    : `fixed right-0 top-20 bottom-0 w-full max-w-xs sm:max-w-sm md:w-72 bg-white shadow-lg rounded-lg border z-50 flex flex-col transition-all duration-300 overflow-hidden`;

  return (
    <div className={containerClass} style={isMobile ? mobileStyles : {}}>
      <div
        className={`bg-gradient-to-r from-purple-700 to-purple-600 text-white px-3 py-2  shadow-md ${
          isMobile ? "" : ""
        }`}
      >
        <div className="flex items-center justify-between ">
          <div className="flex items-center space-x-2 ">
            {/* <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
              </svg>
            </div> */}
            <div>
              <h3 className="font-bold text-sm">{botName}</h3>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {/* Clear Chat Button */}
            <button
              onClick={clearChat}
              className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              title="Clear Chat"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            {/* Close Button (only on mobile) */}
            {isMobile && onClose && (
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                title="Close Chat"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`text-sm ${msg.isUser ? "text-right" : "text-left"}`}
          >
            {msg.type === "products" ? (
              <div className="space-y-2">
                <div className="font-semibold text-green-600">{msg.text}</div>
                {msg.products?.map((item) => (
                  <div
                    key={item.itemId}
                    onClick={() => {
                      navigate(`/main/itemsdisplay/${item.itemId}`);
                      if (isMobile && onClose) onClose();
                    }}
                    className="border rounded-md p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <img
                      src={item.itemImage}
                      alt={item.itemName}
                      className={`${
                        isMobile ? "h-16 w-16" : "h-12 w-12"
                      } object-contain float-left mr-2`}
                    />
                    <div
                      className={`${
                        isMobile ? "text-sm" : "text-xs"
                      } font-bold text-gray-800 break-words`}
                    >
                      {item.itemName}
                    </div>
                    <div
                      className={`${
                        isMobile ? "text-sm" : "text-xs"
                      } text-green-600`}
                    >
                      ₹{item.itemPrice} • {item.savePercentage}% off
                    </div>
                    <div
                      className={`${
                        isMobile ? "text-xs" : "text-[10px]"
                      } text-gray-500`}
                    >
                      {item.groupName} - {item.categoryName}
                    </div>
                    <div className="clear-both"></div>
                  </div>
                ))}
              </div>
            ) : msg.type === "offers" ? (
              <div className="space-y-2">
                <div className="font-semibold text-orange-600">{msg.text}</div>
                <div
                  className={`flex overflow-x-auto space-x-2 pb-2 ${
                    isMobile ? "gap-3" : ""
                  }`}
                >
                  {msg.offers?.map((offer, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        // navigate(`/main/itemsdisplay/${offer.itemId}`);
                        if (isMobile && onClose) onClose();
                      }}
                      className={`flex-shrink-0 bg-white border rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition
      ${
        isMobile ? "min-w-[200px] max-w-[200px]" : "min-w-[180px] max-w-[180px]"
      }`}
                    >
                      <div className="w-full h-24 overflow-hidden rounded-md mb-1">
                        <img
                          src={offer.imageUrl}
                          alt={offer.itemName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div
                        className="font-semibold text-xs text-gray-800 mb-1 truncate"
                        title={offer.itemName}
                      >
                        {offer.itemName}
                      </div>
                      {offer.itemDescription && (
                        <div
                          className="text-xs text-gray-600 mb-1 line-clamp-2"
                          title={offer.itemDescription}
                        >
                          {offer.itemDescription}
                        </div>
                      )}
                      <div className="text-green-600 text-xs font-bold">
                        {offer.price ? `₹${offer.price}` : "Special Price!"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`inline-block px-2 py-1.5 rounded-lg max-w-[85%] ${
                  msg.isUser
                    ? "bg-purple-600 text-white ml-auto"
                    : "bg-gray-100 text-gray-800"
                } ${isMobile ? "text-base" : "text-sm"}`}
              >
                <p className="whitespace-pre-wrap break-words leading-relaxed">
                  {msg.text}
                </p>
              </div>
            )}
            <div
              className={`${
                isMobile ? "text-xs" : "text-[10px]"
              } text-gray-400 mt-1 ${msg.isUser ? "text-right" : "text-left"}`}
            >
              {msg.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left">
            <div className="inline-block px-2 py-1.5 rounded-lg bg-gray-100">
              <ThreeDotsLoading />
            </div>
            <div
              className={`${
                isMobile ? "text-xs" : "text-[10px]"
              } text-gray-400 mt-1`}
            >
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-2 border-t flex items-center space-x-2 bg-white"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className={`flex-1 border border-gray-300 px-3 py-2 sm:px-2 sm:py-1.5 ${
            isMobile ? "text-base min-h-[44px]" : "text-sm"
          } rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
          placeholder="Type your message..."
          // disabled={!isDataLoaded}
        />
        <button
          type="submit"
          className={`bg-purple-600 text-white ${
            isMobile ? "p-3 min-h-[44px] min-w-[44px]" : "p-2"
          } rounded-lg disabled:bg-gray-400 hover:bg-purple-700 active:bg-purple-800 transition-colors flex items-center justify-center`}
          disabled={isLoading || !inputText.trim()}
          title="Send message"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default AIChatWindow;
