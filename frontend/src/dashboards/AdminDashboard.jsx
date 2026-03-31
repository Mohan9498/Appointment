import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { Users, Phone, Calendar, Search } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const logout = useAuthStore((state) => state.logout);

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

  const filtered = appointments.filter((a) =>
    `${a.parent_name} ${a.child_name} ${a.phone} ${a.branch}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const total = appointments.length;
  const today = new Date().toISOString().split("T")[0];
  const todayCount = appointments.filter((a) => a.date === today).length;

  return (
    <div className="min-h-screen 
    bg-white dark:bg-white/5 
    backdrop-blur-md
    text-gray-700 dark:text-gray-300 
    p-4 md:p-6 transition duration-300">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
        
        <h1 className="text-xl md:text-3xl font-bold text-black dark:text-white">
          Admin Dashboard
        </h1>

        <div className="flex items-center gap-3 w-full md:w-auto">

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 text-gray-500  dark:text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search client..."
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-100 dark:bg-white/10 
              text-black dark:text-white
              pl-9 pr-4 py-2 rounded-lg outline-none text-sm w-full"
            />
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white dark:bg-white/5 
        border border-gray-200 dark:border-white/10 
        p-4 rounded-xl flex items-center gap-3 shadow-sm">
          <Users className="text-blue-500" />
          <div>
            <p className="text-xs text-gray-500  dark:text-gray-400">Total Clients</p>
            <h2 className="text-xl font-bold text-black dark:text-white">{total}</h2>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 
        border border-gray-200 dark:border-white/10 
        p-4 rounded-xl flex items-center gap-3 shadow-sm">
          <Calendar className="text-green-500" />
          <div>
            <p className="text-xs text-gray-500  dark:text-gray-400">Today Leads</p>
            <h2 className="text-xl font-bold text-black dark:text-white">{todayCount}</h2>
          </div>
        </div>

      </div>

      {/* CLIENT LIST */}
      <div className="bg-white dark:bg-white/5 
      border border-gray-200 dark:border-white/10 
      backdrop-blur-md 
      p-4 rounded-xl shadow-sm">

        <h2 className="text-lg mb-4 text-black dark:text-white">
          Client Details
        </h2>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <p className="text-gray-500  dark:text-gray-400 text-center py-10">
            No clients found 📭
          </p>
        )}

        {/* CLIENT CARDS */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-gray-100 dark:bg-white/5 
              border border-gray-200 dark:border-white/10
              p-4 rounded-xl flex justify-between items-center flex-wrap gap-3 
              hover:scale-[1.02] transition"
            >
              {/* LEFT */}
              <div>
                <h3 className="font-semibold text-sm text-blue-500">
                  {item.parent_name}
                </h3>

                <p className="text-xs text-gray-500  dark:text-gray-400">
                  👶 {item.child_name} ({item.age} yrs)
                </p>

                <p className="text-xs text-gray-500  dark:text-gray-400">
                  📞 {item.phone}
                </p>

                <p className="text-xs text-gray-500  dark:text-gray-400">
                  📍 {item.branch} • 📘 {item.program}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex gap-2">

                <a
                  href={`tel:${item.phone}`}
                  className="flex items-center gap-1 bg-green-500 hover:bg-green-600 px-3 py-1 text-xs rounded-lg text-white"
                >
                  <Phone size={14} /> Call
                </a>

                <a
                  href={`https://wa.me/91${item.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 text-xs rounded-lg text-white"
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