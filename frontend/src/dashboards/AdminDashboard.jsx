import { useEffect, useMemo, useState, useRef } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Users,
  Calendar,
  MessageSquare,
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Plus,
  Save,
  PenLine,
  LogOut,
  Home,
  Briefcase,
  Info,
  Settings,
  ChevronDown,
  Menu,
  X,
  User,
  Pencil,
  Trash2,
  Activity,
  Award,
  Baby,
  BookOpen,
  Brain,
  Calculator,
  ClipboardList,
  Ear,
  Eye,
  GraduationCap,
  HandHeart,
  Heart,
  HeartPulse,
  HelpingHand,
  Library,
  Lightbulb,
  Mic,
  Notebook,
  PenTool,
  Puzzle,
  School,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  Timer,
  UserCheck,
  BarChart2,
  TrendingUp,
  Hash,
  Type,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import useAuthStore from "../store/useAuthStore";
import serviceSpeechImage from "../assets/j3.webp";
import serviceCognitiveImage from "../assets/j5.webp";
import serviceDayCareImage from "../assets/j4.webp";
import gallerySpeechImage from "../assets/c1.jpg";
import galleryLearningImage from "../assets/c2-640.webp";
import galleryCognitiveImage from "../assets/j6.webp";
import galleryPlayImage from "../assets/j7.webp";
import featureTherapyImage from "../assets/features/therapy.jpeg";
import featureSafeImage from "../assets/features/safe-env.jpeg";
import featurePlayImage from "../assets/features/play-learning.jpeg";
import featureScheduleImage from "../assets/features/schedule.png";
import featureFamilyImage from "../assets/features/parent.jpeg";
import featureProgressImage from "../assets/features/progress.jpeg";

// ── ICON REGISTRY for Services picker ──
const ICON_LIST = {
  Activity, Award, Baby, BookOpen, Brain, Calculator, ClipboardList,
  Ear, Eye, GraduationCap, HandHeart, HeartPulse, HelpingHand, Library,
  Heart, Lightbulb, Mic, Notebook, PenTool, Puzzle, School, ShieldCheck, Smile,
  Sparkles, Star, Stethoscope, Target, Timer, UserCheck, Users,
  Phone, Mail, MapPin, Clock,
};

// ── CMS PAGE SECTIONS ──
const PAGE_SECTIONS = {
  home: [
    { section: "hero",       label: "Hero Section",        type: "hero",     description: "Main heading, subtitle & hero image" },
    { section: "hero-stats", label: "Hero Stats",          type: "stats",    description: "Stats row below the hero section" },
    { section: "services",   label: "Our Services",        type: "cards",    description: "Service cards with image & text" },
    { section: "features",   label: "Features",            type: "features", description: "Animated background image with icon & text" },
    { section: "gallery",    label: "Gallery / Activities",type: "cards",    description: "Activity photo cards" },
  ],
  about: [
    { section: "about-mission", label: "Our Mission", type: "single-card", description: "The Mission icon card (title, description & icon)" },
    { section: "about-vision",  label: "Our Vision",  type: "single-card", description: "The Vision icon card (title, description & icon)" },
    { section: "about-story",   label: "Our Story",   type: "text",        description: "Story heading & narrative paragraph" },
  ],
  contact: [
    { section: "contact-hero",  label: "Contact Hero",     type: "hero",           description: "Badge, heading & subtitle at the top of the page" },
    { section: "contact-info",  label: "Contact Info Cards", type: "mission-vision", description: "Call, Email, Location, WhatsApp, Hours cards" },
    { section: "contact-form",  label: "Contact Form",      type: "text",           description: "Title & subtitle shown above the message form" },
  ],
  programs: [
    { section: "programs",    label: "Programs List",       type: "cards",    description: "Program cards shown on the programs page" },
  ],
  settings: [
    { section: "branches",       label: "Branches",        type: "simple",    description: "Branch location names" },
    { section: "program-options",label: "Program Options", type: "simple",    description: "Appointment program dropdown options" },
    { section: "country-codes",  label: "Country Codes",   type: "simple",    description: "Phone country code options" },
  ],
};

const PAGE_ICONS = {
  home: <Home size={13} />,
  about: <Info size={13} />,
  programs: <BookOpen size={13} />,
  contact: <MessageSquare size={13} />,
  settings: <Settings size={13} />,
};

const SECTION_TYPE_META = {
  hero:           { color: "blue",   label: "Hero",           icon: <ImageIcon size={12}/> },
  stats:          { color: "amber",  label: "Stats",          icon: <BarChart2 size={12}/> },
  services:       { color: "violet", label: "Services",       icon: <Briefcase size={12}/> },
  features:       { color: "fuchsia",label: "Features",       icon: <Star size={12}/> },
  cards:          { color: "emerald",label: "Cards",          icon: <ClipboardList size={12}/> },
  simple:         { color: "gray",   label: "List",           icon: <Type size={12}/> },
  text:           { color: "slate",  label: "Text",           icon: <Type size={12}/> },
  "mission-vision": { color: "rose", label: "Mission & Vision", icon: <Target size={12}/> },
  "single-card":  { color: "rose",   label: "Card",           icon: <Target size={12}/> },
};

