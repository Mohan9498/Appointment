import { useEffect, useState } from "react";
import API from "../services/api";
import CalendarBooking from "../components/CalendarBooking";

function ClientDashboard(){

const [appointments,setAppointments] = useState([])

useEffect(()=>{

API.get("appointments/")
.then(res => setAppointments(res.data))

},[])

const book = async(data)=>{

await API.post("appointments/",data)

alert("Appointment booked. Waiting for admin approval.")

}

return(

<div className="max-w-12xl mx-auto p-10">

<h1 className="text-3xl font-bold mb-8">
Client Dashboard
</h1>

<div className="grid md:grid-cols-2 gap-8">

<CalendarBooking onBook={book}/>

<div>

<h2 className="text-xl font-semibold mb-4">
My Appointments
</h2>

{appointments.map(a => (

<div key={a.id} className="border p-4 mb-3 rounded">

<p>Date: {a.date}</p>
<p>Time: {a.time}</p>
<p>Status: {a.status}</p>

</div>

))}

</div>

</div>

</div>

)

}

export default ClientDashboard