import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Users,
  Calendar,
  MessageSquare,
  LayoutDashboard
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";

function AdminDashboard() {

  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [sort, setSort] = useState("latest");
  const [branchFilter, setBranchFilter] = useState("all");

  const [statusMap, setStatusMap] = useState({});

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // 🔐 Protect route
  useEffect(() => {
    const isAdmin =
      localStorage.getItem("access") &&
      localStorage.getItem("is_admin") === "true";

    if (!isAdmin) navigate("/login", { replace: true });
  }, []);

  // 🌙 Theme
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // 🔄 Fetch
  const fetchAppointments = async () => {
    try {
      const res = await API.get("appointments/");
      setAppointments(res.data);
    } catch {
      toast.error("Failed to load appointments");
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await API.get("contact/");
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setMessages(data);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchMessages();
  }, []);

  // ✅ STATUS WITHOUT RELOAD
  useEffect(() => {
    const saved = {};
    appointments.forEach(a => {
      saved[a.id] = localStorage.getItem(`status_${a.id}`) || "new";
    });
    setStatusMap(saved);
  }, [appointments]);

  const toggleStatus = (id) => {
    const updated = statusMap[id] === "new" ? "contacted" : "new";
    localStorage.setItem(`status_${id}`, updated);
    setStatusMap(prev => ({ ...prev, [id]: updated }));
  };

  const getStatus = (id) => statusMap[id] || "new";

  // 🔍 FILTER
  const filteredAppointments = appointments
    .filter((a) =>
      `${a.parent_name} ${a.child_name} ${a.phone}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((a) =>
      branchFilter === "all" ? true : a.branch === branchFilter
    )
    .sort((a, b) =>
      sort === "latest"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

  const filteredMessages = messages.filter((m) =>
    `${m.name} ${m.email} ${m.message}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 🔓 LOGOUT
  const handleLogout = async () => {
    try {
      await API.post("logout/", {
        refresh: localStorage.getItem("refresh"),
      }).catch(()=>{});
      toast.success("Logged out");
    } finally {
      localStorage.clear();
      logout();
      navigate("/login", { replace: true });
    }
  };

  // 🧊 LOADING SKELETON
  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="animate-pulse bg-gray-200 dark:bg-white/10 h-32 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-[#0F172A]">

      {/* SIDEBAR */}
      <div className={`fixed md:static z-50 h-full bg-white dark:bg-white/5 border-r p-4 transition-transform duration-300 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } ${collapsed ? "md:w-20" : "md:w-56"} w-64`}>

        <h1 className="text-black dark:text-white mb-4">Admin</h1>

        <button onClick={() => setMobileOpen(!mobileOpen)}>☰</button>

        <button
          onClick={() => setDark(!dark)}
          className="mt-2 px-2 py-1 bg-gray-200 dark:bg-white/10 rounded"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        <nav className="mt-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" value="dashboard" active={active} setActive={setActive} />
          <SidebarItem icon={<Calendar size={18} />} label="Appointments" value="appointments" active={active} setActive={setActive} />
          <SidebarItem icon={<MessageSquare size={18} />} label="Messages" value="messages" active={active} setActive={setActive} />
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white w-full py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        <input
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 px-4 py-2 rounded-lg w-full sm:w-72 bg-white dark:bg-white/10 focus:ring-2 focus:ring-blue-500"
        />

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div className="grid md:grid-cols-2 gap-4">
            <StatCard icon={<Users />} label="Appointments" value={appointments.length} />
            <StatCard icon={<MessageSquare />} label="Messages" value={messages.length} />
          </div>
        )}

        {/* APPOINTMENTS */}
        {active === "appointments" && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">

            {filteredAppointments.map((item) => (
              <div
                key={item.id}
                className="backdrop-blur-xl bg-white/70 dark:bg-white/5 border rounded-2xl p-5 shadow hover:scale-[1.02] transition"
              >
                <div className="flex justify-between">
                  <h3 className="text-blue-600 font-semibold">{item.parent_name}</h3>

                  <span
                    onClick={() => toggleStatus(item.id)}
                    className={`px-3 py-1 text-xs rounded-full cursor-pointer ${
                      getStatus(item.id) === "new"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {getStatus(item.id)}
                  </span>
                </div>

                <p>{item.child_name}</p>
                <p>{item.phone}</p>

                <div className="flex gap-2 mt-3">
                  <a href={`tel:${item.phone}`} className="bg-green-500 text-white px-3 py-1 rounded">Call</a>
                  <a href={`https://wa.me/91${item.phone}`} className="bg-emerald-500 text-white px-3 py-1 rounded">WhatsApp</a>
                </div>
              </div>
            ))}

          </div>
        )}

        {/* MESSAGES */}
        {active === "messages" && (
          <div className="space-y-3">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="bg-white dark:bg-white/5 p-4 rounded-xl shadow">
                <p className="font-semibold text-blue-600">{msg.name}</p>
                <p className="text-sm">{msg.message}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

/* COMPONENTS */

function SidebarItem({ icon, label, value, active, setActive }) {
  return (
    <div
      onClick={() => setActive(value)}
      className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
        active === value ? "bg-blue-600 text-white" : "hover:bg-gray-100 dark:hover:bg-white/10"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-white/10 p-4 rounded-xl shadow flex gap-3 items-center">
      {icon}
      <div>
        <p>{label}</p>
        <h2 className="font-bold">{value}</h2>
      </div>
    </div>
  );
}

export default AdminDashboard;