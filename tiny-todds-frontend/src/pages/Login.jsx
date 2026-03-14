import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login(){

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");

const navigate = useNavigate();

const login = async ()=>{

const res = await API.post("login/",{
username,
password
})

localStorage.setItem("token",res.data.access)

navigate("/client")

}

return(

<div className="flex justify-center items-center h-screen">

<div className="w-80 p-6 shadow rounded">

<h2 className="text-xl mb-4">Login</h2>

<input
placeholder="Username"
className="border p-2 w-full mb-3"
onChange={(e)=>setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="border p-2 w-full mb-3"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={login}
className="bg-blue-600 text-white w-full p-2"
>

Login

</button>

</div>

</div>

)

}

export default Login