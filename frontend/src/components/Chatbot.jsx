import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, RotateCcw, Bot, Sparkles } from "lucide-react";

const QUICK_REPLIES = [
  "Speech Therapy",
  "Cognitive Therapy",
  "Day Care",
  "Timings",
  "Branches",
  "Location",
];

const MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8!2d80.23!3d13.04!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAyJzI0LjAiTiA4MMKwMTMnNDguMCJF!5e0!3m2!1sen!2sin!4v1";
const MAP_LINK = "https://www.google.com/maps/search/?api=1&query=26Q9%2B8W%20Chennai%2C%20Tamil%20Nadu";

const INITIAL_MESSAGES = [
  { role: "bot", text: "Hi 👋 I'm the Tiny Todds Assistant!" },
  { role: "bot", text: "You can ask me about our therapy programs, timings, or locations. How can I help you today?" },
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const addBot = (text, type = "text") =>
    setMessages((prev) => [...prev, { role: "bot", text, type, time: new Date() }]);

  const addUser = (text) =>
    setMessages((prev) => [...prev, { role: "user", text, time: new Date() }]);

  const resetChat = () => {
    setInput("");
    setMessages(INITIAL_MESSAGES);
    setIsTyping(false);
    setShowQuickReplies(true);
  };

  // ✅ SIMPLE AI (NO API)
  const sendToAI = (userText) => {
    const text = userText.toLowerCase();
    let reply = "I'm here to help 😊";

    if (text.includes("speech")) {
      reply = "🗣️ **Speech Therapy** helps children improve communication and language skills. It's suitable for ages 1 to 12. Would you like to book a session?";
    }
    else if (text.includes("cognitive")) {
      reply = "🧠 **Cognitive Therapy** supports memory, learning, and attention skills. Suitable for ages 2 to 15. We offer personalized assessment sessions!";
    }
    else if (text.includes("day care")) {
      reply = "🏠 We offer structured **Day Care** for children with special needs, with both full-day and half-day options. Safe, nurturing environment guaranteed!";
    }
    else if (text.includes("timing") || text.includes("time")) {
      reply = "🕐 We are open **Monday to Saturday** from **10 AM to 8 PM**. Sunday is closed. Would you like to schedule an appointment?";
    }
    else if (text.includes("branch")) {
      reply = "🏥 We have branches across Chennai including **WestMambalam, Choolaimedu, Anna Nagar, Tambaram, Porur**, and more. Which branch is closest to you?";
    }
    else if (text.includes("location") || text.includes("map") || text.includes("where")) {
      reply = "📍 Here's our main branch location in **Chennai, Tamil Nadu**:";
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addBot(reply);
        setTimeout(() => addBot("", "map"), 300);
      }, 800 + Math.random() * 600);
      return;
    }
    else if (text.includes("contact") || text.includes("phone") || text.includes("email") || text.includes("call") || text.includes("whatsapp")) {
      reply = "📞 Here's how to reach us:\n\n**Phone:** +91 99413 50646\n**Email:** support@tinytodds.com\n**WhatsApp:** Chat with us directly!\n**Hours:** Mon - Sat, 10 AM - 8 PM";
    }
    else if (text.includes("age")) {
      reply = "👶 Our programs are designed for children from **1 to 15 years** depending on the therapy type. Each program is age-appropriate!";
    }
    else if (text.includes("book") || text.includes("appointment")) {
      reply = "📅 You can book an appointment through our **Book Appointment** button on the home page, or call us directly. Want me to guide you?";
    }
    else if (text.includes("cost") || text.includes("price") || text.includes("fee")) {
      reply = "💰 Our fees vary based on the program and session type. Please contact us for a personalized quote. We also offer package discounts!";
    }
    else if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
      reply = "Hello! 😊 Welcome to Tiny Todds. How can I assist you today? You can ask about our programs, timings, or locations!";
    }
    else {
      reply = "We offer **Speech Therapy**, **Cognitive Therapy**, and **Day Care**. You can also ask about timings, locations, or booking appointments 😊";
    }

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addBot(reply);
    }, 800 + Math.random() * 600);
  };

  const handleSubmit = (text) => {
    const value = (text || input).trim();
    if (!value) return;

    addUser(value);
    setInput("");
    setShowQuickReplies(false);
    sendToAI(value);
  };

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  // Simple markdown bold parser
  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open chat assistant"
        className={`fixed bottom-6 right-6 z-[9999] flex items-center justify-center rounded-2xl p-4 text-white shadow-xl transition-all duration-300 hover:scale-105 ${
          open
            ? "bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 rounded-full"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-glow-blue animate-bounce-gentle"
        }`}
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 z-[9999] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0f1629] shadow-2xl animate-scale-in flex flex-col" style={{ maxHeight: "520px" }}>

          {/* HEADER */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-white/5" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm ring-2 ring-white/20">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-1.5">
                    Tiny Todds Assistant
                    <Sparkles size={12} className="text-yellow-300" />
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-[11px] text-blue-100/80">Online now</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button onClick={resetChat} className="rounded-xl bg-white/10 p-2 hover:bg-white/25 transition-all duration-200" title="Reset chat">
                  <RotateCcw size={14} />
                </button>
                <button onClick={() => setOpen(false)} className="rounded-xl bg-white/10 p-2 hover:bg-white/25 transition-all duration-200">
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-[#0a0e1a] p-4 space-y-4" style={{ minHeight: "300px" }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                {msg.role === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white mr-2 mt-1 shrink-0">
                    <Bot size={14} />
                  </div>
                )}
                <div className="flex flex-col">
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md shadow-sm"
                        : "bg-white dark:bg-white/[0.05] border border-gray-200/80 dark:border-white/[0.08] text-gray-700 dark:text-gray-300 rounded-bl-md shadow-sm"
                    }`}
                  >
                    {msg.type === "map" ? (
                      <div className="space-y-2">
                        <div className="rounded-xl overflow-hidden border border-gray-200/50 dark:border-white/[0.06]">
                          <iframe
                            src={MAP_EMBED_URL}
                            width="100%"
                            height="160"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Main Branch Location"
                          />
                        </div>
                        <a
                          href={MAP_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          📍 Open in Google Maps →
                        </a>
                      </div>
                    ) : msg.role === "bot" ? renderText(msg.text) : msg.text}
                  </div>
                  {msg.time && (
                    <span className={`text-[10px] text-gray-400 mt-1 ${msg.role === "user" ? "text-right" : "ml-1"}`}>
                      {formatTime(msg.time)}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white mr-2 mt-1 shrink-0">
                  <Bot size={14} />
                </div>
                <div className="bg-white dark:bg-white/[0.05] border border-gray-200/80 dark:border-white/[0.08] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Reply Chips */}
            {showQuickReplies && messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {QUICK_REPLIES.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSubmit(chip)}
                    className="text-xs px-3 py-2 rounded-full border border-blue-200 dark:border-blue-800/50 bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 font-medium"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="border-t border-gray-200/80 dark:border-white/[0.06] bg-white dark:bg-[#0f1629] p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Type your question…"
                className="flex-1 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300"
              />
              <button
                onClick={() => handleSubmit()}
                disabled={!input.trim()}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white hover:shadow-glow-blue hover:scale-105 transition-all duration-300 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-2">Powered by Tiny Todds AI Assistant</p>
          </div>
        </div>
      )}
    </>
  );
}