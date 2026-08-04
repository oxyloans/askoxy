import { createContext, useContext } from "react";

export const ChatContext = createContext<{
  chatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
}>({
  chatOpen: false,
  openChat: () => {},
  closeChat: () => {},
});

export function useChatContext() {
  return useContext(ChatContext);
}
