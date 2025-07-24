import React, { useEffect, useRef, useState, useCallback } from "react";
import { Drawer, Button, Input, Avatar } from "antd";
import {
  SendOutlined,
  CloseOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import Header from "./Header";
import HeroSection from "./HeroSection";
import VideoSection from "./VideoSection";
import DomainSection from "./DomainSection ";
import Footer from "./Footer";
import useScrollAnimation from "./useScrollAnimation";
import "./Animation.css";
import BASE_URL from "../Config";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark as oneDarkStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Define interfaces
interface Message {
  role: "user" | "assistant";
  content: string;
  isImage?: boolean;
}

interface PageEvents {
  pageLoaded: boolean;
  scrollCount: number;
  lastInteraction: string;
  visitDuration: number;
}

const LandingPage: React.FC = () => {
  useScrollAnimation();

  const [activeLink, setActiveLink] = useState<
    "home" | "videos" | "usecases" | "contact"
  >("home");

  const [pageEvents, setPageEvents] = useState<PageEvents>({
    pageLoaded: false,
    scrollCount: 0,
    lastInteraction: "",
    visitDuration: 0,
  });

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Welcome to GLMS Support! Ask about loan processing, system features, or troubleshooting. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (showChat) {
      setTimeout(() => {
        document.querySelector<HTMLInputElement>(".ant-input")?.focus();
      }, 300);
    }
  }, [showChat]);

  const handleSend = useCallback(
    async (messageContent?: string) => {
      const textToSend = messageContent ?? input.trim();
      if (!textToSend) return;

      // Add user message optimistically
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: textToSend },
      ]);
      setInput("");
      setLoading(true);

      try {
        const updatedMessages = [
          ...messages,
          { role: "user", content: textToSend },
        ];

        const response = await fetch(`${BASE_URL}/student-service/user/chat1`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedMessages),
        });

        const data = await response.text();
        const isImageUrl = data.startsWith("http");

        const assistantReply: Message = {
          role: "assistant",
          content: data,
          isImage: isImageUrl,
        };

        setMessages((prevMessages) => [...prevMessages, assistantReply]);
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: "❌ Sorry, I encountered an error. Please try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, messages]
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) handleSend();
  };

  const handleChatIconClick = useCallback(() => {
    setShowChat((prev) => {
      const newShowChat = !prev;
      setPageEvents((prevEvents) => ({
        ...prevEvents,
        lastInteraction: `Chat ${
          newShowChat ? "opened" : "closed"
        } at ${new Date().toLocaleTimeString()}`,
      }));
      return newShowChat;
    });
  }, []);

  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    videos: useRef<HTMLDivElement>(null),
    usecases: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = useCallback((sectionId: keyof typeof sectionRefs) => {
    setActiveLink(sectionId);
    setPageEvents((prev) => ({
      ...prev,
      lastInteraction: `Navigation to ${sectionId} section`,
      scrollCount: prev.scrollCount + 1,
    }));

    const headerHeight = 64;
    const targetRef = sectionRefs[sectionId];

    if (targetRef?.current) {
      const y =
        targetRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  const handleContentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const targetType = target.tagName.toLowerCase();
      const targetId = target.id || "unknown";
      const targetClass = target.className || "unknown";

      setPageEvents((prev) => ({
        ...prev,
        lastInteraction: `Clicked ${targetType}#${targetId}`,
      }));
    },
    []
  );

  // Calculate drawer width once on render, fallback to 400
  const drawerWidth = window.innerWidth < 640 ? "100%" : 400;

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-50"
      onClick={handleContentClick}
    >
      <Header onNavClick={scrollToSection} activeLink={activeLink} />
      <main className="flex-grow">
        <section ref={sectionRefs.home} id="home">
          <HeroSection />
        </section>
        <section ref={sectionRefs.videos} id="videos">
          <VideoSection />
        </section>
        <section ref={sectionRefs.usecases} id="usecases">
          <DomainSection />
        </section>
        <section ref={sectionRefs.contact} id="contact">
          <Footer />
        </section>
      </main>

      {/* Chat Button */}
      <Button
        type="primary"
        shape="circle"
        icon={<MessageOutlined />}
        size="large"
        onClick={handleChatIconClick}
        className="fixed bottom-6 right-6 z-50 shadow-xl hover:scale-110 transition-transform"
        aria-label="Open Chat"
      />

      {/* Chat Drawer */}
      <Drawer
        placement="right"
        onClose={() => setShowChat(false)}
        open={showChat}
        width={drawerWidth}
        closable={false}
        title={
          <div className="flex items-center gap-2">
            <Avatar
              icon={<MessageOutlined />}
              style={{ backgroundColor: "#722ed1" }}
            />
            <span className="font-semibold text-base">GLMS Support</span>
          </div>
        }
        extra={
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setShowChat(false)}
          />
        }
        bodyStyle={{ padding: 0, background: "#f9fafb" }}
        headerStyle={{
          background: "linear-gradient(to right, #e0e7ff, #c3ddff)",
        }}
      >
        <div className="flex flex-col h-[calc(100%-64px)]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl text-sm whitespace-pre-wrap shadow ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-none"
                      : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  {msg.isImage ? (
                    <img
                      src={msg.content}
                      alt="Response"
                      className="rounded-md max-w-full h-auto"
                    />
                  ) : msg.role === "assistant" ? (
                    <ReactMarkdown
                      className="prose prose-sm max-w-none"
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        code({
                          node,
                          inline,
                          className,
                          children,
                          ...props
                        }: {
                          node?: any;
                          inline?: boolean;
                          className?: string;
                          children?: React.ReactNode;
                          [key: string]: any;
                        }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={oneDarkStyle as any} // cast to any to fix style typing error
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code
                              className="bg-gray-100 px-1 py-0.5 rounded text-red-600"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                        a: ({ node, ...props }) => (
                          // eslint-disable-next-line jsx-a11y/anchor-has-content
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          />
                        ),
                        img: ({ node, ...props }) => (
                          <img
                            {...props}
                            className="rounded shadow max-w-full h-auto my-2"
                            alt={props.alt || "markdown image"}
                          />
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                  <div className="text-xs text-gray-400 mt-1 text-right">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-xl shadow animate-pulse text-gray-500">
                  Typing...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleKeyPress}
              placeholder="Ask about GLMS features or issues..."
              disabled={loading}
              suffix={
                <Button
                  type="primary"
                  shape="circle"
                  icon={<SendOutlined />}
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                />
              }
              className="rounded-full px-4 py-2 text-sm"
              aria-label="Chat input"
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default LandingPage;
