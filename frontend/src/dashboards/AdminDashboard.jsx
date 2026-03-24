import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";

import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
  LayoutDashboard,
  FileText
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function AdminDashboard() {

  const userStore = useAuthStore();
  const user = userStore.user || {
    username: localStorage.getItem("username"),
  };

  const [appointments, setAppointments] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("dashboard");

  // ✅ Fetch
  const fetchAppointments = async () => {
    try {
      const res = await API.get("appointments/");
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchAppointments();

    const interval = setInterval(fetchAppointments, 10000);
    return () => clearInterval(interval);
  }, []);

  // ✅ WebSocket (real-time)
  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";

    const wsURL =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
        ? `${wsProtocol}://127.0.0.1:8000/ws/appointments/`
        : `${wsProtocol}://${window.location.hostname}:8000/ws/appointments/`;

    // const socket = new WebSocket(wsURL);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === data.id ? { ...a, status: data.status } : a
        )
      );

      toast.success(`Appointment ${data.status}`);
    };

    return () => socket.close();
  }, []);

  // ✅ Approve / Reject
  const updateStatus = async (id, action) => {
    try {
      setLoadingId(id);

      await API.post(`approve/${id}/`, { action });

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: action === "reject" ? "rejected" : "approved",
              }
            : item
        )
      );

      toast.success(
        action === "reject" ? "Rejected successfully" : "Approved successfully"
      );

    } catch {
      toast.error("Action failed");
    } finally {
      setLoadingId(null);
    }
  };

  const total = appointments.length;
  const pending = appointments.filter(a => a.status === "pending").length;
  const approved = appointments.filter(a => a.status === "approved").length;
  const rejected = appointments.filter(a => a.status === "rejected").length;

  const chartData = [
    { name: "Pending", value: pending },
    { name: "Approved", value: approved },
    { name: "Rejected", value: rejected }
  ];

  const statusStyle = {
    pending: "bg-yellow-500/20 text-yellow-300",
    approved: "bg-green-500/20 text-green-300",
    rejected: "bg-red-500/20 text-red-300",
  };

  const filteredAppointments = appointments
    .filter((a) => filter === "all" ? true : a.status === filter)
    .filter((a) =>
      String(a.user || "").toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#111827] to-[#020617] text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617] border-r border-white/10 p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

        <div className="space-y-3">

          <button onClick={() => setActive("dashboard")} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${active === "dashboard" ? "bg-white/10 text-blue-400" : "hover:bg-white/5"}`}>
            <LayoutDashboard size={18}/> Dashboard
          </button>

          <button onClick={() => setActive("appointments")} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${active === "appointments" ? "bg-white/10 text-blue-400" : "hover:bg-white/5"}`}>
            <Users size={18}/> Appointments
          </button>

          <button onClick={() => setActive("reports")} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${active === "reports" ? "bg-white/10 text-blue-400" : "hover:bg-white/5"}`}>
            <FileText size={18}/> Reports
          </button>

        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold capitalize">{active}</h1>

          <div className="flex items-center gap-4">
            {active === "appointments" && (
              <input
                placeholder="Search..."
                className="bg-white/10 px-4 py-2 rounded-lg outline-none"
                onChange={(e) => setSearch(e.target.value)}
              />
            )}

            <p className="text-sm text-gray-400">
              {user?.username}
            </p>
          </div>
        </div>

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <>
            <div className="grid md:grid-cols-4 gap-4 mb-8">

              <div className="bg-white/5 p-4 rounded-xl flex gap-3">
                <Users />
                <div>
                  <p className="text-sm text-gray-400">Total</p>
                  <h2 className="text-xl font-bold">{total}</h2>
                </div>
              </div>

              <div className="bg-yellow-500/10 p-4 rounded-xl flex gap-3">
                <Clock />
                <div>
                  <p className="text-sm">Pending</p>
                  <h2 className="text-xl font-bold">{pending}</h2>
                </div>
              </div>

              <div className="bg-green-500/10 p-4 rounded-xl flex gap-3">
                <CheckCircle />
                <div>
                  <p className="text-sm">Approved</p>
                  <h2 className="text-xl font-bold">{approved}</h2>
                </div>
              </div>

              <div className="bg-red-500/10 p-4 rounded-xl flex gap-3">
                <XCircle />
                <div>
                  <p className="text-sm">Rejected</p>
                  <h2 className="text-xl font-bold">{rejected}</h2>
                </div>
              </div>

            </div>

            <div className="bg-white/5 p-6 rounded-xl h-72">
              <h2 className="mb-4">Appointments Overview</h2>

              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* APPOINTMENTS */}
        {active === "appointments" && (
          <>
            <div className="flex gap-2 mb-6">
              {["all", "pending", "approved", "rejected"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1 rounded-full ${filter === f ? "bg-white text-black" : "bg-white/10"}`}
                >
                  {f}
                </button>
              ))}
            </div>

            {filteredAppointments.length === 0 && (
              <p className="text-gray-400">No appointments found</p>
            )}

            <div className="space-y-4">
              {filteredAppointments.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 p-5 rounded-xl flex justify-between items-center flex-wrap gap-4"
                >
                  <div>
                    <h3 className="font-semibold">{item.user}</h3>
                    <p className="text-sm text-gray-400">
                      {item.date} • {item.time}
                    </p>
                  </div>

                  <div className="flex gap-3 items-center">

                    <span className={`px-3 py-1 rounded ${statusStyle[item.status]}`}>
                      {item.status}
                    </span>

                    {item.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(item.id, "approve")}
                          disabled={loadingId === item.id}
                          className="bg-green-500 px-3 py-1 rounded"
                        >
                          {loadingId === item.id ? "..." : "Approve"}
                        </button>

                        <button
                          onClick={() => updateStatus(item.id, "reject")}
                          disabled={loadingId === item.id}
                          className="bg-red-500 px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* REPORTS */}
        {active === "reports" && (
          <div className="bg-white/5 p-6 rounded-xl">
            <h2 className="text-lg mb-4">Reports</h2>

            <p className="text-gray-400">
              Generate analytics or export reports here.
            </p>

            <button className="mt-4 bg-blue-500 px-4 py-2 rounded">
              Generate Report
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;