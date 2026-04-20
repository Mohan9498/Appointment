import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, RotateCcw, Bot } from "lucide-react";

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
        "Speech therapy helps children improve communication and language skills. It's suitable for ages 1 to 12.";
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
        "We have branches across Chennai including WestMambalam, Anna Nagar,Choolaimedu, Tambaram, Porur, and more.";
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
        aria-label="Open chat assistant"
        className={`fixed bottom-6 right-6 z-[9999] flex items-center justify-center rounded-2xl p-4 text-white shadow-xl transition-all duration-300 hover:scale-105 ${
          open
            ? 'bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 rounded-full'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-glow-blue'
        }`}
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 z-[9999] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-slate-900 shadow-2xl animate-scale-in">

          {/* HEADER */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Tiny Todds Assistant</h3>
                <p className="text-[11px] text-blue-100/80">Ask me anything 💬</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={resetChat}
                className="rounded-xl bg-white/10 p-2 hover:bg-white/20 transition-colors"
                title="Reset"
              >
                <RotateCcw size={14} />
              </button>

              <button
                onClick={() => setOpen(false)}
                className="rounded-xl bg-white/10 p-2 hover:bg-white/20 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="h-80 space-y-3 overflow-y-auto bg-gray-50 dark:bg-slate-950 p-4">
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
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md"
                      : "border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="border-t border-gray-200 dark:border-white/[0.06] bg-white dark:bg-slate-900 p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSubmit()
                }
                placeholder="Ask about programs, timings…"
                className="flex-1 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50/50 dark:bg-slate-950 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:text-white transition-all duration-300"
              />

              <button
                onClick={handleSubmit}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white hover:shadow-glow-blue hover:scale-105 transition-all duration-300"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}