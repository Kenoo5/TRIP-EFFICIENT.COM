import { useState } from "react";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};

export default function GuideChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Hi 👋 I’m your Smart Yatra Guide. I can help you book a session, explain this website, and guide your choices."
    }
  ]);

  const [input, setInput] = useState("");

  const getReply = (msg: string) => {
    const text = msg.toLowerCase();

    if (text.includes("book")) {
      return `📌 How to book a session:
1️⃣ Open Planner Page
2️⃣ Select destination
3️⃣ Choose travel days
4️⃣ Enter budget
5️⃣ Click "Book Session"

This helps us personalize your trip.`;
    }

    if (text.includes("why") || text.includes("importance")) {
      return `🌍 Why Smart Yatra?
• Smart trip planning
• Budget-friendly suggestions
• Eco-friendly travel support
• Rewards with eco-coins
• Everything in one platform`;
    }

    if (text.includes("budget")) {
      return `💰 Budget Guide:
• Low budget → nearby trips
• Medium budget → city travel
• High budget → long vacations

Choose wisely for best results.`;
    }

    if (text.includes("day")) {
      return `🗓 Days Selection:
• 1–2 days → short trips
• 3–5 days → city exploration
• 6+ days → full vacation`;
    }

    if (text.includes("eco")) {
      return `🌱 Eco Option:
Eco-friendly choices reduce pollution and earn eco-coins which you can redeem later.`;
    }

    return `❓ I can help you with:
• Booking a session
• Website importance
• Budget & days selection
• Eco-friendly options

Try typing: book session / budget / eco`;
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { sender: "user", text: input };
    const botMsg: ChatMessage = { sender: "bot", text: getReply(input) };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-xl border flex flex-col">
      
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 rounded-t-2xl font-semibold text-sm">
        🤖 Smart Yatra Guide
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto text-sm">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[85%] px-3 py-2 rounded-lg whitespace-pre-line ${
              msg.sender === "user"
                ? "ml-auto bg-green-100 text-right"
                : "bg-gray-100"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 border-t">
        <input
          type="text"
          className="flex-1 border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ask something..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
