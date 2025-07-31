import { useCallback } from "react";
import BASE_URL from "../../Config";
import { Message } from "../types/types";

interface UseMessagesProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  abortControllerRef: React.MutableRefObject<AbortController | null>; // New prop for cancellation
}

export const useMessages = ({
  messages,
  setMessages,
  input,
  setInput,
  setLoading,
  messagesEndRef,
  abortControllerRef,
}: UseMessagesProps) => {
  const handleSend = useCallback(
    async (messageContent?: string) => {
      const textToSend = messageContent || input.trim();
      if (!textToSend) return;

      const userMessage: Message = { role: "user", content: textToSend };
      const updatedMessages = [...messages, userMessage];

      setMessages(updatedMessages);
      setInput("");
      setLoading(true);

      try {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const response = await fetch(`${BASE_URL}/student-service/user/chat1`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedMessages),
          signal: controller.signal, // Attach signal for cancellation
        });

        const data = await response.text();

        if (!response.ok) {
          throw new Error(`Error: ${data}`);
        }

        // Scroll after user message
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);

        const isImageUrl = data.startsWith("http");
        const assistantReply: Message = {
          role: "assistant",
          content: data,
          isImage: isImageUrl,
        };

        // Scroll again after assistant message is shown
        setTimeout(() => {
          setMessages((prev) => [...prev, assistantReply]);
        }, 50);
      } catch (error) {
        console.error("Chat error:", error);
        const errorMessage: Message = {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          isImage: false,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setTimeout(() => {
          setLoading(false);
          abortControllerRef.current = null;
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    },
    [
      messages,
      input,
      setMessages,
      setInput,
      setLoading,
      messagesEndRef,
      abortControllerRef,
    ]
  );
  // Handle editing an existing message
  const handleEdit = useCallback(
    async (messageId: string, newContent: string) => {
      if (!newContent.trim()) return;

      // Update the message content
      const updatedMessages = messages.map((msg) =>
        msg.id === messageId ? { ...msg, content: newContent } : msg
      );
      setMessages(updatedMessages);
      setInput("");
      setLoading(true);

      try {
        const controller = new AbortController();
        abortControllerRef.current = controller;

        // Send updated conversation to API
        const response = await fetch(`${BASE_URL}/student-service/user/chat1`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedMessages),
          signal: controller.signal,
        });

        const data = await response.text();

        if (!response.ok) {
          throw new Error(`Error: ${data}`);
        }

        const isImageUrl = data.startsWith("http");
        const assistantReply: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data,
          isImage: isImageUrl,
        };

        // Append new assistant response
        setMessages((prev) => [...prev, assistantReply]);
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Request aborted");
        } else {
          console.error("Chat error:", error);
          const errorMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
            isImage: false,
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, setMessages, setLoading, messagesEndRef, abortControllerRef]
  );

  return { handleSend, handleEdit };
};
