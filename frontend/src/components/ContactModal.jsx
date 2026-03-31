import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence, number } from "framer-motion";

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

  // ✅ Auto focus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ✅ ESC key close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ✅ Disable background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // ✅ Input handler
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "age"){
      value = math.max(0,number(value));
    }

    setForm({ ...form, [name]: value });
  };

  // ✅ Validation
  const isValid =
    form.parentName &&
    form.childName &&
    form.age > 0 &&
    form.age <18 &&
    form.phone.length === 10 &&
    form.branch &&
    form.program;

  // ✅ Submit
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
        age: form.age, phone: form.phone, 
        branch: form.branch, 
        program: form.program, 
        date: new Date().toISOString().split("T")[0], 
        time: "Flexible"
      });

      toast.success("Submitted successfully 🎉");
      onClose();

    } catch {
      toast.error("Submission failed");
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
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6"
        >

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-500 hover:text-black text-lg"
          >
            ✕
          </button>

          {/* Title */}
          <h2 className="text-xl font-bold mb-1">
            Tiny Todds Appointment
          </h2>

          <p className="text-gray-500 text-sm mb-5">
            Fill details & we’ll call you
          </p>

          {/* Parent */}
          <input
            ref={inputRef}
            name="parentName"
            placeholder="Parent Name *"
            value={form.parentName}
            onChange={handleChange}
            className="w-full mb-3 px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Child */}
          <input
            name="childName"
            placeholder="Child Name *"
            value={form.childName}
            onChange={handleChange}
            className="w-full mb-3 px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Age */}
          <input
            type="number"
            name="age"
            placeholder="Child Age *"
            value={form.age}
            onChange={handleChange}
            className="w-full mb-3 px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Phone */}
          <div className="flex items-center bg-gray-100 rounded-xl px-3 mb-2 focus-within:ring-2 focus-within:ring-blue-500">
            <span className="text-gray-500 mr-2">+91</span>
            <input
              name="phone"
              placeholder="Phone number *"
              value={form.phone}
              onChange={handleChange}
              className="w-full py-3 bg-transparent outline-none"
            />
          </div>

          {form.phone && form.phone.length !== 10 && (
            <p className="text-red-500 text-xs mb-3">
              Enter valid 10-digit number
            </p>
          )}

          {/* Branch */}
          <select
            name="branch"
            value={form.branch}
            onChange={handleChange}
            className="w-full mb-3 px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Branch *</option>
            <option value="Chennai">Chennai</option>
            <option value="WestMambalam">WestMambalam</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Madurai">Madurai</option>
          </select>

          {/* Program */}
          <div className="mb-5">
            <p className="text-sm font-medium mb-2">
              Select Program *
            </p>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="program"
                  value="Speech Cognitive"
                  onChange={handleChange}
                />
                Speech Cognitive
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="program"
                  value="Day Care"
                  onChange={handleChange}
                />
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
                : "bg-gray-300 text-gray-500"
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