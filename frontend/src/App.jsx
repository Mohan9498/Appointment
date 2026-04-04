import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Programs from "./pages/Programs";
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

  const location = useLocation();

  const hideNavbar = location.pathname.startsWith("/admin");

  {!hideNavbar && <Navbar onOpenModal={() => setShowModal(true)} />}
  
  {location.pathname !== "/admin" && <Navbar />}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-black text-black dark:text-white transition duration-300">

      {/* ✅ SHOW NAVBAR ONLY FOR NON-ADMIN */}
      {!location.pathname.startsWith("/admin") && (
       <Navbar onOpenModal={() => setShowModal(true)} />
      )}

      <Toaster position="top-center" />

      {showModal && (
        <ContactModal onClose={() => setShowModal(false)} />
      )}

      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />

        {/* 🔐 ADMIN */}
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