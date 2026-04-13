import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function ContactModal({ onClose }) {

  const [form, setForm] = useState({
    parentName: "",
    childName: "",
    age: "",
    phone: "",
    countryCode: "+91",
    branch: "",
    program: ""
  });

  const countries = [
    { code: "+93", label: "🇦🇫 " },
    { code: "+355", label: "🇦🇱 " },
    { code: "+213", label: "🇩🇿 " },
    { code: "+1", label: "🇺🇸 " },
    { code: "+44", label: "🇬🇧 " },
    { code: "+61", label: "🇦🇺 " },
    { code: "+91", label: "🇮🇳 " },
    { code: "+971", label: "🇦🇪 " },
    { code: "+81", label: "🇯🇵 " },
    { code: "+49", label: "🇩🇪 " },
    { code: "+33", label: "🇫🇷 " },
    { code: "+39", label: "🇮🇹 " },
    { code: "+34", label: "🇪🇸 " },
    { code: "+86", label: "🇨🇳 " },
    { code: "+7", label: "🇷🇺 " },
    { code: "+55", label: "🇧🇷 " },
    { code: "+27", label: "🇿🇦 " },
    { code: "+65", label: "🇸🇬 " },
    { code: "+82", label: "🇰🇷 " },
    { code: "+966", label: "🇸🇦 " },
    
  ];

  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  // Auto focus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ESC close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Disable scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // Input handler
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "age") {
      value = value.replace(/\D/g, "");
      value = Math.max(0, Number(value));
      if (value > 30) value = 30;
    }

    setForm({ ...form, [name]: value });
  };

  // Validation
  const isValid =
    form.parentName &&
    form.childName &&
    form.age > 0 &&
    form.age <= 30 &&
    form.phone &&
    form.phone.length >= 6 &&
    form.branch &&
    form.program;

  // Submit
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
        phone: `${form.countryCode}${form.phone}`, // ✅ combined
        branch: form.branch,
        program: form.program,
        date: new Date().toISOString().split("T")[0],
        time: "Flexible"
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
          className="relative w-full max-w-md bg-white dark:bg-white/5 rounded-3xl shadow-2xl p-6"
        >

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-500 hover:text-black text-lg"
          >
            ✕
          </button>

          {/* Title */}
          <h2 className="text-xl text-black dark:text-white font-bold mb-1">
            Tiny Todds Appointment
          </h2>

          <p className="dark:text-white text-black/90 text-sm mb-5">
            Fill details & we’ll call you
          </p>

          {/* Parent */}
          <div className="mb-3">
            <label className="text-xs font-medium mt-1 text-gray-700 dark:text-gray-300">
              Parent Name *
            </label>
            <input
              ref={inputRef}
              name="parentName"
              value={form.parentName}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-1 border rounded-xl bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Child */}
          <div className="mb-3">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Child Name *
            </label>
            <input
              name="childName"
              value={form.childName}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-1 border rounded-xl bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Age */}
          <div className="mb-3">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Child Age *
            </label>
            <input
              type="number"
              name="age"
              min="1"
              max="30"
              value={form.age}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-1 border rounded-xl bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* 🌍 PHONE INPUT */}
          <div className="flex items-center border border-gray-300 rounded-xl px-2 mb-4 bg-white/5">
            
            <select
              className="bg-transparent outline-none text-xs mr-1 max-h-40 overflow-y-auto"
              value={form.countryCode}
              onChange={(e) =>
                setForm({ ...form, countryCode: e.target.value })
              }
            >

              {countries.map((c, i) => (
                <option key={i} value={c.code}>
                  {c.label} ({c.code})
                </option>
              ))}
              
            </select>

            <input
              type="tel"
              placeholder="Phone number *"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="w-full py-2 bg-transparent outline-none"
            />
          </div>

          {/* Branch */}
          <div className="mb-4">
            <label className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300">
              Select Branch *
            </label>

            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="w-full px-2 py-1 rounded-xl border border-gray-300 dark:border-white/10 bg-white  dark:bg-white/5 text-black dark:text-blue focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Choose your branch</option>
              <option value="Chennai">Chennai</option>
              <option value="WestMambalam">West Mambalam</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Madurai">Madurai</option>
            </select>
          </div>

          {/* Program */}
          <div className="mb-5">
            <p className="text-sm font-medium mb-2">Select Program *</p>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="program" value="Speech Cognitive" onChange={handleChange} />
                Speech Cognitive
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="program" value="Day Care" onChange={handleChange} />
                Day Care
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`w-full py-2  rounded-xl font-semibold transition ${
              isValid
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ContactModal;