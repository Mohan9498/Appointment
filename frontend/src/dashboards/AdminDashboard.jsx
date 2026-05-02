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

// ── ICON REGISTRY for Services picker ──
const ICON_LIST = {
  Activity, Award, Baby, BookOpen, Brain, Calculator, ClipboardList,
  Ear, Eye, GraduationCap, HandHeart, HeartPulse, HelpingHand, Library,
  Lightbulb, Mic, Notebook, PenTool, Puzzle, School, ShieldCheck, Smile,
  Sparkles, Star, Stethoscope, Target, Timer, UserCheck, Users,
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
    { section: "about-main",  label: "About Content",      type: "text",     description: "Main description text" },
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
  home: <Home size={16} />,
  about: <Info size={16} />,
  programs: <BookOpen size={16} />,
  settings: <Settings size={16} />,
};

const SECTION_TYPE_META = {
  hero:     { color: "blue",   label: "Hero",     icon: <ImageIcon size={12}/> },
  stats:    { color: "amber",  label: "Stats",    icon: <BarChart2 size={12}/> },
  services: { color: "violet", label: "Services", icon: <Briefcase size={12}/> },
  features: { color: "fuchsia",label: "Features", icon: <Star size={12}/> },
  cards:    { color: "emerald",label: "Cards",    icon: <ClipboardList size={12}/> },
  simple:   { color: "gray",   label: "List",     icon: <Type size={12}/> },
  text:     { color: "slate",  label: "Text",     icon: <Type size={12}/> },
};

// ── DEFAULT STAT TEMPLATES ──
const HERO_STAT_DEFAULTS = [
  { title: "Children Helped", description: "700+" },
  { title: "Branches", description: "35+" },
  { title: "Parent Satisfaction", description: "98%" }
];

