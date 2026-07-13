import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  RotateCcw,
  Bot,
  Sparkles,
  MapPin,
  Mic,
  Brain,
  Home as HomeIcon,
  Phone,
  Clock,
} from "lucide-react";

const QUICK_REPLIES = ["Our Programs", "Timings", "Branches", "Location", "Contact Us"];

const MAP_QUERY = "26Q9+8W Chennai, Tamil Nadu";
const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

const PROGRAMS = [
  {
    icon: Mic,
    title: "Speech Therapy",
    ages: "Ages 1–12",
    desc: "Builds communication, articulation, and language skills through individualized sessions.",
  },
  {
    icon: Brain,
    title: "Cognitive Therapy",
    ages: "Ages 2–15",
    desc: "Strengthens memory, attention, and learning ability, beginning with a personalized assessment.",
  },
  {
    icon: HomeIcon,
    title: "Day Care",
    ages: "All ages",
    desc: "Structured full-day and half-day care for children with special needs, in a safe, nurturing setting.",
  },
];

const BRANCHES = [
  "West Mambalam",
  "Choolaimedu",
  "Anna Nagar",
  "Tambaram",
  "Porur",
  "Velachery",
  "Adyar",
  "T. Nagar",
  "Perambur",
  "OMR",
];

const INITIAL_MESSAGES = [
  { role: "bot", text: "Hi 👋 I'm the Tiny Todds Assistant." },
  { role: "bot", text: "I can help with our therapy programs, timings, or branch locations. What would you like to know?" },
];

