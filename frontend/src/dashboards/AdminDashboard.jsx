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
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // 🔐 Protect route
  useEffect(() => {
    const isAdmin =
      localStorage.getItem("access") &&
      localStorage.getItem("is_admin") === "true";

    if (!isAdmin) navigate("/login", { replace: true });
  }, []);

  // 🔄 Fetch
  useEffect(() => {
    API.get("appointments/").then(res => setAppointments(res.data)).catch(()=>{});
    API.get("contact/")
      .then(res => setMessages(Array.isArray(res.data) ? res.data : res.data?.data || []))
      .catch(()=>{})
      .finally(() => setLoading(false));
  }, []);

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

  const filteredAppointments = appointments.filter((a) =>
    `${a.parent_name} ${a.child_name} ${a.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredMessages = messages.filter((m) =>
    `${m.name} ${m.email} ${m.message}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map(i => (
          <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-[#0F172A]">

      {/* 📱 MOBILE TOP BAR */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white dark:bg-[#0F172A] border-b sticky top-0 z-50">
        <h1 className="font-semibold text-black dark:text-white">Admin</h1>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-2xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
        >
          ☰
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full z-50
          w-72 md:w-56
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          bg-white dark:bg-[#0F172A]
          border-r border-gray-200 dark:border-white/10
          p-5 flex flex-col shadow-xl
        `}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-semibold text-black dark:text-white">Admin</h1>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* NAV */}
        <nav className="space-y-2 flex-1">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" value="dashboard" active={active} setActive={setActive} setMobileOpen={setMobileOpen} />
          <SidebarItem icon={<Calendar size={18} />} label="Appointments" value="appointments" active={active} setActive={setActive} setMobileOpen={setMobileOpen} />
          <SidebarItem icon={<MessageSquare size={18} />} label="Messages" value="messages" active={active} setActive={setActive} setMobileOpen={setMobileOpen} />
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* MAIN */}
      <div className="flex-1 p-6">

        <input
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 px-4 py-2 rounded-lg w-full sm:w-72 bg-white dark:bg-white/10"
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
              <div key={item.id} className="bg-white dark:bg-white/5 p-4 rounded-xl shadow">
                <h3 className="text-blue-600">{item.parent_name}</h3>
                <p>{item.child_name}</p>
                <p>{item.phone}</p>
              </div>
            ))}
          </div>
        )}

        {/* MESSAGES */}
        {active === "messages" && (
          <div className="space-y-3">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="bg-white dark:bg-white/5 p-4 rounded-xl shadow">
                <p className="text-blue-600">{msg.name}</p>
                <p>{msg.message}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

/* COMPONENTS */

function SidebarItem({ icon, label, value, active, setActive, setMobileOpen }) {
  return (
    <div
      onClick={() => {
        setActive(value);
        setMobileOpen(false); // ✅ auto close on mobile
      }}
      className={`flex items-center gap-2 p-3 rounded cursor-pointer ${
        active === value
          ? "bg-blue-600 text-white"
          : "hover:bg-gray-100 dark:hover:bg-white/10"
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