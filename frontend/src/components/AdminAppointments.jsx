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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-dark mb-6">
          Admin Dashboard
        </h1>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6 flex-wrap">
           <button className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-primary-hover transition">
            Active
           </button>

           <button className="bg-muted text-dark px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition">
             Pending
           </button>

           <button className="bg-muted text-dark px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition">
             Approved
           </button>

           <button className="bg-muted text-dark px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition">
             Rejected
           </button>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* User Info */}
            <div>
              <p className="text-dark font-semibold text-lg">
                User Name
              </p>
              <p className="text-text-light text-sm mt-1">
                Date • Time
              </p>
            </div>

            {/* Status + Actions */}
            <div className="flex items-center gap-3 flex-wrap">

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-600">
                Pending
              </span>

              <button className="px-4 py-2 rounded-full bg-primary text-white text-sm hover:bg-primary-hover transition">
                Approve
              </button>

              <button className="px-4 py-2 rounded-full bg-gray-200 text-dark text-sm hover:bg-gray-300 transition">
                Reject
              </button>

             </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminAppointments;