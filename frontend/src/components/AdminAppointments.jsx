import { useEffect, useState } from "react";
import API from "../services/api";
import AdminAnalytics from "./AdminAnalytics";
import toast from "react-hot-toast";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [filter, setFilter] = useState("all");

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      // FIX: was `const res = ("appointments/")` — missing await API.get
      const res = await API.get("appointments/");
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch appointments");
    }
  };

  // INITIAL LOAD + WEBSOCKET
  useEffect(() => {
    fetchAppointments();

    // ✅ Build WebSocket URL from current host (works in dev + production)
    let socket = null;
    try {
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsHost = window.location.hostname === "localhost" ? "127.0.0.1:8000" : window.location.host;
      socket = new WebSocket(`${wsProtocol}//${wsHost}/ws/appointments/`);

      socket.onopen = () => console.log("WebSocket connected");

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.message) toast.success(data.message);
        fetchAppointments();
      };

      socket.onerror = () => console.log("WebSocket unavailable (this is OK if channels is disabled)");
      socket.onclose = () => console.log("WebSocket disconnected");
    } catch (err) {
      console.log("WebSocket not available:", err);
    }

    return () => {
      if (socket) socket.close();
    };
  }, []);

  // Approve / Reject
  const updateStatus = async (id, action) => {
    try {
      setLoadingId(id);

      await API.post(`approve/${id}/`, { action });

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: action === "reject" ? "rejected" : "approved" }
            : item
        )
      );

      if (action === "reject") {
        toast.error("Appointment rejected");
      } else {
        toast.success("Appointment approved");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update appointment");
    } finally {
      setLoadingId(null);
    }
  };

  const statusStyle = {
    pending:  "bg-yellow-500/20 text-yellow-600 dark:text-yellow-300",
    approved: "bg-green-500/20  text-green-600  dark:text-green-300",
    rejected: "bg-red-500/20    text-red-600    dark:text-red-300",
  };

  // FIX: filter was never applied — now connected to state
  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  // FIX: filter button helper to avoid repeating active/inactive class logic
  const filterBtn = (label, value) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-4 py-2 rounded-full text-sm transition font-medium ${
        filter === value
          ? "bg-blue-600 text-white"
          : "bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black p-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading — FIX: was styled like a button card; now a clean heading */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Manage all appointment requests in real time.
        </p>

        {/* Analytics */}
        <AdminAnalytics appointments={appointments} />

        {/* Filter Buttons — FIX: all wired to setFilter */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {filterBtn("All", "all")}
          {filterBtn("Pending", "pending")}
          {filterBtn("Approved", "approved")}
          {filterBtn("Rejected", "rejected")}
        </div>

        {/* Appointment count */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Showing {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? "s" : ""}
        </p>

        {/* FIX: was hardcoded static card — now maps real appointment data */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            // FIX: empty state added
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-10 text-center text-gray-400 dark:text-gray-500">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-medium">
                No {filter === "all" ? "" : filter} appointments found.
              </p>
            </div>
          ) : (
            filteredAppointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  {/* User Info */}
                  <div>
                    <p className="font-semibold text-lg text-gray-900 dark:text-white">
                      {appt.parent_name}
                      {appt.child_name && (
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                          (Child: {appt.child_name})
                        </span>
                      )}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      {appt.date} • {appt.time} • {appt.branch}
                    </p>
                    {appt.program && (
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                        Program: {appt.program}
                      </p>
                    )}
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-3 flex-wrap">

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle[appt.status]}`}>
                      {appt.status}
                    </span>

                    {appt.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(appt.id, "approve")}
                          disabled={loadingId === appt.id}
                          className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          {loadingId === appt.id ? "..." : "Approve"}
                        </button>

                        <button
                          onClick={() => updateStatus(appt.id, "reject")}
                          disabled={loadingId === appt.id}
                          className="px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-300 transition disabled:opacity-50"
                        >
                          {loadingId === appt.id ? "..." : "Reject"}
                        </button>
                      </>
                    )}

                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminAppointments;
