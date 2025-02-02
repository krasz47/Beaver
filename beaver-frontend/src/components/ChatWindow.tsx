import React, { useState, useEffect, useRef } from "react";
import { fetchBeaverResponse } from "../api";

interface ChatWindowProps {
  code: string;
  onUpdateCode: (newCode: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ code, onUpdateCode }) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedCode, setSuggestedCode] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const response = await fetchBeaverResponse(code, newMessages);

    setMessages([
      ...newMessages,
      { role: "system", content: response.message },
    ]);

    if (response.updated_code) {
      setSuggestedCode(response.updated_code);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container flex flex-col h-full w-full bg-[#1e1e1e] p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-white mb-2">Beaver AI</h2>

      {/* Chat Messages */}
      <div
        ref={chatRef}
        className="flex-grow max-h-[600px] overflow-y-auto bg-darkGray p-3 rounded-lg"
      >
        {messages.map((msg, idx) => (
          <p
            key={idx}
            className={`p-2 ${
              msg.role === "user"
                ? "text-right text-blue-400"
                : "text-left text-green-400"
            }`}
          >
            <strong>{msg.role === "user" ? "You" : "Beaver"}:</strong>{" "}
            {msg.content}
          </p>
        ))}
        {loading && <p className="text-yellow-400">Beaver is thinking...</p>}
      </div>

      {/* Suggested Code Changes */}
      {suggestedCode && (
        <div className="bg-darkGray p-3 rounded-lg mt-2">
          <h3 className="text-white text-sm pb-2">Suggested Code Update</h3>
          <pre className="text-white text-sm p-2 rounded bg-[#1e1e1e] overflow-x-auto">
            {suggestedCode}
          </pre>
          <button
            onClick={() => {
              onUpdateCode(suggestedCode);
              setSuggestedCode(null);
            }}
            className="primary-btn mt-2"
          >
            Apply Code Update
          </button>
        </div>
      )}

      {/* Input Field */}
      <div className="flex mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the code..."
          className="flex-grow p-2 text-white border rounded"
        />
        <button onClick={sendMessage} className="primary-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
