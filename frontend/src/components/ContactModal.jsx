import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput from "react-phone-input-2/dist/lib";
import "react-phone-input-2/lib/style.css";

function ContactModal({ onClose }) {

  const [form, setForm] = useState({
    parentName: "",
    childName: "",
    age: "",
    phone: "",
    branch: "",
    program: ""
  });

  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const PhoneInput = require("react-phone-input-2").default;

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

  // ✅ Validation (global phone)
  const isValid =
    form.parentName &&
    form.childName &&
    form.age > 0 &&
    form.age <= 30 &&
    form.phone &&
    form.phone.length > 5 &&
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
        phone: form.phone, // ✅ includes country code
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >

        {/* Modal */}
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
          <input
            ref={inputRef}
            name="parentName"
            placeholder="Parent Name *"
            value={form.parentName}
            onChange={handleChange}
            className="w-full mb-3 px-4 py-3 rounded-xl bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Child */}
          <input
            name="childName"
            placeholder="Child Name *"
            value={form.childName}
            onChange={handleChange}
            className="w-full mb-3 px-4 py-3 rounded-xl bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Age */}
          <input
            type="number"
            name="age"
            min="1"
            max="30"
            placeholder="Child Age *"
            value={form.age}
            onChange={handleChange}
            className="w-full mb-1 px-4 py-3 rounded-xl bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {form.age && (form.age <= 0 || form.age > 30) && (
            <p className="text-red-500 text-xs mb-3">
              Age must be between 1 and 30
            </p>
          )}

          {/* 🌍 GLOBAL PHONE INPUT */}
          <div className="mb-4">
            <PhoneInput
              country={"in"}
              enableSearch={true}
              value={form.phone}
              onChange={(phone) => setForm({ ...form, phone })}

              inputProps={{
                name: "phone",
                required: true,
              }}
            
              containerStyle={{
                width: "100%"
              }}
            
              inputStyle={{
                width: "100%",
                height: "50px",
                borderRadius: "12px",
                backgroundColor: "transparent",
                border: "1px solid #d1d5db",
                paddingLeft: "60px",
                fontSize: "14px",
                color: document.documentElement.classList.contains("dark") ? "white" : "black"
              }}
            
              buttonStyle={{
                border: "none",
                background: "transparent"
              }}
            
              dropdownStyle={{
                borderRadius: "10px"
              }}
            />
          </div>

          {/* Branch */}
          <select
            name="branch"
            value={form.branch}
            onChange={handleChange}
            className="p-2 w-full mb-3 rounded-xl bg-white/5 text-black dark:text-white"
          >
            <option value="">Select Branch *</option>
            <option value="Chennai">Chennai</option>
            <option value="WestMambalam">WestMambalam</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Madurai">Madurai</option>
          </select>

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
            className={`w-full py-3 rounded-xl font-semibold transition ${
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