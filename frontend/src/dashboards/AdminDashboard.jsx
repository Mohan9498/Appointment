import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { Users, Phone } from "lucide-react";

function AdminDashboard() {

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await API.get("appointments/");
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 🔍 Search filter
  const filtered = appointments.filter((a) =>
    `${a.name} ${a.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const total = appointments.length;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4 md:p-6">

      {/* 🔥 HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
        <h1 className="text-xl md:text-3xl font-bold">
          Admin Dashboard
        </h1>

        <input
          type="text"
          placeholder="Search name or phone..."
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/10 px-4 py-2 rounded-lg outline-none text-sm w-full md:w-72"
        />
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-4 rounded-xl flex items-center gap-3 backdrop-blur-lg">
          <Users className="text-blue-400" />
          <div>
            <p className="text-xs text-gray-400">Total Bookings</p>
            <h2 className="text-xl font-bold">{total}</h2>
          </div>
        </div>

      </div>

      {/* 📋 APPOINTMENTS LIST */}
      <div className="bg-white/5 p-4 rounded-xl backdrop-blur-lg">

        <h2 className="text-lg mb-4">Appointments</h2>

        {/* ⏳ Loading */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* ❌ Empty */}
        {!loading && filtered.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            No bookings found 📅
          </p>
        )}

        {/* ✅ LIST */}
        <div className="space-y-3 max-h-[65vh] overflow-y-auto">

          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white/10 p-4 rounded-xl flex justify-between items-center flex-wrap gap-3 hover:bg-white/20 transition"
            >
              <div>
                <h3 className="font-semibold text-sm">
                  {item.name || "Client"}
                </h3>

                <p className="text-xs text-gray-400">
                  📞 {item.phone || "No phone"}
                </p>

                <p className="text-xs text-gray-400">
                  📅 {item.date} • ⏰ {item.time}
                </p>
              </div>

              {/* 📞 CALL BUTTON */}
              <a
                href={`tel:${item.phone}`}
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600 px-3 py-1 text-xs rounded-lg transition"
              >
                <Phone size={14} /> Call
              </a>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;