import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import useCMS from "../hooks/useCMS";


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

  const { getSection } = useCMS("settings");
  const branchesCMS = getSection("branches"); 
  const programsCMS = getSection("program-options"); 
  const countryCMS = getSection("country-codes");

  const defaultCountries = [
    { code: "+91", label: "🇮🇳" },
    { code: "+1", label: "🇺🇸" },
    { code: "+44", label: "🇬🇧" },
    { code: "+61", label: "🇦🇺" },
    { code: "+971", label: "🇦🇪" },
    { code: "+81", label: "🇯🇵" },
    { code: "+49", label: "🇩🇪" },
    { code: "+33", label: "🇫🇷" },
    { code: "+39", label: "🇮🇹" },
    { code: "+34", label: "🇪🇸" },
    { code: "+86", label: "🇨🇳" },
    { code: "+7", label: "🇷🇺" },
    { code: "+55", label: "🇧🇷" },
    { code: "+27", label: "🇿🇦" },
    { code: "+65", label: "🇸🇬" },
    { code: "+82", label: "🇰🇷" },
    { code: "+966", label: "🇸🇦" },
    { code: "+93", label: "🇦🇫" },
    { code: "+213", label: "🇩🇿" },
  ];

  const countries = countryCMS?.data?.length
    ? countryCMS.data.map(c => ({ code: c.title, label: c.title }))
    : defaultCountries;

  const programs = programsCMS?.data?.length
    ? programsCMS.data.map(p => ({ value: p.title, label: p.title }))
    : [
        { value: "Speech Therapy",   label: "Speech Therapy" },
        { value: "Cognitive Therapy", label: "Cognitive Therapy" },
        { value: "Day Care",          label: "Day Care" },
      ];

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef();

  const branches = branchesCMS?.data?.length
  ? [...branchesCMS.data].sort((a, b) => a.title.localeCompare(b.title))
  : [
      { title: "WestMambalam" },
      { title: "Choolaimedu" },
      { title: "Anna Nagar" },
      { title: "Adambakkam" },
      { title: "Egmore" },
      { title: "Tambaram" },
      { title: "Porur" },
      { title: "Thiruvanmiyur" },
      { title: "Mylapore" },
      { title: "K.K. Nagar" },
    ];


  

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
        className="fixed inset-0 z-50 flex py-1 items-center justify-center bg-black/70 backdrop-blur-md px-2 sm:px-4"
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
          className="relative w-full max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] min-[1200px]:max-w-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-3xl shadow-2xl shadow-black/20 dark:shadow-black/50 p-3 sm:p-6 overflow-y-auto max-h-[95vh]"
        >
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 text-lg leading-none transition-colors"
            type="button"
          >
            ✕
          </button>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Appointment Requested!
              </h2>
              <p className="text-gray-500 dark:text-gray-500 text-sm mb-6 max-w-sm">
                Thank you,{" "}
                <span className="font-medium text-blue-600">{form.parentName}</span>! We'll call
                you shortly to confirm{" "}
                <span className="font-medium">{form.childName}</span>'s appointment at our{" "}
                <span className="font-medium">{form.branch}</span> branch.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                type="button"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl text-gray-900 dark:text-white font-bold tracking-tight mb-1 pr-8">
                Book an Appointment
              </h2>
              <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-white-400 mb-1.5">
                  Phone Number *
                </label>

                <div
                  className={`flex items-center border rounded-xl px-3 py-0.5 bg-white dark:bg-white/5 focus-within:ring-2 transition-all duration-200 ${
                    phoneError
                      ? "border-red-400 dark:border-red-500 focus-within:ring-red-400"
                      : phoneValid
                      ? "border-green-400 dark:border-green-500 focus-within:ring-green-400"
                      : "border-gray-300 dark:border-white/10 focus-within:ring-blue-600 focus-within:border-blue-500"
                  }`}
                >
                  <CustomDropdown
                    value={form.countryCode}
                    onChange={(val) => setForm({ ...form, countryCode: val, phone: "" })}
                    options={countries.map((c) => ({
                      value: c.code,
                      label: `${c.label} ${c.code !== c.label ? c.code : ""}`
                    }))}
                    className="mr-3"
                    buttonClassName="pr-3 py-0 border-r border-gray-200 dark:border-white/10 w-max"
                    dropdownClassName="left-0 w-36 min-w-max"
                  />

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
                    <span className="ml-1 text-sm flex-shrink-0">
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
                <CustomDropdown
                  value={form.branch}
                  onChange={(val) => setForm({ ...form, branch: val })}
                  options={[
                    { value: "", label: "Choose your nearest branch" },
                    ...branches.map((b) => ({ value: b.title, label: b.title }))
                  ]}
                  buttonClassName="w-full px-4 py-2 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-500 transition-all duration-200"
                  dropdownClassName="left-0 "
                />
              </Field>

              <div className="mb-6">
                <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                  Select Program *
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {programs.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setForm({ ...form, program: p.value })}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        form.program === p.value
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shadow-sm scale-[1.02]"
                          : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
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
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  isValid
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.98]"
                    : "bg-gray-100 dark:bg-white/5 text-gray-500 cursor-not-allowed"
                }`}
                type="button"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
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
  "w-full mt-1 px-3 py-1 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-500 outline-none transition-all duration-200";

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-500 mb-1.5">
        {label} *
      </label>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════
//  CUSTOM DROPDOWN COMPONENT
// ════════════════════════════════════════════════════
function CustomDropdown({ value, onChange, options, className = "", buttonClassName = "", dropdownClassName = "" }) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className={`relative ${className}`}>
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className={`flex items-center justify-between gap-3 text-sm outline-none transition-all ${buttonClassName}`}
      >
        <span className="truncate text-gray-700 dark:text-gray-300 font-medium">{selectedOption?.label}</span>
        <ChevronDown size={14} className="text-gray-400 shrink-0" />
      </button>
      {open && (
        <div className={`absolute z-[9999] mt-1.5 min-w-full w-max max-w-[200px] bg-white dark:bg-[#1e2128] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl shadow-black/10 dark:shadow-black/40 max-h-60 overflow-y-auto py-1 ${dropdownClassName}`}>
          {options.map((opt, i) => (
            <button
              type="button"
              key={i}
              onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-all truncate ${value === opt.value ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02] text-gray-700 dark:text-gray-300'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContactModal;