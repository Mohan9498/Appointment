import { useEffect, useState } from "react";
import API from "../services/api";
import AdminAnalytics from "./AdminAnalytics";
import toast from "react-hot-toast";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [filter, setFilter] = useState("all");

  //  Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await API.get("appointments/");
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch appointments");
    }
  };

  //  INITIAL LOAD + WEBSOCKET
  useEffect(() => {
    fetchAppointments();

    const socket = new WebSocket("ws://127.0.0.1:8000/ws/appointments/");

    socket.onopen = () => {
      console.log(" WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log(" Realtime update:", data);

      //  Toast notification from backend
      if (data.message) {
        toast.success(data.message);
      }

      //  Refresh instantly
      fetchAppointments();
    };

    socket.onerror = (err) => {
      console.log("WebSocket error:", err);
    };

    socket.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    return () => socket.close();
  }, []);

  //  Approve / Reject
  const updateStatus = async (id, action) => {
    try {
      setLoadingId(id);

      await API.post(`approve/${id}/`, { action });

      //  Optimistic update
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

      //  Toast
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
    pending: "bg-yellow-500/20 text-yellow-300",
    approved: "bg-green-500/20 text-green-300",
    rejected: "bg-red-500/20 text-red-300",
  };

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f172a] to-black p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "approved", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm capitalize transition ${
                  filter === f
                    ? "bg-white text-black"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <AdminAnalytics appointments={appointments} />

        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-gray-400 backdrop-blur-xl">
              No appointments found.
            </div>
          ) : (
            filteredAppointments.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:bg-white/[0.07]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {item.user || item.username || "User"}
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      {item.date} • {item.time}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[item.status]}`}
                    >
                      {item.status}
                    </span>

                    {item.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(item.id, "approve")}
                          disabled={loadingId === item.id}
                          className="px-4 py-2 rounded-full bg-green-500 text-black font-medium hover:opacity-90 disabled:opacity-50"
                        >
                          {loadingId === item.id ? "Updating..." : "Approve"}
                        </button>

                        <button
                          onClick={() => updateStatus(item.id, "reject")}
                          disabled={loadingId === item.id}
                          className="px-4 py-2 rounded-full bg-red-500 text-white font-medium hover:opacity-90 disabled:opacity-50"
                        >
                          {loadingId === item.id ? "Updating..." : "Reject"}
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