import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Phone rules per country code: { min, max, label }
const phoneRules = {
  "+91":  { min: 10, max: 10, label: "India — 10 digits" },
  "+1":   { min: 10, max: 10, label: "US/Canada — 10 digits" },
  "+44":  { min: 10, max: 10, label: "UK — 10 digits" },
  "+61":  { min: 9,  max: 9,  label: "Australia — 9 digits" },
  "+971": { min: 9,  max: 9,  label: "UAE — 9 digits" },
  "+81":  { min: 10, max: 11, label: "Japan — 10 or 11 digits" },
  "+49":  { min: 10, max: 11, label: "Germany — 10 or 11 digits" },
  "+33":  { min: 9,  max: 9,  label: "France — 9 digits" },
  "+39":  { min: 9,  max: 10, label: "Italy — 9 or 10 digits" },
  "+34":  { min: 9,  max: 9,  label: "Spain — 9 digits" },
  "+86":  { min: 11, max: 11, label: "China — 11 digits" },
  "+7":   { min: 10, max: 10, label: "Russia — 10 digits" },
  "+55":  { min: 10, max: 11, label: "Brazil — 10 or 11 digits" },
  "+27":  { min: 9,  max: 9,  label: "South Africa — 9 digits" },
  "+65":  { min: 8,  max: 8,  label: "Singapore — 8 digits" },
  "+82":  { min: 9,  max: 10, label: "South Korea — 9 or 10 digits" },
  "+966": { min: 9,  max: 9,  label: "Saudi Arabia — 9 digits" },
  "+93":  { min: 9,  max: 9,  label: "Afghanistan — 9 digits" },
  "+213": { min: 9,  max: 9,  label: "Algeria — 9 digits" },
};

function getPhoneError(countryCode, phone) {
  if (!phone) return null;
  const rule = phoneRules[countryCode];
  if (!rule) return null;
  const len = phone.length;
  if (len < rule.min) {
    return `${rule.label} (${len}/${rule.min} digits entered)`;
  }
  if (len > rule.max) {
    return `Too many digits for ${rule.label.split("—")[0].trim()} (max ${rule.max})`;
  }
  return null; // valid
}

