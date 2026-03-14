import { useEffect,useState } from "react";
import API from "../services/api";

function AdminDashboard(){

const [appointments,setAppointments] = useState([]);

useEffect(()=>{

API.get("appointments/")
.then(res => setAppointments(res.data))

},[])

const approve = async(id)=>{

await API.post(`appointments/${id}/approve/`)

alert("Appointment Approved")

}

return(

<div className="p-10">

<h1 className="text-2xl font-bold mb-6">
Admin Dashboard
</h1>

{appointments.map(a=>(
<div key={a.id} className="border p-4 mb-3">

<p>{a.date}</p>

<button
onClick={()=>approve(a.id)}
className="bg-green-600 text-white px-4 py-1"
>

Approve

</button>

</div>
))}

</div>

)

}

export default AdminDashboard