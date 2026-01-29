import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { sendQueryToAPI } from "./api";
import {
  parseItemsFromMarkdown,
  parseOrdersFromMarkdown,
  isOrderHistory
} from "./chatUtils";
import ProductCard from "./ProductCard";
import OrderCard from "./OrderCard";

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [sessionId, setSessionId] = useState(
    localStorage.getItem("session_id")
  );
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const prevMsgCountRef = useRef(0);
  const [autoScroll, setAutoScroll] = useState(true);

  /* ---------- AUTO SCROLL ---------- */
  useEffect(() => {
    if (autoScroll && messages.length > prevMsgCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      prevMsgCountRef.current = messages.length;
    }
  }, [messages, autoScroll]);

  /* ---------- SEND TO AI ---------- */
  const send = async (text) => {
    setLoading(true);

    const data = await sendQueryToAPI(text, sessionId);

    if (data.session_id) {
      setSessionId(data.session_id);
      localStorage.setItem("session_id", data.session_id);
    }

    const isOrders = isOrderHistory(data.response);

    setMessages(prev => [
      ...prev,
      {
        role: "assistant",
        text: data.response,
        items: !isOrders
          ? parseItemsFromMarkdown(data.response)
          : null,
        orders: isOrders
          ? parseOrdersFromMarkdown(data.response)
          : null
      }
    ]);

    setLoading(false);
  };

  const sendUser = async () => {
    if (!query.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: query }]);
    setQuery("");
    await send(query);
  };

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col p-4">

      {/* HEADER */}
      <div className="flex justify-between border-b pb-2">
        <h3 className="font-semibold">AI Commerce Assistant</h3>
        <button
          onClick={() => {
            setMessages([]);
            setSessionId(null);
            localStorage.removeItem("session_id");
            prevMsgCountRef.current = 0;
          }}
          className="text-sm text-red-600"
        >
          New Chat
        </button>
      </div>

      {/* CHAT BODY */}
      <div
        className="flex-1 overflow-y-auto py-4 space-y-4"
        onScroll={(e) => {
          const el = e.target;
          setAutoScroll(
            el.scrollHeight - el.scrollTop - el.clientHeight < 50
          );
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-[80%] rounded-xl px-4 py-3 bg-gray-100">

              {/* TEXT */}
              {!m.items && !m.orders && (
               <ReactMarkdown
                  components={{
                    img: ({ ...props }) => (
                      <img
                        {...props}
                        className="max-w-full max-h-80 object-contain rounded-xl mx-auto my-3"
                      />
                    )
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              )}

              {/* PRODUCTS */}
              {m.items && (
                <div className="space-y-3">
                  {m.items.map((item, idx) => (
                    <ProductCard
                      key={idx}
                      item={item}
                      onAction={send}
                    />
                  ))}
                </div>
              )}

              {/* ORDERS */}
              {m.orders && (
                <>
                  <p className="text-sm mb-2">
                    📦 Your recent orders
                  </p>
                  <div className="space-y-3">
                    {m.orders.map((order, idx) => (
                      <OrderCard key={idx} order={order} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-400">
            AI is typing…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="flex gap-2 border-t pt-3">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendUser()}
          className="flex-1 border rounded-full px-4 py-2"
          placeholder="Ask or manage your cart…"
        />
        <button
          onClick={sendUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}
