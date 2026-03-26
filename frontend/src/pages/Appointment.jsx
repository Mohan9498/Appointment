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

// 🔥 Convert time to 24hr format
const convertTo24Hour = (time) => {
  let [hour, modifier] = time.split(" ");
  let [hours, minutes] = hour.split(":");

  if (hours === "12") hours = "00";
  if (modifier === "PM") hours = parseInt(hours) + 12;

  return `${hours}:${minutes}:00`;
};

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
          params: { date: date.toISOString().split("T")[0] },
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

    try {
      await API.post("appointments/", {
        date: date.toISOString().split("T")[0],
        time: convertTo24Hour(selectedTime),
      });

      setSuccess("✅ Appointment request sent!");
      setSelectedTime("");
    } catch (err) {
      console.log(err);
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-6xl mx-auto bg-card border border-border rounded-xl p-6 grid md:grid-cols-2 gap-8 shadow-sm">

        {/* Calendar */}
        <div>
          <h2 className="text-lg font-semibold text-dark mb-4">
            Select Date
          </h2>

          <div className="bg-muted p-4 rounded-lg border border-border">
            <Calendar
              onChange={setDate}
              value={date}
              tileDisabled={({ date }) => isPastDate(date)}
              className="modern-calendar w-full"
            />
          </div>
        </div>

        {/* Slots */}
        <div>
          <h2 className="text-lg font-semibold text-dark mb-2">
            Available Slots
          </h2>

          <p className="text-text-light text-sm mb-4">
            {date.toDateString()}
          </p>

          {/* Loading */}
          {fetchingSlots && (
            <p className="text-text-light text-sm">Loading slots...</p>
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
                    py-2 rounded-lg text-sm transition
                    ${isSelected 
                      ? "bg-primary text-white" 
                      : "bg-muted text-dark"}
                    ${isBooked || isPast 
                      ? "opacity-30 cursor-not-allowed" 
                      : "hover:bg-primary hover:text-white"}
                  `}
                >
                  {slot}
                </button>
              );
            })}
          </div>

          {/* Selected */}
          {selectedTime && (
            <div className="mt-4 text-sm text-dark">
              Selected:{" "}
              <span className="text-primary font-medium">
                {selectedTime}
              </span>
            </div>
          )}

          {/* Button */}
          <button
            onClick={bookAppointment}
            disabled={loading}
            className="mt-6 w-full py-3 rounded-lg bg-primary text-white hover:bg-primary-hover transition disabled:opacity-40"
          >
            {loading ? "Booking..." : "Confirm Booking →"}
          </button>

          {/* Success */}
          {success && (
            <div className="mt-4 text-green-500 text-sm text-center">
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Appointment;