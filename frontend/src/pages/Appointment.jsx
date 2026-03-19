import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import API from "../services/api";
import "./calendar.css";

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
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setFetchingSlots(true);

        const res = await API.get("appointments/", {
          params: { date: date.toISOString().split("T")[0] }
        });

        setBookedSlots(res.data.booked_slots || []);
      } catch (err) {
        console.log(err);
      } finally {
        setFetchingSlots(false);
      }
    };

    fetchSlots();
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

  const bookAppointment = async () => {
    if (!selectedTime) {
      alert("Please select a time slot");
      return;
    }

    setLoading(true);

    setTimeout(async () => {
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
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10 px-4 sm:px-6 min-w-80">

      <div className="max-w-6xl mx-auto bg-[#111] border border-gray-800 rounded-2xl p-5 sm:p-6 min-w-80 grid grid-cols-1
       md:grid-cols-2 gap-7">

        {/* CALENDAR */}
        <div>
          <h2 className="text-white text-lg sm:text-xl  min-w-80 font-semibold mb-4">
            Select Date
          </h2>

          <div className="bg-[#0a0a0a] p-3 min-w-80 rounded-xl border border-gray-800">
            <Calendar
              onChange={setDate}
              value={date}
              tileDisabled={({ date }) => isPastDate(date)}
              className="modern-calendar"
            />
          </div>
        </div>

        {/* SLOTS */}
        <div>
          <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">
            Available Slots
          </h2>

          <p className="text-gray-400 text-sm mb-4">
            {date.toDateString()}
          </p>

          {/* Loading */}
          {fetchingSlots && (
            <p className="text-gray-400 text-sm">Loading slots...</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

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
                    py-3 rounded-xl text-sm transition
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
            <div className="mt-4 text-gray-300 text-sm">
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
            <div className="mt-4 text-green-400 text-sm text-center">
              {success}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Appointment;