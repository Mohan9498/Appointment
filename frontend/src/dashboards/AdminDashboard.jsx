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
    <div className="flex min-h-screen bg-gray-100 dark:bg-[#0F172A] text-black dark:text-white">

      {/* SIDEBAR */}
      <div className="w-56 bg-white dark:bg-white/5 border-r border-gray-200 dark:border-white/10 p-5">

        <h1 className="text-xl font-bold mb-6 text-black dark:text-white">
          Admin Panel
        </h1>

        <nav className="space-y-2 justify-center items-center">

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

            <StatCard icon={<Users />} label="Total Appointments" value= {appointments.length} />
            <StatCard icon={<MessageSquare />} label="Total Messages" value={messages.length} />

          </div>
        )}

        {/* APPOINTMENTS */}
        {active === "appointments" && (
          <Section title="Appointment Leads ">
            {filteredAppointments.map((item) => (
              <Card key={item.id}>
                
                {/* MAIN ROW */}
                <div className="flex flex-col space-x-11 md:flex-row md:items-center md:justify-between justify-center items-center gap-4">
                  
                  {/* LEFT SIDE (Details) */}
                  <div className="space-y-2 justify-center items-center">

                    <h3 className="text-blue-500 font-semibold">
                       {item.parent_name}
                    </h3>

                    <p className="text-sm text-gray-800 dark:text-gray-300">
                       {item.child_name}
                    </p>

                    <p className="text-sm text-gray-800 dark:text-gray-300">
                       ({item.age} years )
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                       {item.phone}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                       {item.branch}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                       {item.program}
                    </p>

                    {/* ✅ DATE ADDED */}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.created_at
                      ? new Date(item.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })
                      : "No date"}
                    </p>

                  </div>
                  
                  {/* RIGHT SIDE (Actions) */}
                  <div className="flex space-x-12 gap-2 md:justify-start justify-center items-center">

                    <a href={`tel:${item.phone}`} className="btn-green hover:bg-green-700">
                      Call
                    </a>
                    
                    <a  
                      href={`https://wa.me/91${item.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-green space-x-10 hover:bg-green-400" > WhatsApp
                    </a>
                    
                  </div>
                  
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
                <div className="space-x-1 justify-center items-center">
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
    <div className="bg-white dark:bg-white/25 p-4 rounded-2xl shadow">
      <div className="flex  items-center gap-3">
        {icon}
        <div>
          <p className="text-sm text-black dark:text-white">{label}</p>
          <h2 className="text-lg font-semibold text-black dark:text-white">{value}</h2>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow space-y-3">
      <h2 className="text-lg font-semibold text-black dark:text-white">{title}</h2>
      {children.length ? children : <p>No data found</p>}
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="flex justify-between items-center bg-gray-100 dark:bg-white/5 p-4 rounded-2xl">
      {children}
    </div>
  );
}

export default AdminDashboard;