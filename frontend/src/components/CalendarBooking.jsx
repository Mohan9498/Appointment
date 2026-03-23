import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";

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

  useEffect(() => {
    const random = Math.random();

    if (random < 0.3) setBookedSlots(["10:00 AM", "11:00 AM"]);
    else if (random < 0.6) setBookedSlots(["2:00 PM"]);
    else setBookedSlots([]);

    setSelectedTime("");
  }, [date]);

  const isPastDate = (date) => {
    const today = new Date();
    return date < new Date(today.setHours(0, 0, 0, 0));
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] p-6">

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 max-w-5xl w-full grid md:grid-cols-2 gap-10 shadow-2xl">

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

        {/* RIGHT → SLOTS */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-2">
            Available Slots
          </h2>

          <p className="text-gray-400 text-sm mb-5">
            {date.toDateString()}
          </p>

          <div className="grid grid-cols-2 gap-4">

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
                    p-2.5 rounded-lg text-xs font-medium transition-all duration-300

                     ${isSelected

                      ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-black shadow-md scale-105"
                      
                      : "bg-white/5 border border-white/10 text-gray-200"}

                     ${isBooked || isPast

                      ? "opacity-30 cursor-not-allowed"

                      : "hover:scale-105 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-black"}
                  `}
                >
                  {slot}
                </button>
              );
            })}

          </div>

          {/* Selected */}
          {selectedTime && (
            <div className="mt-6 text-sm text-gray-300">
              Selected:{" "}
              <span className="text-blue-400 font-medium">
                {selectedTime}
              </span>
            </div>
          )}

          {/* CTA */}
          <button
            disabled={!selectedTime}
            className="mt-6 w-full py-3 rounded-full font-semibold
            bg-gradient-to-r from-blue-400 to-indigo-500 text-black
            hover:scale-105 transition duration-300
            disabled:opacity-30"
          >
            Confirm Booking →
          </button>

        </div>

      </div>
    </div>
  );
}

export default CalendarBooking;