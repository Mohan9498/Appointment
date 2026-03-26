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
    let socket = null;  
    //  Disabled (Redis not running)
    const enableWebSocket = false;

    if (enableWebSocket) {
      const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
      
      const wsURL =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
        ? `${wsProtocol}://127.0.0.1:8000/ws/appointments/`
        : `${wsProtocol}://${window.location.hostname}:8000/ws/appointments/`;

    socket = new WebSocket(wsURL);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === data.id ? { ...a, status: data.status } : a
        )
      );

      toast.success(`Appointment ${data.status}`);
    };
  }
  return () => {
    if (socket) socket.close();
  };
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
    <div className="min-h-screen bg-background px-4 sm:px-6 md:px-10 py-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-dark">
          Admin Dashboard
        </h1>
        <p className="text-text-light mt-1 text-sm">
          Overview of appointments and system activity
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary-light text-primary">
            <Users size={22} />
          </div>
          <div>
            <p className="text-sm text-text-light">Total</p>
            <h2 className="text-2xl font-bold text-dark">120</h2>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-4">
          <div className="p-3 rounded-xl bg-warning/20 text-warning">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-sm text-text-light">Pending</p>
            <h2 className="text-2xl font-bold text-warning">32</h2>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-4">
          <div className="p-3 rounded-xl bg-success/20 text-success">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-sm text-text-light">Approved</p>
            <h2 className="text-2xl font-bold text-success">70</h2>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-4">
          <div className="p-3 rounded-xl bg-danger/20 text-danger">
            <XCircle size={22} />
          </div>
          <div>
            <p className="text-sm text-text-light">Rejected</p>
            <h2 className="text-2xl font-bold text-danger">18</h2>
          </div>
        </div>

      </div>

      {/* Content Section */}
      <div className="mt-10 grid md:grid-cols-2 gap-6">

        {/* Chart Placeholder */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-dark mb-4">
            Appointments Overview
          </h2>

          <div className="h-48 flex items-center justify-center text-text-light text-sm">
            Chart goes here
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-dark mb-4">
            Recent Activity
          </h2>

          <ul className="space-y-3 text-sm text-text-light">
            <li>New appointment booked</li>
            <li>Appointment approved</li>
            <li>New user registered</li>
          </ul>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;