import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Users,
  Phone,
  Calendar,
  Search,
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

  const logout = useAuthStore((state) => state.logout);


  const handleLogout = () => {
    logout();
    navigate("/login"); //  smooth redirect (no reload)

    window.location.reload();
  };

  // 🔹 Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await API.get("appointments/");
      setAppointments(res.data);
    } catch {
      toast.error("Failed to load appointments");
    }
  };

  // 🔹 Fetch contact messages
  const fetchMessages = async () => {
    try {
      const res = await API.get("contact/");

     console.log("MESSAGES RESPONSE:", res.data);

      // ✅ Handle both formats safely
     const messages = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setMessages(messages);

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
      fetchAppointments();
      fetchMessages();
    }, []);

  const filteredAppointments = appointments.filter((a) =>
    `${a.parent_name} ${a.child_name} ${a.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin =
      localStorage.getItem("access") &&
      localStorage.getItem("is_admin") === "true";
  
    if (!isAdmin) {
      navigate("/login");
    }
  }, []);

  const filteredMessages = messages.filter((m) =>
    `${m.name} ${m.email} ${m.message}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-[#0F172A]">

      {/* SIDEBAR */}
      <div className="w-64 bg-white dark:bg-white/5 border-r border-gray-200 dark:border-white/10 p-5">

        <h1 className="text-xl font-bold mb-6 text-black dark:text-white">
          Admin Panel
        </h1>

        <nav className="space-y-2">

          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={active} setActive={setActive} value="dashboard" />
          <SidebarItem icon={<Calendar size={18} />} label="Appointments" active={active} setActive={setActive} value="appointments" />
          <SidebarItem icon={<MessageSquare size={18} />} label="Messages" active={active} setActive={setActive} value="messages" />

        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">

        {/* SEARCH */}
        <div className="mb-6 flex justify-between items-center">

          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white dark:bg-white/10 px-4 py-2 rounded-lg w-72 outline-none"
          />

        </div>

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <StatCard icon={<Users />} label="Total Appointments" value={appointments.length} />
            <StatCard icon={<MessageSquare />} label="Total Messages" value={messages.length} />

          </div>
        )}

        {/* APPOINTMENTS */}
        {active === "appointments" && (
          <Section title="Appointment Leads">
            {filteredAppointments.map((item) => (
              <Card key={item.id}>
                <div>
                  <h3 className="text-blue-500 font-semibold">{item.parent_name}</h3>
                  <p className="text-sm">👶 {item.child_name} ({item.age})</p>
                  <p className="text-sm">📞 {item.phone}</p>
                  <p className="text-sm">📍 {item.branch} • {item.program}</p>
                </div>

                <div className="flex gap-2">
                  <a href={`tel:${item.phone}`} className="btn-green">Call</a>
                  <a href={`https://wa.me/91${item.phone}`} target="_blank" className="btn-green">WhatsApp</a>
                </div>
              </Card>
            ))}
          </Section>
        )}

        {/* MESSAGES */}
        {active === "messages" && (
          <Section title="Contact Messages">
            {filteredMessages.map((msg) => (
              <Card key={msg.id}>
                <div>
                  <h3 className="font-semibold">{msg.name}</h3>
                  <p className="text-sm text-gray-500">{msg.email}</p>
                  <p className="text-sm mt-1">{msg.message}</p>
                </div>
              </Card>
            ))}
          </Section>
        )}

      </div>
    </div>
  );
}

/* 🔹 Components */

function SidebarItem({ icon, label, active, setActive, value }) {
  return (
    <div
      onClick={() => setActive(value)}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
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
    <div className="bg-white dark:bg-white/5 p-4 rounded-xl shadow">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h2 className="text-xl font-bold">{value}</h2>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-white/5 p-4 rounded-xl shadow space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children.length ? children : <p>No data found</p>}
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="flex justify-between items-center bg-gray-100 dark:bg-white/5 p-4 rounded-lg">
      {children}
    </div>
  );
}

export default AdminDashboard;