// Shared color-class lookup so every SECTION_TYPE_META color (not just a
// hardcoded few) renders correctly in the section header badge/icon.
const SECTION_COLOR_CLASSES = {
  blue:    { solid: "bg-blue-500",    badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" },
  amber:   { solid: "bg-amber-500",   badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" },
  violet:  { solid: "bg-violet-500",  badge: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400" },
  emerald: { solid: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" },
  fuchsia: { solid: "bg-fuchsia-500", badge: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-400" },
  gray:    { solid: "bg-gray-500",    badge: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400" },
  slate:   { solid: "bg-slate-500",   badge: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400" },
  rose:    { solid: "bg-rose-500",    badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400" },
};

// ════════════════════════════════════════════════════
//  CUSTOM DROPDOWN COMPONENT
// ════════════════════════════════════════════════════
function CustomDropdown({ value, onChange, options, className = "" }) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className={`relative ${className}`}>
      <button 
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#16191f] text-sm outline-none hover:border-blue-400 focus:border-blue-500 transition-all shadow-sm"
      >
        <span className="truncate text-gray-700 dark:text-gray-300 font-medium">{selectedOption?.label}</span>
        <ChevronDown size={14} className="text-gray-400 shrink-0" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 min-w-full w-max max-w-[200px] bg-white dark:bg-[#1e2128] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
          {options.map((opt, i) => (
            <button
              key={i}
              onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm transition-all truncate ${value === opt.value ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02] text-gray-700 dark:text-gray-300'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Enabling a section should never invent marketing copy, sample stats, or
// placeholder lists. It only scaffolds an empty record — page/section/order —
// so the admin's own content (typed in, or already present from a prior save)
// is the only thing that ever shows up in the editor/preview.
//
// EXCEPTION — home/hero: Hero.jsx ships with hardcoded fallback copy (the
// badge, heading, and subtitle already visible on the live site right now)
// so the public page never looks broken before an admin has touched the CMS.
// If we scaffolded that section blank, the editor would show empty fields
// while the real site kept showing that fallback copy — confusing, and an
// easy way to accidentally wipe it by saving. So for this one section only,
// we seed the editor with the exact same strings already hardcoded in
// Hero.jsx, rather than inventing anything new. Keep these two in sync.
const HOME_HERO_DEFAULTS = {
  title: "Empowering",
  description: "Professional therapy & development programs designed to help your child grow with confidence, communication, and care.",
  data: [
    { title: "badge", description: "✨ Professional Child Therapy" },
    { title: "highlight", description: "Little Minds" },
  ],
};

// Same exception as home/hero — seed the Contact hero and info cards with the
// copy already hardcoded/live in Contact.jsx, so the editor never opens blank
// while the real site shows something different.
const CONTACT_HERO_DEFAULTS = {
  title: "Let's talk about your child's",
  description: "Reach out for therapy consultation, program details, appointment support, or general questions.",
  data: [
    { title: "badge", description: "Get in touch" },
    { title: "highlight", description: "care." },
  ],
};

const CONTACT_INFO_DEFAULTS = [
  { title: "Call us", description: "+91 99413 50646", icon: "Phone" },
  { title: "Email", description: "support@tinytodds.com", icon: "Mail" },
  { title: "Location", description: "Chennai, Tamil Nadu", icon: "MapPin" },
  { title: "WhatsApp", description: "Chat on WhatsApp", icon: "Phone" },
  { title: "Hours", description: "Mon - Sat, 10 AM - 8 PM", icon: "Clock" },
];

// Seed the Contact Form section with the default copy already live in
// Contact.jsx so the editor never opens blank while the site shows content.
const CONTACT_FORM_DEFAULTS = {
  title: "Send a message",
  description: "Fill in your details and we\u2019ll get back to you soon.",
  data: [],
};

const HERO_STATS_DEFAULTS = {
  data: [
    { title: "Children Helped", description: "700+" },
    { title: "Branches", description: "35+" },
    { title: "Parent Satisfaction", description: "98%" },
  ],
};

const SERVICES_DEFAULTS = {
  title: "Our Services",
  description: "Specialized therapy programs designed to support every child's growth, learning, and development journey.",
  data: [
    {
      title: "Speech Therapy",
      description: "Improve communication, language, and social skills through evidence-based speech development techniques tailored to each child.",
      image: serviceSpeechImage,
    },
    {
      title: "Cognitive Therapy",
      description: "Enhance memory, attention, and problem-solving abilities with structured cognitive training programs.",
      image: serviceCognitiveImage,
    },
    {
      title: "Day Care",
      description: "A safe, nurturing, and engaging environment for learning, play, and social growth throughout the day.",
      image: serviceDayCareImage,
    },
  ],
};

const FEATURES_DEFAULTS = {
  data: [
    {
      icon: "Brain",
      title: "Expert Therapists",
      description: "Our certified specialists bring years of experience in pediatric speech, cognitive, and behavioral therapy.",
      image: featureTherapyImage,
    },
    {
      icon: "ShieldCheck",
      title: "Safe Environment",
      description: "A fully child-proofed, nurturing space designed to make every child feel comfortable and secure.",
      image: featureSafeImage,
    },
    {
      icon: "Heart",
      title: "Child Friendly",
      description: "Programs are built around play-based learning so children enjoy every session and thrive.",
      image: featurePlayImage,
    },
    {
      icon: "Clock",
      title: "Flexible Scheduling",
      description: "Morning, afternoon, and weekend slots available to fit your family's routine.",
      image: featureScheduleImage,
    },
    {
      icon: "Users",
      title: "Family Involvement",
      description: "We keep parents engaged with regular progress updates and at-home activity guides.",
      image: featureFamilyImage,
    },
    {
      icon: "Star",
      title: "Proven Results",
      description: "Over 2850 children have made meaningful developmental progress across our 35 branches.",
      image: featureProgressImage,
    },
  ],
};

const GALLERY_DEFAULTS = {
  title: "Our Activities",
  description: "A glimpse into our engaging sessions that help children grow, learn, and thrive.",
  data: [
    {
      title: "Speech Activities",
      description: "Speech therapy activity",
      image: gallerySpeechImage,
    },
    {
      title: "Learning Sessions",
      description: "Interactive learning session",
      image: galleryLearningImage,
    },
    {
      title: "Cognitive Training",
      description: "Cognitive development activity",
      image: galleryCognitiveImage,
    },
    {
      title: "Play & Growth",
      description: "Play-based learning activity",
      image: galleryPlayImage,
    },
  ],
};

const PROGRAMS_DEFAULTS = {
  title: "Our Programs",
  description: "Carefully designed therapy programs to support your child's growth and development.",
  data: [
    {
      title: "Speech Therapy",
      description: "Improve communication and language development skills in children through personalized, evidence-based sessions.",
      image: serviceSpeechImage,
    },
    {
      title: "Cognitive Therapy",
      description: "Enhance memory, attention, and problem-solving abilities with structured cognitive training programs.",
      image: serviceCognitiveImage,
    },
    {
      title: "Day Care",
      description: "A safe, engaging environment for learning and social growth with expert supervision throughout the day.",
      image: serviceDayCareImage,
    },
  ],
};

// ── SETTINGS DEFAULTS ──
// These seed the Settings sections (Branches / Program Options / Country
// Codes) with the exact same values ContactModal.jsx expects/consumes, so
// enabling a section for the first time — or previewing/editing it before
// it's been saved — already shows a real, usable list instead of "empty".
const BRANCHES_DEFAULTS = {
  data: [
    { title: "WestMambalam", description: "" },
    { title: "Choolaimedu", description: "" },
    { title: "Anna Nagar", description: "" },
    { title: "Adambakkam", description: "" },
    { title: "Egmore", description: "" },
    { title: "Tambaram", description: "" },
    { title: "Porur", description: "" },
    { title: "Thiruvanmiyur", description: "" },
    { title: "Mylapore", description: "" },
    { title: "K.K. Nagar", description: "" },
  ],
};

const PROGRAM_OPTIONS_DEFAULTS = {
  data: [
    { title: "Speech Therapy", description: "" },
    { title: "Cognitive Therapy", description: "" },
    { title: "Day Care", description: "" },
  ],
};

const COUNTRY_CODES_DEFAULTS = {
  data: [
    { title: "+91", description: "" },
    { title: "+1", description: "" },
    { title: "+44", description: "" },
    { title: "+61", description: "" },
    { title: "+971", description: "" },
    { title: "+81", description: "" },
    { title: "+49", description: "" },
    { title: "+33", description: "" },
    { title: "+39", description: "" },
    { title: "+34", description: "" },
    { title: "+86", description: "" },
    { title: "+7", description: "" },
    { title: "+55", description: "" },
    { title: "+27", description: "" },
    { title: "+65", description: "" },
    { title: "+82", description: "" },
    { title: "+966", description: "" },
    { title: "+93", description: "" },
    { title: "+213", description: "" },
  ],
};

const SECTION_DEFAULTS = {
  home: {
    hero: HOME_HERO_DEFAULTS,
    "hero-stats": HERO_STATS_DEFAULTS,
    services: SERVICES_DEFAULTS,
    features: FEATURES_DEFAULTS,
    gallery: GALLERY_DEFAULTS,
  },
  contact: {
    "contact-hero": CONTACT_HERO_DEFAULTS,
    "contact-info": { data: CONTACT_INFO_DEFAULTS },
    "contact-form": CONTACT_FORM_DEFAULTS,
  },
  programs: {
    programs: PROGRAMS_DEFAULTS,
  },
  settings: {
    branches: BRANCHES_DEFAULTS,
    "program-options": PROGRAM_OPTIONS_DEFAULTS,
    "country-codes": COUNTRY_CODES_DEFAULTS,
  },
};

const cloneDefaultData = (data = []) => data.map((d) => ({ ...d }));

function getSectionDefaults(page, section) {
  return SECTION_DEFAULTS[String(page || "").toLowerCase()]?.[String(section || "").toLowerCase()] || {};
}

function applySectionDefaults(item) {
  const defaults = getSectionDefaults(item?.page, item?.section);
  const hasData = Array.isArray(item?.data) && item.data.length > 0;

  return {
    ...item,
    title: item?.title || defaults.title || "",
    description: item?.description || defaults.description || "",
    data: hasData ? item.data : cloneDefaultData(defaults.data),
  };
}

function buildSectionPayload(page, section, order) {
  const normalizedPage = String(page).toLowerCase();
  const normalizedSection = String(section).toLowerCase();
  const defaults = getSectionDefaults(normalizedPage, normalizedSection);

  return {
    page: normalizedPage,
    section: normalizedSection,
    title: defaults.title || "",
    description: defaults.description || "",
    data: cloneDefaultData(defaults.data),
    order,
  };
}

// ════════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════════
function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages]         = useState([]);
  const [content, setContent]           = useState([]);

  const [search,       setSearch]       = useState("");
  const [active,       setActive]       = useState("dashboard");
  const [loading,      setLoading]      = useState(true);
  const [sort,         setSort]         = useState("latest");
  const [branchFilter, setBranchFilter] = useState("all");
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [savingIds,    setSavingIds]    = useState([]);
  const [pagesTab,     setPagesTab]     = useState("home");
  const [editModeIds,  setEditModeIds]  = useState([]);
  const [drafts,       setDrafts]       = useState({});
  const [dark,         setDark]         = useState(localStorage.getItem("theme") === "dark");

  const logout   = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // dark mode sync
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // ── AUTH / LOGOUT ──
  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) await API.post("logout/", { refresh }).catch(() => {});
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    } finally {
      localStorage.clear();
      logout();
      navigate("/login", { replace: true });
    }
  };

  // ── FETCH ──
  const fetchAppointments = async () => {
    try {
      const res  = await API.get("appointments/");
      const data = res.data;
      setAppointments(
        Array.isArray(data) ? data : data?.results ?? data?.data ?? []
      );
    } catch { setAppointments([]); toast.error("Failed to load appointments"); }
  };

  const fetchMessages = async () => {
    try {
      const res  = await API.get("contact/");
      const data = res.data;
      setMessages(
        Array.isArray(data) ? data : data?.results ?? data?.data ?? []
      );
    } catch (err) {
      if (err.response?.status === 401) { localStorage.clear(); navigate("/login"); return; }
      setMessages([]); toast.error("Failed to load messages");
    }
  };

  const fetchContent = async () => {
    try {
      const res  = await API.get("content/");
      const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setContent(data);
    } catch { setContent([]); }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchAppointments(), fetchMessages(), fetchContent()]);
      setLoading(false);
    })();
  }, []);

  // ── CMS HELPERS ──
  const setSaving = (id, val) =>
    setSavingIds((prev) => val ? [...prev.filter(i=>i!==id), id] : prev.filter(i=>i!==id));

  const toggleEdit = (k) => {
    const existingItem = content.find((c) => c.section === k);
    setEditModeIds((prev) => prev.includes(k) ? prev.filter(i=>i!==k) : [...prev, k]);
    if (existingItem) {
      setDrafts((prev) => ({
        ...prev,
        [existingItem.id]: prev[existingItem.id] || { ...existingItem },
      }));
    }
  };

  const updateLocal = (id, updates) => {
    const currentItem = content.find((c) => c.id === id);
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || currentItem || {}),
        ...updates,
      },
    }));
  };

  const autoCreate = async (page, section) => {
    if (content.find((c) => c.page === page && c.section === section)) return;
    try {
      const payload = buildSectionPayload(page, section, content.length + 1);
      const res = await API.post("content/", payload);
      const createdItem = res?.data;

      if (createdItem) {
        setContent((prev) => [...prev, createdItem]);
      } else {
        await fetchContent();
      }

      toast.success("Section enabled");
      setEditModeIds((prev) => [...prev, section]);
    } catch (err) {
      console.error("Payload:", payload);
      console.error("Status:", err.response?.status);
      console.error("Backend response:", err.response?.data);
        
      const data = err.response?.data || {};
        
      const error =
        data.detail ||
        data.non_field_errors?.[0] ||
        data.section?.[0] ||
        data.page?.[0] ||
        data.title?.[0] ||
        data.description?.[0] ||
        data.data?.[0] ||
        JSON.stringify(data) ||
        "Failed to create section";
        
      toast.error(error);
    }
  };

  const saveContent = async (item) => {
    const draftItem = drafts[item.id] || item;
    try {
      setSaving(item.id, true);
      await API.patch(`content/${item.id}/`, {
        page: item.page, section: item.section,
        title: draftItem.title || "", description: draftItem.description || "",
        data: Array.isArray(draftItem.data) ? draftItem.data : [],
        order: draftItem.order || 0,
      });
      await fetchContent();
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      toast.success("Section saved!");
      setEditModeIds((prev) => prev.filter((i) => i !== item.section));
    } catch { toast.error("Save failed"); }
    finally { setSaving(item.id, false); }
  };

  const quickSave = async (updatedItem) => {
    const draftItem = drafts[updatedItem.id] || updatedItem;
    try {
      setSaving(updatedItem.id, true);
      const res = await API.patch(`content/${updatedItem.id}/`, {
        page: updatedItem.page, section: updatedItem.section,
        title: draftItem.title || "", description: draftItem.description || "",
        data: Array.isArray(draftItem.data) ? draftItem.data : [],
        order: draftItem.order || 0,
      });
      const savedItem = res?.data || { ...updatedItem, ...draftItem };

      // Sync the saved values into `content` BEFORE dropping the draft,
      // otherwise the next render falls back to the pre-edit item and
      // whatever was just typed appears to vanish.
      setContent((prev) => prev.map((c) => (c.id === updatedItem.id ? savedItem : c)));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[updatedItem.id];
        return next;
      });
      toast.success("Saved");
    } catch { toast.error("Save failed"); }
    finally { setSaving(updatedItem.id, false); }
  };

  const uploadImage = async (id, file) => {
    if (!file) return;
    const item = content.find((c) => c.id === id);
    if (!item) return;
    const fd = new FormData();
    fd.append("page", item.page); fd.append("section", item.section);
    fd.append("title", item.title || ""); fd.append("description", item.description || "");
    fd.append("data", JSON.stringify(Array.isArray(item.data) ? item.data : []));
    fd.append("order", item.order || 0); fd.append("image", file);
    try {
      setSaving(id, true);
      await API.patch(`content/${id}/`, fd);
      await fetchContent(); toast.success("Image uploaded");
    } catch { toast.error("Image upload failed"); }
    finally { setSaving(id, false); }
  };

  const deleteSection = async (id) => {
    if (!window.confirm("Delete this section?")) return;
    try {
      await API.delete(`content/${id}/`);
      setContent((prev) => prev.filter((c) => c.id !== id));
      toast.success("Section deleted");
    } catch { toast.error("Delete failed"); }
  };

  // cards
  const addCard    = (id) => {
    const item = content.find((c) => c.id === id);
    if (!item) return;
    updateLocal(id, { data: [...(item.data || []), { title: "", description: "", image: "" }] });
  };
  const updateCard = (id, idx, key, val) => {
    const item = content.find((c) => c.id === id);
    if (!item) return;
    const d = [...(item.data || [])];
    d[idx] = { ...(d[idx] || {}), [key]: val };
    updateLocal(id, { data: d });
  };
  const removeCard = (id, idx) => {
    const item = content.find((c) => c.id === id);
    if (!item) return;
    updateLocal(id, { data: (item.data || []).filter((_, i) => i !== idx) });
  };

  // ── ANALYTICS ──
  const getCombinedMonthly = () => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { name: d.toLocaleString("default", { month: "short" }), month: d.getMonth(), year: d.getFullYear(), appointments: 0, messages: 0 };
    });
    appointments.forEach((a) => {
      const dt = new Date(a.created_at); if (isNaN(dt)) return;
      const m = months.find((x) => x.month === dt.getMonth() && x.year === dt.getFullYear());
      if (m) m.appointments++;
    });
    messages.forEach((msg) => {
      const dt = new Date(msg.created_at); if (isNaN(dt)) return;
      const m = months.find((x) => x.month === dt.getMonth() && x.year === dt.getFullYear());
      if (m) m.messages++;
    });
    return months;
  };

  const filteredAppointments = appointments
    .filter((a) => `${a.parent_name} ${a.child_name} ${a.phone}`.toLowerCase().includes(search.toLowerCase()))
    .filter((a) => branchFilter === "all" || a.branch === branchFilter)
    .sort((a, b) => sort === "latest"
      ? new Date(b.created_at || b.date) - new Date(a.created_at || a.date)
      : new Date(a.created_at || a.date) - new Date(b.created_at || b.date));

  const filteredMessages = Array.isArray(messages)
    ? messages.filter((m) => `${m.name} ${m.email} ${m.message}`.toLowerCase().includes(search.toLowerCase()))
    : [];

  const PAGE_LABELS = { dashboard:"Dashboard", appointments:"Appointments", messages:"Messages", pages:"Pages Editor" };

  // ════════════════════════════════
  //  RENDER
  // ════════════════════════════════
  return (
    <div className="min-h-screen flex bg-[#f4f6fb] dark:bg-[#0f1117] text-gray-900 dark:text-white">

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-white dark:bg-[#16191f]
        flex flex-col shadow-xl border-r border-gray-100 dark:border-white/[0.06]
        z-50 transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 pt-6 pb-5 border-b border-gray-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/30">
              T
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">Admin Panel</p>
              <p className="text-[10px] text-gray-400">Tiny Todds Centre</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="md:hidden text-gray-400 hover:text-gray-700 dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-3 mb-2">Main</p>
          <NavBtn icon={<LayoutDashboard size={17}/>} label="Dashboard"    val="dashboard"    active={active} setActive={setActive} setMobileOpen={setMobileOpen} />
          <NavBtn icon={<Calendar size={17}/>}        label="Appointments" val="appointments" active={active} setActive={setActive} setMobileOpen={setMobileOpen} count={appointments.length} />
          <NavBtn icon={<MessageSquare size={17}/>}   label="Messages"     val="messages"     active={active} setActive={setActive} setMobileOpen={setMobileOpen} count={messages.length} />

          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-3 mt-5 mb-2">Content</p>
          <NavBtn icon={<PenLine size={17}/>} label="Pages Editor" val="pages" active={active} setActive={setActive} setMobileOpen={setMobileOpen} />
        </nav>

        {/* Bottom */}
        <div className="px-4 pb-5 border-t border-gray-100 dark:border-white/[0.06] pt-4 space-y-2">
          <button
            onClick={() => setDark(!dark)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition"
          >
            <span>{dark ? "☀️" : "🌙"}</span>
            <span>{dark ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ══════════════ MAIN ══════════════ */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* ── Top Header ── */}
        <header className="sticky top-0 z-30 h-10 bg-white/80 dark:bg-[#16191f]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/[0.06] flex items-center justify-between px-5 md:px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-sm">{PAGE_LABELS[active] || active}</h1>
              <p className="text-[11px] text-gray-400 leading-none">Admin Dashboard</p>
            </div>
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 bg-white dark:bg-white/[0.04] px-3 py-2 rounded-xl border border-gray-200 dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/10 transition shadow-sm cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                <User size={16} className="text-blue-600 dark:text-blue-400" />
              </div>

              <div className="text-left leading-tight hidden sm:block">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  Admin
                </div>
                <div className="text-[11px] text-green-500 font-medium">
                  Active
                </div>
              </div>

              <ChevronDown size={14} className="text-gray-400" />
            </div>

            {profileOpen && (
              <div className="absolute right-0 top-14 w-48 bg-white dark:bg-[#1e2128] border border-gray-200 dark:border-white/[0.08] rounded-xl shadow-xl p-2 space-y-1 z-50">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                >
                  <User size={14} className="text-gray-500" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                >
                  <LogOut size={14} className="text-red-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ── Content Area ── */}
        <main className="flex-1 p-5 md:p-8 max-w-7xl mx-auto w-full">

          {/* ════════ DASHBOARD ════════ */}
          {active === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard icon={<Users size={22}/>}        label="Appointments"  value={appointments.length} color="blue" />
                <StatCard icon={<MessageSquare size={22}/>} label="Messages"      value={messages.length}     color="emerald" />
                <StatCard icon={<FileText size={22}/>}      label="CMS Sections"  value={content.length}      color="violet" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#16191f] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06] shadow-sm">
                  <h3 className="text-sm font-semibold mb-1">Monthly Analytics</h3>
                  <p className="text-xs text-gray-400 mb-5">Appointments vs Messages (last 6 months)</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={getCombinedMonthly()}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 40px rgba(0,0,0,.1)" }} />
                      <Legend />
                      <Bar dataKey="appointments" fill="#3B82F6" radius={[6,6,0,0]} />
                      <Bar dataKey="messages"     fill="#10B981" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-[#16191f] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06] shadow-sm">
                  <h3 className="text-sm font-semibold mb-1">Distribution</h3>
                  <p className="text-xs text-gray-400 mb-5">Appointments vs Messages ratio</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={[{name:"Appointments",value:appointments.length},{name:"Messages",value:messages.length}]}
                        dataKey="value" outerRadius={90} innerRadius={50} strokeWidth={0} label>
                        {["#3B82F6","#10B981"].map((c,i) => <Cell key={i} fill={c}/>)}
                      </Pie>
                      <Legend /><Tooltip contentStyle={{ borderRadius:"12px", border:"none" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentCard title="Recent Appointments" onViewAll={() => setActive("appointments")}>
                  {appointments.length === 0
                    ? <EmptyState label="No appointments yet" />
                    : appointments.slice(0,5).map((a) => (
                      <div key={a.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 text-xs font-bold">
                            {(a.parent_name||"?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{a.parent_name}</p>
                            <p className="text-xs text-gray-400">{a.child_name} · {a.branch}</p>
                          </div>
                        </div>
                        <span className="text-[11px] text-gray-400">{a.created_at ? new Date(a.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short"}) : a.date || "—"}</span>
                      </div>
                    ))
                  }
                </RecentCard>

                <RecentCard title="Recent Messages" onViewAll={() => setActive("messages")}>
                  {messages.length === 0
                    ? <EmptyState label="No messages yet" />
                    : messages.slice(0,5).map((m) => (
                      <div key={m.id} className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-sm font-medium">{m.name}</p>
                          <span className="text-[11px] text-gray-400">{m.created_at ? new Date(m.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short"}) : "—"}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate max-w-[280px]">{m.message}</p>
                      </div>
                    ))
                  }
                </RecentCard>
              </div>
            </div>
          )}

          {/* ════════ APPOINTMENTS ════════ */}
          {active === "appointments" && (
            <div className="space-y-5">
              <SectionHeader title="Appointment Leads" count={filteredAppointments.length} />
              <div className="flex flex-col sm:flex-row gap-2 relative z-40">
                <input type="text" placeholder="Search appointments…" onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 sm:w-64 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#16191f] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all shadow-sm text-gray-900 dark:text-white" />
                
                <div className="flex gap-2">
                  <CustomDropdown
                    value={branchFilter}
                    onChange={setBranchFilter}
                    className="w-1/2 sm:w-[130px] shrink-0"
                    options={[
                      { value: "all", label: "All Branches" },
                      ...(content.find(c => c.section === "branches")?.data
                        ?.slice()
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map(b => ({ value: b.title, label: b.title })) 
                        || [])
                    ]}
                  />

                  <CustomDropdown
                    value={sort}
                    onChange={setSort}
                    className="w-1/2 sm:w-[130px] shrink-0"
                    options={[
                      { value: "latest", label: "Latest" },
                      { value: "oldest", label: "Oldest" }
                    ]}
                  />
                </div>
              </div>
              {filteredAppointments.length === 0
                ? <EmptyState label="No appointments found" />
                : <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredAppointments.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-[#16191f] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-md transition space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-blue-600">{item.parent_name}</h3>
                        <span className="text-xs text-gray-400">{item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : item.date || "No date"}</span>
                      </div>
                      <p className="text-sm font-medium">{item.child_name}</p>
                      <p className="text-sm text-gray-500">Age: {item.age}</p>
                      <p className="text-sm">{item.phone}</p>
                      <p className="text-sm text-gray-500">{item.branch} · {item.program}</p>
                      <div className="flex gap-3 pt-2">
                        <a href={`tel:${item.phone}`} className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl text-sm font-medium transition">Call</a>
                        <a href={`https://wa.me/${(item.phone||"").replace(/\D/g,"")}`} target="_blank" rel="noreferrer" className="flex-1 text-center bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl text-sm font-medium transition">WhatsApp</a>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
          )}

          {/* ════════ MESSAGES ════════ */}
          {active === "messages" && (
            <div className="space-y-5">
              <SectionHeader title="Contact Messages" count={filteredMessages.length} />
              <input type="text" placeholder="Search messages…" onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all" />

              {/* Mobile */}
              <div className="md:hidden space-y-4">
                {filteredMessages.map((msg) => (
                  <div key={msg.id} className="bg-white dark:bg-[#16191f] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06] shadow-sm space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-blue-600">{msg.name}</h3>
                      <span className="text-xs text-gray-500">{msg.created_at ? new Date(msg.created_at).toLocaleDateString("en-IN") : "No date"}</span>
                    </div>
                    <a href={`mailto:${msg.email}`} className="text-sm text-blue-600 underline">{msg.email}</a>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{msg.message}</p>
                    <div className="flex gap-3 text-xs pt-1">
                      <button onClick={() => navigator.clipboard.writeText(msg.email)} className="text-gray-500 hover:text-black dark:hover:text-white">Copy</button>
                      <a href={`mailto:${msg.email}`} className="text-green-600 hover:underline">Reply</a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop */}
              <div className="hidden md:block bg-white dark:bg-[#16191f] rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/[0.06]">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-600 dark:text-gray-400">Name</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-600 dark:text-gray-400">Email</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-600 dark:text-gray-400">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                    {filteredMessages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                        <td className="px-6 py-4">
                          <p className="font-medium text-blue-600">{msg.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{msg.created_at ? new Date(msg.created_at).toLocaleDateString("en-IN") : "No date"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline font-medium">{msg.email}</a>
                          <div className="flex gap-3 mt-1 text-xs">
                            <button onClick={() => navigator.clipboard.writeText(msg.email)} className="text-gray-500 hover:text-black dark:hover:text-white">Copy</button>
                            <a href={`mailto:${msg.email}`} className="text-green-600 hover:underline">Reply</a>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">{msg.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredMessages.length === 0 && <EmptyState label="No messages found" />}
              </div>
            </div>
          )}

          {/* ════════ PAGES EDITOR ════════ */}
          {active === "pages" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-600/20 shrink-0">
                  <FileText size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pages Editor</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Edit your website content section by section.</p>
                </div>
              </div>

              {/* Page Tabs */}
              <div className="bg-white dark:bg-[#16191f] rounded-2xl p-4 border border-gray-100 dark:border-white/[0.06] shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Select Page</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {Object.keys(PAGE_SECTIONS).map((page) => {
                    const isActive = pagesTab === page;
                    return (
                      <button key={page}
                        onClick={() => setPagesTab(page)}
                        className={`group flex items-center justify-center gap-1.5 min-w-0 w-full overflow-hidden px-3 sm:px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium capitalize transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-transparent shadow-md shadow-blue-600/20"
                            : "bg-gray-50 dark:bg-white/[0.02] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/[0.06] hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="shrink-0 flex items-center">{PAGE_ICONS[page]}</span>
                        <span className="truncate min-w-0">{page}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sections — each one is its own card, so it reads as a
                  distinct, self-contained unit rather than a flat list row. */}
              <div className="space-y-4">
              {PAGE_SECTIONS[pagesTab]?.map((def) => {
                const item    = content.find((c) => c.page === pagesTab && c.section === def.section) || null;
                const isEdit  = editModeIds.includes(def.section);
                const meta    = SECTION_TYPE_META[def.type] || SECTION_TYPE_META.cards;
                const colorCls = SECTION_COLOR_CLASSES[meta.color] || SECTION_COLOR_CLASSES.emerald;
                const draftItem = item ? (drafts[item.id] || item) : null;
                const bannerImage = item?.image
                  ? (item.image.startsWith("http") ? item.image : `https://appointment-83q0.onrender.com${item.image}`)
                  : null;

                return (
                  <div key={def.section} className={`rounded-2xl border bg-white dark:bg-[#16191f] shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-5 ${
                    item ? "border-gray-100 dark:border-white/[0.06]" : "border-dashed border-gray-200 dark:border-white/[0.08]"
                  }`}>

                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
                      <div className="flex items-center gap-3 sm:w-64 shrink-0">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-white shadow-sm">
                          {bannerImage ? (
                            <img src={bannerImage} alt={def.label} className="h-full w-full object-cover" />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${colorCls.solid}`}>{meta.icon}</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-gray-900 dark:text-white">{def.label}</h3>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${colorCls.badge}`}>{meta.label}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{def.description}</p>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col gap-2 sm:max-w-xs sm:ml-auto">
                        {item && (
                          <div className="flex bg-gray-100 dark:bg-white/[0.05] p-1 rounded-xl w-full">
                            {["Preview","Edit"].map((label, i) => (
                              <button key={label} onClick={() => toggleEdit(def.section)}
                                className={`flex-1 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  (i===0 ? !isEdit : isEdit)
                                    ? "bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-white"
                                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                }`}>{label}</button>
                            ))}
                          </div>
                        )}
                        {item ? (
                          <div className="flex gap-2 w-full">
                            <button onClick={() => deleteSection(item.id)} className="flex-1 px-3 py-2 rounded-xl text-xs font-medium bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 transition">
                              Delete
                            </button>
                            <button onClick={() => saveContent(item)} disabled={savingIds.includes(item.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-60">
                              <Save size={13}/> {savingIds.includes(item.id) ? "Saving…" : "Save"}
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => autoCreate(pagesTab, def.section)}
                            className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm w-full">
                            <Plus size={13}/> Enable Section
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Section Body */}
                    <div className="pt-4">

                      {item ? (
                        <div className="w-full min-w-0 space-y-3 sm:space-y-4">
                          {/* Status Badge */}
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 w-fit">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Enabled (Live)
                            </span>
                          </div>

                          <div className="w-full min-w-0 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50/60 dark:bg-white/[0.02] shadow-sm p-3 sm:p-4">
                            <div className="mb-3 flex items-center justify-between gap-2">
                              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current content</h4>
                              <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Live preview</span>
                            </div>
                            <ContentPreview item={item} type={def.type} />
                          </div>

                          {isEdit && (
                            <div className="w-full min-w-0 rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50/40 dark:bg-blue-500/[0.04] shadow-sm p-3 sm:p-4">
                              <div className="mb-3 flex items-center justify-between gap-2">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Edit fields</h4>
                                <span className="text-[10px] font-medium uppercase tracking-wide text-blue-500">Editing</span>
                              </div>
                              <SectionEditor
                                item={draftItem || item}
                                savedItem={item}
                                type={def.type}
                                updateLocal={updateLocal} uploadImage={uploadImage}
                                quickSave={quickSave} savingIds={savingIds}
                                isEnabled={true}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full min-w-0 space-y-3 sm:space-y-4">
                          {/* Status Badge - Disabled */}
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] w-fit">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                              Disabled (Draft)
                            </span>
                          </div>

                          <div className="w-full min-w-0 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-white/[0.02] p-3 sm:p-4">
                            <div className="mb-3 flex items-center justify-between gap-2">
                              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Preview (read-only)</h4>
                              <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Draft — not published</span>
                            </div>
                            <SectionEditor
                                item={draftItem || applySectionDefaults({ ...def, page: pagesTab, title: "", description: "", data: [] })}
                                savedItem={null}
                                type={def.type}
                                updateLocal={() => {}}
                                uploadImage={() => {}}
                                quickSave={() => {}}
                                savingIds={[]}
                                isEnabled={false}
                              />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
//  SECTION EDITOR — routes to specialized sub-editors
// ════════════════════════════════════════════════════
function SectionEditor({ item, savedItem, type, updateLocal, uploadImage, quickSave, savingIds, isEnabled = true }) {
  switch (type) {
    case "hero":        return <HeroEditor        item={item} savedItem={savedItem} updateLocal={updateLocal} uploadImage={uploadImage} savingIds={savingIds} isEnabled={isEnabled} />;
    case "text":        return <TextEditor        item={item} savedItem={savedItem} updateLocal={updateLocal} quickSave={quickSave} isEnabled={isEnabled} />;
    case "stats":       return <StatsEditor       item={item} savedItem={savedItem} updateLocal={updateLocal} quickSave={quickSave} isEnabled={isEnabled} />;
    case "features":    return <FeaturesEditor    item={item} savedItem={savedItem} updateLocal={updateLocal} quickSave={quickSave} isEnabled={isEnabled} />;
    case "simple":      return <SimpleEditor      item={item} savedItem={savedItem} updateLocal={updateLocal} quickSave={quickSave} isEnabled={isEnabled} />;
    case "mission-vision": return <MissionVisionEditor item={item} savedItem={savedItem} updateLocal={updateLocal} quickSave={quickSave} isEnabled={isEnabled} />;
    case "single-card": return <SingleCardEditor  item={item} savedItem={savedItem} updateLocal={updateLocal} quickSave={quickSave} isEnabled={isEnabled} />;
    default:            return <CardsEditor       item={item} savedItem={savedItem} updateLocal={updateLocal} quickSave={quickSave} isEnabled={isEnabled} />;
  }
}

// ── Hero Editor ──
function HeroEditor({ item, savedItem, updateLocal, uploadImage, savingIds, isEnabled = true }) {
  // Badge text and the highlighted (colored) part of the heading are stored
  // as two entries inside `data`, using the SAME {title, description} shape
  // every other section's data array already uses (stats, cards,
  // mission-vision) — rather than inventing a new {badge, highlight} shape,
  // which the backend's serializer rejected with a 400.
  const data = Array.isArray(item.data) ? item.data : [];
  const isContactHero = item.section === "contact-hero";
  const defaults = isContactHero ? CONTACT_HERO_DEFAULTS : HOME_HERO_DEFAULTS;
  const defaultData = defaults.data;
  const getDefaultExtra = (key) => defaultData.find((d) => d?.title === key)?.description || "";
  const getExtra = (key) => data.find((d) => d?.title === key)?.description || getDefaultExtra(key);
  const setExtra = (key, value) => {
    const next = data.filter((d) => d?.title !== key);
    next.push({ title: key, description: value });
    updateLocal(item.id, { data: next });
  };

  return (
    <div className="space-y-5">
      {!isContactHero && (
        <FieldGroup >
          {item.image
            ? <img src={item.image.startsWith("http") ? item.image : `https://appointment-83q0.onrender.com${item.image}`}
                alt="hero" className="w-full max-w-sm h-40 object-cover rounded-xl border border-gray-200 dark:border-white/10 mb-3"/>
            : <div className="w-full max-w-xs h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center text-gray-400 mb-3 gap-1">
                <ImageIcon size={22}/><span className="text-xs">No image yet</span>
              </div>
          }
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => isEnabled && uploadImage(item.id, e.target.files?.[0])} 
            disabled={!isEnabled}
            className="text-sm text-gray-500" 
          />
        </FieldGroup>
      )}
      <FieldGroup label="Badge Text (small pill above the heading)">
        <input
          value={getExtra("badge")}
          onChange={(e) => isEnabled && setExtra("badge", e.target.value)}
          disabled={!isEnabled}
          className={isEnabled ? inputCls : disabledInputCls}
          placeholder="✨ Professional Child Therapy"
        />
      </FieldGroup>
      <FieldGroup label="Title (first line of heading)">
        <input 
          value={item.title || defaults.title || ""} 
          onChange={(e) => isEnabled && updateLocal(item.id,{title:e.target.value})}
          disabled={!isEnabled}
          className={isEnabled ? inputCls : disabledInputCls} 
          placeholder="Hero heading text" 
        />
      </FieldGroup>
      <FieldGroup label="Highlighted Line (second line, shown in the accent color)">
        <input
          value={getExtra("highlight")}
          onChange={(e) => isEnabled && setExtra("highlight", e.target.value)}
          disabled={!isEnabled}
          className={isEnabled ? inputCls : disabledInputCls}
          placeholder="Little Minds"
        />
      </FieldGroup>
      <FieldGroup label="Description / Subtitle">
        <textarea 
          value={item.description || defaults.description || ""} 
          onChange={(e) => isEnabled && updateLocal(item.id,{description:e.target.value})}
          disabled={!isEnabled}
          className={`${isEnabled ? inputCls : disabledInputCls} min-h-[100px] resize-y`} 
          placeholder="Subtitle or description" 
        />
      </FieldGroup>
    </div>
  );
}

// ── Text Editor ──
function TextEditor({ item, savedItem, updateLocal, quickSave, isEnabled = true }) {
  return (
    <div className="space-y-5">
      <FieldGroup label="Section Title (Optional)">
        <input 
          value={item.title||""} 
          onChange={(e) => isEnabled && updateLocal(item.id,{title:e.target.value})} 
          onBlur={() => isEnabled && quickSave(item)}
          disabled={!isEnabled}
          className={isEnabled ? inputCls : disabledInputCls} 
          placeholder="Heading text" 
        />
      </FieldGroup>
      <FieldGroup label="Description Text">
        <textarea 
          value={item.description||""} 
          onChange={(e) => isEnabled && updateLocal(item.id,{description:e.target.value})} 
          onBlur={() => isEnabled && quickSave(item)}
          disabled={!isEnabled}
          className={`${isEnabled ? inputCls : disabledInputCls} min-h-[200px] resize-y`} 
          placeholder="Main content text" 
        />
      </FieldGroup>
    </div>
  );
}

// ── Stats Editor (like TTTC Home/About stats) ──
function StatsEditor({ item, savedItem, updateLocal, quickSave, isEnabled = true }) {
  const effectiveItem = applySectionDefaults(item);
  const effectiveSavedItem = savedItem ? applySectionDefaults(savedItem) : effectiveItem;
  const data = Array.isArray(effectiveItem.data)
  ? [...effectiveItem.data].sort((a, b) =>
      String(a?.title || "").localeCompare(
        String(b?.title || ""),
        undefined,
        { sensitivity: "base" }
      )
    )
  : [];
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingIdx, setEditingIdx] = useState(null);

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const newData = [...data];
    if (editingIdx !== null) newData[editingIdx] = form;
    else newData.push(form);
    updateLocal(item.id, { data: newData });
    quickSave({ ...item, data: newData });
    setForm({ title: "", description: "" });
    setEditingIdx(null);
  };

  const handleDelete = (idx) => {
    if(!window.confirm("Delete this stat?")) return;
    const newData = data.filter((_, i) => i !== idx);
    updateLocal(item.id, { data: newData });
    quickSave({ ...item, data: newData });
  };

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className={`border rounded-xl overflow-hidden shadow-sm ${isEnabled ? "bg-white dark:bg-white/[0.02] border-gray-200 dark:border-white/[0.06]" : "bg-gray-50 dark:bg-gray-900/20 border-gray-300 dark:border-gray-600"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className={`border-b ${isEnabled ? "bg-gray-50 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.06]" : "bg-gray-100 dark:bg-gray-800/40 border-gray-300 dark:border-gray-600"}`}>
              <tr>
                <th className={`px-4 py-3 font-semibold ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Label</th>
                <th className={`px-4 py-3 font-semibold ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Value</th>
                <th className={`px-4 py-3 font-semibold w-32 ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isEnabled ? "divide-gray-100 dark:divide-white/[0.06]" : "divide-gray-200 dark:divide-gray-700"}`}>
              {data.map((d, i) => (
                <tr key={i} className={isEnabled ? "hover:bg-gray-50 dark:hover:bg-white/[0.02] transition" : ""}>
                  <td className={`px-4 py-3 font-medium ${isEnabled ? "text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400"}`}>{d.title}</td>
                  <td className={`px-4 py-3 font-bold ${isEnabled ? "text-orange-500" : "text-orange-400/60"}`}>{d.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { if(isEnabled) { setForm(d); setEditingIdx(i); } }} 
                        disabled={!isEnabled}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${isEnabled ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:shadow-md" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"}`}>
                        Edit
                      </button>
                      <button 
                        onClick={() => { if(isEnabled) handleDelete(i); }} 
                        disabled={!isEnabled}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${isEnabled ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white hover:shadow-md" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"}`}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan="3" className="px-4 py-8 text-center text-gray-400 text-sm">No stats added yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form */}
      {isEnabled && (
        <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-amber-800 dark:text-amber-500 mb-4">{editingIdx !== null ? "Edit Stat" : "Add Stat"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Label</label>
              <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className={inputCls} placeholder="e.g. Happy Students" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Value</label>
              <input value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className={inputCls} placeholder="e.g. 500+" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSubmit} className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all">
              {editingIdx !== null ? "Update" : "Add"}
            </button>
            {editingIdx !== null && (
              <button onClick={() => { setForm({title:"", description:""}); setEditingIdx(null); }} className="px-6 py-2.5 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all">Cancel</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Features Editor (Icon + Image background) ──
function FeaturesEditor({ item, savedItem, updateLocal, quickSave, isEnabled = true }) {
  const effectiveItem = applySectionDefaults(item);
  const effectiveSavedItem = savedItem ? applySectionDefaults(savedItem) : effectiveItem;
  const data = Array.isArray(effectiveItem.data)
  ? [...effectiveItem.data].sort((a, b) =>
      String(a?.title || "").localeCompare(
        String(b?.title || ""),
        undefined,
        { sensitivity: "base" }
      )
    )
  : [];
  const [form, setForm] = useState({ title: "", description: "", icon: "", image: "" });
  const [editingIdx, setEditingIdx] = useState(null);
  const [iconDropdown, setIconDropdown] = useState(false);

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const newData = [...data];
    if (editingIdx !== null) newData[editingIdx] = form;
    else newData.push(form);
    updateLocal(item.id, { data: newData });
    quickSave({ ...item, data: newData });
    setForm({ title: "", description: "", icon: "", image: "" });
    setEditingIdx(null);
  };

  const handleDelete = (idx) => {
    if(!window.confirm("Delete this feature?")) return;
    const newData = data.filter((_, i) => i !== idx);
    updateLocal(item.id, { data: newData });
    quickSave({ ...item, data: newData });
  };

  const SelectedIcon = ICON_LIST[form.icon] || null;

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className={`border rounded-xl overflow-hidden shadow-sm ${isEnabled ? "bg-white dark:bg-white/[0.02] border-gray-200 dark:border-white/[0.06]" : "bg-gray-50 dark:bg-gray-900/20 border-gray-300 dark:border-gray-600"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className={`border-b ${isEnabled ? "bg-gray-50 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.06]" : "bg-gray-100 dark:bg-gray-800/40 border-gray-300 dark:border-gray-600"}`}>
              <tr>
                <th className={`px-4 py-3 font-semibold w-16 text-center ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Icon</th>
                <th className={`px-4 py-3 font-semibold w-16 text-center ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Bg Image</th>
                <th className={`px-4 py-3 font-semibold ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Title</th>
                <th className={`px-4 py-3 font-semibold w-32 ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isEnabled ? "divide-gray-100 dark:divide-white/[0.06]" : "divide-gray-200 dark:divide-gray-700"}`}>
              {data.map((d, i) => {
                const IC = ICON_LIST[d.icon] || Briefcase;
                return (
                  <tr key={i} className={isEnabled ? "hover:bg-gray-50 dark:hover:bg-white/[0.02] transition" : ""}>
                    <td className="px-4 py-3 text-center"><IC size={18} className={isEnabled ? "text-fuchsia-600" : "text-fuchsia-500/60"} /></td>
                    <td className="px-4 py-3">
                      {(d.image || d.src) ? <img src={d.image||d.src} alt="" className="w-8 h-8 object-cover rounded-md" /> : <span className={`text-xs ${isEnabled ? "text-gray-400" : "text-gray-500"}`}>None</span>}
                    </td>
                    <td className={`px-4 py-3 font-medium ${isEnabled ? "text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400"}`}>{d.title}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { if(isEnabled) { setForm({title: d.title||"", description: d.description||"", icon: d.icon||"", image: d.image||"",}); setEditingIdx(i); } }} 
                          disabled={!isEnabled}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${isEnabled ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white hover:shadow-md" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"}`}>
                          Edit
                        </button>
                        <button 
                          onClick={() => { if(isEnabled) handleDelete(i); }} 
                          disabled={!isEnabled}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${isEnabled ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white hover:shadow-md" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"}`}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {data.length === 0 && <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-400 text-sm">No features added yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form */}
      {isEnabled && (
        <div className="bg-fuchsia-50/50 dark:bg-fuchsia-500/5 border border-fuchsia-100 dark:border-fuchsia-500/10 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-fuchsia-800 dark:text-fuchsia-500 mb-4">{editingIdx !== null ? "Edit Feature" : "Add Feature"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Title</label>
              <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className={inputCls} placeholder="Feature Name" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Background Image URL (Required)</label>
              <input value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} className={inputCls} placeholder="https://..." />
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Icon</label>
              <button onClick={() => setIconDropdown(!iconDropdown)} className="w-full flex items-center gap-2 border border-gray-200 dark:border-white/[0.06] rounded-xl px-3.5 py-2.5 bg-white dark:bg-white/[0.02] text-sm text-left hover:border-fuchsia-400 transition">
                {SelectedIcon ? <SelectedIcon size={16} className="text-fuchsia-600"/> : null}
                <span className="flex-1 text-gray-700 dark:text-gray-300">{form.icon || "Pick an icon..."}</span>
                <ChevronDown size={14} className="text-gray-400"/>
              </button>
              {iconDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-[#1e2128] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                  {Object.keys(ICON_LIST).map((name) => {
                    const IC = ICON_LIST[name];
                    return (
                      <button key={name} onClick={() => { setForm({...form, icon: name}); setIconDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-500/10 text-sm transition text-left">
                        <IC size={16} className="text-fuchsia-600"/> {name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className={`${inputCls} min-h-[80px]`} placeholder="Detailed description" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSubmit} className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all">
              {editingIdx !== null ? "Update" : "Add"}
            </button>
            {editingIdx !== null && (
              <button onClick={() => { setForm({title:"", description:"", icon:"", image:""}); setEditingIdx(null); }} className="px-6 py-2.5 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all">Cancel</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Mission & Vision Editor (icon cards, e.g. About page) ──
function MissionVisionEditor({ item, savedItem, updateLocal, quickSave, isEnabled = true }) {
  const data = Array.isArray(item.data) ? [...item.data] : [];
  const [form, setForm] = useState({ title: "", description: "", icon: "" });
  const [editingIdx, setEditingIdx] = useState(null);
  const [iconDropdown, setIconDropdown] = useState(false);

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const newData = [...data];
    if (editingIdx !== null) newData[editingIdx] = form;
    else newData.push(form);
    updateLocal(item.id, { data: newData });
    quickSave({ ...item, data: newData });
    setForm({ title: "", description: "", icon: "" });
    setEditingIdx(null);
  };

  const handleDelete = (idx) => {
    if (!window.confirm("Delete this card?")) return;
    const newData = data.filter((_, i) => i !== idx);
    updateLocal(item.id, { data: newData });
    quickSave({ ...item, data: newData });
  };

  const SelectedIcon = ICON_LIST[form.icon] || null;

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className={`border rounded-xl overflow-hidden shadow-sm ${isEnabled ? "bg-white dark:bg-white/[0.02] border-gray-200 dark:border-white/[0.06]" : "bg-gray-50 dark:bg-gray-900/20 border-gray-300 dark:border-gray-600"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className={`border-b ${isEnabled ? "bg-gray-50 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.06]" : "bg-gray-100 dark:bg-gray-800/40 border-gray-300 dark:border-gray-600"}`}>
              <tr>
                <th className={`px-4 py-3 font-semibold w-16 text-center ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Icon</th>
                <th className={`px-4 py-3 font-semibold ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Title</th>
                <th className={`px-4 py-3 font-semibold ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Description</th>
                <th className={`px-4 py-3 font-semibold w-32 ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isEnabled ? "divide-gray-100 dark:divide-white/[0.06]" : "divide-gray-200 dark:divide-gray-700"}`}>
              {data.map((d, i) => {
                const IC = ICON_LIST[d.icon] || Target;
                return (
                  <tr key={i} className={isEnabled ? "hover:bg-gray-50 dark:hover:bg-white/[0.02] transition" : ""}>
                    <td className="px-4 py-3 text-center"><IC size={18} className={isEnabled ? "text-rose-600" : "text-rose-500/60"} /></td>
                    <td className={`px-4 py-3 font-medium ${isEnabled ? "text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400"}`}>{d.title}</td>
                    <td className={`px-4 py-3 truncate max-w-[220px] ${isEnabled ? "text-gray-500" : "text-gray-600"}`}>{d.description}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { if(isEnabled) { setForm({ title: d.title||"", description: d.description||"", icon: d.icon||"" }); setEditingIdx(i); } }} 
                          disabled={!isEnabled}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${isEnabled ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white hover:shadow-md" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"}`}>
                          Edit
                        </button>
                        <button 
                          onClick={() => { if(isEnabled) handleDelete(i); }} 
                          disabled={!isEnabled}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${isEnabled ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white hover:shadow-md" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"}`}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {data.length === 0 && <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-400 text-sm">No cards added yet — add "Our Mission" and "Our Vision" below.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form */}
      {isEnabled && (
        <div className="bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-rose-800 dark:text-rose-500 mb-4">{editingIdx !== null ? "Edit Card" : "Add Card"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Title</label>
              <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className={inputCls} placeholder="e.g. Our Mission" />
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Icon</label>
              <button onClick={() => setIconDropdown(!iconDropdown)} className="w-full flex items-center gap-2 border border-gray-200 dark:border-white/[0.06] rounded-xl px-3.5 py-2.5 bg-white dark:bg-white/[0.02] text-sm text-left hover:border-rose-400 transition">
                {SelectedIcon ? <SelectedIcon size={16} className="text-rose-600"/> : null}
                <span className="flex-1 text-gray-700 dark:text-gray-300">{form.icon || "Pick an icon..."}</span>
                <ChevronDown size={14} className="text-gray-400"/>
              </button>
              {iconDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-[#1e2128] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                  {Object.keys(ICON_LIST).map((name) => {
                    const IC = ICON_LIST[name];
                    return (
                      <button key={name} onClick={() => { setForm({...form, icon: name}); setIconDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-sm transition text-left">
                        <IC size={16} className="text-rose-600"/> {name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className={`${inputCls} min-h-[80px]`} placeholder="e.g. We focus on speech, cognitive, and behavioral development..." />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSubmit} className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all">
              {editingIdx !== null ? "Update" : "Add"}
            </button>
            {editingIdx !== null && (
              <button onClick={() => { setForm({title:"", description:"", icon:""}); setEditingIdx(null); }} className="px-6 py-2.5 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all">Cancel</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Single Card Editor (Our Mission / Our Vision) ──
// Stores the card content directly in item.title, item.description, and item.data[0].icon
// so each section is a self-contained, independently editable card.
function SingleCardEditor({ item, savedItem, updateLocal, quickSave, isEnabled = true }) {
  const iconKey = Array.isArray(item.data) && item.data[0]?.icon ? item.data[0].icon : "";
  const savedIconKey = Array.isArray(savedItem?.data) && savedItem?.data[0]?.icon ? savedItem.data[0].icon : "";
  const [iconDropdown, setIconDropdown] = useState(false);

  const setIconKey = (key) => {
    const newData = [{ ...(Array.isArray(item.data) ? (item.data[0] || {}) : {}), icon: key }];
    updateLocal(item.id, { data: newData });
  };

  const SelectedIcon = ICON_LIST[iconKey] || null;
  const SavedIcon    = ICON_LIST[savedIconKey] || null;

  return (
    <div className="space-y-5">
      {/* Live preview of saved content */}
      {savedItem && (
        <div className={`w-full min-w-0 rounded-[1rem] border p-3 sm:p-4 shadow-sm ${
          isEnabled
            ? "border-rose-200/70 dark:border-rose-500/15 bg-white/90 dark:bg-[#171b24]/90 shadow-[0_10px_25px_-18px_rgba(244,63,94,0.35)]"
            : "border-rose-300/50 dark:border-rose-600/20 bg-rose-50/60 dark:bg-rose-900/10"
        }`}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h4 className={`text-sm font-semibold ${isEnabled ? "text-rose-800 dark:text-rose-400" : "text-rose-700 dark:text-rose-500"}`}>Saved values</h4>
          </div>
          <div className="flex items-start gap-3">
            {SavedIcon && (
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
                <SavedIcon size={18} className="text-rose-600 dark:text-rose-400" />
              </div>
            )}
            <div>
              <p className={`text-sm font-bold ${isEnabled ? "text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400"}`}>{savedItem.title || "—"}</p>
              <p className={`text-xs mt-0.5 ${isEnabled ? "text-gray-500 dark:text-gray-400" : "text-gray-600 dark:text-gray-500"}`}>{savedItem.description || "No description yet"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit fields */}
      <FieldGroup label="Card Title">
        <input
          value={item.title || ""}
          onChange={(e) => isEnabled && updateLocal(item.id, { title: e.target.value })}
          onBlur={() => isEnabled && quickSave(item)}
          disabled={!isEnabled}
          className={isEnabled ? inputCls : disabledInputCls}
          placeholder="e.g. Our Mission"
        />
      </FieldGroup>

      <FieldGroup label="Description">
        <textarea
          value={item.description || ""}
          onChange={(e) => isEnabled && updateLocal(item.id, { description: e.target.value })}
          onBlur={() => isEnabled && quickSave(item)}
          disabled={!isEnabled}
          className={`${isEnabled ? inputCls : disabledInputCls} min-h-[120px] resize-y`}
          placeholder="e.g. We focus on speech, cognitive, and behavioral development…"
        />
      </FieldGroup>

      <FieldGroup label="Icon">
        <div className="relative">
          <button
            onClick={() => isEnabled && setIconDropdown(!iconDropdown)}
            disabled={!isEnabled}
            className={`w-full flex items-center gap-2 border rounded-xl px-3.5 py-2.5 text-sm text-left transition ${
              isEnabled
                ? "border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-rose-400"
                : "border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/20 cursor-not-allowed"
            }`}
          >
            {SelectedIcon ? <SelectedIcon size={16} className="text-rose-600" /> : null}
            <span className="flex-1 text-gray-700 dark:text-gray-300">{iconKey || "Pick an icon…"}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          {iconDropdown && isEnabled && (
            <div className="absolute z-50 mt-1 w-full bg-white dark:bg-[#1e2128] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl max-h-48 overflow-y-auto">
              {Object.keys(ICON_LIST).map((name) => {
                const IC = ICON_LIST[name];
                return (
                  <button
                    key={name}
                    onClick={() => { setIconKey(name); setIconDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-sm transition text-left"
                  >
                    <IC size={16} className="text-rose-600" /> {name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </FieldGroup>
    </div>
  );
}

// ── Generic Cards Editor ──
function CardsEditor({ item, savedItem, updateLocal, quickSave, isEnabled = true }) {
  const effectiveItem = applySectionDefaults(item);
  const effectiveSavedItem = savedItem ? applySectionDefaults(savedItem) : effectiveItem;
  const requiresImage = ["services", "gallery", "programs"].includes(item.section);
  const data = Array.isArray(effectiveItem.data)
  ? [...effectiveItem.data].sort((a, b) =>
      String(a?.title || "").localeCompare(
        String(b?.title || ""),
        undefined,
        { sensitivity: "base" }
      )
    )
  : [];
  const [form, setForm] = useState({ title: "", description: "", image: "" });
  const [editingIdx, setEditingIdx] = useState(null);

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const newData = [...data];
    if (editingIdx !== null) newData[editingIdx] = form;
    else newData.push(form);
    updateLocal(item.id, { data: newData });
    quickSave({ ...item, data: newData });
    setForm({ title: "", description: "", image: "" });
    setEditingIdx(null);
  };

  const handleDelete = (idx) => {
    if(!window.confirm("Delete this card?")) return;
    const newData = data.filter((_, i) => i !== idx);
    updateLocal(item.id, { data: newData });
    quickSave({ ...item, data: newData });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldGroup label="Section Title">
          <input 
            value={effectiveItem.title || ""} 
            onChange={(e) => isEnabled && updateLocal(item.id,{title:e.target.value})} 
            onBlur={() => isEnabled && quickSave(item)} 
            disabled={!isEnabled}
            className={isEnabled ? inputCls : disabledInputCls} 
            placeholder="Section heading" 
          />
        </FieldGroup>
        <FieldGroup label="Section Description">
          <textarea 
            value={effectiveItem.description || ""} 
            onChange={(e) => isEnabled && updateLocal(item.id,{description:e.target.value})} 
            onBlur={() => isEnabled && quickSave(item)}
            disabled={!isEnabled}
            className={`${isEnabled ? inputCls : disabledInputCls} min-h-[42px]`} 
            placeholder="Optional description" 
          />
        </FieldGroup>
      </div>

      <div className="pt-2 border-t border-gray-100 dark:border-white/[0.06] space-y-6">
        {/* Table */}
        <div className={`border rounded-xl overflow-hidden shadow-sm ${isEnabled ? "bg-white dark:bg-white/[0.02] border-gray-200 dark:border-white/[0.06]" : "bg-gray-50 dark:bg-gray-900/20 border-gray-300 dark:border-gray-600"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className={`border-b ${isEnabled ? "bg-gray-50 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.06]" : "bg-gray-100 dark:bg-gray-800/40 border-gray-300 dark:border-gray-600"}`}>
                <tr>
                  <th className={`px-4 py-3 font-semibold w-16 ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Image</th>
                  <th className={`px-4 py-3 font-semibold ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Title</th>
                  <th className={`px-4 py-3 font-semibold ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Description</th>
                  <th className={`px-4 py-3 font-semibold w-32 ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isEnabled ? "divide-gray-100 dark:divide-white/[0.06]" : "divide-gray-200 dark:divide-gray-700"}`}>
                {data.map((d, i) => (
                  <tr key={i} className={isEnabled ? "hover:bg-gray-50 dark:hover:bg-white/[0.02] transition" : ""}>
                    <td className="px-4 py-3">
                      {(d.image || d.src) ? <img src={d.image||d.src} alt="" className="w-10 h-10 object-cover rounded-md border border-gray-200 dark:border-white/10" onError={(e)=>e.target.style.display="none"}/> : <span className={`text-xs ${isEnabled ? "text-gray-400" : "text-gray-500"}`}>None</span>}
                    </td>
                    <td className={`px-4 py-3 font-medium ${isEnabled ? "text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400"}`}>{d.title}</td>
                    <td className={`px-4 py-3 truncate max-w-[200px] ${isEnabled ? "text-gray-500" : "text-gray-600"}`}>{d.description}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { if(isEnabled) { setForm({ title: d.title||"", description: d.description||"", image: d.image||d.src||"" }); setEditingIdx(i); } }} 
                          disabled={!isEnabled}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${isEnabled ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white hover:shadow-md" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"}`}>
                          Edit
                        </button>
                        <button 
                          onClick={() => { if(isEnabled) handleDelete(i); }} 
                          disabled={!isEnabled}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${isEnabled ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white hover:shadow-md" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"}`}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-400 text-sm">No cards added yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form */}
        {isEnabled && (
          <div className="bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-500 mb-4">{editingIdx !== null ? "Edit Card" : "Add Card"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Title</label>
                <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className={inputCls} placeholder="Card title" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Image URL{requiresImage ? " (Required)" : ""}
                </label>
                <input value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} className={inputCls} placeholder="https://..." />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className={`${inputCls} min-h-[80px]`} placeholder="Card description" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                {editingIdx !== null ? "Update" : "Add"}
              </button>
              {editingIdx !== null && (
                <button onClick={() => { setForm({title:"", description:"", image:""}); setEditingIdx(null); }} className="px-6 py-2.5 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all">Cancel</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Simple List Editor (Branches, Programs, Country Codes) ──
function SimpleEditor({ item, savedItem, updateLocal, quickSave, isEnabled = true }) {
  const data = Array.isArray(item.data)
  ? [...item.data].sort((a, b) =>
      String(a?.title || "").localeCompare(
        String(b?.title || ""),
        undefined,
        { sensitivity: "base" }
      )
    )
  : [];
  const [form, setForm] = useState("");
  const [editingIdx, setEditingIdx] = useState(null);

  const isDuplicate = form.trim() && data.some(
    (d, i) => i !== editingIdx && String(d?.title || "").toLowerCase() === form.trim().toLowerCase()
  );

  const handleSubmit = () => {
    if(!isEnabled || !form.trim() || isDuplicate) return;
    const newData = [...data];
    if (editingIdx !== null) newData[editingIdx] = { title: form.trim(), description: "" };
    else newData.push({ title: form.trim(), description: "" });
    updateLocal(item.id, { data: newData });
    quickSave({ ...item, data: newData });
    setForm("");
    setEditingIdx(null);
  };

  const handleDelete = (idx) => {
    if(!isEnabled) return;
    if(!window.confirm("Delete this item?")) return;
    const newData = data.filter((_, i) => i !== idx);
    updateLocal(item.id, { data: newData });
    quickSave({ ...item, data: newData });
  };

  return (
    <div className="space-y-6">
      <div className={`border rounded-xl overflow-hidden shadow-sm ${isEnabled ? "bg-white dark:bg-white/[0.02] border-gray-200 dark:border-white/[0.06]" : "bg-gray-50 dark:bg-gray-900/20 border-gray-300 dark:border-gray-600"}`}>
        <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isEnabled ? "bg-gray-50 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.06]" : "bg-gray-100 dark:bg-gray-800/40 border-gray-300 dark:border-gray-600"}`}>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {data.length} {data.length === 1 ? "item" : "items"}{!isEnabled && data.length > 0 ? " · default preview" : ""}
          </span>
        </div>
        <table className="w-full text-sm text-left">
          <thead className={`border-b ${isEnabled ? "bg-gray-50 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.06]" : "bg-gray-100 dark:bg-gray-800/40 border-gray-300 dark:border-gray-600"}`}>
            <tr>
              <th className={`px-4 py-3 font-semibold ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Name</th>
              <th className={`px-4 py-3 font-semibold w-32 ${isEnabled ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.06]">
            {data.map((d, i) => (
              <tr key={i} className={`transition ${editingIdx === i ? "bg-blue-50/60 dark:bg-blue-500/[0.06]" : ""} ${isEnabled ? "hover:bg-gray-50 dark:hover:bg-white/[0.02]" : ""}`}>
                <td className={`px-4 py-3 font-medium ${isEnabled ? "text-gray-800 dark:text-gray-200" : "text-gray-500 dark:text-gray-400"}`}>{d.title}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button disabled={!isEnabled} onClick={() => { setForm(d.title||""); setEditingIdx(i); }} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none">Edit</button>
                    <button disabled={!isEnabled} onClick={() => handleDelete(i)} className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan="2" className="px-4 py-8 text-center text-gray-400 text-sm">No items added yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className={`border rounded-xl p-5 shadow-sm ${isEnabled ? "bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.06]" : "bg-gray-100 dark:bg-gray-800/30 border-gray-300 dark:border-gray-600"}`}>
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">{editingIdx !== null ? "Edit Item" : "Add Item"}</h3>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Name / Value</label>
            <input
              value={form}
              onChange={(e) => isEnabled && setForm(e.target.value)}
              onKeyDown={(e) => { if (isEnabled && e.key === "Enter" && form.trim() && !isDuplicate) handleSubmit(); }}
              disabled={!isEnabled}
              className={`${isEnabled ? inputCls : disabledInputCls} ${isEnabled && isDuplicate ? "border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
              placeholder="Enter value..."
            />
            {isEnabled && isDuplicate && <p className="mt-1.5 text-xs text-red-500">This value already exists.</p>}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={handleSubmit} disabled={!isEnabled || !form.trim() || isDuplicate}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
              {editingIdx !== null ? "Update" : "Add"}
            </button>
            {editingIdx !== null && (
              <button disabled={!isEnabled} onClick={() => { setForm(""); setEditingIdx(null); }} className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════
//  CONTENT PREVIEW
// ════════════════════════════════════════════════════
function ContentPreview({ item, type }) {
  // ContentPreview is only ever rendered from inside the `item ? ... : ...`
  // branch in the sections list, so `item` is always truthy here. Disabled
  // sections use SectionEditor (with isEnabled={false}) to show the
  // read-only fields directly, rather than this preview block.
  const previewItem = applySectionDefaults(item);
  const data = Array.isArray(previewItem.data)
  ? [...previewItem.data].sort((a, b) =>
      String(a?.title || "").localeCompare(
        String(b?.title || ""),
        undefined,
        { sensitivity: "base" }
      )
    )
  : [];

  if (type === "stats") {
    return (
      <div className="space-y-3">
        {previewItem.title && <h3 className="text-lg font-bold">{previewItem.title}</h3>}
        {data.length > 0
          ? <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {data.map((s,i) => (
                <div key={i} className="bg-white dark:bg-[#16191f] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-md transition text-center">
                  <p className="text-2xl font-black text-orange-500">{s.description||"—"}</p>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide mt-1">{s.title||"—"}</p>
                </div>
              ))}
            </div>
          : <p className="text-sm text-gray-400">No stats configured yet.</p>
        }
      </div>
    );
  }

  if (type === "services") {
    return (
      <div className="space-y-3">
        {previewItem.title && <h3 className="text-lg font-bold">{previewItem.title}</h3>}
        {data.length > 0
          ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((c,i) => {
                const IC = ICON_LIST[c.image] || Briefcase;
                return (
                  <div key={i} className="bg-white dark:bg-[#16191f] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-md transition">
                    <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center mb-3">
                      <IC size={20} className="text-violet-600"/>
                    </div>
                    <h4 className="font-bold text-sm mb-1">{c.title||"—"}</h4>
                    <p className="text-xs text-gray-500 max-h-8 overflow-y-auto pr-1">{c.description||"—"}</p>
                  </div>
                );
              })}
            </div>
          : <p className="text-sm text-gray-400">No services configured yet.</p>
        }
      </div>
    );
  }

  if (type === "mission-vision") {
    const palette = [
      { bg: "bg-rose-100 dark:bg-rose-500/20",  text: "text-rose-600" },
      { bg: "bg-amber-100 dark:bg-amber-500/20", text: "text-amber-600" },
      { bg: "bg-blue-100 dark:bg-blue-500/20",   text: "text-blue-600" },
      { bg: "bg-emerald-100 dark:bg-emerald-500/20", text: "text-emerald-600" },
    ];
    return (
      <div className="space-y-3">
        {previewItem.title && <h3 className="text-lg font-bold">{previewItem.title}</h3>}
        {data.length > 0
          ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.map((c,i) => {
                const IC = ICON_LIST[c.icon] || Target;
                const clr = palette[i % palette.length];
                return (
                  <div key={i} className="bg-white dark:bg-[#16191f] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-md transition">
                    <div className={`w-11 h-11 rounded-xl ${clr.bg} flex items-center justify-center mb-3`}>
                      <IC size={20} className={clr.text}/>
                    </div>
                    <h4 className="font-bold text-base mb-1.5">{c.title||"—"}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed max-h-11 overflow-y-auto pr-1">{c.description||"—"}</p>
                  </div>
                );
              })}
            </div>
          : <p className="text-sm text-gray-400">No cards configured yet — add "Our Mission" and "Our Vision".</p>
        }
      </div>
    );
  }

  if (type === "simple") {
    return (
      <div className="space-y-3">
        {data.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2">
              {data.map((d, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/[0.08]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500" />
                  {d.title || "—"}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">
              {data.length} {data.length === 1 ? "item" : "items"}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-400">No items added yet.</p>
        )}
      </div>
    );
  }

  if (type === "single-card") {
    // Icon on top, text below — same vertical "image/icon-first" layout as
    // every other card preview, using the exact Appointment Leads card format.
    const iconKey = Array.isArray(previewItem.data) && previewItem.data[0]?.icon ? previewItem.data[0].icon : "";
    const IC = ICON_LIST[iconKey] || Target;
    return (
      <div className="bg-white dark:bg-[#16191f] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-md transition">
        <div className="w-11 h-11 rounded-xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center mb-3">
          <IC size={20} className="text-rose-600 dark:text-rose-400" />
        </div>
        <h4 className="font-bold text-base mb-1.5">{previewItem.title || "—"}</h4>
        <p className="text-sm text-gray-500 leading-relaxed max-h-11 overflow-y-auto pr-1">{previewItem.description || "No description yet."}</p>
      </div>
    );
  }

  if (type === "hero") {
    const heroData = Array.isArray(previewItem.data) ? previewItem.data : [];
    const isContactHero = previewItem.section === "contact-hero";
    const defaults = isContactHero ? CONTACT_HERO_DEFAULTS : HOME_HERO_DEFAULTS;
    const defaultData = defaults.data;
    const getDefaultExtra = (key) => defaultData.find((d) => d?.title === key)?.description || "";
    const badge = heroData.find((d) => d?.title === "badge")?.description || getDefaultExtra("badge");
    const highlight = heroData.find((d) => d?.title === "highlight")?.description || getDefaultExtra("highlight");
    const title = previewItem.title || defaults.title || "";
    const description = previewItem.description || defaults.description || "";
    // Resolve relative backend image paths the same way HeroEditor & Contact.jsx do.
    const imgSrc = !isContactHero && previewItem.image
      ? (previewItem.image.startsWith("http") ? previewItem.image : `https://appointment-83q0.onrender.com${previewItem.image}`)
      : null;
    return (
      <div className="space-y-3">
        {imgSrc && <img src={imgSrc} alt="preview" className="w-full max-w-xs h-36 object-cover rounded-xl shadow-sm border border-gray-200 dark:border-white/10"/>}
        {badge && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
            {badge}
          </span>
        )}
        <h3 className="text-lg font-bold">
          {title || "—"}
          {highlight && <span className="text-orange-500"> {highlight}</span>}
        </h3>
        {description && <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-h-11 overflow-y-auto pr-1">{description}</p>}
        {!badge && !title && !highlight && !description && !imgSrc && (
          <p className="text-sm text-gray-400">No hero content configured yet.</p>
        )}
      </div>
    );
  }

  // Default (cards)
  return (
    <div className="relative isolate w-full min-w-0 overflow-hidden bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] p-3 sm:p-5 max-[320px]:p-2 rounded-xl space-y-3">
      {previewItem.title       && <h3 className="text-lg font-bold">{previewItem.title}</h3>}
      {previewItem.description && <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-h-11 overflow-y-auto pr-1">{previewItem.description}</p>}
      {previewItem.image       && <img src={previewItem.image} alt="preview" className="w-full max-w-xs h-36 object-cover rounded-xl shadow-sm border border-gray-200 dark:border-white/10"/>}
      {data.length > 0  && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 border-t border-gray-100 dark:border-white/10">
          {data.map((c,i) => (
            <div key={i} className="bg-white dark:bg-[#16191f] rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-md transition overflow-hidden">
              {c.image && (
                <div className="h-28 w-full overflow-hidden">
                  <img src={c.image} alt="" className="w-full h-full object-cover" onError={(e)=>e.target.parentElement.style.display="none"}/>
                </div>
              )}
              <div className="p-4">
                <h4 className="font-semibold text-sm">{c.title||"—"}</h4>
                <p className="text-xs text-gray-500 mt-1 max-h-8 overflow-y-auto pr-1">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════
//  SMALL SHARED COMPONENTS
// ════════════════════════════════════════════════════
const inputCls = "w-full border border-gray-200 dark:border-white/[0.06] rounded-xl px-3.5 py-2.5 bg-white dark:bg-white/[0.02] text-gray-900 dark:text-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600";

const disabledInputCls = "w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 text-sm cursor-not-allowed pointer-events-none placeholder:text-gray-400 dark:placeholder:text-gray-600";

function FieldGroup({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function EmptyCards({ label }) {
  return (
    <div className="border-2 border-dashed border-gray-200 dark:border-white/[0.06] rounded-xl p-8 text-center text-sm text-gray-400" dangerouslySetInnerHTML={{__html: label}}/>
  );
}

function EmptyState({ label }) {
  return <div className="py-14 text-center text-sm text-gray-400">{label}</div>;
}

function SectionHeader({ title, count }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{count} total records</p>
      </div>
    </div>
  );
}

function NavBtn({ icon, label, val, active, setActive, setMobileOpen, count }) {
  const isActive = active === val;
  return (
    <button
      onClick={() => { setActive(val); setMobileOpen(false); }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-600/20"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {count > 0 && (
        <span className={`text-[10px] min-w-[18px] text-center px-1.5 py-0.5 rounded-full font-bold ${
          isActive ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-500"
        }`}>{count}</span>
      )}
    </button>
  );
}

function StatCard({ icon, label, value, color }) {
  const c = {
    blue:    { bg:"bg-blue-50 dark:bg-blue-500/10",    text:"text-blue-600 dark:text-blue-400",    border:"border-l-blue-500" },
    emerald: { bg:"bg-emerald-50 dark:bg-emerald-500/10", text:"text-emerald-600 dark:text-emerald-400", border:"border-l-emerald-500" },
    violet:  { bg:"bg-violet-50 dark:bg-violet-500/10",  text:"text-violet-600 dark:text-violet-400",  border:"border-l-violet-500" },
  }[color] || { bg:"bg-blue-50", text:"text-blue-600", border:"border-l-blue-500" };

  return (
    <div className={`bg-white dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.06] border-l-4 ${c.border} p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center ${c.text} group-hover:scale-105 transition-transform`}>{icon}</div>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{value}</h2>
        </div>
      </div>
    </div>
  );
}

function RecentCard({ title, onViewAll, children }) {
  return (
    <div className="bg-white dark:bg-[#16191f] rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.06] flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <button onClick={onViewAll} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">View All →</button>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-white/[0.04]">{children}</div>
    </div>
  );
}

export default AdminDashboard;