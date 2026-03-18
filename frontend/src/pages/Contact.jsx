import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  Send,
  MessageSquareText,
} from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("contact/", formData);

      alert("Message sent successfully");

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-sky-50" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-100 blur-3xl opacity-70" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-slate-200 blur-3xl opacity-60" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="pt-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
                <MessageSquareText size={16} />
                Get in touch
              </p>

              <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight tracking-tight text-slate-900">
                Let’s talk about your child’s care.
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                Reach out for therapy consultation, program details, appointment
                support, or general questions. We’ll help you choose the right
                next step.
              </p>

              <div className="mt-10 grid sm:grid-cols-2 gap-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-900 p-3 text-white">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Call us</p>
                      <p className="font-semibold text-slate-900">
                        +91 98765 43210
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-900 p-3 text-white">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-semibold text-slate-900">
                        support@tinytodds.com
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-900 p-3 text-white">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Location</p>
                      <p className="font-semibold text-slate-900">
                        Chennai, Tamil Nadu
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-900 p-3 text-white">
                      <Clock3 size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Hours</p>
                      <p className="font-semibold text-slate-900">
                        Mon - Sat, 9 AM - 6 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 md:p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Send a message
                </h2>
                <p className="mt-2 text-slate-500">
                  Fill in your details and we’ll get back to you soon.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Message
                  </label>
                  <textarea
                    rows="6"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help"
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:scale-[1.01] hover:bg-slate-800 disabled:opacity-70"
                >
                  <Send size={18} />
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;