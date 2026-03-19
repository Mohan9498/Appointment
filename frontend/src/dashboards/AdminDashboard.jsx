import { useEffect, useState } from "react";
import API from "../services/api";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("appointments/");
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, action) => {
    try {
      setLoadingId(id);

      const res = await API.patch(`appointments/${id}/approve/`, {
        action,
      });

      setAppointments((prev) =>
        prev.map((item) => (item.id === id ? res.data : item))
      );
    } catch (err) {
      console.log(err);
      alert("Failed to update appointment");
    } finally {
      setLoadingId(null);
    }
  };

  const statusStyle = {
    pending: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20",
    approved: "bg-green-500/15 text-green-300 border border-green-500/20",
    rejected: "bg-red-500/15 text-red-300 border border-red-500/20",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-[#111] border border-gray-800 rounded-3xl p-4 sm:p-6">
        <h1 className="text-2xl font-semibold text-white mb-6">
          Appointment Approval
        </h1>

        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-gray-400">No appointments found.</div>
          ) : (
            appointments.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-800 bg-[#0f0f0f] p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold">{item.username}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {item.date} at {item.time}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
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