import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

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

  const [appointments, setAppointments] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("dashboard");

  // ✅ FETCH DATA
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
  }, []);

  // ✅ UPDATE STATUS
  const updateStatus = async (id, action) => {
    try {
      setLoadingId(id);

      await API.post(`approve/${id}/`, {
         action: action || "approve"
      });

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
        action === "reject" ? "Rejected" : "Approved"
      );

    } catch {
      toast.error("Action failed");
    } finally {
      setLoadingId(null);
    }
  };

  // ✅ STATS
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
    <div className="flex min-h-screen bg-[#0F172A] text-white">

      {/* SIDEBAR */}
      <div className="w-60 bg-black/30 backdrop-blur-lg p-5 hidden md:block rounded-r-2xl">

        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <div className="space-y-3 text-sm">

          <button
            onClick={() => setActive("dashboard")}
            className={`flex items-center gap-2 p-2 rounded-lg w-full ${
              active === "dashboard" && "bg-white/10 text-blue-400"
            }`}
          >
            <LayoutDashboard size={18}/> Dashboard
          </button>

          <button
            onClick={() => setActive("appointments")}
            className={`flex items-center gap-2 p-2 rounded-lg w-full ${
              active === "appointments" && "bg-white/10 text-blue-400"
            }`}
          >
            <Users size={18}/> Appointments
          </button>

          <button
            onClick={() => setActive("reports")}
            className={`flex items-center gap-2 p-2 rounded-lg w-full ${
              active === "reports" && "bg-white/10 text-blue-400"
            }`}
          >
            <FileText size={18}/> Reports
          </button>

        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-4 md:p-6">

        {/* HEADER */}
        <div className="flex justify-between mb-5">
          <h1 className="text-xl md:text-2xl font-bold capitalize">{active}</h1>

          {active === "appointments" && (
            <input
              placeholder="Search user..."
              className="bg-white/10 px-4 py-2 rounded-lg outline-none text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
        </div>

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <>
            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

              <Card icon={<Users />} label="Total" value={total} />
              <Card icon={<Clock />} label="Pending" value={pending} color="yellow" />
              <Card icon={<CheckCircle />} label="Approved" value={approved} color="green" />
              <Card icon={<XCircle />} label="Rejected" value={rejected} color="red" />

            </div>

            {/* CHART */}
            <div className="bg-white/5 p-4 rounded-xl h-60">
              <h2 className="mb-3 text-sm">Appointments Overview</h2>

              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* APPOINTMENTS */}
        {active === "appointments" && (
          <>
            {/* FILTER */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {["all", "pending", "approved", "rejected"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filter === f ? "bg-white text-black" : "bg-white/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* LIST */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {filteredAppointments.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 p-4 rounded-xl flex justify-between items-center flex-wrap gap-3"
                >
                  <div>
                    <h3 className="font-semibold text-sm">{item.user}</h3>
                    <p className="text-xs text-gray-400">
                      {item.date} • {item.time}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center">

                    <span className={`px-2 py-1 text-xs rounded ${statusStyle[item.status]}`}>
                      {item.status}
                    </span>

                    {item.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(item.id, "approve")}
                          disabled={loadingId === item.id}
                          className="bg-green-500 px-2 py-1 text-xs rounded"
                        >
                          ✓
                        </button>

                        <button
                          onClick={() => updateStatus(item.id, "reject")}
                          disabled={loadingId === item.id}
                          className="bg-red-500 px-2 py-1 text-xs rounded"
                        >
                          ✕
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
          <div className="bg-white/5 p-5 rounded-xl max-w-xl">

            <h2 className="text-lg mb-2">Reports</h2>

            <p className="text-sm text-gray-400">
              Generate analytics reports to track appointment trends, approvals,
              and system performance.
            </p>

            <button className="mt-4 bg-blue-500 px-4 py-2 rounded text-sm">
              Generate Report
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

/* 🔥 REUSABLE CARD */
function Card({ icon, label, value, color }) {
  return (
    <div className={`bg-white/5 p-4 rounded-xl flex gap-3 items-center`}>
      <div className={`text-${color || "blue"}-400`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <h2 className="text-lg font-bold">{value}</h2>
      </div>
    </div>
  );
}

export default AdminDashboard;