import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

const navigate = useNavigate();

const [isRegister, setIsRegister] = useState(false);
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async (e) => {
  e.preventDefault();   // prevents GET request

  try {

    const res = await API.post("accounts/login/", {
      username,
      password
    });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    if (res.data.is_admin) {
      navigate("/admin-dashboard");
    } else {
      navigate("/client-dashboard");
    }

  } catch (error) {
    alert("Invalid credentials");
  }
};

const handleRegister = async () => {


try {

  const res = await API.post("accounts/register/", {
    username: username,
    password: password
  });

  console.log(res.data);

  alert("Registered successfully");
  setIsRegister(false);

} catch (error) {

  console.error(error);
  alert("Registration failed");

}


};

return (

<div className="flex justify-center items-center h-screen bg-gray-100">

  <div className="w-80 p-6 shadow-lg rounded bg-white">

    <h2 className="text-xl mb-4 text-center font-semibold">
      {isRegister ? "Register" : "Login"}
    </h2>

    <input
      placeholder="Username"
      className="border p-2 w-full mb-3 rounded"
      value={username}
      onChange={(e)=>setUsername(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      className="border p-2 w-full mb-3 rounded"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
    />

    <button
      onClick={isRegister ? handleRegister : handleLogin}
      className="bg-blue-600 text-white w-full p-2 rounded"
    >
      {isRegister ? "Register" : "Login"}
    </button>

    <p className="text-center mt-3 text-sm">

      {isRegister ? "Already have an account?" : "Don't have an account?"}

      <span
        className="text-blue-600 cursor-pointer ml-1"
        onClick={()=>setIsRegister(!isRegister)}
      >
        {isRegister ? "Login" : "Register"}
      </span>

    </p>

  </div>

</div>


);

}

export default Login;
