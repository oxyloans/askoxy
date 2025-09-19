import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Card, Avatar, Typography, Spin, Badge } from "antd";
import { SendOutlined, UserOutlined, RobotOutlined } from "@ant-design/icons";
import { Message, askAssistant } from "./assistantApi";

const { Text } = Typography;

interface ChatWindowProps {
  assistantId: string;
  assistantName: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  assistantId,
  assistantName,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      content: input.trim(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setHasStartedChat(true);

    try {
      const assistantReply = await askAssistant(assistantId, updatedMessages);
      setMessages((prev) => [...prev, assistantReply]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ height: "85vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          padding: "16px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: "12px 12px 0 0",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 className="m-0 text-[18px] font-semibold">
              <span className="bg-gradient-to-r from-green-500 to-green-300 bg-clip-text text-transparent">
                {assistantName}
              </span>{" "}
              AI Assistant
            </h3>

            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px" }}>
              Assistant ID: {assistantId}
            </Text>
          </div>
          <Badge
            color={loading ? "orange" : "green"}
            text={
              <span
                style={{ color: "rgba(255,255,255,0.9)", fontSize: "12px" }}
              >
                {loading ? "Thinking..." : "Online"}
              </span>
            }
          />
        </div>
      </div>

      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          backgroundColor: "#fafafa",
          minHeight: 0,
          position: "relative",
        }}
      >
        {/* Welcome Message - Shows when no chat has started */}
        {!hasStartedChat && messages.length === 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "32px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                maxWidth: "400px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "28px",
                  fontWeight: "bold",
                  background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Welcome to {assistantName}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "16px",
                  opacity: 0.9,
                  lineHeight: "1.5",
                }}
              >
                Your AI Assistant is ready to help! Ask me anything to get started.
              </p>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {hasStartedChat && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    maxWidth: "75%",
                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    size={36}
                    icon={
                      msg.role === "user" ? <UserOutlined /> : <RobotOutlined />
                    }
                    style={{
                      backgroundColor:
                        msg.role === "user" ? "#667eea" : "#52c41a",
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "16px",
                      backgroundColor: msg.role === "user" ? "#667eea" : "white",
                      color: msg.role === "user" ? "white" : "#333",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      wordWrap: "break-word",
                      lineHeight: "1.5",
                      fontSize: "14px",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    maxWidth: "75%",
                  }}
                >
                  <Avatar
                    size={36}
                    icon={<RobotOutlined />}
                    style={{ backgroundColor: "#52c41a", flexShrink: 0 }}
                  />
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "16px",
                      backgroundColor: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Spin size="small" />
                    <span style={{ color: "#666", fontSize: "14px" }}>
                      Assistant is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Section */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "white",
          borderTop: "1px solid #e8e8e8",
          borderRadius: "0 0 12px 12px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <Input.TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey && !loading) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Type your message..."
            disabled={loading}
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{
              flex: 1,
              borderRadius: "12px",
              resize: "none",
              opacity: loading ? 0.6 : 1,
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={onSend}
            disabled={!input.trim() || loading}
            loading={loading}
            style={{
              height: "auto",
              padding: "8px 16px",
              borderRadius: "12px",
              background: loading 
                ? "#d9d9d9" 
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;