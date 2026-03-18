import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-modern.css";

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

  // 🔥 Simulated API (replace later)
  useEffect(() => {
    // simulate different booked slots per day
    const random = Math.random();

    if (random < 0.3) setBookedSlots(["10:00 AM", "11:00 AM"]);
    else if (random < 0.6) setBookedSlots(["2:00 PM"]);
    else setBookedSlots([]);

    setSelectedTime(""); // reset when date changes
  }, [date]);

  // Disable past dates
  const isPastDate = (date) => {
    const today = new Date();
    return date < new Date(today.setHours(0, 0, 0, 0));
  };

  // Disable past time
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

  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

      {/* LEFT → CALENDAR */}
      <div>

        <h2 className="text-white text-xl font-semibold mb-4">
          Select Date
        </h2>

        <Calendar
          onChange={setDate}
          value={date}
          tileDisabled={({ date }) => isPastDate(date)}
          tileContent={({ date }) => {
            const random = Math.random();

            let color = "bg-green-400";
            if (random < 0.3) color = "bg-red-500";
            else if (random < 0.6) color = "bg-yellow-400";

            return (
              <div className="flex justify-center mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${color}`}></span>
              </div>
            );
          }}
          className="modern-calendar"
        />

      </div>

      {/* RIGHT → TIME SLOTS */}
      <div>

        <h2 className="text-white text-xl font-semibold mb-4">
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
                  ${isSelected ? "bg-accent text-black" : "bg-[#111] text-gray-300"}
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
            Selected: <span className="text-accent">{selectedTime}</span>
          </div>
        )}

        {/* CTA */}
        <button
          disabled={!selectedTime}
          className="mt-6 w-full py-3 rounded-full bg-accent text-black font-medium
          hover:scale-105 transition duration-300 disabled:opacity-30"
        >
          Confirm Booking →
        </button>

      </div>

    </div>
  );
}

export default CalendarBooking;