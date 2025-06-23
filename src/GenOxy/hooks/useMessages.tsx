import { useCallback } from "react";
import BASE_URL from "../../Config";

import { Message } from "../types/types";

export const useMessages = (
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  input: string,
  setInput: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleSend = useCallback(async (messageContent?: string) => {
    const textToSend = messageContent || input.trim();
    if (!textToSend) return;

    const userMessage: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/student-service/user/chat1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMessages),
      });
      const data = await response.text();

      if (!response.ok) {
        throw new Error(`Error: ${data}`);
      }

      const isImageUrl = data.startsWith("http");
      const assistantReply: Message = {
        role: "assistant",
        content: data,
        isImage: isImageUrl,
      };

      setMessages([...updatedMessages, assistantReply]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        isImage: false,
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [messages, input, setMessages, setLoading]);

  return { handleSend };
};