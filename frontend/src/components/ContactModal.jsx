import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

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

  const programs = [
    { value: "Speech Therapy", label: "Speech Therapy" },
    { value: "Cognitive Therapy", label: "Cognitive Therapy" },
    { value: "Day Care", label: "Day Care" },
  ];

  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (prefill) {
      setForm((prev) => ({
        ...prev,
        ...prefill,
      }));
    }
  }, [prefill]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
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

  const isValid =
    form.parentName &&
    form.childName &&
    Number(form.age) > 0 &&
    Number(form.age) <= 30 &&
    form.phone &&
    form.phone.length >= 6 &&
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
      onClose();
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
        className="fixed inset-0 z-50 flex py-3 items-center justify-center bg-black/60 backdrop-blur-sm px-4"
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
          className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 overflow-y-auto max-h-[95vh]"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl leading-none"
            type="button"
          >
            ✕
          </button>

          <h2 className="text-xl text-gray-900 dark:text-white font-bold mb-1">
            Book an Appointment
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
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

          <Field label="Phone Number">
            <div className="flex items-center border border-gray-300 dark:border-white/10 rounded-xl px-3 bg-white dark:bg-white/5 focus-within:ring-2 focus-within:ring-blue-500">
              <select
                className="bg-transparent outline-none text-sm py-2 pr-2 text-gray-700 dark:text-gray-200"
                value={form.countryCode}
                onChange={(e) =>
                  setForm({ ...form, countryCode: e.target.value })
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
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="w-full py-2 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
          </Field>

          <Field label="Select Branch">
            <select
              name="branch"
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
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                      : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-blue-300"
                  }`}
                >
                  <span className="text-xs text-center leading-tight">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              isValid
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed"
            }`}
            type="button"
          >
            {loading ? "Submitting..." : "Submit Appointment"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const inputCls =
  "w-full mt-1 px-4 py-1 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition";

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label} *
      </label>
      {children}
    </div>
  );
}

export default ContactModal;