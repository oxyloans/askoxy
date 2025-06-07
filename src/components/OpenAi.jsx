import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Card, Typography, Avatar, Spin } from "antd";
import {
  DownloadOutlined,
  SendOutlined,
  UserOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";

const { Text } = Typography;

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle image download with proper filename and CORS handling
  const handleImageDownload = async (imageUrl) => {
    try {
      // Fetch the image
      const response = await fetch(imageUrl, {
        mode: "cors",
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();

      // Create download URL
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename with timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      link.download = `askoxy-image-${timestamp}.png`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);

      // Fallback method using fetch with different approach
      try {
        const proxyUrl = `https://cors-anywhere.herokuapp.com/${imageUrl}`;
        const response = await fetch(proxyUrl);
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        const timestamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/:/g, "-");
        link.download = `askoxy-image-${timestamp}.png`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (fallbackError) {
        // Final fallback - open in new tab
        window.open(imageUrl, "_blank");
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) {
      return;
    }

    const userMessage = {
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/student-service/user/chat1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMessages),
      });

      const data = await response.text();
      const isImageUrl = data.startsWith("http");

      const assistantReply = {
        role: "assistant",
        content: data,
        isImage: isImageUrl,
      };

      setMessages([...updatedMessages, assistantReply]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            <RobotOutlined className="text-3xl" />
            <h1 className="text-3xl font-bold">AskOxy.AI Assistant</h1>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <RobotOutlined className="text-8xl text-gray-300 mb-8" />
              <Text className="text-gray-500 text-xl block mb-8">
                Welcome! How can I help you today?
              </Text>
              <div className="flex flex-wrap gap-4 justify-center max-w-6xl mx-auto">
                <Card
                  className="p-4 hover:shadow-lg cursor-pointer border-purple-200 hover:border-purple-400 transition-all flex-1 min-w-72"
                  onClick={() => setInput("What are OxyLoans interest rates?")}
                >
                  <Text className="text-gray-600 text-center text-lg">
                    What are OxyLoans interest rates?
                  </Text>
                </Card>
                <Card
                  className="p-4 hover:shadow-lg cursor-pointer border-purple-200 hover:border-purple-400 transition-all flex-1 min-w-72"
                  onClick={() => setInput("How do I apply for a loan?")}
                >
                  <Text className="text-gray-600 text-center text-lg">
                    How do I apply for a loan?
                  </Text>
                </Card>
                <Card
                  className="p-4 hover:shadow-lg cursor-pointer border-purple-200 hover:border-purple-400 transition-all flex-1 min-w-72"
                  onClick={() => setInput("Generate an image of a sunset")}
                >
                  <Text className="text-gray-600 text-center text-lg">
                    Generate an image of a sunset
                  </Text>
                </Card>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-4 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <Avatar
                  icon={<RobotOutlined />}
                  className="bg-purple-500 flex-shrink-0 mt-1"
                  size="large"
                />
              )}

              <Card
                className={`max-w-3xl shadow-lg border-0 ${
                  msg.role === "user" ? "bg-purple-500 text-white" : "bg-white"
                }`}
                bodyStyle={{ padding: "20px" }}
              >
                {msg.isImage ? (
                  <div className="relative">
                    <img
                      src={msg.content}
                      alt="AI Generated Content"
                      className="rounded-lg max-w-full h-auto shadow-sm max-h-96"
                      loading="lazy"
                    />
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={() => handleImageDownload(msg.content)}
                      className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 border-gray-300 text-gray-700 shadow-lg hover:shadow-xl"
                      size="large"
                      shape="circle"
                    />
                  </div>
                ) : (
                  <div>
                    <Text
                      className={`${
                        msg.role === "user" ? "text-white" : "text-gray-800"
                      } whitespace-pre-wrap leading-relaxed text-lg`}
                    >
                      {msg.content}
                    </Text>
                  </div>
                )}
              </Card>

              {msg.role === "user" && (
                <Avatar
                  icon={<UserOutlined />}
                  className="bg-purple-500 flex-shrink-0 mt-1"
                  size="large"
                />
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start gap-4">
              <Avatar
                icon={<RobotOutlined />}
                className="bg-purple-500 flex-shrink-0 mt-1"
                size="large"
              />
              <Card className="bg-white shadow-lg border-0 max-w-md">
                <div className="flex items-center gap-3 py-3">
                  <Spin size="default" />
                  <Text className="text-gray-600 text-base">
                    Assistant is thinking...
                  </Text>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input.TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                onPressEnter={handleKeyPress}
                disabled={loading}
                autoSize={{ minRows: 1, maxRows: 4 }}
                className="resize-none text-base"
              />
            </div>
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={loading}
              onClick={handleSend}
              disabled={!input.trim()}
              size="large"
              className="bg-purple-500 hover:bg-purple-600 px-8"
            >
              Send
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}