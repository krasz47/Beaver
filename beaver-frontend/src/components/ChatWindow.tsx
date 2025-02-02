import React, { useState } from "react";
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

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", content: input }]);
    const response = await fetchBeaverResponse(code, input);

    setMessages([
      ...messages,
      { role: "user", content: input },
      { role: "ai", content: response.message },
    ]);

    if (response.updatedCode) {
      onUpdateCode(response.updatedCode);
    }

    setInput("");
  };

  return (
    <div className="chat-container flex flex-col  h-full w-full">
      <h2 className="text-lg font-semibold mb-2">Beaver AI</h2>
      <div className="flex-grow max-h-[600px] overflow-y-auto bg-darkGray p-3 rounded-lg">
        {messages.map((msg, idx) => (
          <p
            key={idx}
            className={
              msg.role === "user"
                ? "text-right text-blue-500"
                : "text-left text-green-500"
            }
          >
            <strong>{msg.role === "user" ? "You" : "Beaver"}:</strong>{" "}
            {msg.content}
          </p>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the code..."
          className="flex-grow p-2 border rounded text-white"
        />
        <button onClick={sendMessage} className="primary-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
