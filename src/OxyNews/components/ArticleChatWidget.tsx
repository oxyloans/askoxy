// ArticleChatWidget.tsx
import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import type { ChatMessage } from "../types";

const SUGGESTIONS = [
  "What does this mean for OxyGroup?",
  "Summarize this in 3 bullet points",
  "Who are the key people mentioned?",
];

export default function ArticleChatWidget({
  paperclipId,
  onClose,
}: {
  paperclipId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function send(question: string) {
    if (!question.trim() || sending) return;
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setSending(true);
    try {
      const res = await api.chat(paperclipId, question);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.answer, sources: res.sources },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't reach radhAI right now. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    // Bounded height instead of h-full — previously this stretched to match the
    // article's full length inside the grid row, leaving a huge empty area below
    // a short message list. Now it's a normal-sized sidebar panel that scrolls
    // internally and stays pinned via the parent's `lg:sticky top-24`.
    <aside className="bg-plum rounded-lg shadow-lift overflow-hidden flex flex-col h-[70vh] lg:h-[calc(100vh-7rem)]">
      <div className="px-4 sm:px-5 py-4 border-b border-paper/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold text-plum font-semibold text-sm shrink-0">
            R
          </span>
          <div className="leading-tight">
            <h2 className="font-display text-gold font-semibold text-base sm:text-lg">radhAI Thoughts</h2>
            <p className="text-xs text-paper/60 mt-0.5">Ask anything about this article</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="focus-ring text-paper/60 hover:text-paper text-xl leading-none px-2 py-1 rounded shrink-0"
        >
          ✕
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="h-full flex flex-col justify-center gap-4">
            <p className="text-sm text-paper/50 italic text-center">
              Ask about implications, background, or what this means for OxyGroup.
            </p>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  onClick={() => send(sug)}
                  className="text-left text-sm bg-plum-light/60 hover:bg-plum-light text-paper/90 rounded-lg px-3 py-2 transition-colors focus-ring"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm rounded-lg px-3 py-2 max-w-[85%] leading-relaxed ${
              m.role === "user" ? "bg-gold text-plum ml-auto" : "bg-plum-light text-paper"
            }`}
          >
            {m.content}
          </div>
        ))}
        {sending && (
          <div className="text-sm text-paper/50 italic flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-paper/40 animate-bounce [animation-delay:-0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-paper/40 animate-bounce [animation-delay:-0.1s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-paper/40 animate-bounce" />
            <span className="ml-1">Radha is thinking...</span>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="p-3 border-t border-paper/10 flex gap-2 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Radha..."
          className="flex-1 bg-plum-light text-paper placeholder:text-paper/40 text-sm rounded-full px-4 py-2 focus-ring border border-paper/10"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="focus-ring shrink-0 bg-gold text-plum font-semibold text-sm px-4 py-2 rounded-full disabled:opacity-40"
        >
          Ask
        </button>
      </form>
    </aside>
  );
}