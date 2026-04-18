import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Users,
  Calendar,
  MessageSquare,
  LayoutDashboard,
  FileText
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";

function AdminDashboard() {

  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState([]);

  const [active, setActive] = useState("dashboard");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  /* =========================
     🔐 AUTH PROTECTION
  ========================== */
  useEffect(() => {
    const isAdmin =
      localStorage.getItem("access") &&
      localStorage.getItem("is_admin") === "true";

    if (!isAdmin) {
      navigate("/login", { replace: true });
    }
  }, []);

  /* =========================
     📊 DATA FETCHING
  ========================== */

  const fetchAppointments = async () => {
    const res = await API.get("appointments/");
    setAppointments(res.data);
  };

  const fetchMessages = async () => {
    const res = await API.get("contact/");
    setMessages(res.data);
  };

  const fetchContent = async () => {
    const res = await API.get("content/");
    setContent(res.data);
  };

  useEffect(() => {
    fetchAppointments();
    fetchMessages();
    fetchContent();
  }, []);

  /* =========================
     🧠 CMS ACTIONS
  ========================== */

  const updateContent = async (id, data) => {
    await API.patch("content/", { id, ...data });
    fetchContent();
    toast.success("Updated");
  };

  const deleteContent = async (id) => {
    await API.delete("content/", { data: { id } });
    fetchContent();
    toast.success("Deleted");
  };

  const createContent = async () => {
    await API.post("content/", {
      page: "home",
      section: "new-section",
      title: "New Section",
      description: ""
    });
    fetchContent();
  };

  /* =========================
     🔓 LOGOUT
  ========================== */

  const handleLogout = () => {
    localStorage.clear();
    logout();
    navigate("/login");
  };

  /* =========================
     🎯 FILTERS
  ========================== */

  const filteredAppointments = appointments.filter((a) =>
    `${a.parent_name} ${a.child_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredMessages = messages.filter((m) =>
    `${m.name} ${m.message}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-white dark:bg-black p-4 border-r">

        <h1 className="font-bold mb-6">Admin</h1>

        <SidebarItem label="Dashboard" value="dashboard" active={active} setActive={setActive} icon={<LayoutDashboard />} />
        <SidebarItem label="Appointments" value="appointments" active={active} setActive={setActive} icon={<Calendar />} />
        <SidebarItem label="Messages" value="messages" active={active} setActive={setActive} icon={<MessageSquare />} />
        <SidebarItem label="CMS Content" value="content" active={active} setActive={setActive} icon={<FileText />} />

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white w-full py-2 rounded"
        >
          Logout
        </button>

      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 p-6">

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div>
            <h2 className="text-xl mb-4">Dashboard</h2>
            <p>Total Appointments: {appointments.length}</p>
            <p>Total Messages: {messages.length}</p>
          </div>
        )}

        {/* APPOINTMENTS */}
        {active === "appointments" && (
          <div>
            <h2>Appointments</h2>

            <input
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 mb-4"
            />

            {filteredAppointments.map((a) => (
              <div key={a.id} className="border p-3 mb-2">
                <h3>{a.parent_name}</h3>
                <p>{a.child_name}</p>
                <p>{a.phone}</p>
              </div>
            ))}
          </div>
        )}

        {/* MESSAGES */}
        {active === "messages" && (
          <div>
            <h2>Messages</h2>

            <input
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 mb-4"
            />

            {filteredMessages.map((m) => (
              <div key={m.id} className="border p-3 mb-2">
                <h3>{m.name}</h3>
                <p>{m.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* CMS CONTENT */}
        {active === "content" && (
          <div>

            <h2 className="text-xl mb-4">CMS Content</h2>

            <button
              onClick={createContent}
              className="bg-blue-600 text-white px-4 py-2 mb-4"
            >
              + Add Content
            </button>

            {content.map((item) => (
              <div key={item.id} className="border p-4 mb-4">

                <input
                  value={item.page}
                  onChange={(e) =>
                    updateContent(item.id, { page: e.target.value })
                  }
                  className="border p-2 mb-2 w-full"
                />

                <input
                  value={item.section}
                  onChange={(e) =>
                    updateContent(item.id, { section: e.target.value })
                  }
                  className="border p-2 mb-2 w-full"
                />

                <input
                  value={item.title || ""}
                  onChange={(e) =>
                    updateContent(item.id, { title: e.target.value })
                  }
                  className="border p-2 mb-2 w-full"
                />

                <textarea
                  value={item.description || ""}
                  onChange={(e) =>
                    updateContent(item.id, { description: e.target.value })
                  }
                  className="border p-2 mb-2 w-full"
                />

                <button
                  onClick={() => deleteContent(item.id)}
                  className="bg-red-500 text-white px-3 py-1"
                >
                  Delete
                </button>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

/* COMPONENT */
function SidebarItem({ label, value, active, setActive, icon }) {
  return (
    <div
      onClick={() => setActive(value)}
      className={`flex items-center gap-2 p-2 cursor-pointer ${
        active === value ? "bg-blue-600 text-white" : ""
      }`}
    >
      {icon}
      {label}
    </div>
  );
}

export default AdminDashboard;