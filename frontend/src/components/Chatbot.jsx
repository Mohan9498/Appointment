import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, RotateCcw } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 I'm the Tiny Todds Assistant!" },
    {
      role: "bot",
      text: "You can ask me about our therapy programs, timings, or locations. How can I help you today?",
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBot = (text) =>
    setMessages((prev) => [...prev, { role: "bot", text }]);

  const addUser = (text) =>
    setMessages((prev) => [...prev, { role: "user", text }]);

  const resetChat = () => {
    setInput("");
    setMessages([
      { role: "bot", text: "Hi 👋 I'm the Tiny Todds Assistant!" },
      {
        role: "bot",
        text: "You can ask me about our therapy programs, timings, or locations. How can I help you today?",
      },
    ]);
  };

  // ✅ SIMPLE AI (NO API)
  const sendToAI = (userText) => {
    const text = userText.toLowerCase();

    let reply = "I'm here to help 😊";

    if (text.includes("speech")) {
      reply =
        "Speech therapy helps children improve communication and language skills. It’s suitable for ages 1 to 12.";
    } 
    else if (text.includes("cognitive")) {
      reply =
        "Cognitive therapy supports memory, learning, and attention skills. Suitable for ages 2 to 15.";
    }
    else if (text.includes("day care")) {
      reply =
        "We offer structured day care for children with special needs, with both full-day and half-day options.";
    }
    else if (text.includes("timing") || text.includes("time")) {
      reply =
        "We are open Monday to Saturday from 10 AM to 8 PM. Sunday is closed.";
    }
    else if (text.includes("branch") || text.includes("location")) {
      reply =
        "We have branches across Chennai including WestMambalam, Anna Nagar, Tambaram, Porur, and more.";
    }
    else if (text.includes("age")) {
      reply =
        "Our programs are designed for children from 1 to 15 years depending on the therapy type.";
    }
    else {
      reply =
        "We offer Speech Therapy, Cognitive Therapy, and Day Care. You can also ask about timings or locations 😊";
    }

    setTimeout(() => {
      addBot(reply);
    }, 500);
  };

  const handleSubmit = () => {
    const value = input.trim();
    if (!value) return;

    addUser(value);
    setInput("");

    sendToAI(value);
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-[9999] flex items-center justify-center rounded-full bg-blue-600 p-4 text-white shadow-xl transition hover:scale-105 hover:bg-blue-700"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 z-[9999] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900">

          {/* HEADER */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white">
            <div>
              <h3 className="font-semibold">Tiny Todds Assistant</h3>
              <p className="text-xs text-blue-100">Ask me anything 💬</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetChat}
                className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                title="Reset"
              >
                <RotateCcw size={16} />
              </button>

              <button
                onClick={() => setOpen(false)}
                className="rounded-full bg-white/10 p-2 hover:bg-white/20"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="h-96 space-y-3 overflow-y-auto bg-gray-50 p-3 dark:bg-gray-950">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 bg-white text-gray-800 dark:border-white/10 dark:bg-gray-900 dark:text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="border-t border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSubmit()
                }
                placeholder="Ask about programs, timings, locations…"
                className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-gray-950 dark:text-white"
              />

              <button
                onClick={handleSubmit}
                className="rounded-full bg-blue-600 p-3 text-white hover:bg-blue-700"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}