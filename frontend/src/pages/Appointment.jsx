import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import API from "../services/api";
import "./calendar-modern.css";

const ALL_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
];

function Appointment() {

  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // 🔥 Fetch booked slots from backend (replace API later)
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await API.get("appointments/", {
          params: { date: date.toISOString().split("T")[0] }
        });

        // expect backend to return ["10:00 AM", ...]
        setBookedSlots(res.data.booked_slots || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSlots();
    setSelectedTime("");
  }, [date]);

  // Disable past dates
  const isPastDate = (date) => {
    const today = new Date();
    return date < new Date(today.setHours(0, 0, 0, 0));
  };

  // Disable past time today
  const isPastTime = (slot) => {
    const now = new Date();
    const selected = new Date(date);

    if (selected.toDateString() !== now.toDateString()) return false;

    const [time, modifier] = slot.split(" ");
    let [hours] = time.split(":");
    hours = parseInt(hours);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours <= now.getHours();
  };

  // Booking API
  const bookAppointment = async () => {
    if (!selectedTime) {
      alert("Please select a time slot");
      return;
    }

    setLoading(true);

    try {
      await API.post("appointments/", {
        date: date.toISOString().split("T")[0],
        time: selectedTime,
      });

      setSuccess("✅ Appointment request sent!");
      setSelectedTime("");
    } catch (err) {
      console.log(err);
      alert("Booking failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#e4a6a6bd] py-20 px-6">

      <div className="max-w-6xl mx-auto bg-[#fd7c7c] border border-gray-800 rounded-2xl p-8 grid md:grid-cols-2 gap-10">

        {/* LEFT → CALENDAR */}
        <div>

          <h2 className="text-white text-xl font-semibold mb-4">
            Select Date
          </h2>

          <Calendar
            onChange={setDate}
            value={date}
            tileDisabled={({ date }) => isPastDate(date)}
            className="modern-calendar"
          />

        </div>

        {/* RIGHT → SLOTS */}
        <div>

          <h2 className="text-white text-xl font-semibold mb-2">
            Available Slots
          </h2>

          <p className="text-gray-400 text-sm mb-4">
            {date.toDateString()}
          </p>

          <div className="grid grid-cols-2 gap-3">

            {ALL_SLOTS.map((slot, i) => {
              const isBooked = bookedSlots.includes(slot);
              const isPast = isPastTime(slot);
              const isSelected = selectedTime === slot;

              return (
                <button
                  key={i}
                  disabled={isBooked || isPast}
                  onClick={() => setSelectedTime(slot)}
                  className={`
                    p-3 rounded-xl text-sm transition
                    ${isSelected ? "bg-accent text-black" : "bg-[#1a1a1a] text-gray-300"}
                    ${isBooked || isPast ? "opacity-30 cursor-not-allowed" : "hover:bg-accent hover:text-black"}
                  `}
                >
                  {slot}
                </button>
              );
            })}

          </div>

          {/* Selected */}
          {selectedTime && (
            <div className="mt-6 text-gray-300 text-sm">
              Selected:{" "}
              <span className="text-accent font-medium">
                {selectedTime}
              </span>
            </div>
          )}

          {/* Button */}
          <button
            onClick={bookAppointment}
            disabled={loading}
            className="mt-6 w-full py-3 rounded-full bg-accent text-black font-medium
            hover:scale-105 transition duration-300 disabled:opacity-30"
          >
            {loading ? "Booking..." : "Confirm Booking →"}
          </button>

          {/* Success */}
          {success && (
            <div className="mt-4 text-green-400 text-sm">
              {success}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Appointment;