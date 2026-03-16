import { useState } from "react";
import Calendar from "react-calendar";
import API from "../services/api";

function Appointment(){

const [date,setDate] = useState(new Date());

const bookAppointment = async ()=>{

await API.post("http://127.0.0.1:8000/api/appointments/",{

date:date

})

alert("Appointment request sent. Waiting for admin approval.");

}

return(

<div className="p-10">

<h1 className="text-2xl font-bold mb-6">
Book Appointment
</h1>

<Calendar onChange={setDate} value={date}/>

<button
onClick={bookAppointment}
className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
>

Book Slot

</button>

</div>

)

}

export default Appointment