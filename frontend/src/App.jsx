import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

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

  const isAdmin = localStorage.getItem("is_admin") === "true";

  return (
    <>
      {/*  Toast */}
      <Toaster position="top-center" />

      {/* Modal */}
      {showModal && (
        <ContactModal onClose={() => setShowModal(false)} />
      )}

      <Routes>
        {/*  PUBLIC HOME */}
        <Route path="/" element={<Home />} />

        {/*  LOGIN */}
        <Route path="/login" element={<Login />} />


        <Route path="/about" element={<About />} />
        
        <Route path="/programs" element={<Programs />} />

        {/*  CONTACT */}
        <Route path="/contact" element={<Contact />} />

        {/*  ADMIN */}
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login"/>
            )
          }
        />
    
        <Route
          path="/admin/appointments"
          element={
            isAdmin ? (
              <AdminAppointments />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;