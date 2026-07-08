import { useState } from "react";
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
import useCMS from "../hooks/useCMS";

import SEO from "../components/SEO";

// Same icon keys the admin dashboard's icon picker (ICON_LIST in
// AdminDashboard.jsx) uses for the "Contact Info Cards" section.
const CMS_ICON_MAP = { Phone, Mail, MapPin, Clock: Clock3 };
const CMS_COLOR_CYCLE = ["green", "red", "blue", "emerald", "amber"];

// CMS-managed cards only ever store { title, description, icon } — no href —
// so once an admin edits this section in the dashboard, a stored `href`
// (like the static Location/Call/WhatsApp links below) is lost. Deriving the
// link from the card's title instead means it keeps working no matter where
// the data comes from, and each card type (Call, Email, Location, WhatsApp)
// gets its own correct link independently of the others.
function buildCardHref(card) {
  if (card.href) return card.href; // explicit override always wins
  const title = (card.title || "").toLowerCase();
  const value = (card.description || "").trim();
  if (!value) return null;

  if (title.includes("call") || title.includes("phone")) {
    return `tel:${value.replace(/[^\d+]/g, "")}`;
  }
  if (title.includes("email") || title.includes("mail")) {
    return `mailto:${value}`;
  }
  if (title.includes("whatsapp")) {
    const digits = value.replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : null;
  }
  if (title.includes("location") || title.includes("address")) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
  }
  return null;
}

function Contact() {

  // ✅ CMS HOOK — contact-hero (badge/heading/subtitle), contact-info
  // (Call/Email/Location/WhatsApp/Hours cards), and contact-form (heading &
  // subtitle above the message form) — all editable in the admin
  // dashboard's Contact page tab.
  const { getSection } = useCMS("contact");
  const hero = getSection("contact-hero");
  const infoCms = getSection("contact-info");
  const formCms = getSection("contact-form");

  const heroData = Array.isArray(hero?.data) ? hero.data : [];
  const badgeText = heroData.find((d) => d?.title === "badge")?.description || "Get in touch";
  const highlightText = heroData.find((d) => d?.title === "highlight")?.description || "care.";
  const headingLine1 = hero?.title || "Let's talk about your child's";
  const heroSubtitle = hero?.description ||
    "Reach out for therapy consultation, program details, appointment support, or general questions.";

  // SEO tags mirror the hero content instead of separate hardcoded copy, so
  // editing the hero in the dashboard also updates what search engines and
  // browser tabs show for this page.
  const seoTitle = hero?.title ? `${headingLine1} ${highlightText}`.trim() : "Contact Us";
  const seoDescription = hero?.description || "Get in touch with Tiny Todds Therapy Care for consultation, program details, and appointment support.";

  // ✅ CMS FORM — title & subtitle above the contact form, editable via the
  // "Contact Form" section in the dashboard's Contact page tab.
  const formTitle = formCms?.title || "Send a message";
  const formSubtitle = formCms?.description || "Fill in your details and we'll get back to you soon.";

  const staticInfoCards = [
    { title: "Call us", description: "+91 99413 50646", icon: "Phone", href: "tel:+919941350646" },
    { title: "Email", description: "support@tinytodds.com", icon: "Mail", href: "mailto:support@tinytodds.com" },
    { title: "Location", description: "Chennai, Tamil Nadu", icon: "MapPin", href: "https://www.google.com/maps/search/?api=1&query=26Q9%2B8W%20Chennai%2C%20Tamil%20Nadu" },
    { title: "WhatsApp", description: "Chat on WhatsApp", icon: "Phone", href: "https://wa.me/919941350646" },
    { title: "Hours", description: "Mon - Sat, 10 AM - 8 PM", icon: "Clock" },
  ];
  const infoCards = infoCms?.data?.length ? infoCms.data : staticInfoCards;

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
      {/* ✅ CMS SEO — mirrors the contact hero content instead of separate
          hardcoded copy, so editing the hero also updates the page title
          and meta description search engines/browser tabs see. */}
      <SEO 
        title={seoTitle} 
        description={seoDescription} 
        keywords="contact, reach out, therapy consultation, appointment" 
      />

      <section className="relative overflow-hidden pt-28 pb-20" id="contact-hero">

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
                {badgeText}
              </span>

              {/* ✅ CMS HERO HEADING — first line from `title`, accent line from
                  data entry keyed "highlight", both editable independently */}
              <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1] animate-fade-in-up-delay-1">
                {headingLine1} <span className="text-gradient">{highlightText}</span>
              </h1>

              {/* ✅ CMS SUBTITLE */}
              <p className="mt-5 max-w-xl text-lg text-gray-500 dark:text-gray-400 leading-relaxed animate-fade-in-up-delay-2">
                {heroSubtitle}
              </p>

              {/* ✅ CMS INFO CARDS */}
              <div className="mt-10 grid sm:grid-cols-2 gap-4 animate-fade-in-up-delay-3">
                {infoCards.map((card, i) => {
                  const Icon = CMS_ICON_MAP[card.icon] || MessageSquareText;
                  const color = CMS_COLOR_CYCLE[i % CMS_COLOR_CYCLE.length];
                  const href = buildCardHref(card);
                  const content = href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {card.description}
                    </a>
                  ) : (
                    card.description
                  );
                  return (
                    <InfoCard key={i} icon={<Icon size={18} />} color={color} title={card.title} value={content} />
                  );
                })}
              </div>

            </div>

            {/* RIGHT FORM */}
            <div className="rounded-2xl border border-gray-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] p-6 md:p-8 shadow-sm hover:shadow-lg transition-shadow duration-500 animate-slide-in-right">

              <div className="mb-6">
                {/* ✅ CMS: form title & subtitle come from the "Contact Form"
                    section in the dashboard — falls back to static defaults if
                    that section hasn't been created yet. */}
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {formTitle}
                </h2>
                <p className="text-gray-400 dark:text-gray-500 mt-1 text-sm">
                  {formSubtitle}
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
          <p className="text-xs text-gray-600 dark:text-gray-500 font-medium uppercase tracking-wider">{title}</p>
          <div className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default Contact;