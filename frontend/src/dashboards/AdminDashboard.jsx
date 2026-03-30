import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { Users, Phone, Calendar, Search } from "lucide-react";

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch once (FIXED duplicate call)
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

  // 🔍 Smart search
  const filtered = appointments.filter((a) =>
    `${a.parent_name} ${a.child_name} ${a.phone} ${a.branch}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 📊 Stats
  const total = appointments.length;
  const today = new Date().toISOString().split("T")[0];
  const todayCount = appointments.filter((a) => a.date === today).length;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4 md:p-6">

      {/* 🔥 HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
        <h1 className="text-xl md:text-3xl font-bold">
          Admin Dashboard
        </h1>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search client..."
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/10 pl-9 pr-4 py-2 rounded-lg outline-none text-sm w-full"
          />
        </div>
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white/10 p-4 rounded-xl flex items-center gap-3">
          <Users className="text-blue-400" />
          <div>
            <p className="text-xs text-gray-400">Total Clients</p>
            <h2 className="text-xl font-bold">{total}</h2>
          </div>
        </div>

        <div className="bg-white/10 p-4 rounded-xl flex items-center gap-3">
          <Calendar className="text-green-400" />
          <div>
            <p className="text-xs text-gray-400">Today Leads</p>
            <h2 className="text-xl font-bold">{todayCount}</h2>
          </div>
        </div>

      </div>

      {/* 📋 CLIENT LIST */}
      <div className="bg-white/5 p-4 rounded-xl">

        <h2 className="text-lg mb-4">Client Details</h2>

        {/* ⏳ Loading */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* ❌ Empty */}
        {!loading && filtered.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            No clients found 📭
          </p>
        )}

        {/* ✅ CLIENT CARDS */}
        <div className="space-y-3 max-h-[65vh] overflow-y-auto">

          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white/10 p-4 rounded-xl flex justify-between items-center flex-wrap gap-3 hover:bg-white/20 transition"
            >
              {/* LEFT */}
              <div>
                <h3 className="font-semibold text-sm text-blue-400">
                  {item.parent_name}
                </h3>

                <p className="text-xs text-gray-400">
                  👶 {item.child_name} ({item.age} yrs)
                </p>

                <p className="text-xs text-gray-400">
                  📞 {item.phone}
                </p>

                <p className="text-xs text-gray-400">
                  📍 {item.branch} • 📘 {item.program}
                </p>

              </div>

              {/* RIGHT */}
              <div className="flex gap-2">

                {/* 📞 CALL */}
                <a
                  href={`tel:${item.phone}`}
                  className="flex items-center gap-1 bg-green-500 hover:bg-green-600 px-3 py-1 text-xs rounded-lg"
                >
                  <Phone size={14} /> Call
                </a>

                {/* 💬 WHATSAPP */}
                <a
                  href={`https://wa.me/91${item.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 text-xs rounded-lg"
                >
                  WhatsApp
                </a>

              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;