import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import toast from "react-hot-toast";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  Send,
  MessageSquareText,
} from "lucide-react";

function Contact({ onOpenModal }) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValid =
    formData.name.trim() &&
    formData.email.includes("@") &&
    formData.message.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      toast.error("Please fill all fields correctly");
      return;
    }

    try {
      setLoading(true);
      await API.post("contact/", formData);
      toast.success("Message sent successfully 🎉");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-black dark:text-white">

      <Navbar onOpenModal={onOpenModal} />

      <section className="relative overflow-hidden pt-28 pb-16 bg-slate-50 dark:bg-black text-black dark:text-white">

        {/* FIX: decorative blurs now have a visible tint instead of matching the page background */}
        <div className="absolute inset-0 pointer-events-none" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-100 dark:bg-blue-900/30 blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-100 dark:bg-indigo-900/30 blur-3xl opacity-60 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* LEFT */}
            <div className="pt-4">

              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-black dark:text-white px-4 py-2 text-sm font-medium shadow-sm">
                <MessageSquareText size={16} />
                Get in touch
              </p>

              <h1 className="mt-6 text-4xl md:text-6xl font-bold text-black dark:text-white">
                Let's talk about your child's care.
              </h1>

              <p className="mt-5 max-w-xl text-lg text-gray-600 dark:text-gray-300">
                Reach out for therapy consultation, program details, appointment support, or general questions.
              </p>

              {/* Cards */}
              <div className="mt-10 grid sm:grid-cols-2 gap-4">
                <InfoCard icon={<Phone size={18} />} title="Call us" value={<a href="tel:+919941350646" className="hover:underline text-blue-600">+91 99413 50646</a>} />
                <InfoCard icon={<Mail size={18} />} title="Email" value={<a href="mailto:support@tinytodds.com" className="hover:underline text-blue-600">support@tinytodds.com</a>} />
                <InfoCard icon={<MapPin size={18} />} title="Location" value={<a href="https://www.google.com/maps/search/?api=1&query=26Q9%2B8W%20Chennai%2C%20Tamil%20Nadu" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">Chennai, Tamil Nadu</a>} />
                <InfoCard icon={<Phone size={18} />} title="WhatsApp" value={<a href="https://wa.me/919941350646" target="_blank" rel="noopener noreferrer" className="hover:underline text-green-600">Chat on WhatsApp</a>} />
                <InfoCard icon={<Clock3 size={18} />} title="Hours" value="Mon - Sat, 10 AM - 8 PM" />
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-black dark:text-white p-6 md:p-8 shadow-xl">

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Send a message
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Fill in your details and we'll get back to you soon.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />

                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Message
                  </label>
                  <textarea
                    rows="6"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help"
                    className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-white/10 transition"
                    required
                  />
                </div>

                {/* FIX: was cursor-allowed — not a valid CSS value */}
                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className={`w-full flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition ${
                    isValid
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send size={18} />
                  {loading ? "Sending..." : "Send Message"}
                </button>

              </form>
            </div>

          </div>
        </div>
      </section>

      <Footer onOpenModal={onOpenModal} />
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3.5 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-white/10 transition"
        required
      />
    </div>
  );
}

// FIX: removed unused className prop
function InfoCard({ icon, title, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-black dark:text-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-900 dark:bg-white/10 p-3 text-white">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <div className="font-semibold text-black dark:text-white">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default Contact;