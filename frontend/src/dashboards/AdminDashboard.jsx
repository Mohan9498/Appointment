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
      setAppointments(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch {
      toast.error("Failed to load appointments");
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await API.get("contact/");
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setMessages(data);
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      toast.error("Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      const res = await API.get("content/");
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setContent(data);
    } catch (err) {
      console.log("CMS ERROR:", err.response?.data || err.message);
      toast.error("Failed to load CMS content");
      setContent([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchMessages();
    fetchContent();
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
    try {
      await API.post("content/", {
        page: cmsPage,
        section: `new-section-${Date.now()}`,
        title: "New Section",
        description: "",
        data: [],
      });
      await fetchContent();
      toast.success("Section added");
    } catch (err) {
      console.log(err.response?.data || err.message);
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
      await fetchContent();
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
      await fetchContent();
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

    const formData = new FormData();
    formData.append("image", file);

    try {
      setSaving(id, true);
      await API.patch(`content/${id}/`, formData);
      await fetchContent();
      toast.success("Image uploaded");
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Image upload failed");
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-slate-950">
      <div className="md:hidden flex justify-between items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-200/50 dark:border-white/[0.06] sticky top-0 z-50">
        <h1 className="font-bold text-gray-900 dark:text-white tracking-tight">Admin Panel</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-700 dark:text-white"
          >
            ☰
          </button>

          <button
            onClick={() => setDark(!dark)}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 transition hover:bg-gray-200 dark:hover:bg-white/20"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 h-full min-h-screen w-64 bg-white dark:bg-slate-900 border-r border-gray-200/50 dark:border-white/[0.06] z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:w-64 flex flex-col justify-between p-4`}
      >
        <button onClick={() => setMobileOpen(false)} className="md:hidden text-xl mb-4 text-gray-500 hover:text-gray-700 dark:hover:text-white transition">
          ✕
        </button>

        <nav className="space-y-1.5 max-h-full flex-1 overflow-y-auto">
          <div className="hidden md:flex items-center justify-between mt-2 mb-6 px-2">
            <h1 className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">Admin Panel</h1>

            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-xl text-xs bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition"
            >
              {dark ? "☀️" : "🌙"}
            </button>
          </div>

          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={active}
            setActive={setActive}
            value="dashboard"
            setMobileOpen={setMobileOpen}
          />

          <SidebarItem
            icon={<Calendar size={18} />}
            label="Appointments"
            active={active}
            setActive={setActive}
            value="appointments"
            setMobileOpen={setMobileOpen}
          />

          <SidebarItem
            icon={<MessageSquare size={18} />}
            label="Messages"
            active={active}
            setActive={setActive}
            value="messages"
            setMobileOpen={setMobileOpen}
          />

          <SidebarItem
            icon={<PenLine size={18} />}
            label="Pages"
            active={active}
            setActive={setActive}
            value="pages"
            setMobileOpen={setMobileOpen}
          />

          <SidebarItem
            icon={<FileText size={18} />}
            label="Advanced CMS"
            active={active}
            setActive={setActive}
            value="content"
            setMobileOpen={setMobileOpen}
          />
        </nav>

        <button onClick={handleLogout} className="mt-6 bg-red-500/90 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
          Logout
        </button>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 p-6 overflow-y-auto">
        {active === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard icon={<Users />} label="Total Appointments" value={appointments.length} />
              <StatCard icon={<MessageSquare />} label="Total Messages" value={messages.length} />
              <StatCard icon={<FileText />} label="Total CMS Sections" value={content.length} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] p-6 rounded-2xl shadow-sm">
                <h3 className="mb-4 font-bold tracking-tight text-gray-900 dark:text-white">Monthly Analytics</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getCombinedMonthlyData()}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="appointments" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="messages" fill="#22C55E" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] p-6 rounded-2xl shadow-sm">
                <h3 className="mb-4 font-bold tracking-tight text-gray-900 dark:text-white">Distribution</h3>

                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Appointments", value: appointments.length },
                        { name: "Messages", value: messages.length },
                      ]}
                      dataKey="value"
                      outerRadius={90}
                      label
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={index} fill={color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {active === "appointments" && (
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
                className="px-3 py-2 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] text-gray-900 dark:text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
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
                className="px-3 py-2 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] text-gray-900 dark:text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredAppointments.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm hover:shadow-lg flex flex-col items-start transition-all duration-300 hover:-translate-y-0.5"
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
                      href={`https://wa.me/91${item.phone}`}
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
        )}

        {active === "messages" && (
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
                  className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm hover:shadow-lg flex flex-col transition-all duration-300 hover:-translate-y-0.5"
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
                  <tr className="bg-gray-100 dark:bg-white/10 text-sm">
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
        )}

        {/* ===== PAGES EDITOR (NO SECTION KEY NEEDED) ===== */}
        {active === "pages" && (
          <div className="space-y-6">

            {/* Page Tabs */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">Edit Page Content</h2>
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
              const item = content.find((c) => c.page === pagesTab && c.section === def.section);

              return (
                <div
                  key={def.section}
                  className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">{def.label}</h3>
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
                    <div className="p-6 space-y-4">
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

        {/* ===== ADVANCED CMS (ORIGINAL) ===== */}
        {active === "content" && (
          <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] p-6 rounded-2xl shadow-sm space-y-5">
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
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
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
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white px-4 py-2 rounded-xl"
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
                          className="border p-3 w-full rounded-xl bg-white dark:bg-white/10"
                        >
                          {CMS_PAGES.map((page) => (
                            <option key={page} value={page}>
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
                          className="border p-3 w-full rounded-xl bg-white dark:bg-white/10"
                          placeholder="hero, services, about-story"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">Title</label>
                      <input
                        value={item.title || ""}
                        onChange={(e) => updateLocalContent(item.id, { title: e.target.value })}
                        className="border p-3 w-full rounded-xl bg-white dark:bg-white/10"
                        placeholder="Section title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">Description</label>
                      <textarea
                        value={item.description || ""}
                        onChange={(e) => updateLocalContent(item.id, { description: e.target.value })}
                        className="border p-3 w-full rounded-xl min-h-[120px] bg-white dark:bg-white/10"
                        placeholder="Section description"
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[220px,1fr] gap-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-black dark:text-white">Section Image</label>

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title || item.section || "section-image"}
                            className="w-full h-40 object-cover rounded-2xl border border-gray-200 dark:border-white/10"
                          />
                        ) : (
                          <div className="w-full h-40 rounded-2xl border border-dashed border-gray-300 dark:border-white/15 flex items-center justify-center text-gray-400">
                            <div className="flex flex-col items-center gap-2 text-sm">
                              <ImageIcon size={24} />
                              No image
                            </div>
                          </div>
                        )}

                        <input type="file" accept="image/*" onChange={(e) => uploadImage(item.id, e.target.files?.[0])} />
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
                                  className="border p-3 w-full rounded-xl bg-white dark:bg-white/10"
                                  placeholder="Card title"
                                />

                                <textarea
                                  value={card.description || ""}
                                  onChange={(e) => updateCard(item.id, index, "description", e.target.value)}
                                  className="border p-3 w-full rounded-xl min-h-[90px] bg-white dark:bg-white/10"
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
  );
}

function SidebarItem({ icon, label, active, setActive, value, collapsed, setMobileOpen }) {
  return (
    <div
      onClick={() => {
        setActive(value);
        setMobileOpen(false);
      }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200 ${
        active === value
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">{label}</p>
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
      {data.length > 0 ? children : <div className="text-center py-12 text-gray-400 dark:text-gray-500">No data found</div>}
    </div>
  );
}

export default AdminDashboard;
