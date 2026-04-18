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
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white">

      <Navbar onOpenModal={onOpenModal} />

      <section className="relative overflow-hidden pt-28 pb-20">

        {/* Background Decorations */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-white dark:from-slate-900/50 dark:to-slate-950 pointer-events-none" />
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/20 dark:bg-blue-900/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-200/20 dark:bg-indigo-900/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* LEFT */}
            <div className="pt-4">

              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/50 dark:border-white/[0.06] bg-white/80 dark:bg-white/5 text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium backdrop-blur-sm animate-fade-in-up">
                <MessageSquareText size={16} className="text-blue-600 dark:text-blue-400" />
                Get in touch
              </span>

              <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1] animate-fade-in-up-delay-1">
                Let's talk about your child's <span className="text-gradient">care.</span>
              </h1>

              <p className="mt-5 max-w-xl text-lg text-gray-500 dark:text-gray-400 leading-relaxed animate-fade-in-up-delay-2">
                Reach out for therapy consultation, program details, appointment support, or general questions.
              </p>

              {/* Cards */}
              <div className="mt-10 grid sm:grid-cols-2 gap-4 animate-fade-in-up-delay-3">
                <InfoCard icon={<Phone size={18} />} color="green" title="Call us" value={<a href="tel:+919941350646" className="hover:text-blue-600 transition-colors">+91 99413 50646</a>} />
                <InfoCard icon={<Mail size={18} />} color="red" title="Email" value={<a href="mailto:support@tinytodds.com" className="hover:text-blue-600 transition-colors">support@tinytodds.com</a>} />
                <InfoCard icon={<MapPin size={18} />} color="blue" title="Location" value={<a href="https://www.google.com/maps/search/?api=1&query=26Q9%2B8W%20Chennai%2C%20Tamil%20Nadu" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Chennai, Tamil Nadu</a>} />
                <InfoCard icon={<Phone size={18} />} color="emerald" title="WhatsApp" value={<a href="https://wa.me/919941350646" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors">Chat on WhatsApp</a>} />
                <InfoCard icon={<Clock3 size={18} />} color="amber" title="Hours" value="Mon - Sat, 10 AM - 8 PM" />
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="rounded-2xl border border-gray-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] p-6 md:p-8 shadow-sm hover:shadow-lg transition-shadow duration-500 animate-slide-in-right">

              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Send a message
                </h2>
                <p className="text-gray-400 dark:text-gray-500 mt-1 text-sm">
                  Fill in your details and we'll get back to you soon.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message
                  </label>
                  <textarea
                    rows="5"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help"
                    className="w-full rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02] px-4 py-3.5 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:bg-white/[0.04] transition-all duration-300 text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${
                    isValid
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-glow-blue hover:scale-[1.01]"
                      : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Send size={16} />
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
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className="w-full rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02] px-4 py-3.5 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:bg-white/[0.04] transition-all duration-300 text-sm"
        required
      />
    </div>
  );
}

function InfoCard({ icon, title, value, color = "blue" }) {
  const colorMap = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="group rounded-2xl border border-gray-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">{title}</p>
          <div className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default Contact;