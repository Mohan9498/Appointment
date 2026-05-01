import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import ModernFileUpload from "../components/ui/ModernFileUpload";
import toast from "react-hot-toast";
import {
  Users,
  Calendar,
  MessageSquare,
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  PenLine,
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
import { Upload } from "lucide-react";


const CMS_PAGES = ["home", "about", "programs"];

// ✅ PRE-DEFINED SECTION MAP — matches exactly what the frontend pages use
const PAGE_SECTIONS = {
  home: [
    { section: "hero", label: "Hero Section", description: "Main heading, subtitle, and hero image on the home page", hasCards: false },
    { section: "services", label: "Services Section", description: "Service cards (Speech Therapy, Cognitive Therapy, Day Care)", hasCards: true },
    { section: "features", label: "Why Choose Us", description: "Feature cards (Expert Therapists, Safe Environment, etc.)", hasCards: true },
    { section: "gallery", label: "Gallery / Activities", description: "Activity images shown in the gallery grid", hasCards: true },
  ],
  about: [
    { section: "about-main", label: "About Content", description: "Main description text on the About page", hasCards: false },
  ],
  programs: [
    { section: "programs", label: "Programs List", description: "Program cards (Speech Therapy, Cognitive Therapy, Day Care)", hasCards: true },
  ],
};

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState([]);

  const [search, setSearch] = useState("");
  const [active, setActive] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const [collapsed] = useState(false);
  const [sort, setSort] = useState("latest");
  const [branchFilter, setBranchFilter] = useState("all");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmsPage, setCmsPage] = useState("home");
  const [savingIds, setSavingIds] = useState([]);
  const [pagesTab, setPagesTab] = useState("home");
  const [previewMode, setPreviewMode] = useState(true);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  const getStatus = (id) => {
    return localStorage.getItem(`status_${id}`) || "new";
  };

  const toggleStatus = (id) => {
    const current = getStatus(id);
    const updated = current === "new" ? "contacted" : "new";
    localStorage.setItem(`status_${id}`, updated);
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        await API.post("logout/", { refresh }).catch(() => {});
      }

      toast.success("Logged out successfully");
    } catch (err) {
      console.log("Logout error:", err.response?.data || err.message);
      toast.error("Logout failed (fallback clearing session)");
    } finally {
      localStorage.clear();
      logout();
      navigate("/login", { replace: true });
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await API.get("appointments/");

      let data = res.data;
      console.log("APPOINTMENTS RAW:", data);

      if (Array.isArray(data)) {
        setAppointments(data);
      } else if (data?.results) {
        setAppointments(data.results);
      } else if (data?.data) {
        setAppointments(data.data);
      } else {
        setAppointments([]);
      }

    } catch (err) {
      console.log("APPOINTMENTS ERROR:", err.response?.data || err.message);
      setAppointments([]);
      toast.error("Failed to load appointments");
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await API.get("contact/");

      let data = res.data;
      console.log("CONTACT RAW:", data);

      if (Array.isArray(data)) {
        setMessages(data);
      } else if (data?.results) {
        setMessages(data.results);
      } else if (data?.data) {
        setMessages(data.data);
      } else {
        setMessages([]);
      }

    } catch (err) {
      console.log("CONTACT ERROR:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      setMessages([]);
      toast.error("Failed to load messages");
    }
  };

  const fetchContent = async (page = null) => {
   try {
      const url = page ? `content/?page=${page}` : "content/";
      const res = await API.get(url);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      setContent(data);
    } catch (err) {
      console.log("CMS ERROR:", err.response?.data || err.message);
      setContent([]);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);

      await Promise.all([
        fetchAppointments(),
        fetchMessages(),
        fetchContent(),
      ]);

      setLoading(false);
    };

    loadAll();
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const setSaving = (id, value) => {
    setSavingIds((prev) => {
      if (value) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((item) => item !== id);
    });
  };

  const createContent = async () => {
    const exists = content.find(
      (c) => c.page === cmsPage && c.section === "new-section"
    );
    
    if (exists) {
      toast.error("Section already exists");
      return;
    }

    try {
      await API.post("content/", {
        page: cmsPage,
        section: "new-section",
        title: "New Section",
        description: "",
        data: [],
      });

      await fetchContent(cmsPage);;
      toast.success("Section added");
    } catch (err) {
      toast.error("Create failed");
    }
  };

  // ✅ AUTO-CREATE a section if it doesn't exist yet
  const autoCreateSection = async (page, section) => {
    // Check if already exists
    const exists = content.find((c) => c.page === page && c.section === section);
    if (exists) return;

    try {
      await API.post("content/", {
        page,
        section,
        title: "",
        description: "",
        data: [],
      });
      await fetchContent(cmsPage);;
      toast.success(`"${section}" section created`);
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Failed to create section");
    }
  };

  const updateLocalContent = (id, updates) => {
    setContent((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const saveContent = async (item) => {
    try {
      setSaving(item.id, true);
      await API.patch(`content/${item.id}/`, {
        page: item.page,
        section: item.section,
        title: item.title || "",
        description: item.description || "",
        data: Array.isArray(item.data) ? item.data : [],
      });
      await fetchContent(cmsPage);;
      toast.success("Section saved");
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Save failed");
    } finally {
      setSaving(item.id, false);
    }
  };

  const deleteContent = async (id) => {
    if (!window.confirm("Delete this section?")) return;

    try {
      await API.delete(`content/${id}/`);
      setContent((prev) => prev.filter((item) => item.id !== id));
      toast.success("Section deleted");
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Delete failed");
    }
  };

  const uploadImage = async (id, file) => {
    if (!file) return;

    // Find the existing item to keep its other fields
    const item = content.find((c) => c.id === id);
    const formData = new FormData();
    formData.append('image', file);

    // Append all other fields (except image) to the form data
    if (item) {
      Object.entries(item).forEach(([key, value]) => {
        if (key !== 'image') {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
        }
      });
    }

    try {
      setSaving(id, true);
      await API.patch(`content/${id}/`, formData);
      // Update local state directly without wiping other fields
      const updatedItem = { ...item, image: file };
      setContent((prev) => prev.map((c) => (c.id === id ? updatedItem : c)));
      toast.success('Image uploaded');
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error('Image upload failed');
    } finally {
      setSaving(id, false);
    }
  };

  const addCard = (id) => {
    const item = content.find((entry) => entry.id === id);
    if (!item) return;

    const updatedData = [
      ...(Array.isArray(item.data) ? item.data : []),
      { title: "", description: "" },
    ];

    updateLocalContent(id, { data: updatedData });
  };

  const updateCard = (id, index, key, value) => {
    const item = content.find((entry) => entry.id === id);
    if (!item) return;

    const updatedData = [...(Array.isArray(item.data) ? item.data : [])];
    updatedData[index] = {
      ...(updatedData[index] || {}),
      [key]: value,
    };

    updateLocalContent(id, { data: updatedData });
  };

  const removeCard = (id, index) => {
    const item = content.find((entry) => entry.id === id);
    if (!item) return;

    const updatedData = (Array.isArray(item.data) ? item.data : []).filter(
      (_, i) => i !== index
    );

    updateLocalContent(id, { data: updatedData });
  };

  const filteredAppointments = appointments
    .filter((a) =>
      `${a.parent_name} ${a.child_name} ${a.phone}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((a) => (branchFilter === "all" ? true : a.branch === branchFilter))
    .sort((a, b) => {
      if (sort === "latest") {
        return new Date(b.created_at || b.date) - new Date(a.created_at || a.date);
      }
      return new Date(a.created_at || a.date) - new Date(b.created_at || b.date);
    });

  const filteredMessages = Array.isArray(messages)
    ? messages.filter((m) =>
        `${m.name} ${m.email} ${m.message}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : [];

  const filteredContent = useMemo(() => {
    return content.filter((item) => (item.page || "home") === cmsPage);
  }, [content, cmsPage]);

  const COLORS = ["#3B82F6", "#22C55E"];

  const getCombinedMonthlyData = () => {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: d.toLocaleString("default", { month: "short" }),
        month: d.getMonth(),
        year: d.getFullYear(),
        appointments: 0,
        messages: 0,
      });
    }

    appointments.forEach((item) => {
      if (!item.created_at) return;
      const date = new Date(item.created_at);
      const match = months.find(
        (m) => m.month === date.getMonth() && m.year === date.getFullYear()
      );
      if (match) match.appointments += 1;
    });

    messages.forEach((item) => {
      if (!item.created_at) return;
      const date = new Date(item.created_at);
      if (isNaN(date)) return;
      const match = months.find(
        (m) => m.month === date.getMonth() && m.year === date.getFullYear()
      );
      if (match) match.messages += 1;
    });

    return months;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted text-foreground">
      {/* ── MOBILE HEADER ── */}
      <div className="md:hidden flex justify-between items-center px-5 py-3.5 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl  border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">A</div>
          <h1 className="font-bold text-foreground tracking-tight">Admin</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg bg-muted transition hover:bg-muted/80 text-sm">{dark ? "☀️" : "🌙"}</button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-muted transition text-foreground">☰</button>
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      <div
        className={`fixed top-0 left-0 h-screen w-[260px] bg-white/70 dark:bg-white/[0.02] backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-300 shadow-lg ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:sticky md:top-0 md:w-[260px] md:shrink-0 flex flex-col overflow-y-auto`}
      >
        <button onClick={() => setMobileOpen(false)} className="md:hidden absolute top-4 right-4 text-lg text-gray-400 hover:text-gray-700 dark:hover:text-white transition">✕</button>

        {/* Logo */}
        <div className="hidden md:flex items-center gap-3 px-6 pt-6 pb-5 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-600/20">A</div>
          <div>
            <h1 className="font-bold text-foreground tracking-tight text-[12px]">Admin Panel</h1>
            
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-3 mb-2">Main Menu</p>
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={active} setActive={setActive} value="dashboard" setMobileOpen={setMobileOpen} />
          <SidebarItem icon={<Calendar size={18} />} label="Appointments" active={active} setActive={setActive} value="appointments" setMobileOpen={setMobileOpen} count={appointments.length} />
          <SidebarItem icon={<MessageSquare size={18} />} label="Messages" active={active} setActive={setActive} value="messages" setMobileOpen={setMobileOpen} count={messages.length} />

          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-3 mt-5 mb-2">Content</p>
          <SidebarItem icon={<PenLine size={18} />} label="Pages" active={active} setActive={setActive} value="pages" setMobileOpen={setMobileOpen} />
          <SidebarItem icon={<FileText size={18} />} label="Advanced CMS" active={active} setActive={setActive} value="content" setMobileOpen={setMobileOpen} />
        </nav>

        {/* Bottom */}
        <div className="px-4 pb-5 space-y-3 border-t border-border pt-4">
          <button onClick={() => setDark(!dark)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted transition">
            <span>{dark ? "☀️" : "🌙"}</span>
            <span>{dark ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button onClick={handleLogout} className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md">
            Logout
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 min-h-screen bg-background">
       <div className="max-w-7xl mx-auto w-full">
        {active === "dashboard" && (
          <div className="p-6 space-y-6">
            {/* Page Header */}
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h2>
              <p className="text-sm text-muted-foreground mt-1">Overview of your management</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <StatCard icon={<Users size={22} />} label="Appointments" value={appointments.length} color="blue" />
              <StatCard icon={<MessageSquare size={22} />} label="Messages" value={messages.length} color="emerald" />
              <StatCard icon={<FileText size={22} />} label="CMS Sections" value={content.length} color="violet" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card-hover rounded-2xl p-6  shadow-sm">
                <h3 className="text-sm font-semibold text-foreground mb-1">Monthly Analytics</h3>
                <p className="text-xs text-gray-400 mb-5">Appointments vs Messages (last 6 months)</p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={getCombinedMonthlyData()}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Bar dataKey="appointments" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="messages" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card-hover rounded-2xl p-6  shadow-sm">
                <h3 className="text-sm font-semibold text-foreground mb-1">Distribution</h3>
                <p className="text-xs text-gray-400 mb-5">Appointments vs Messages ratio</p>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={[{ name: "Appointments", value: appointments.length }, { name: "Messages", value: messages.length }]} dataKey="value" outerRadius={95} innerRadius={55} label strokeWidth={0}>
                      {COLORS.map((color, index) => (<Cell key={index} fill={color} />))}
                    </Pie>
                    <Legend />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Appointments & Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Recent Appointments */}
              <div className="glass-card-hover rounded-2xl  shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Recent Appointments</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Latest 5 bookings</p>
                  </div>
                  <button onClick={() => setActive("appointments")} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">View All →</button>
                </div>
                {appointments.length === 0 ? (
                  <div className="p-10 text-center text-sm text-gray-400 dark:text-gray-500">
                    <Calendar size={28} className="mx-auto mb-2 opacity-40" />
                    No appointments yet
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                    {appointments.slice(0, 5).map((a) => (
                      <div key={a.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold">
                            {(a.parent_name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{a.parent_name}</p>
                            <p className="text-xs text-gray-400">{a.child_name} · {a.branch}</p>
                          </div>
                        </div>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap">
                          {a.created_at ? new Date(a.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : a.date || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Messages */}
              <div className="glass-card-hover rounded-2xl  shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Recent Messages</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Latest 5 contacts</p>
                  </div>
                  <button onClick={() => setActive("messages")} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">View All →</button>
                </div>
                {messages.length === 0 ? (
                  <div className="p-10 text-center text-sm text-gray-400 dark:text-gray-500">
                    <MessageSquare size={28} className="mx-auto mb-2 opacity-40" />
                    No messages yet
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                    {messages.slice(0, 5).map((msg) => (
                      <div key={msg.id} className="px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{msg.name}</p>
                          <span className="text-[11px] text-gray-400 whitespace-nowrap">
                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[300px]">{msg.message}</p>
                        <a href={`mailto:${msg.email}`} className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline mt-0.5 inline-block">{msg.email}</a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {active === "appointments" && (
        <div className="p-6 max-w-7xl mx-auto">
          <Section title="Appointment Leads" data={filteredAppointments}>
            <input
              type="text"
              placeholder="Search appointments..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white text-sm transition-all duration-300"
            />

            <div className="flex flex-wrap gap-3 text-black mb-4">
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] text-gray-900 dark:text-gray-500 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
              >
                <option value="all">All Branches</option>
                <option value="Chennai">Chennai</option>
                <option value="WestMambalam">WestMambalam</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Madurai">Madurai</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] text-gray-900 dark:text-gray-500 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredAppointments.map((item) => (
                <div
                  key={item.id}
                  className="glass-card-hover p-5 rounded-2xl space-y-3 hover:shadow-lg flex flex-col items-start transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex justify-between items-start gap-14 mb-3 w-full">
                    <h3 className="text-lg font-semibold text-blue-600">{item.parent_name}</h3>

                    <p className="text-sm items-end text-black-400 mb-4">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : item.date || "No date"}
                    </p>
                  </div>

                  <p className="text-sm font-medium">{item.child_name}</p>
                  <p className="text-sm text-gray-500 mb-2">Age: {item.age}</p>
                  <p className="text-sm mb-2">{item.phone}</p>

                  <div className="text-sm text-gray-500 mb-3">
                    <p>{item.branch}</p>
                  </div>

                  <div className="text-sm text-gray-500 mb-3">
                    <p>{item.program}</p>
                  </div>

                    <div className="flex flex-row justify-center items-center gap-3 w-full mt-2">
                    <a
                      href={`tel:${item.phone}`}
                      className="flex-auto text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      Call
                    </a>

                    <a
                      href={`https://wa.me/${(item.phone || "").replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-auto text-center bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Section>
          </div>
        )}

        {active === "messages" && (
        <div className="p-6 max-w-7xl mx-auto">
          <Section title="Contact Messages" data={filteredMessages}>
            <input
              type="text"
              placeholder="Search messages..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white text-sm transition-all duration-300"
            />

            <div className="md:hidden space-y-4">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="glass-card-hover p-5 rounded-2xl space-y-3 hover:shadow-lg flex flex-col transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-blue-600 font-semibold">{msg.name}</h3>
                    <p className="text-xs text-gray-500">
                      {msg.created_at ? new Date(msg.created_at).toLocaleDateString("en-IN") : "No date"}
                    </p>
                  </div>

                  <a href={`mailto:${msg.email}`} className="text-sm text-blue-600 underline">
                    {msg.email}
                  </a>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{msg.message}</p>

                  <div className="flex gap-3 mt-3 text-xs">
                    <button
                      onClick={() => navigator.clipboard.writeText(msg.email)}
                      className="text-gray-500 hover:text-black dark:hover:text-white"
                    >
                      Copy
                    </button>

                    <a href={`mailto:${msg.email}`} className="text-green-600 hover:underline">
                      Reply
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/60 dark:bg-white/[0.04] text-sm">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Message</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMessages.map((msg) => (
                    <tr
                      key={msg.id}
                      className="border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition"
                    >
                      <td className="p-3 font-medium text-blue-600">
                        <div className="flex flex-col">
                          {msg.name}
                          <span className="text-xs text-gray-500 mt-1">
                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString("en-IN") : "No date"}
                          </span>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex flex-col">
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-blue-600 hover:underline text-sm font-medium"
                          >
                            {msg.email}
                          </a>

                          <div className="flex gap-3 mt-1 text-xs">
                            <button
                              onClick={() => navigator.clipboard.writeText(msg.email)}
                              className="text-gray-500 hover:text-black dark:hover:text-white"
                            >
                              Copy
                            </button>

                            <a href={`mailto:${msg.email}`} className="text-green-600 hover:underline">
                              Reply
                            </a>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-sm">{msg.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          </div>
        )}

        {/* ===== PAGES EDITOR ===== */}
        {active === "pages" && (
          <div className="p-6 space-y-6">

            {/* Page Tabs */}
            <div className="glass-card-hover rounded-2xl p-6  shadow-sm">
              <h2 className="text-xl font-bold tracking-tight text-foreground mb-1">Edit Page Content</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">Select a page and edit its sections directly. No section keys needed.</p>

              <div className="flex flex-wrap gap-2">
                {Object.keys(PAGE_SECTIONS).map((page) => (
                  <button
                    key={page}
                    onClick={() => setPagesTab(page)}
                    className={`px-5 py-2.5 rounded-xl border text-sm capitalize font-medium transition-all duration-200 ${
                      pagesTab === page
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-sm"
                        : "bg-white dark:bg-white/[0.02] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/[0.06] hover:border-blue-300 dark:hover:border-blue-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>

            {/* Sections for selected page */}
            {PAGE_SECTIONS[pagesTab]?.map((def) => {
              const item = content.find(
                (c) => c.page === pagesTab && c.section === def.section
              ) || null;

              return (
                <div
                  key={def.section}
                  className="glass-card-hover rounded-2xl  shadow-sm overflow-hidden"
                >
                  <div className="flex gap-2">
                      <button
                      onClick={() => setPreviewMode(true)}
                      className={`px-4 py-2 rounded-xl text-sm ${
                          previewMode
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-white/10"

                      }`}
                    >
                        Preview
                    </button>
                    
                    
                    <button
                      onClick={() => setPreviewMode(false)} 
                      className={`px-4 py-2 rounded-xl text-sm ${      !previewMode 
                        ? "bg-blue-600 text-white"   
                        : "bg-gray-100 dark:bg-white/10" 
                      }`}  >    Edit
                    </button>
                  </div>
                  
                  {/* Section Header */}
                  <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-foreground">{def.label}</h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{def.description}</p>
                    </div>

                    {item ? (
                      <button
                        onClick={() => saveContent(item)}
                        disabled={savingIds.includes(item.id)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-glow-blue text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-60"
                      >
                        <Save size={14} />
                        {savingIds.includes(item.id) ? "Saving..." : "Save Changes"}
                      </button>
                    ) : (
                      <button
                        onClick={() => autoCreateSection(pagesTab, def.section)}
                        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                      >
                        <Plus size={14} />
                        Enable Section
                      </button>
                    )}
                  </div>

                  {/* Section Body */}
                  {item ? (
                    <div className="p-6 space-y-6">
                      {/* 🔥 PREVIEW */}
                        {previewMode && item && <ContentPreview item={item} />}
                      {/* EDIT MODE */}
                      {!previewMode && (
                        <>
                          {/* Title */}
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title</label>
                            <input
                              value={item.title || ""}
                              onChange={(e) => updateLocalContent(item.id, { title: e.target.value })}
                              className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl bg-gray-50/50 dark:bg-white/[0.02] text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
                              placeholder="Section title"
                            />
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
                            <textarea
                              value={item.description || ""}
                              onChange={(e) => updateLocalContent(item.id, { description: e.target.value })}
                              className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl min-h-[100px] bg-gray-50/50 dark:bg-white/[0.02] text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
                              placeholder="Section description"
                            />
                          </div>

                          {/* Image Upload */}
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Section Image</label>
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title || "section"}
                                className="w-full max-w-xs h-40 object-cover rounded-xl border border-gray-200 dark:border-white/[0.06] mb-2"
                              />
                            ) : (
                              <div className="w-full max-w-xs h-32 rounded-xl border border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-400 mb-2">
                                <div className="flex flex-col items-center gap-1 text-xs">
                                  <ImageIcon size={20} />
                                  No image
                                </div>
                              </div>
                            )}
                            <input type="file" accept="image/*" onChange={(e) => uploadImage(item.id, e.target.files?.[0])} className="text-sm text-gray-500" />
                          </div>

                          {/* Cards (for sections that support it) */}
                          {def.hasCards && (
                            <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Cards / Items</h4>
                                <button
                                  onClick={() => addCard(item.id)}
                                  className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                >
                                  <Plus size={12} />
                                  Add Card
                                </button>
                              </div>
                          
                              {(item.data || []).length === 0 ? (
                                <div className="border border-dashed border-gray-300 dark:border-white/10 rounded-xl p-6 text-sm text-gray-400 text-center">
                                  No cards added yet. Click "Add Card" to start.
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {(item.data || []).map((card, index) => (
                                    <div
                                      key={`${item.id}-${index}`}
                                      className="border border-gray-200 dark:border-white/[0.06] rounded-xl p-4 bg-gray-50/50 dark:bg-white/[0.02] space-y-3"
                                    >
                                      <div className="flex items-center justify-between">
                                        <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300">Card {index + 1}</h5>
                                        <button
                                          onClick={() => removeCard(item.id, index)}
                                          className="text-red-500 text-xs hover:underline font-medium"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                  
                                      <input
                                        value={card.title || ""}
                                        onChange={(e) => updateCard(item.id, index, "title", e.target.value)}
                                        className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl bg-white dark:bg-white/[0.02] text-gray-900 dark:text-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                        placeholder="Card title"
                                      />

                                      <textarea
                                        value={card.description || ""}
                                        onChange={(e) => updateCard(item.id, index, "description", e.target.value)}
                                        className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl min-h-[80px] bg-white dark:bg-white/[0.02] text-gray-900 dark:text-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                        placeholder="Card description"
                                      />

                                      {/* Image URL for card */}
                                      <div>
                                        <input
                                          value={card.image || card.src || ""}
                                          onChange={(e) => updateCard(item.id, index, "image", e.target.value)}
                                          className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl bg-white dark:bg-white/[0.02] text-gray-900 dark:text-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                          placeholder="Image URL (paste image link here)"
                                        />
                                        {(card.image || card.src) && (
                                          <img
                                            src={card.image || card.src}
                                            alt={card.title || "card"}
                                            className="mt-2 w-24 h-16 object-cover rounded-lg border border-gray-200 dark:border-white/[0.06]"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm text-gray-400 dark:text-gray-500">Click "Enable Section" to start editing this section.</p>
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        )}

        {/* ===== ADVANCED CMS ===== */}
        {active === "content" && (
          <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* <div>
                <h2 className="text-xl font-semibold text-black dark:text-white">Multi-page CMS</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage Home, About, and Programs sections professionally without changing your frontend UI.
                </p>
              </div> */}

              <div className="flex flex-wrap gap-2">
                {CMS_PAGES.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCmsPage(page)}
                    className={`px-4 py-2 rounded-xl border text-sm capitalize transition ${
                      cmsPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-white/10 text-black dark:text-white border-gray-200 dark:border-white/10"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-gray-500">
                Current page: <span className="font-semibold capitalize text-black dark:text-white">{cmsPage}</span>
              </div>

              <button
                onClick={createContent}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-glow text-white px-4 py-2 rounded-xl"
              >
                <Plus size={16} />
                Add Section
              </button>
            </div>

            {filteredContent.length === 0 ? (
              <div className="border border-dashed border-gray-300 dark:border-white/15 rounded-2xl p-10 text-center">
                <FileText className="mx-auto mb-3 text-gray-400" size={32} />
                <h3 className="text-lg font-semibold text-black dark:text-white">No sections in {cmsPage}</h3>
                <p className="text-sm text-gray-500 mt-1">Create your first section for this page.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredContent.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 dark:border-white/10 rounded-2xl p-5 bg-gray-50 dark:bg-white/5 space-y-4"
                  >
                    <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-black dark:text-white capitalize">
                          {item.section || "Untitled section"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Page: {(item.page || cmsPage).toUpperCase()}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => saveContent(item)}
                          disabled={savingIds.includes(item.id)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-glow disabled:opacity-70 text-white px-4 py-2 rounded-xl"
                        >
                          <Save size={16} />
                          {savingIds.includes(item.id) ? "Saving..." : "Save Section"}
                        </button>

                        <button
                          onClick={() => deleteContent(item.id)}
                          className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-black dark:text-white">Page</label>
                        <select
                          value={item.page || "home"}
                          onChange={(e) => updateLocalContent(item.id, { page: e.target.value })}
                          className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl bg-white dark:bg-white/10 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition"
                        >
                          {CMS_PAGES.map((page) => (
                            <option key={page} value={page} className="text-gray-900 dark:text-white dark:bg-slate-800">
                              {page}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-black dark:text-white">Section Key</label>
                        <input
                          value={item.section || ""}
                          onChange={(e) => updateLocalContent(item.id, { section: e.target.value })}
                          className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl bg-white dark:bg-white/10 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition"
                          placeholder="hero, services, about-story"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">Title</label>
                      <input
                        value={item.title || ""}
                        onChange={(e) => updateLocalContent(item.id, { title: e.target.value })}
                        className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl bg-white dark:bg-white/10 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition"
                        placeholder="Section title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">Description</label>
                      <textarea
                        value={item.description || ""}
                        onChange={(e) => updateLocalContent(item.id, { description: e.target.value })}
                        className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl min-h-[120px] bg-white dark:bg-white/10 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition"
                        placeholder="Section description"
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[220px,1fr] gap-4">
                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Section Image
                        </label>
                                              
                        {/* Preview */}
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title || "section"}
                            className="w-full max-w-xs h-40 object-cover rounded-xl border border-gray-200 dark:border-white/[0.06] mb-3"
                          />
                        ) : (
                          <div className="w-full max-w-xs h-32 rounded-xl border border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-400 mb-3">
                            No image
                          </div>
                        )}
                      
                        {/* 🔥 PROFESSIONAL BUTTON */}
                        <div className="flex items-center gap-3">
                          
                          <label className="inline-flex items-center gap-2 px-2 py-1 
                          rounded-xl text-sm font-semibold cursor-pointer
                          bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                          hover:shadow-lg hover:scale-[1.02] active:scale-95
                          transition-all duration-300">
                          
                            📁 Upload Image
                      
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => uploadImage(item.id, e.target.files?.[0])}
                              className="hidden"
                            />
                          </label>
                      
                          {/* Status */}
                          <span className="text-xs text-gray-500">
                            {savingIds.includes(item.id) ? "Uploading..." : "Choose a file"}
                          </span>
                      
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-black dark:text-white">Cards / Repeatable Items</h4>
                          <button
                            onClick={() => addCard(item.id)}
                            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-xl text-sm"
                          >
                            <Plus size={14} />
                            Add Card
                          </button>
                        </div>

                        {(item.data || []).length === 0 ? (
                          <div className="border border-dashed border-gray-300 dark:border-white/15 rounded-2xl p-6 text-sm text-gray-500">
                            No cards added yet.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {(item.data || []).map((card, index) => (
                              <div
                                key={`${item.id}-${index}`}
                                className="border border-gray-200 dark:border-white/10 rounded-2xl p-4 bg-white dark:bg-white/5 space-y-3"
                              >
                                <div className="flex items-center justify-between">
                                  <h5 className="font-medium text-black dark:text-white">Card {index + 1}</h5>
                                  <button
                                    onClick={() => removeCard(item.id, index)}
                                    className="text-red-500 text-sm hover:underline"
                                  >
                                    Remove Card
                                  </button>
                                </div>

                                <input
                                  value={card.title || ""}
                                  onChange={(e) => updateCard(item.id, index, "title", e.target.value)}
                                  className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl bg-white dark:bg-white/10 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition"
                                  placeholder="Card title"
                                />

                                <textarea
                                  value={card.description || ""}
                                  onChange={(e) => updateCard(item.id, index, "description", e.target.value)}
                                  className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl min-h-[90px] bg-white dark:bg-white/10 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition"
                                  placeholder="Card description"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
       </div>
      </div>
    </div>
  );
}


function ContentPreview({ item }) {
  if (!item) {
    return (
      <div className="p-4 text-sm text-gray-400">
        No content available
      </div>
    );
  }

  return (
    <div className="glass-card-hover p-5 rounded-2xl space-y-4">

      {/* Title */}
      {item.title && (
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {item.title}
        </h3>
      )}

      {/* Description */}
      {item.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {item.description}
        </p>
      )}

      {/* Image */}
      {item.image && (
        <img
          src={item.image}
          alt="preview"
          className="w-full max-w-md h-48 object-cover rounded-xl"
        />
      )}

      {/* Cards */}
      {Array.isArray(item.data) && item.data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {item.data.map((card, i) => (
            <div key={i} className="p-4 border rounded-xl">
              <h4 className="font-semibold">{card.title}</h4>
              <p className="text-sm text-gray-500">{card.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



function SidebarItem({ icon, label, active, setActive, value, collapsed, setMobileOpen, count }) {
  return (
    <div
      onClick={() => { setActive(value); setMobileOpen(false); }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200 ${
        active === value
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      {icon}
      {!collapsed && <span className="flex-1">{label}</span>}
      {!collapsed && count > 0 && (
        <span className={`text-[11px] min-w-[20px] text-center px-1.5 py-0.5 rounded-full font-semibold ${
          active === value ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
        }`}>{count}</span>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color = "blue" }) {
  const colors = {
    blue: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-l-blue-500" },
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-l-emerald-500" },
    violet: { bg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", border: "border-l-violet-500" },
  };
  const c = colors[color] || colors.blue;
  return (
    <div className={`bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/[0.06] border-l-4 ${c.border} p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center ${c.text} group-hover:scale-105 transition-transform duration-300`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{value}</h2>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, data = [] }) {
  return (
    <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] p-6 rounded-2xl shadow-sm space-y-5">
      <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h2>
      {children}
      {data.length === 0 && <div className="text-center py-12 text-gray-400 dark:text-gray-500">No data found</div>}
    </div>
  );
}

export default AdminDashboard;