function ContactModal({ onClose, prefill = null }) {
  const [form, setForm] = useState({
    parentName: prefill?.parentName || "",
    childName: prefill?.childName || "",
    age: prefill?.age || "",
    phone: prefill?.phone || "",
    countryCode: prefill?.countryCode || "+91",
    branch: prefill?.branch || "",
    program: prefill?.program || "",
  });

  const countries = [
    { code: "+91",  label: "🇮🇳" },
    { code: "+1",   label: "🇺🇸" },
    { code: "+44",  label: "🇬🇧" },
    { code: "+61",  label: "🇦🇺" },
    { code: "+971", label: "🇦🇪" },
    { code: "+81",  label: "🇯🇵" },
    { code: "+49",  label: "🇩🇪" },
    { code: "+33",  label: "🇫🇷" },
    { code: "+39",  label: "🇮🇹" },
    { code: "+34",  label: "🇪🇸" },
    { code: "+86",  label: "🇨🇳" },
    { code: "+7",   label: "🇷🇺" },
    { code: "+55",  label: "🇧🇷" },
    { code: "+27",  label: "🇿🇦" },
    { code: "+65",  label: "🇸🇬" },
    { code: "+82",  label: "🇰🇷" },
    { code: "+966", label: "🇸🇦" },
    { code: "+93",  label: "🇦🇫" },
    { code: "+213", label: "🇩🇿" },
  ];

  const programs = [
    { value: "Speech Therapy",   label: "Speech Therapy" },
    { value: "Cognitive Therapy", label: "Cognitive Therapy" },
    { value: "Day Care",          label: "Day Care" },
  ];

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef();

  // Derived phone error — recalculates whenever phone or countryCode changes
  const phoneError = getPhoneError(form.countryCode, form.phone);
  const phoneHint = phoneRules[form.countryCode]
    ? `${phoneRules[form.countryCode].label}`
    : null;

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (prefill) setForm((prev) => ({ ...prev, ...prefill }));
  }, [prefill]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "age") {
      value = value.replace(/\D/g, "");
      value = Math.max(0, Number(value));
      if (value > 30) value = 30;
    }
    setForm({ ...form, [name]: value });
  };

  // Phone is valid only when there's no error AND it has at least the min digits
  const phoneValid =
    form.phone.length > 0 &&
    phoneError === null &&
    form.phone.length >= (phoneRules[form.countryCode]?.min ?? 6);

  const isValid =
    form.parentName &&
    form.childName &&
    Number(form.age) > 0 &&
    Number(form.age) <= 30 &&
    phoneValid &&
    form.branch &&
    form.program;

  const handleSubmit = async () => {
    if (!isValid) {
      toast.error("Please fill all fields correctly");
      return;
    }
    try {
      setLoading(true);
      await API.post("appointments/", {
        parent_name: form.parentName,
        child_name: form.childName,
        age: form.age,
        phone: `${form.countryCode}${form.phone}`,
        branch: form.branch,
        program: form.program,
        date: new Date().toISOString().split("T")[0],
        time: "Flexible",
      });
      toast.success("Submitted successfully 🎉");
      setSubmitted(true);
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex py-1 items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-4 overflow-y-auto max-h-[95vh]"
        >
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-2 p-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-xl leading-none"
            type="button"
          >
            ✕
          </button>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Appointment Requested!
              </h2>
              <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">
                Thank you,{" "}
                <span className="font-medium text-blue-600">{form.parentName}</span>! We'll call
                you shortly to confirm{" "}
                <span className="font-medium">{form.childName}</span>'s appointment at our{" "}
                <span className="font-medium">{form.branch}</span> branch.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                type="button"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl text-gray-900 dark:text-white font-bold mb-1">
                Book an Appointment
              </h2>
              <p className="text-gray-500 dark:text-gray-500 text-sm mb-3">
                Fill in the details and we'll call you to confirm.
              </p>

              <Field label="Parent Name">
                <input
                  ref={inputRef}
                  name="parentName"
                  value={form.parentName}
                  onChange={handleChange}
                  placeholder="e.g. Madhan"
                  className={inputCls}
                />
              </Field>

              <Field label="Child Name">
                <input
                  name="childName"
                  value={form.childName}
                  onChange={handleChange}
                  placeholder="e.g. Aryan"
                  className={inputCls}
                />
              </Field>

              <Field label="Child Age (years)">
                <input
                  type="number"
                  name="age"
                  min="1"
                  max="30"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="1 – 30"
                  className={inputCls}
                />
              </Field>

              {/* PHONE — with per-country hint and live error */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 dark:text-white-400 mb-1">
                  Phone Number *
                </label>

                <div
                  className={`flex items-center border rounded-xl px-3 bg-white dark:bg-white/5 focus-within:ring-2 transition ${
                    phoneError
                      ? "border-red-400 dark:border-red-500 focus-within:ring-red-400"
                      : phoneValid
                      ? "border-green-400 dark:border-green-500 focus-within:ring-green-400"
                      : "border-gray-300 dark:border-white/10 focus-within:ring-blue-600"
                  }`}
                >
                  <select
                  aria-label="Select Country Code"
                    className="bg-transparent outline-none text-sm py-1 pr-2 text-gray-700 dark:text-gray-700"
                    value={form.countryCode}
                    onChange={(e) =>
                      setForm({ ...form, countryCode: e.target.value, phone: "" })
                    }
                  >
                    {countries.map((c, i) => (
                      <option key={i} value={c.code}>
                        {c.label} {c.code}
                      </option>
                    ))}
                  </select>

                  <input
                    type="tel"
                    placeholder={
                      phoneRules[form.countryCode]
                        ? `${phoneRules[form.countryCode].min}${
                            phoneRules[form.countryCode].max !== phoneRules[form.countryCode].min
                              ? `–${phoneRules[form.countryCode].max}`
                              : ""
                          } digits`
                        : "Phone number"
                    }
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
                    }
                    maxLength={phoneRules[form.countryCode]?.max ?? 15}
                    className="w-full py-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                  />

                  {/* Live status icon */}
                  {form.phone.length > 0 && (
                    <span className="ml-2 text-sm flex-shrink-0">
                      {phoneError ? "❌" : "✅"}
                    </span>
                  )}
                </div>

                {/* Hint line — shows expected format when no input yet */}
                {!form.phone && phoneHint && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    {phoneHint}
                  </p>
                )}

                {/* Error line — shows when input exists but is wrong */}
                {phoneError && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    ⚠ {phoneError}
                  </p>
                )}

                {/* Success line */}
                {phoneValid && !phoneError && (
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                    Valid number
                  </p>
                )}
              </div>

              <Field label="Select Branch">
                <select
                  name="branch"
                  aria-label="Select Branch"
                  value={form.branch}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="">Choose your nearest branch</option>
                  <option value="WestMambalam">WestMambalam</option>
                  <option value="Choolaimedu">Choolaimedu</option>
                  <option value="Anna Nagar">Anna Nagar</option>
                  <option value="Adambakkam">Adambakkam</option>
                  <option value="Egmore">Egmore</option>
                  <option value="Tambaram">Tambaram</option>
                  <option value="Porur">Porur</option>
                  <option value="Thiruvanmiyur">Thiruvanmiyur</option>
                  <option value="Mylapore">Mylapore</option>
                  <option value="K.K. Nagar">K.K. Nagar</option>
                </select>
              </Field>

              <div className="mb-5">
                <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                  Select Program *
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {programs.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setForm({ ...form, program: p.value })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-sm font-medium transition ${
                        form.program === p.value
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                          : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-blue-300"
                      }`}
                    >
                      <span className="text-xs text-center leading-tight">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isValid || loading}
                className={`w-full py-2 rounded-xl font-semibold transition ${
                  isValid
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 dark:bg-white/5 text-gray-500 cursor-not-allowed"
                }`}
                type="button"
              >
                {loading ? "Submitting..." : "Submit Appointment"}
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const inputCls =
  "w-full mt-1 px-4 py-1 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none transition";

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">
        {label} *
      </label>
      {children}
    </div>
  );
}

export default ContactModal;