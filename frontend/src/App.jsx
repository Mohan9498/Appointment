import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Contact from "./pages/Contact";

import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

import AdminDashboard from "./dashboards/AdminDashboard";
import AdminAppointments from "./components/AdminAppointments";
import ContactModal from "./components/ContactModal";

function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center text-xl font-bold">
      404 - Page Not Found
    </div>
  );
}

function App() {
  const [showModal, setShowModal] = useState(false);
  const [modalPrefill, setModalPrefill] = useState(null);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleOpenModal = (prefill = null) => {
    setModalPrefill(prefill);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalPrefill(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-black text-black dark:text-white transition duration-300">
      {!isAdminRoute && (
        <Navbar onOpenModal={() => handleOpenModal()} />
      )}

      <Toaster position="top-center" />

      {showModal && (
        <ContactModal
          onClose={handleCloseModal}
          prefill={modalPrefill}
        />
      )}

      <Routes>
        <Route path="/" element={<Home onOpenModal={() => handleOpenModal()} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute>
              <AdminAppointments />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdminRoute && (
        <>
          {/* <Footer onOpenModal={() => handleOpenModal()} /> */}
          <Chatbot onOpenModal={handleOpenModal} />
        </>
      )}
    </div>
  );
}

export default App;