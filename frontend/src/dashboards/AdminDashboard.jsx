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

  const [collapsed, setCollapsed] = useState(false);

  const [sort, setSort] = useState("latest");
  const [branchFilter, setBranchFilter] = useState("all");

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
    return new Date(b.created_at) - new Date(a.created_at);
  } else {
    return new Date(a.created_at) - new Date(b.created_at);
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


useEffect(() => {
  const isAdmin =
    localStorage.getItem("access") &&
    localStorage.getItem("is_admin") === "true";

  if (!isAdmin) {
    navigate("/login", { replace: true });
  }
}, []);


console.log("Appointments:", appointments);
console.log("Filtered:", filteredAppointments);
console.log("Messages:", messages);
console.log("Filtered Messages:", filteredMessages);

  return (
    <div className="h-screen w-full flex bg-gray-100 dark:bg-[#0F172A]">
      

      {/* SIDEBAR */}
      <div
        className={`${
          collapsed ? "w-20" : "w-56"
        } transition-all duration-300 bg-white dark:bg-white/5 border-r border-gray-200 dark:border-white/10 p-4 flex flex-col`}
      >

        {/* TOP */}
        <div className="flex justify-between items-center mb-6">
          {!collapsed && (
            <h1 className="text-xl font-bold text-black dark:text-white">
              Admin Panel
            </h1>
          )}
          
          <div className="flex items-center gap-2">
            
            {/* ☰ COLLAPSE */}
            
            <button
              onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition" >   ☰
            </button>
            
            
            {/* 🌙 THEME */}
            
            <button
              onClick={() => setDark(!dark)}
              className="px-2 py-1 rounded-lg text-sm bg-gray-200 dark:bg-white/10 text-black dark:text-white" >
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
          
        </div>

        {/* NAV */}
        <nav className="space-y-2 flex-1">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={active}
            setActive={setActive}
            value="dashboard"
            collapsed={collapsed}
          />

          <SidebarItem
            icon={<Calendar size={18} />}
            label="Appointments"
            active={active}
            setActive={setActive}
            value="appointments"
            collapsed={collapsed}
          />

          <SidebarItem
            icon={<MessageSquare size={18} />}
            label="Messages"
            active={active}
            setActive={setActive}
            value="messages"
            collapsed={collapsed}
          />
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm transition"
        >
          {collapsed ? "⎋" : "Logout"}
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
        <Section title="Appointment Leads" data={filteredAppointments}>

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
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

            {filteredAppointments.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow hover:shadow-xl flex flex-col items-start transition duration-300">

                {/* HEADER */}
                <div className="flex justify-between items-start mb-3">

                  <h3 className="text-lg font-semibold text-blue-600">
                    {item.parent_name}
                  </h3>

                  {/* 🟢 STATUS BADGE */}
                  <span
                    onClick={() => toggleStatus(item.id)}
                    className={`text-xs px-3 py-1 rounded-full cursor-pointer ${
                    getStatus(item.id) === "new"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-700"
                    }`}
                  >
                  {getStatus(item.id) === "new" ? " New" : " Contacted"}
                  </span>

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

                <p className="text-xs text-gray-400 mb-4">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString("en-IN")
                    : "No date"}
                </p>

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

           <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">

              <thead>
                <tr className="bg-gray-100 dark:bg-white/10 text-sm">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMessages.map((msg) => (
                  <tr
                   key={msg.id}
                   className="border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                    <td className="p-3 font-medium text-blue-600">
                      {msg.name}
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col">
                        {/* EMAIL LINK */}
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-blue-600 hover:underline text-sm font-medium" >
                            {msg.email}
                        </a>
                        {/* ACTIONS */}
                        <div className="flex gap-3 mt-1 text-xs">
                          <button
                            onClick={() => navigator.clipboard.writeText(msg.email)}
                            className="text-gray-500 hover:text-black dark:hover:text-white" >
                              Copy
                          </button>
                          
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-green-600 hover:underline"  >
                                Reply
                          </a>

                        </div>

                      </div>
                    </td>


                    <td className="p-3 text-sm">
                       {msg.message}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs" 
                      >
                        Delete
                      </button>
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



function SidebarItem({ icon, label, active, setActive, value, collapsed }) {
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