const ABOUT_STAT_DEFAULTS = [
  { title: "Success Rate",        description: "" },
  { title: "Parent Satisfaction", description: "" },
  { title: "Improvement Rate",    description: "" },
  { title: "Early Detection",     description: "" },
  { title: "Phone No One",        description: "" },
  { title: "Phone No Two",        description: "" },
];

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

  const toggleEdit = (k) =>
    setEditModeIds((prev) => prev.includes(k) ? prev.filter(i=>i!==k) : [...prev, k]);

  const updateLocal = (id, updates) =>
    setContent((prev) => prev.map((c) => c.id === id ? { ...c, ...updates } : c));

  const autoCreate = async (page, section) => {
    if (content.find((c) => c.page === page && c.section === section)) return;
    try {
      let initialData = [];
      if (section === "hero-stats")  initialData = HERO_STAT_DEFAULTS;
      if (section === "about-stats") initialData = ABOUT_STAT_DEFAULTS;
      
      if (section === "branches") {
        initialData = ["WestMambalam", "Choolaimedu", "Anna Nagar", "Adambakkam", "Egmore", "Tambaram", "Porur", "Thiruvanmiyur", "Mylapore", "K.K. Nagar"].map(t => ({ title: t, description: "" }));
      }
      if (section === "program-options") {
        initialData = ["Speech Therapy", "Cognitive Therapy", "Day Care"].map(t => ({ title: t, description: "" }));
      }
      if (section === "country-codes") {
        initialData = ["+91", "+1", "+44", "+61", "+971", "+81", "+49", "+33", "+39", "+34", "+86", "+7", "+55", "+27", "+65", "+82", "+966", "+93", "+213"].map(t => ({ title: t, description: "" }));
      }

      await API.post("content/", {
        page: page.toLowerCase(), section: section.toLowerCase(),
        title: "", description: "", data: initialData, order: content.length + 1,
      });
      await fetchContent();
      toast.success("Section enabled");
      setEditModeIds((prev) => [...prev, section]);
    } catch (err) {
      toast.error(err.response?.data?.section?.[0] ?? "Failed to create section");
    }
  };

  const saveContent = async (item) => {
    try {
      setSaving(item.id, true);
      await API.patch(`content/${item.id}/`, {
        page: item.page, section: item.section,
        title: item.title || "", description: item.description || "",
        data: Array.isArray(item.data) ? item.data : [],
        order: item.order || 0,
      });
      await fetchContent();
      toast.success("Section saved!");
      setEditModeIds((prev) => prev.filter((i) => i !== item.section));
    } catch { toast.error("Save failed"); }
    finally { setSaving(item.id, false); }
  };

  const quickSave = async (updatedItem) => {
    try {
      setSaving(updatedItem.id, true);
      await API.patch(`content/${updatedItem.id}/`, {
        page: updatedItem.page, section: updatedItem.section,
        title: updatedItem.title || "", description: updatedItem.description || "",
        data: Array.isArray(updatedItem.data) ? updatedItem.data : [],
        order: updatedItem.order || 0,
      });
      toast.success("Saved dynamically");
    } catch { toast.error("Dynamic save failed"); }
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
                        || ["WestMambalam", "Choolaimedu", "Anna Nagar", "Adambakkam", "Egmore", "Tambaram", "Porur", "Thiruvanmiyur", "Mylapore", "K.K. Nagar"].map(b => ({ value: b, label: b })))
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
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pages Editor</h2>
                <p className="text-sm text-gray-500 mt-1">Edit your website content section by section.</p>
              </div>

              {/* Page Tabs */}
              <div className="bg-white dark:bg-[#16191f] rounded-2xl p-4 border border-gray-100 dark:border-white/[0.06] shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Select Page</p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(PAGE_SECTIONS).map((page) => (
                    <button key={page}
                      onClick={() => setPagesTab(page)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all duration-200 ${
                        pagesTab === page
                          ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-transparent shadow-md shadow-blue-600/20"
                          : "bg-gray-50 dark:bg-white/[0.02] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/[0.06] hover:border-blue-300 dark:hover:border-blue-700"
                      }`}
                    >
                      {PAGE_ICONS[page]}
                      {page}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sections */}
              {PAGE_SECTIONS[pagesTab]?.map((def) => {
                const item    = content.find((c) => c.page === pagesTab && c.section === def.section) || null;
                const isEdit  = editModeIds.includes(def.section);
                const meta    = SECTION_TYPE_META[def.type] || SECTION_TYPE_META.cards;

                return (
                  <div key={def.section} className="bg-white dark:bg-[#16191f] rounded-2xl border border-gray-100 dark:border-white/[0.06] shadow-sm overflow-hidden">

                    {/* Section Header */}
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold ${
                          meta.color === "blue"   ? "bg-blue-500"   :
                          meta.color === "amber"  ? "bg-amber-500"  :
                          meta.color === "violet" ? "bg-violet-500" : "bg-emerald-500"
                        }`}>
                          {meta.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 dark:text-white">{def.label}</h3>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                              meta.color === "blue"   ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"   :
                              meta.color === "amber"  ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"  :
                              meta.color === "violet" ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400" :
                                                       "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                            }`}>{meta.label}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{def.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {item && (
                          <div className="flex bg-gray-100 dark:bg-white/[0.05] p-1 rounded-xl">
                            {["Preview","Edit"].map((label, i) => (
                              <button key={label} onClick={() => toggleEdit(def.section)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  (i===0 ? !isEdit : isEdit)
                                    ? "bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-white"
                                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                }`}>{label}</button>
                            ))}
                          </div>
                        )}
                        {item ? (
                          <>
                            <button onClick={() => deleteSection(item.id)} className="px-3 py-2 rounded-xl text-xs font-medium bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 transition">
                              Delete
                            </button>
                            <button onClick={() => saveContent(item)} disabled={savingIds.includes(item.id)}
                              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-60">
                              <Save size={13}/> {savingIds.includes(item.id) ? "Saving…" : "Save"}
                            </button>
                          </>
                        ) : (
                          <button onClick={() => autoCreate(pagesTab, def.section)}
                            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm">
                            <Plus size={13}/> Enable Section
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Section Body */}
                    <div className="p-6">
                      {!isEdit && <ContentPreview item={item} type={def.type} />}

                      {isEdit && item && (
                        <SectionEditor
                          item={item} type={def.type}
                          updateLocal={updateLocal} uploadImage={uploadImage}
                          quickSave={quickSave} savingIds={savingIds}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
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
function SectionEditor({ item, type, updateLocal, uploadImage, quickSave, savingIds }) {
  switch (type) {
    case "hero":     return <HeroEditor     item={item} updateLocal={updateLocal} uploadImage={uploadImage} savingIds={savingIds}/>;
    case "text":     return <TextEditor     item={item} updateLocal={updateLocal} quickSave={quickSave} />;
    case "stats":    return <StatsEditor    item={item} updateLocal={updateLocal} quickSave={quickSave} />;
    case "features": return <FeaturesEditor item={item} updateLocal={updateLocal} quickSave={quickSave} />;
    case "simple":   return <SimpleEditor   item={item} updateLocal={updateLocal} quickSave={quickSave} />;
    default:         return <CardsEditor    item={item} updateLocal={updateLocal} quickSave={quickSave} />;
  }
}

// ── Hero Editor ──
function HeroEditor({ item, updateLocal, uploadImage, savingIds }) {
  return (
    <div className="space-y-5">
      <FieldGroup label="Title">
        <input value={item.title||""} onChange={(e) => updateLocal(item.id,{title:e.target.value})}
          className={inputCls} placeholder="Hero heading text" />
      </FieldGroup>
      <FieldGroup label="Description / Subtitle">
        <textarea value={item.description||""} onChange={(e) => updateLocal(item.id,{description:e.target.value})}
          className={`${inputCls} min-h-[100px] resize-y`} placeholder="Subtitle or description" />
      </FieldGroup>
      <FieldGroup label="Section Image">
        {item.image
          ? <img src={item.image.startsWith("http") ? item.image : `https://appointment-83q0.onrender.com${item.image}`}
              alt="hero" className="w-full max-w-sm h-40 object-cover rounded-xl border border-gray-200 dark:border-white/10 mb-3"/>
          : <div className="w-full max-w-xs h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center text-gray-400 mb-3 gap-1">
              <ImageIcon size={22}/><span className="text-xs">No image yet</span>
            </div>
        }
        <input type="file" accept="image/*" onChange={(e) => uploadImage(item.id, e.target.files?.[0])} className="text-sm text-gray-500" />
      </FieldGroup>
    </div>
  );
}

// ── Text Editor ──
function TextEditor({ item, updateLocal, quickSave }) {
  return (
    <div className="space-y-5">
      <FieldGroup label="Section Title (Optional)">
        <input value={item.title||""} onChange={(e) => updateLocal(item.id,{title:e.target.value})} onBlur={() => quickSave(item)}
          className={inputCls} placeholder="Heading text" />
      </FieldGroup>
      <FieldGroup label="Description Text">
        <textarea value={item.description||""} onChange={(e) => updateLocal(item.id,{description:e.target.value})} onBlur={() => quickSave(item)}
          className={`${inputCls} min-h-[200px] resize-y`} placeholder="Main content text" />
      </FieldGroup>
    </div>
  );
}

// ── Stats Editor (like TTTC Home/About stats) ──
function StatsEditor({ item, updateLocal, quickSave }) {
  const data = Array.isArray(item.data)
  ? [...item.data].sort((a, b) =>
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
      <div className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-white/[0.04] border-b border-gray-200 dark:border-white/[0.06]">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Label</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Value</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.06]">
              {data.map((d, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{d.title}</td>
                  <td className="px-4 py-3 text-orange-500 font-bold">{d.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setForm(d); setEditingIdx(i); }} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all">Edit</button>
                      <button onClick={() => handleDelete(i)} className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all">Delete</button>
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
    </div>
  );
}

// ── Features Editor (Icon + Image background) ──
function FeaturesEditor({ item, updateLocal, quickSave }) {
  const data = Array.isArray(item.data)
  ? [...item.data].sort((a, b) =>
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
      <div className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-white/[0.04] border-b border-gray-200 dark:border-white/[0.06]">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 w-16 text-center">Icon</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 w-16 text-center">Bg Image</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Title</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.06]">
              {data.map((d, i) => {
                const IC = ICON_LIST[d.icon] || Briefcase;
                return (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                    <td className="px-4 py-3 text-center"><IC size={18} className="text-fuchsia-600 inline-block"/></td>
                    <td className="px-4 py-3">
                      {(d.image || d.src) ? <img src={d.image||d.src} alt="" className="w-8 h-8 object-cover rounded-md" /> : <span className="text-xs text-gray-400">None</span>}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{d.title}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setForm({title: d.title||"", description: d.description||"", icon: d.icon||"", image: d.image||""}); setEditingIdx(i); }} className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all">Edit</button>
                        <button onClick={() => handleDelete(i)} className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all">Delete</button>
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
      <div className="bg-fuchsia-50/50 dark:bg-fuchsia-500/5 border border-fuchsia-100 dark:border-fuchsia-500/10 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-fuchsia-800 dark:text-fuchsia-500 mb-4">{editingIdx !== null ? "Edit Feature" : "Add Feature"}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Title</label>
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className={inputCls} placeholder="Feature Name" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Background Image URL</label>
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
    </div>
  );
}

// ── Generic Cards Editor ──
function CardsEditor({ item, updateLocal, quickSave }) {
  const data = Array.isArray(item.data)
  ? [...item.data].sort((a, b) =>
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
          <input value={item.title||""} onChange={(e) => updateLocal(item.id,{title:e.target.value})} onBlur={() => quickSave(item)} className={inputCls} placeholder="Section heading" />
        </FieldGroup>
        <FieldGroup label="Section Description">
          <textarea value={item.description||""} onChange={(e) => updateLocal(item.id,{description:e.target.value})} onBlur={() => quickSave(item)}
            className={`${inputCls} min-h-[42px]`} placeholder="Optional description" />
        </FieldGroup>
      </div>

      <div className="pt-2 border-t border-gray-100 dark:border-white/[0.06] space-y-6">
        {/* Table */}
        <div className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-white/[0.04] border-b border-gray-200 dark:border-white/[0.06]">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 w-16">Image</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Title</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Description</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                {data.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                    <td className="px-4 py-3">
                      {(d.image || d.src) ? <img src={d.image||d.src} alt="" className="w-10 h-10 object-cover rounded-md border border-gray-200 dark:border-white/10" onError={(e)=>e.target.style.display="none"}/> : <span className="text-xs text-gray-400">None</span>}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{d.title}</td>
                    <td className="px-4 py-3 text-gray-500 truncate max-w-[200px]">{d.description}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setForm({ title: d.title||"", description: d.description||"", image: d.image||d.src||"" }); setEditingIdx(i); }} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all">Edit</button>
                        <button onClick={() => handleDelete(i)} className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all">Delete</button>
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
        <div className="bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-500 mb-4">{editingIdx !== null ? "Edit Card" : "Add Card"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Title</label>
              <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className={inputCls} placeholder="Card title" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Image URL</label>
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
      </div>
    </div>
  );
}

// ── Simple List Editor (Branches, Programs, Country Codes) ──
function SimpleEditor({ item, updateLocal, quickSave }) {
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

  const handleSubmit = () => {
    if(!form.trim()) return;
    const newData = [...data];
    if (editingIdx !== null) newData[editingIdx] = { title: form, description: "" };
    else newData.push({ title: form, description: "" });
    updateLocal(item.id, { data: newData });
    quickSave({ ...item, data: newData });
    setForm("");
    setEditingIdx(null);
  };

  const handleDelete = (idx) => {
    if(!window.confirm("Delete this item?")) return;
    const newData = data.filter((_, i) => i !== idx);
    updateLocal(item.id, { data: newData });
    quickSave({ ...item, data: newData });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-white/[0.04] border-b border-gray-200 dark:border-white/[0.06]">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Name</th>
              <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.06]">
            {data.map((d, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{d.title}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setForm(d.title||""); setEditingIdx(i); }} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all">Edit</button>
                    <button onClick={() => handleDelete(i)} className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan="2" className="px-4 py-8 text-center text-gray-400 text-sm">No items added yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">{editingIdx !== null ? "Edit Item" : "Add Item"}</h3>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Name / Value</label>
            <input value={form} onChange={(e) => setForm(e.target.value)} className={inputCls} placeholder="Enter value..." />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={handleSubmit} className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all">
              {editingIdx !== null ? "Update" : "Add"}
            </button>
            {editingIdx !== null && (
              <button onClick={() => { setForm(""); setEditingIdx(null); }} className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all">Cancel</button>
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
  if (!item) return (
    <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/[0.06] rounded-xl text-center">
      <FileText size={28} className="text-gray-300 dark:text-gray-600 mb-3"/>
      <p className="text-sm font-medium text-gray-500">Section not enabled yet</p>
      <p className="text-xs text-gray-400 mt-1">Click "Enable Section" to activate it</p>
    </div>
  );

  const data = Array.isArray(item.data)
  ? [...item.data].sort((a, b) =>
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
        {item.title && <h3 className="text-lg font-bold">{item.title}</h3>}
        {data.length > 0
          ? <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {data.map((s,i) => (
                <div key={i} className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 rounded-xl p-4 text-center shadow-sm">
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
        {item.title && <h3 className="text-lg font-bold">{item.title}</h3>}
        {data.length > 0
          ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((c,i) => {
                const IC = ICON_LIST[c.image] || Briefcase;
                return (
                  <div key={i} className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl p-5 shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center mb-3">
                      <IC size={20} className="text-violet-600"/>
                    </div>
                    <h4 className="font-bold text-sm mb-1">{c.title||"—"}</h4>
                    <p className="text-xs text-gray-500">{c.description||"—"}</p>
                  </div>
                );
              })}
            </div>
          : <p className="text-sm text-gray-400">No services configured yet.</p>
        }
      </div>
    );
  }

  // Default (hero / cards)
  return (
    <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] p-5 rounded-xl space-y-3">
      {item.title       && <h3 className="text-lg font-bold">{item.title}</h3>}
      {item.description && <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>}
      {item.image       && <img src={item.image} alt="preview" className="w-full max-w-xs h-36 object-cover rounded-xl shadow-sm border border-gray-200 dark:border-white/10"/>}
      {data.length > 0  && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 border-t border-gray-100 dark:border-white/10">
          {data.map((c,i) => (
            <div key={i} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm">
              {c.image && <img src={c.image} alt="" className="w-full h-28 object-cover rounded-lg mb-3" onError={(e)=>e.target.style.display="none"}/>}
              <h4 className="font-semibold text-sm">{c.title||"—"}</h4>
              <p className="text-xs text-gray-500 mt-1">{c.description}</p>
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