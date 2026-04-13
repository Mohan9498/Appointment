import { useMemo, useState } from "react";
import { MessageCircle, X, Send, RotateCcw } from "lucide-react";

const branches = [
  "WestMambalam",
  "Choolaimedu",
  "Anna Nagar",
  "Adambakkam",
  "Egmore",
  "Tambaram",
  "Porur",
  "Thiruvanmiyur",
  "Mylapore",
  "K.K. Nagar",
];

const programs = [
  "Speech Therapy",
  "Cognitive Therapy",
  "Day Care",
];

const initialLead = {
  parentName: "",
  childName: "",
  age: "",
  phone: "",
  countryCode: "+91",
  branch: "",
  program: "",
};

export default function Chatbot({ onOpenModal }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [step, setStep] = useState("welcome");
  const [lead, setLead] = useState(initialLead);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi 👋 I’m Tiny Todds Assistant. I can help you book an appointment in a few quick steps.",
    },
    {
      role: "bot",
      text: "Tap “Start booking” to continue.",
    },
  ]);

  const canSubmit = useMemo(() => {
    return (
      lead.parentName.trim() &&
      lead.childName.trim() &&
      Number(lead.age) > 0 &&
      Number(lead.age) <= 30 &&
      lead.phone.trim().length >= 6 &&
      lead.branch &&
      lead.program
    );
  }, [lead]);

  const addBot = (text) =>
    setMessages((prev) => [...prev, { role: "bot", text }]);

  const addUser = (text) =>
    setMessages((prev) => [...prev, { role: "user", text }]);

  const resetChat = () => {
    setInput("");
    setStep("welcome");
    setLead(initialLead);
    setMessages([
      {
        role: "bot",
        text: "Hi 👋 I’m Tiny Todds Assistant. I can help you book an appointment in a few quick steps.",
      },
      {
        role: "bot",
        text: "Tap “Start booking” to continue.",
      },
    ]);
  };

  const startBooking = () => {
    setStep("parentName");
    addBot("What is the parent’s name?");
  };

  const askNext = (nextStep) => {
    setStep(nextStep);

    const prompts = {
      childName: "What is the child’s name?",
      age: "What is the child’s age?",
      phone: "Please enter your phone number.",
      branch: "Choose your nearest branch.",
      program: "Choose the program you are interested in.",
      review: "Everything looks good. Tap “Open appointment form” to continue.",
    };

    if (prompts[nextStep]) addBot(prompts[nextStep]);
  };

  const handleTextSubmit = () => {
    const value = input.trim();
    if (!value) return;

    addUser(value);
    setInput("");

    if (step === "parentName") {
      setLead((prev) => ({ ...prev, parentName: value }));
      askNext("childName");
      return;
    }

    if (step === "childName") {
      setLead((prev) => ({ ...prev, childName: value }));
      askNext("age");
      return;
    }

    if (step === "age") {
      const age = Number(value.replace(/\D/g, ""));
      if (!age || age < 1 || age > 30) {
        addBot("Please enter a valid age between 1 and 30.");
        return;
      }
      setLead((prev) => ({ ...prev, age: String(age) }));
      askNext("phone");
      return;
    }

    if (step === "phone") {
      const phone = value.replace(/\D/g, "");
      if (phone.length < 6) {
        addBot("Please enter a valid phone number.");
        return;
      }
      setLead((prev) => ({ ...prev, phone }));
      askNext("branch");
      return;
    }

    addBot("Use the options below and I’ll guide you.");
  };

  const selectBranch = (branch) => {
    addUser(branch);
    setLead((prev) => ({ ...prev, branch }));
    askNext("program");
  };

  const selectProgram = (program) => {
    addUser(program);
    setLead((prev) => ({ ...prev, program }));
    askNext("review");
  };

  const openForm = () => {
    if (!canSubmit) {
      addBot("A few details are still missing. Please complete all steps.");
      return;
    }

    onOpenModal(lead);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-[9999] flex items-center justify-center rounded-full bg-blue-600 p-4 text-white shadow-xl transition hover:scale-105 hover:bg-blue-700"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 z-[9999] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white">
            <div>
              <h3 className="font-semibold">Tiny Todds Assistant</h3>
              <p className="text-xs text-blue-100">Smart appointment help</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetChat}
                className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                title="Reset"
                type="button"
              >
                <RotateCcw size={16} />
              </button>

              <button
                onClick={() => setOpen(false)}
                className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="h-96 space-y-3 overflow-y-auto bg-gray-50 p-3 dark:bg-gray-950">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
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

            {step === "welcome" && (
              <div className="pt-2">
                <button
                  onClick={startBooking}
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  type="button"
                >
                  Start booking
                </button>
              </div>
            )}

            {step === "branch" && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                {branches.map((branch) => (
                  <button
                    key={branch}
                    onClick={() => selectBranch(branch)}
                    className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-700 hover:border-blue-500 hover:text-blue-600 dark:border-white/10 dark:bg-gray-900 dark:text-gray-200"
                    type="button"
                  >
                    {branch}
                  </button>
                ))}
              </div>
            )}

            {step === "program" && (
              <div className="grid grid-cols-1 gap-2 pt-2">
                {programs.map((program) => (
                  <button
                    key={program}
                    onClick={() => selectProgram(program)}
                    className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-700 hover:border-blue-500 hover:text-blue-600 dark:border-white/10 dark:bg-gray-900 dark:text-gray-200"
                    type="button"
                  >
                    {program}
                  </button>
                ))}
              </div>
            )}

            {step === "review" && (
              <div className="rounded-2xl border border-gray-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-gray-900">
                <p>
                  <span className="font-medium">Parent:</span> {lead.parentName}
                </p>
                <p>
                  <span className="font-medium">Child:</span> {lead.childName}
                </p>
                <p>
                  <span className="font-medium">Age:</span> {lead.age}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {lead.countryCode} {lead.phone}
                </p>
                <p>
                  <span className="font-medium">Branch:</span> {lead.branch}
                </p>
                <p>
                  <span className="font-medium">Program:</span> {lead.program}
                </p>

                <button
                  onClick={openForm}
                  className="mt-3 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                  type="button"
                >
                  Open appointment form
                </button>
              </div>
            )}
          </div>

          {["parentName", "childName", "age", "phone"].includes(step) && (
            <div className="border-t border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
                  placeholder={
                    step === "age"
                      ? "Enter age"
                      : step === "phone"
                      ? "Enter phone number"
                      : "Type here..."
                  }
                  className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-gray-950 dark:text-white"
                />
                <button
                  onClick={handleTextSubmit}
                  className="rounded-full bg-blue-600 p-3 text-white hover:bg-blue-700"
                  type="button"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}