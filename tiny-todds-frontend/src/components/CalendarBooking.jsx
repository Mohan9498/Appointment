import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CalendarBooking({ onBook }) {

const [date, setDate] = useState(new Date());
const [time, setTime] = useState("");

const handleBooking = () => {

if(!time){
alert("Please select a time slot")
return
}

onBook({
date,
time
})

}

return (

<div className="bg-white shadow p-6 rounded-lg">

<h2 className="text-xl font-semibold mb-4">
Select Appointment Date
</h2>

<Calendar onChange={setDate} value={date} />

<div className="mt-6">

<label className="block mb-2 font-medium">
Select Time Slot
</label>

<select
className="border p-2 w-full rounded"
onChange={(e)=>setTime(e.target.value)}
>

<option value="">Choose time</option>
<option>10:00 AM</option>
<option>11:00 AM</option>
<option>12:00 PM</option>
<option>2:00 PM</option>
<option>3:00 PM</option>

</select>

</div>

<button
onClick={handleBooking}
className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
>

Book Appointment

</button>

</div>

)

}

export default CalendarBooking