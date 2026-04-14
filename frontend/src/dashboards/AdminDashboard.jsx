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
  Legend
} from "recharts";
import useAuthStore from "../store/useAuthStore";

function AdminDashboard() {

  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const [collapsed, setCollapsed] = useState(false);

  const [sort, setSort] = useState("latest");
  const [branchFilter, setBranchFilter] = useState("all");

  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = useAuthStore((state) => state.logout);

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

      //  Call backend logout API
      if (refresh) {
        await API.post("logout/", {
          refresh: refresh,
        }).catch(()=>{});
      }

     toast.success("Logged out successfully");

    } catch (err) {
     console.log("Logout error:", err.response?.data || err.message);
     toast.error("Logout failed (fallback clearing session)");
    } finally {
      // 🧹 Clear everything
     localStorage.clear();

     logout(); // Zustand reset

     // 🔁 Redirect
      navigate("/login", { replace: true });
    }
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

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await API.delete(`contact/${id}/`);

      // ✅ Remove from UI instantly
      setMessages((prev) => prev.filter((msg) => msg.id !== id));

      toast.success("Message deleted");
    } catch (err) {
      toast.error("Delete failed");
      console.log(err);
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

  

  const navigate = useNavigate();

  
  const filteredAppointments = appointments
    .filter((a) =>
      `${a.parent_name} ${a.child_name} ${a.phone}`
    .toLowerCase()
    .includes(search.toLowerCase())
  )
  .filter((a) =>
    branchFilter === "all" ? true : a.branch === branchFilter
  )
  .sort((a, b) => {
    if (sort === "latest") {
      return new Date(b.created_at || b.date) - new Date(a.created_at || a.date);
    } else {
      return new Date(a.created_at || a.date) - new Date(b.created_at || b.date);
    }
  });
  const filteredMessages = messages.filter((m) =>
    `${m.name} ${m.email} ${m.message}`
    .toLowerCase()
    .includes(search.toLowerCase())
  );

  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);


  // useEffect(() => {
  //   const isAdmin =
  //     localStorage.getItem("access") &&
  //     localStorage.getItem("is_admin") === "true";

  //   if (!isAdmin) {
  //     navigate("/login", { replace: true });
  //   }
  // }, []);


  console.log("Appointments:", appointments);
  console.log("Filtered:", filteredAppointments);
  console.log("Messages:", messages);
  console.log("Filtered Messages:", filteredMessages);


  // 📊 Chart Data
  const appointmentData = [
    { name: "Appointments", value: appointments.length },
  ];

  const messageData = [
    { name: "Messages", value: messages.length },
  ];

  const COLORS = ["#3B82F6", "#22C55E"];


  
  // 📊 REAL MONTHLY ANALYTICS (Last 6 Months)
  // 📊 COMBINED MONTHLY DATA (Appointments + Messages)
  const getCombinedMonthlyData = () => {
    const now = new Date();

    const months = [];

    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

      months.push({
        name: d.toLocaleString("default", { month: "short" }),
        month: d.getMonth(),
        year: d.getFullYear(),
        appointments: 0,
        messages: 0
      });
    }

    // Count appointments
    appointments.forEach((item) => {
      if (!item.created_at) return;

      const date = new Date(item.created_at);

      const match = months.find(
        (m) =>
          m.month === date.getMonth() &&
          m.year === date.getFullYear()
      );

      if (match) match.appointments += 1;
    });

    // Count messages
    messages.forEach((item) => {
      if (!item.created_at) return;

      const date = new Date(item.created_at);

      if (isNaN(date)) return;

      const match = months.find(
        (m) =>
          m.month === date.getMonth() &&
          m.year === date.getFullYear()
      );
    
      if (match) match.messages += 1;
    });

    return months;
  };




  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-[#0F172A]">

      {/* ✅ MOBILE HEADER */}
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

      {/* ✅ SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full min-h-screen w-64   bg-white dark:bg-white/5 border-r z-50   transform transition-transform duration-300  ${mobileOpen ? "translate-x-0" : "-translate-x-full"}  md:translate-x-0 md:static md:w-64   flex flex-col justify-between p-4`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-xl mb-4"
        >
          ✕
        </button>

        <nav className="space-y-2 flex-1 overflow-y-auto">
          {/* 🌙 THEME TOGGLE (DESKTOP) */}
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
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* ✅ OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
     
        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div className="space-y-6">
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard icon={<Users />} label="Total Appointments" value={appointments.length} />
              <StatCard icon={<MessageSquare />} label="Total Messages" value={messages.length} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Bar Chart */}
              {/* 📈 MONTHLY ANALYTICS */}
              <div className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow">
                <h3 className="mb-4 font-semibold text-black dark:text-white">
                  Monthly Analytics
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getCombinedMonthlyData()}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {/* 🔵 Appointments */}
                    <Bar dataKey="appointments" fill="#3B82F6" radius={[6, 6, 0, 0]} />

                    {/* 🟢 Messages */}
                    <Bar dataKey="messages" fill="#22C55E" radius={[6, 6, 0, 0]} />

                  </BarChart>
                </ResponsiveContainer>
              </div>
                
              {/* Pie Chart */}
              <div className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow">
                <h3 className="mb-4 font-semibold">Distribution</h3>
                
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Appointments", value: appointments.length },
                        { name: "Messages", value: messages.length }
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

        {/* APPOINTMENTS */}
        {active === "appointments" && (
          <Section title="Appointment Leads" data={filteredAppointments}>

            <input
              type="text"
              placeholder="Search appointments..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 px-4 py-2 rounded-xl border bg-white dark:bg-white/10 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* 🔍 FILTER + SORT */}
            <div className="flex flex-wrap gap-3  text-black mb-4">

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

            {/* 🔥 CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

              {filteredAppointments.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow hover:shadow-xl flex flex-col items-start transition duration-300">

                  {/* HEADER */}
                  <div className="flex justify-between items-start gap-14 mb-3">

                    <h3 className="text-lg font-semibold text-blue-600">
                      {item.parent_name}
                    </h3>


                    <p className="text-sm items-end text-black-400 mb-4">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"

                          })
                        : item.date || "No date"}
                    </p>                    

                  </div>

                  <p className="text-sm font-medium"> {item.child_name}</p> 

                  <p className="text-sm text-gray-500 mb-2">Age: {item.age}</p>

                  <p className="text-sm mb-2"> {item.phone}</p>

                  <div className="text-sm text-gray-500 mb-3">
                    <p> {item.branch}</p>
                  </div>

                  <div className="text-sm text-gray-500 mb-3">
                    <p> {item.program}</p>
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

        {/* MESSAGES */}
        {active === "messages" && (
          <Section title="Contact Messages" data={filteredMessages}>

            <input
              type="text"
              placeholder="Search messages..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 px-4 py-2 rounded-xl border bg-white dark:bg-white/10 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* ✅ MOBILE VIEW (CARD UI) */}
            <div className="md:hidden space-y-4">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow hover:shadow-xl flex flex-col transition duration-300"
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-blue-600 font-semibold">
                      {msg.name}
                    </h3>

                    {/* ✅ DATE */}
                    <p className="text-xs text-gray-500">
                      {msg.created_at
                        ? new Date(msg.created_at).toLocaleDateString("en-IN")
                        : "No date"}
                    </p>
                  </div>
                      
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-sm text-blue-500 underline"
                  >
                    {msg.email}
                  </a>
                      
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {msg.message}
                  </p>
                      
                  <div className="flex gap-3 mt-3 text-xs">
                    <button
                      onClick={() => navigator.clipboard.writeText(msg.email)}
                      className="text-gray-500 hover:text-black dark:hover:text-white"
                    >
                      Copy
                    </button>
                      
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-green-600 hover:underline"
                    >
                      Reply
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ DESKTOP VIEW (TABLE UI) */}
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
                                  
                          {/* ✅ DATE */}
                          <span className="text-xs text-gray-500 mt-1">
                            {msg.created_at
                              ? new Date(msg.created_at).toLocaleDateString("en-IN")
                              : "No date"}
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
                            
                            <a
                              href={`mailto:${msg.email}`}
                              className="text-green-600 hover:underline"
                            >
                              Reply
                            </a>
                          </div>
                        </div>
                      </td>
                            
                      <td className="p-3 text-sm">
                        {msg.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
                
              </table>
            </div>
              
          </Section>
        )}

      </div>
    </div>
  );
}

/* 🔹 Components */



function SidebarItem({ icon, label, active, setActive, value, collapsed, setMobileOpen }) {
  return (
    <div
      onClick={() => {
        setActive(value);
        setMobileOpen(false); // ✅ CLOSE AFTER CLICK
      }}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
        active === value
          ? "bg-blue-600 text-white"
          : "hover:bg-gray-100 dark:hover:bg-white/10"
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

function Section({ title, children, data = [] }) {
  return (
    <div className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow space-y-4">
      
      <h2 className="text-lg font-semibold text-black dark:text-white">
        {title}
      </h2>

      {data.length > 0 ? (
        children
      ) : (
        <div className="text-center py-10 text-gray-500">
           No data found
        </div>
      )}

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