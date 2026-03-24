import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Appointment from "./pages/Appointment";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProgramDetails from "./pages/ProgramDetails";

import AdminDashboard from "./dashboards/AdminDashboard";
import ClientDashboard from "./dashboards/ClientDashboard";
import AdminAppointments from "./components/AdminAppointments"; // ✅ ADD THIS

import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

//  404 page
function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

function App() {
  return (
    <BrowserRouter>

      {/*  Toast must be OUTSIDE Routes */}
      <Toaster position="top-center" />

      <Routes>

        {/*  Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/programs/:name" element={<ProgramDetails />} />

        {/*  Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*  Protected Dashboards */}

        {/*  Admin only */}
        <Route path="/admin" element={ <ProtectedRoute adminOnly={true}> <AdminDashboard /> </ProtectedRoute> } />

        {/*  Admin appointments  */}
        <Route path="/admin/appointments" element={ <ProtectedRoute adminOnly={true}>  <AdminAppointments /> </ProtectedRoute> } />

        {/*  Client */}
        <Route path="/client" element={ <ProtectedRoute>   <ClientDashboard />  </ProtectedRoute> } />

        {/*  404 fallback */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;