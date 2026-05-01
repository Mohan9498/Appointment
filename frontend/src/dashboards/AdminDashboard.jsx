import { useEffect, useMemo, useState } from "react";
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

// ✅ Replaced "home" with "hero" and removed explicit section key inputs
const PAGE_SECTIONS = {
  home: [
    { section: "hero", label: "Hero Section", description: "Main heading, subtitle, and hero image", hasCards: false },
    { section: "services", label: "Services Section", description: "Service cards", hasCards: true },
    { section: "features", label: "Why Choose Us", description: "Feature cards", hasCards: true },
    { section: "gallery", label: "Gallery / Activities", description: "Activity images", hasCards: true },
  ],
  about: [
    { section: "about-main", label: "About Content", description: "Main description text on the About page", hasCards: false },
  ],
  programs: [
    { section: "programs", label: "Programs List", description: "Program cards", hasCards: true },
  ],
  settings: [
    { section: "branches", label: "Branches", hasCards: true },
    { section: "program-options", label: "Programs", hasCards: true },
    { section: "country-codes", label: "Country Codes", hasCards: true },
  ],
};

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState([]);

  const [search, setSearch] = useState("");
  const [active, setActive] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("latest");
  const [branchFilter, setBranchFilter] = useState("all");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [savingIds, setSavingIds] = useState([]);
  
  const [pagesTab, setPagesTab] = useState("home");
  // ✅ Changed from global boolean to array of active edit sections
  const [editModeIds, setEditModeIds] = useState([]);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        await API.post("logout/", { refresh }).catch(() => {});
      }
      toast.success("Logged out successfully");
    } catch (err) {
      console.log("Logout error:", err);
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
      if (Array.isArray(data)) setAppointments(data);
      else if (data?.results) setAppointments(data.results);
      else if (data?.data) setAppointments(data.data);
      else setAppointments([]);
    } catch (err) {
      setAppointments([]);
      toast.error("Failed to load appointments");
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await API.get("contact/");
      let data = res.data;
      if (Array.isArray(data)) setMessages(data);
      else if (data?.results) setMessages(data.results);
      else if (data?.data) setMessages(data.data);
      else setMessages([]);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      setMessages([]);
      toast.error("Failed to load messages");
    }
  };

  const fetchContent = async () => {
    try {
      const res = await API.get("content/");
      const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setContent(data);
    } catch (err) {
      setContent([]);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchAppointments(), fetchMessages(), fetchContent()]);
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

  const toggleEditMode = (sectionKey) => {
    setEditModeIds((prev) =>
      prev.includes(sectionKey)
        ? prev.filter((id) => id !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const autoCreateSection = async (page, section) => {
    const exists = content.find((c) => c.page === page && c.section === section);
    if (exists) return;

    try {
      await API.post("content/", {
          page: page.toLowerCase(),
          section: section.toLowerCase(),
          title: "",
          description: "",
          data: [],   // keep empty list
          order: content.length + 1,
        });

      await fetchContent();
      toast.success("Section enabled");
      setEditModeIds((prev) => (prev.includes(section) ? prev : [...prev, section]));
    } catch (err) {
      console.error("CREATE CMS ERROR:", err.response?.data || err);
      toast.error(err.response?.data?.page?.[0] || err.response?.data?.section?.[0] || "Failed to create section");
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
        data: Array.isArray(item.data)  ? item.data.map((card) => ({      title: card.title || "",      description: card.description || "",      image: card.image || "",    }))  : [],
        order: item.order || 0,
      });

      await fetchContent();
      toast.success("Section saved");
      setEditModeIds((prev) => prev.filter((id) => id !== item.section));
    } catch (err) {
      console.error("SAVE CMS ERROR:", err.response?.data || err);
      toast.error("Save failed");
    } finally {
      setSaving(item.id, false);
    }
  };

  const uploadImage = async (id, file) => {
    if (!file) return;

    const item = content.find((c) => c.id === id);
    if (!item) return;

    const formData = new FormData();

    formData.append("page", item.page);
    formData.append("section", item.section);
    formData.append("title", item.title || "");
    formData.append("description", item.description || "");
    formData.append("data", JSON.stringify(Array.isArray(item.data) ? item.data : []));
    formData.append("order", item.order || 0);
    formData.append("image", file);

    try {
      setSaving(id, true);

      await API.patch(`content/${id}/`, formData);

      await fetchContent();
      toast.success("Image uploaded");
    } catch (err) {
      console.error("IMAGE UPLOAD ERROR:", err.response?.data || err);
      toast.error("Image upload failed");
    } finally {
      setSaving(id, false);
    }
  };  

  const deleteSection = async (id) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;

    try {
      await API.delete(`content/${id}/`);
      setContent((prev) => prev.filter((c) => c.id !== id));
      toast.success("Section deleted");
    } catch (err) {
      console.error(err.response?.data);
      toast.error("Delete failed");
    }
  };

  const addCard = (id) => {
    const item = content.find((entry) => entry.id === id);
    if (!item) return;
    const updatedData = [...(Array.isArray(item.data) ? item.data : []), { title: "", description: "" }];
    updateLocalContent(id, { data: updatedData });
  };

  const updateCard = (id, index, key, value) => {
    const item = content.find((entry) => entry.id === id);
    if (!item) return;
    const updatedData = [...(Array.isArray(item.data) ? item.data : [])];
    updatedData[index] = { ...(updatedData[index] || {}), [key]: value };
    updateLocalContent(id, { data: updatedData });
  };

  const removeCard = (id, index) => {
    const item = content.find((entry) => entry.id === id);
    if (!item) return;
    const updatedData = (Array.isArray(item.data) ? item.data : []).filter((_, i) => i !== index);
    updateLocalContent(id, { data: updatedData });
  };

  const filteredAppointments = appointments
    .filter((a) => `${a.parent_name} ${a.child_name} ${a.phone}`.toLowerCase().includes(search.toLowerCase()))
    .filter((a) => (branchFilter === "all" ? true : a.branch === branchFilter))
    .sort((a, b) => {
      if (sort === "latest") return new Date(b.created_at || b.date) - new Date(a.created_at || a.date);
      return new Date(a.created_at || a.date) - new Date(b.created_at || b.date);
    });

  const filteredMessages = Array.isArray(messages)
    ? messages.filter((m) => `${m.name} ${m.email} ${m.message}`.toLowerCase().includes(search.toLowerCase()))
    : [];

  const COLORS = ["#3B82F6", "#22C55E"];

  const getCombinedMonthlyData = () => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ name: d.toLocaleString("default", { month: "short" }), month: d.getMonth(), year: d.getFullYear(), appointments: 0, messages: 0 });
    }
    appointments.forEach((item) => {
      if (!item.created_at) return;
      const date = new Date(item.created_at);
      const match = months.find((m) => m.month === date.getMonth() && m.year === date.getFullYear());
      if (match) match.appointments += 1;
    });
    messages.forEach((item) => {
      if (!item.created_at) return;
      const date = new Date(item.created_at);
      if (isNaN(date)) return;
      const match = months.find((m) => m.month === date.getMonth() && m.year === date.getFullYear());
      if (match) match.messages += 1;
    });
    return months;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted text-foreground">
      {/* ── MOBILE HEADER ── */}
      <div className="md:hidden flex justify-between items-center px-5 py-3.5 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
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
      <div className={`fixed top-0 left-0 h-screen w-[260px] bg-white/70 dark:bg-white/[0.02] backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-300 shadow-lg ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:sticky md:top-0 md:w-[260px] md:shrink-0 flex flex-col overflow-y-auto`}>
        <button onClick={() => setMobileOpen(false)} className="md:hidden absolute top-4 right-4 text-lg text-gray-400 hover:text-gray-700 dark:hover:text-white transition">✕</button>
        <div className="hidden md:flex items-center gap-3 px-6 pt-6 pb-5 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-600/20">A</div>
          <div><h1 className="font-bold text-foreground tracking-tight text-[12px]">Admin Panel</h1></div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-3 mb-2">Main Menu</p>
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={active} setActive={setActive} value="dashboard" setMobileOpen={setMobileOpen} />
          <SidebarItem icon={<Calendar size={18} />} label="Appointments" active={active} setActive={setActive} value="appointments" setMobileOpen={setMobileOpen} count={appointments.length} />
          <SidebarItem icon={<MessageSquare size={18} />} label="Messages" active={active} setActive={setActive} value="messages" setMobileOpen={setMobileOpen} count={messages.length} />

          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 px-3 mt-5 mb-2">Website Content</p>
          <SidebarItem icon={<PenLine size={18} />} label="Pages Editor" active={active} setActive={setActive} value="pages" setMobileOpen={setMobileOpen} />
        </nav>

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

      {mobileOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 min-h-screen bg-background">
       <div className="max-w-7xl mx-auto w-full">
        {active === "dashboard" && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h2>
              <p className="text-sm text-muted-foreground mt-1">Overview of your management</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <StatCard icon={<Users size={22} />} label="Appointments" value={appointments.length} color="blue" />
              <StatCard icon={<MessageSquare size={22} />} label="Messages" value={messages.length} color="emerald" />
              <StatCard icon={<FileText size={22} />} label="CMS Sections" value={content.length} color="violet" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card-hover rounded-2xl p-6 shadow-sm">
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

              <div className="glass-card-hover rounded-2xl p-6 shadow-sm">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Appointments */}
              <div className="glass-card-hover rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Recent Appointments</h3>
                  </div>
                  <button onClick={() => setActive("appointments")} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">View All →</button>
                </div>
                {appointments.length === 0 ? (
                  <div className="p-10 text-center text-sm text-gray-400 dark:text-gray-500">No appointments yet</div>
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
                        <span className="text-[11px] text-gray-400">{a.created_at ? new Date(a.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : a.date || "—"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Messages */}
              <div className="glass-card-hover rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Recent Messages</h3>
                  </div>
                  <button onClick={() => setActive("messages")} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">View All →</button>
                </div>
                {messages.length === 0 ? (
                  <div className="p-10 text-center text-sm text-gray-400 dark:text-gray-500">No messages yet</div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                    {messages.slice(0, 5).map((msg) => (
                      <div key={msg.id} className="px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{msg.name}</p>
                          <span className="text-[11px] text-gray-400">{msg.created_at ? new Date(msg.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[300px]">{msg.message}</p>
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
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                placeholder="Search appointments..."
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white text-sm transition-all"
              />
              <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] text-gray-900 dark:text-gray-500 text-sm outline-none transition">
                <option value="all">All Branches</option>
                <option value="Chennai">Chennai</option>
                <option value="WestMambalam">WestMambalam</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Madurai">Madurai</option>
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] text-gray-900 dark:text-gray-500 text-sm outline-none transition">
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredAppointments.map((item) => (
                <div key={item.id} className="glass-card-hover p-5 rounded-2xl space-y-3 hover:shadow-lg flex flex-col items-start transition-all duration-300">
                  <div className="flex justify-between items-start gap-14 mb-3 w-full">
                    <h3 className="text-lg font-semibold text-blue-600">{item.parent_name}</h3>
                    <p className="text-sm text-gray-400">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : item.date || "No date"}
                    </p>
                  </div>
                  <p className="text-sm font-medium">{item.child_name}</p>
                  <p className="text-sm text-gray-500 mb-2">Age: {item.age}</p>
                  <p className="text-sm mb-2">{item.phone}</p>
                  <p className="text-sm text-gray-500 mb-3">{item.branch}</p>
                  <p className="text-sm text-gray-500 mb-3">{item.program}</p>
                  <div className="flex flex-row justify-center items-center gap-3 w-full mt-2">
                    <a href={`tel:${item.phone}`} className="flex-auto text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl text-sm font-medium transition-colors">Call</a>
                    <a href={`https://wa.me/${(item.phone || "").replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="flex-auto text-center bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl text-sm font-medium transition-colors">WhatsApp</a>
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
            <input type="text" placeholder="Search messages..." onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-72 px-4 py-2.5 mb-4 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white text-sm transition-all" />
            <div className="md:hidden space-y-4">
              {filteredMessages.map((msg) => (
                <div key={msg.id} className="glass-card-hover p-5 rounded-2xl space-y-3 hover:shadow-lg flex flex-col transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-blue-600 font-semibold">{msg.name}</h3>
                    <p className="text-xs text-gray-500">{msg.created_at ? new Date(msg.created_at).toLocaleDateString("en-IN") : "No date"}</p>
                  </div>
                  <a href={`mailto:${msg.email}`} className="text-sm text-blue-600 underline">{msg.email}</a>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{msg.message}</p>
                  <div className="flex gap-3 mt-3 text-xs">
                    <button onClick={() => navigator.clipboard.writeText(msg.email)} className="text-gray-500 hover:text-black dark:hover:text-white">Copy</button>
                    <a href={`mailto:${msg.email}`} className="text-green-600 hover:underline">Reply</a>
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
                    <tr key={msg.id} className="border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                      <td className="p-3 font-medium text-blue-600">
                        <div className="flex flex-col">{msg.name}<span className="text-xs text-gray-500 mt-1">{msg.created_at ? new Date(msg.created_at).toLocaleDateString("en-IN") : "No date"}</span></div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline text-sm font-medium">{msg.email}</a>
                          <div className="flex gap-3 mt-1 text-xs">
                            <button onClick={() => navigator.clipboard.writeText(msg.email)} className="text-gray-500 hover:text-black dark:hover:text-white">Copy</button>
                            <a href={`mailto:${msg.email}`} className="text-green-600 hover:underline">Reply</a>
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

            <div className="glass-card-hover rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold tracking-tight text-foreground mb-1">Edit Page Content</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">Select a page and edit its sections dynamically.</p>

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

            {PAGE_SECTIONS[pagesTab]?.map((def) => {
              const item = content.find((c) => c.page === pagesTab && c.section === def.section) || null;
              // ✅ Fixed: Now checks per-section state rather than global boolean
              const isEditing = editModeIds.includes(def.section);

              return (
                <div key={def.section} className="glass-card-hover rounded-2xl shadow-sm overflow-hidden">
                  
                  {/* Section Header */}
                  <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-foreground">{def.label}</h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{def.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* ✅ Fixed: Preview / Edit Toggle */}
                      {item && (
                        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl mr-2">
                          <button
                            onClick={() => toggleEditMode(def.section)}
                            className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                              !isEditing ? "bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-white font-medium" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => toggleEditMode(def.section)}
                            className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                              isEditing ? "bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-white font-medium" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                          >
                            Edit
                          </button>
                        </div>
                      )}

                      {item ? (
                      <>
                        <button
                            onClick={() => deleteSection(item.id)}
                            className="px-4 py-2 rounded-xl text-sm bg-red-500 hover:bg-red-600 text-white"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => saveContent(item)}
                          disabled={savingIds.includes(item.id)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-glow-blue text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-60"
                        >
                          <Save size={14} />
                          {savingIds.includes(item.id) ? "Saving..." : "Save"}
                        </button>

                      </>
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
                  </div>

                  {/* Section Body */}
                  <div className="p-6">
                    {/* ✅ Fixed: Preview Mode Rendering */}
                    {!isEditing && <ContentPreview item={item} />}

                    {/* EDIT MODE */}
                    {isEditing && item && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title</label>
                          <input
                            value={item.title || ""}
                            onChange={(e) => updateLocalContent(item.id, { title: e.target.value })}
                            className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl bg-gray-50/50 dark:bg-white/[0.02] text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
                            placeholder="Section title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
                          <textarea
                            value={item.description || ""}
                            onChange={(e) => updateLocalContent(item.id, { description: e.target.value })}
                            className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl min-h-[100px] bg-gray-50/50 dark:bg-white/[0.02] text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
                            placeholder="Section description"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Section Image</label>
                          {item.image ? (
                            <img src={item.image?.StartsWith("http") ? item.image : `https://appointment-83q0.onrender.com${item.image}` } alt={item.title || "section"} className="w-full max-w-none h-20 object-cover rounded-xl border border-gray-200 dark:border-white/[0.06] mb-2" />
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

                        {def.hasCards && (
                          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Cards / Items</h4>
                              <button onClick={() => addCard(item.id)} className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                                <Plus size={12} /> Add Card
                              </button>
                            </div>
                        
                            {(item.data || []).length === 0 ? (
                              <div className="border border-dashed border-gray-300 dark:border-white/10 rounded-xl p-6 text-sm text-gray-400 text-center">
                                No cards added yet. Click "Add Card" to start.
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {(item.data || []).map((card, index) => (
                                  <div key={`${item.id}-${index}`} className="border border-gray-200 dark:border-white/[0.06] rounded-xl p-4 bg-gray-50/50 dark:bg-white/[0.02] space-y-3">
                                    <div className="flex items-center justify-between">
                                      <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300">Card {index + 1}</h5>
                                      <button onClick={() => removeCard(item.id, index)} className="text-red-500 text-xs hover:underline font-medium">Remove</button>
                                    </div>
                                
                                    <input value={card.title || ""} onChange={(e) => updateCard(item.id, index, "title", e.target.value)} className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl bg-white dark:bg-white/[0.02] text-gray-900 dark:text-white text-sm outline-none focus:border-blue-500 transition" placeholder="Card title" />
                                    <textarea value={card.description || ""} onChange={(e) => updateCard(item.id, index, "description", e.target.value)} className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl min-h-[80px] bg-white dark:bg-white/[0.02] text-gray-900 dark:text-white text-sm outline-none focus:border-blue-500 transition" placeholder="Card description" />
                                    <div>
                                      <input value={card.image || card.src || ""} onChange={(e) => updateCard(item.id, index, "image", e.target.value)} className="border border-gray-200 dark:border-white/[0.06] p-3 w-full rounded-xl bg-white dark:bg-white/[0.02] text-gray-900 dark:text-white text-sm outline-none focus:border-blue-500 transition" placeholder="Image URL" />
                                      {(card.image || card.src) && (
                                        <img src={card.image || card.src} alt={card.title || "card"} className="mt-2 w-24 h-16 object-cover rounded-lg border border-gray-200 dark:border-white/[0.06]" onError={(e) => { e.target.style.display = 'none'; }} />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

       </div>
      </div>
    </div>
  );
}

// ✅ Fixed: Safe fallback renderer
function ContentPreview({ item }) {
  if (!item) {
    return (
      <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/[0.05] rounded-xl text-center">
        <FileText size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This section is not enabled yet.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Click the "Enable Section" button above to activate it.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] p-6 rounded-xl space-y-4 shadow-inner">
      {item.title && <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>}
      {item.description && <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>}
      {item.image && <img src={item.image} alt="preview" className="w-full max-w-md h-48 object-cover rounded-xl shadow-sm border border-gray-200 dark:border-white/10" />}
      {Array.isArray(item.data) && item.data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
          {item.data.map((card, i) => (
            <div key={i} className="p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm hover:shadow-md transition">
              {card.image && <img src={card.image} alt="card" className="w-full h-32 object-cover rounded-lg mb-3" />}
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{card.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{card.description}</p>
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
        active === value ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      {icon}
      {!collapsed && <span className="flex-1">{label}</span>}
      {!collapsed && count > 0 && (
        <span className={`text-[11px] min-w-[20px] text-center px-1.5 py-0.5 rounded-full font-semibold ${active === value ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"}`}>{count}</span>
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