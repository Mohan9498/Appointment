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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-[#0F172A]">
      <div className="md:hidden h-full flex justify-between items-center p-2 bg-white dark:bg-[#0F172A] border-b sticky top-0 z-50">
        <h1 className="font-semibold text-black dark:text-white">Admin</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-2xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
          >
            ☰
          </button>

          <button
            onClick={() => setDark(!dark)}
            className="px-2 py-1 rounded-lg bg-gray-200 dark:bg-white/10"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 h-full min-h-screen w-64 bg-white dark:bg-white/5 border-r z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:w-64 flex flex-col justify-between p-4`}
      >
        <button onClick={() => setMobileOpen(false)} className="md:hidden text-xl mb-4">
          ✕
        </button>

        <nav className="space-y-2  max-h-full flex-1 overflow-y-auto">
          <div className="hidden md:flex items-center justify-between mt-4 px-2">
            <h1 className="font-serif text-black dark:text-white">Admin</h1>

            <button
              onClick={() => setDark(!dark)}
              className="px-3 rounded-lg text-xs bg-gray-200 dark:bg-white/10 text-black dark:text-white"
            >
              {dark ? "☀️ Light" : "🌙 Dark"}
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
            icon={<FileText size={18} />}
            label="Content"
            active={active}
            setActive={setActive}
            value="content"
            setMobileOpen={setMobileOpen}
          />
        </nav>

        <button onClick={handleLogout} className="mt-6 bg-red-500 text-white py-2 rounded-lg">
          Logout
        </button>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 p-6">
        {active === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard icon={<Users />} label="Total Appointments" value={appointments.length} />
              <StatCard icon={<MessageSquare />} label="Total Messages" value={messages.length} />
              <StatCard icon={<FileText />} label="Total CMS Sections" value={content.length} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow">
                <h3 className="mb-4 font-semibold text-black dark:text-white">Monthly Analytics</h3>

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

              <div className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow">
                <h3 className="mb-4 font-semibold">Distribution</h3>

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
              className="w-full sm:w-72 px-4 py-2 rounded-xl border bg-white dark:bg-white/10 outline-none focus:ring-2 focus:ring-blue-600"
            />

            <div className="flex flex-wrap gap-3 text-black mb-4">
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white dark:bg-white/10 border"
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
                className="px-3 py-2 rounded-lg bg-white dark:bg-white/10 border"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredAppointments.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow hover:shadow-xl flex flex-col items-start transition duration-300"
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

                  <div className="flex flex-row justify-center items-center gap-3">
                    <a
                      href={`tel:${item.phone}`}
                      className="flex-auto text-center w-24 bg-green-500 hover:bg-green-600 text-white py-1 rounded-2xl text-lg"
                    >
                      Call
                    </a>

                    <a
                      href={`https://wa.me/91${item.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-auto text-center w-24 bg-emerald-400 hover:bg-emerald-500 text-white py-2 rounded-2xl text-sm"
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
              className="w-full sm:w-72 px-4 py-2 rounded-xl border bg-white dark:bg-white/10 outline-none focus:ring-2 focus:ring-blue-600"
            />

            <div className="md:hidden space-y-4">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow hover:shadow-xl flex flex-col transition duration-300"
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

        {active === "content" && (
          <div className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow space-y-5">
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
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
        active === value ? "bg-blue-600 text-white" : "hover:bg-gray-100 dark:hover:bg-white/10"
      }`}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-white/25 p-4 rounded-2xl shadow">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm text-black dark:text-white">{label}</p>
          <h2 className="text-lg font-semibold text-black dark:text-white">{value}</h2>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, data = [] }) {
  return (
    <div className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow space-y-4">
      <h2 className="text-lg font-semibold text-black dark:text-white">{title}</h2>
      {data.length > 0 ? children : <div className="text-center py-10 text-gray-500">No data found</div>}
    </div>
  );
}

export default AdminDashboard;
