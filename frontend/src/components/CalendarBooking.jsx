import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ALL_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
];

function CalendarBooking() {

  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🚀 Simulate fetching booked slots (replace with API)
  useEffect(() => {
    const fakeBooked = ["11:00 AM"]; // example
    setBookedSlots(fakeBooked);
  }, [date]);

  // ⏱️ Disable past dates
  const isPastDate = (date) => {
    const today = new Date();
    return date < new Date(today.setHours(0,0,0,0));
  };

  // ⏱️ Disable past time today
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

  const handleBooking = async () => {
    if (!selectedTime) {
      alert("Select a time slot");
      return;
    }

    setLoading(true);

    // 🔥 Replace with API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="relative bg-[#111] border border-gray-800 p-6 rounded-2xl max-w-md mx-auto">

      {/* Glow */}
      <div className="absolute inset-0 bg-accent/10 blur-xl opacity-20 rounded-2xl"></div>

      <div className="relative z-10">

        <h2 className="text-2xl text-white font-semibold mb-6">
          Book Appointment
        </h2>

        {/* Calendar */}
        <div className="bg-[#0a0a0a] p-4 rounded-xl border border-gray-800">
          <Calendar
            onChange={setDate}
            value={date}
            tileDisabled={({ date }) => isPastDate(date)}
          />
        </div>

        {/* Time Slots */}
        <div className="mt-6">
          <p className="text-gray-300 mb-3 text-sm">
            Select Time Slot
          </p>

          <div className="grid grid-cols-3 gap-3">

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
                    p-2 rounded-lg text-sm transition
                    ${isSelected ? "bg-accent text-black" : "bg-[#1a1a1a] text-gray-300"}
                    ${isBooked || isPast ? "opacity-30 cursor-not-allowed" : "hover:bg-accent hover:text-black"}
                  `}
                >
                  {slot}
                </button>
              );
            })}

          </div>
        </div>

        {/* Selected */}
        <p className="mt-4 text-sm text-gray-400">
          {selectedTime && `Selected: ${date.toDateString()} at ${selectedTime}`}
        </p>

        {/* Button */}
        <button
          onClick={handleBooking}
          disabled={loading}
          className="mt-6 w-full py-3 rounded-full bg-accent text-black font-medium
          hover:scale-105 transition duration-300"
        >
          {loading ? "Booking..." : "Confirm Booking →"}
        </button>

        {/* Success */}
        {success && (
          <div className="mt-4 text-green-400 text-center text-sm">
            ✅ Appointment Booked Successfully!
          </div>
        )}

      </div>

    </div>
  );
}

export default CalendarBooking;