export default function Chatbot({ onOpenModal }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [usedChips, setUsedChips] = useState([]);
  const topicCounts = useRef({});
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
    setUsedChips([]);
    topicCounts.current = {};
  };

  // Returns how many times this topic has already been asked, then increments it.
  const askTopic = (topic) => {
    const count = topicCounts.current[topic] || 0;
    topicCounts.current[topic] = count + 1;
    return count;
  };

  // Runs a bot reply after a short, natural typing delay.
  const respondWithDelay = (callback) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 800 + Math.random() * 600);
  };

  // ✅ SIMPLE AI (NO API)
  const sendToAI = (userText) => {
    const text = userText.toLowerCase();

    if (text.includes("location") || text.includes("map") || text.includes("where") || text.includes("address")) {
      const asked = askTopic("location");
      respondWithDelay(() => {
        addBot(
          asked === 0
            ? "Here is our main branch location in Chennai, Tamil Nadu:"
            : "Sure, here's that location again:"
        );
        setTimeout(() => addBot("", "map"), 300);
      });
      return;
    }

    if (text.includes("branch")) {
      const asked = askTopic("branches");
      respondWithDelay(() => {
        addBot(asked === 0 ? "We have branches across Chennai:" : "Here's our branch list again:");
        setTimeout(() => addBot("", "branches"), 300);
      });
      return;
    }

    if (
      text.includes("speech") ||
      text.includes("cognitive") ||
      text.includes("day care") ||
      text.includes("daycare") ||
      text.includes("program") ||
      text.includes("therapy")
    ) {
      const asked = askTopic("programs");
      respondWithDelay(() => {
        addBot(asked === 0 ? "Here's an overview of our programs:" : "As mentioned, here are our programs again:");
        setTimeout(() => addBot("", "programs"), 300);
      });
      return;
    }

    if (text.includes("timing") || text.includes("time") || text.includes("hour")) {
      const asked = askTopic("timing");
      respondWithDelay(() =>
        addBot(
          asked === 0
            ? "🕐 We're open **Monday to Saturday, 10 AM – 8 PM**. We're closed on Sundays. Would you like to schedule an appointment?"
            : "🕐 Just to recap — **Mon to Sat, 10 AM – 8 PM**, closed Sundays."
        )
      );
      return;
    }

    if (
      text.includes("contact") ||
      text.includes("phone") ||
      text.includes("email") ||
      text.includes("call") ||
      text.includes("whatsapp")
    ) {
      const asked = askTopic("contact");
      respondWithDelay(() =>
        addBot(
          asked === 0
            ? "📞 Here's how to reach us:\n\n**Phone:** +91 99413 50646\n**Email:** support@tinytodds.com\n**Hours:** Mon – Sat, 10 AM – 8 PM"
            : "📞 Here's that number again: **+91 99413 50646** (support@tinytodds.com)"
        )
      );
      return;
    }

    if (text.includes("age")) {
      const asked = askTopic("age");
      respondWithDelay(() =>
        addBot(
          asked === 0
            ? "👶 Our programs serve children from **1 to 15 years**, with the age range depending on the therapy type."
            : "👶 Right, ages **1–15** overall — it depends on the specific program."
        )
      );
      return;
    }

    if (text.includes("book") || text.includes("appointment")) {
      const asked = askTopic("book");
      respondWithDelay(() =>
        addBot(
          asked === 0
            ? "📅 You can book an appointment using the **Book Appointment** button on our home page, or by calling us directly. Would you like the phone number?"
            : "📅 Same as before — use the **Book Appointment** button, or give us a call."
        )
      );
      return;
    }

    if (text.includes("cost") || text.includes("price") || text.includes("fee")) {
      const asked = askTopic("cost");
      respondWithDelay(() =>
        addBot(
          asked === 0
            ? "💰 Fees vary by program and session type. Package discounts are available. Contact us for a personalized quote."
            : "💰 As mentioned, pricing depends on the program — reach out to us directly for a quote."
        )
      );
      return;
    }

    if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
      const asked = askTopic("greeting");
      respondWithDelay(() =>
        addBot(
          asked === 0
            ? "Hello! 😊 Welcome to Tiny Todds. Ask me about our programs, timings, or branch locations anytime."
            : "Hi again! 👋 What else can I help you with?"
        )
      );
      return;
    }

    const asked = askTopic("fallback");
    respondWithDelay(() =>
      addBot(
        asked === 0
          ? "We offer **Speech Therapy**, **Cognitive Therapy**, and **Day Care**. You can also ask about timings, branches, or booking an appointment."
          : "I might not have understood that. Try asking about our **programs**, **timings**, **branches**, or **contact details**."
      )
    );
  };

  const handleSubmit = (text, isChip = false) => {
    const value = (text || input).trim();
    if (!value) return;

    addUser(value);
    setInput("");
    if (isChip) setUsedChips((prev) => [...prev, value]);
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
        return (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
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
        <div
          className="fixed bottom-24 right-4 z-[9999] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0f1629] shadow-2xl animate-scale-in flex flex-col"
          style={{ maxHeight: "520px" }}
        >
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
                          <MapPin size={12} /> Open in Google Maps →
                        </a>
                      </div>
                    ) : msg.type === "branches" ? (
                      <ul className="space-y-2.5 min-w-[200px]">
                        {BRANCHES.map((branch) => (
                          <li key={branch} className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                              <MapPin size={13} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{branch}</span>
                          </li>
                        ))}
                      </ul>
                    ) : msg.type === "programs" ? (
                      <div className="space-y-3 min-w-[220px]">
                        {PROGRAMS.map(({ icon: Icon, title, ages, desc }) => (
                          <div key={title} className="flex gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                              <Icon size={14} />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-semibold">{title}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                                  {ages}
                                </span>
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : msg.role === "bot" ? (
                      renderText(msg.text)
                    ) : (
                      msg.text
                    )}
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
            {!isTyping &&
              (() => {
                const remainingChips = QUICK_REPLIES.filter((chip) => !usedChips.includes(chip));
                if (remainingChips.length === 0) return null;
                return (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {remainingChips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleSubmit(chip, true)}
                        className="text-xs px-3 py-2 rounded-full border border-blue-200 dark:border-blue-800/50 bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 font-medium"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                );
              })()}

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