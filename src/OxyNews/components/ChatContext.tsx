import { createContext, useContext } from "react";

export const ChatContext = createContext<{
  chatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  setPaperclipId: (id: string | null) => void;
}>({
  chatOpen: false,
  openChat: () => {},
  closeChat: () => {},
  setPaperclipId: () => {},
});

export function useChatContext() {
  return useContext(ChatContext);
}
