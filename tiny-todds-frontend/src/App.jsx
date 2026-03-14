import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Appointment from "./pages/Appointment";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./dashboards/AdminDashboard";
import ClientDashboard from "./dashboards/ClientDashboard";

function App() {

return (

<BrowserRouter>

<Routes>

<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
<Route path="/programs" element={<Programs />} />
<Route path="/appointment" element={<Appointment />} />
<Route path="/contact" element={<Contact />} />

<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />

<Route path="/admin" element={<AdminDashboard />} />
<Route path="/client" element={<ClientDashboard />} />

</Routes>

</BrowserRouter>

);

}

export default App;