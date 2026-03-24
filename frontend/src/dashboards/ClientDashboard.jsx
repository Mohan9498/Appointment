import { useEffect, useState } from "react";
import API from "../services/api";
import CalendarBooking from "../components/CalendarBooking";
import toast from "react-hot-toast";

function ClientDashboard() {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("appointments/");
      setAppointments(res.data);
    } catch (err) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    //  auto refresh every 10 sec
    const interval = setInterval(fetchAppointments, 10000);
    return () => clearInterval(interval);

  }, []);

  const book = async (data) => {
    try {
      setBooking(true);

      await API.post("appointments/", data);

      toast.success("Appointment booked!");

      fetchAppointments(); // refresh list

    } catch (err) {
      toast.error("Booking failed");
    } finally {
      setBooking(false);
    }
  };

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/appointments/");
    
    socket.onmessage = (event) => {
       const data = JSON.parse(event.data);
       
       setAppointments(prev =>
         prev.map(a =>
            a.id === data.id ? { ...a, status: data.status } : a
         )
       );
    }; 
    
    return () => socket.close();
}, []);


  return (

    <div className="max-w-full mx-auto px-3 py-4 xs:px-4 sm:px-6 md:px-10 bg-bg min-h-screen">

      {/* Title */}
      <h1 className="text-base text-rose-400 xs:text-lg sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">
        Client Dashboard
      </h1>

      {/* Layout */}
      <div className="grid grid-cols-1 p-10 md:grid-cols-2 gap-4 xs:gap-5 md:gap-8">

        {/* Calendar */}
        <div className="bg-white rounded-3xl shadow-md p-10 xs:p-4">
          <CalendarBooking onBook={book} booking={booking} />
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-2xl shadow-md p-3 xs:p-4 max-h-[450px] overflow-y-auto">

          <h2 className="text-sm text-teal-400 xs:text-base sm:text-xl font-semibold mb-3 sm:mb-4">
            My Appointments
          </h2>

          {/*  Loading */}
          {loading && (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/*  Empty */}
          {!loading && appointments.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-10">
              No appointments yet 📅
            </p>
          )}

          {/*  List */}
          {!loading && appointments.map(a => (
            <div
              key={a.id}
              className="border p-3 mb-3 rounded-xl shadow-sm text-xs xs:text-sm md:text-base hover:shadow-md transition"
            >
              <p><span className="font-medium">Date:</span> {a.date}</p>
              <p><span className="font-medium">Time:</span> {a.time}</p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className={
                  a.status === "Approved"
                    ? "text-green-600"
                    : a.status === "Rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }>
                  {a.status}
                </span>
              </p>
            </div>
          ))}

        </div>

      </div>

      {/* 📱 Sticky Mobile Button */}
      <div className="fixed bottom-4 left-0 right-0 px-4 md:hidden">
        <button
          disabled={booking}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-full bg-primary text-white py-3 rounded-xl shadow-lg active:scale-95 transition disabled:opacity-50"
        >
          {booking ? "Booking..." : "Book Appointment"}
        </button>
      </div>

    </div>
  );
}

export default ClientDashboard;