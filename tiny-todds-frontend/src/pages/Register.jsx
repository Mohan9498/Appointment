import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register(){

const navigate = useNavigate()

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")

const register = async () => {

await API.post("register/",{
username,
password
})

alert("Registration successful")

navigate("/login")

}

return(

<div className="flex justify-center items-center h-screen">

<div className="w-96 p-6 shadow rounded">

<h2 className="text-xl mb-4">Register</h2>

<input
className="border p-2 w-full mb-3"
placeholder="Username"
onChange={(e)=>setUsername(e.target.value)}
/>

<input
type="password"
className="border p-2 w-full mb-3"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={register}
className="bg-blue-600 text-white w-full py-2 rounded"
>

Register

</button>

</div>

</div>

)

}

export default Register