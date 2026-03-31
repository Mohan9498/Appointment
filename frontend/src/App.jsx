import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";  

import Home from "./pages/Home"; 
import Login from "./pages/Login";
import About from "./pages/About";
import Programs from "./pages/Programs";
import ProtectedRoute from "./components/ProtectedRoute";
import Contact from "./pages/Contact";
import AdminDashboard from "./dashboards/AdminDashboard";
import AdminAppointments from "./components/AdminAppointments";
import ContactModal from "./components/ContactModal";

// 404 page
function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center text-xl font-bold">
      404 - Page Not Found
    </div>
  );
}

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 text-black dark:text-white min-h-screen transition duration-300">

      {/* NAVBAR */}
      <Navbar onOpenModal={() => setShowModal(true)} />

      {/* TOASTER */}
      <Toaster position="top-center" />

      {/* MODAL */}
      {showModal && (
        <ContactModal onClose={() => setShowModal(false)} />
      )}

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminAppointments />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

    </div>
  );
}

export default App;