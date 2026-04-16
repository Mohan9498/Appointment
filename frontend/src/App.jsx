import { Routes, Route, useLocation } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Lazy load all pages — reduces initial JS bundle by ~756 KiB
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const About = lazy(() => import("./pages/About"));
const Programs = lazy(() => import("./pages/Programs"));
const Contact = lazy(() => import("./pages/Contact"));
const AdminDashboard = lazy(() => import("./dashboards/AdminDashboard"));
const AdminAppointments = lazy(() => import("./components/AdminAppointments"));

import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import ContactModal from "./components/ContactModal";

function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center text-xl font-bold">
      404 - Page Not Found
    </div>
  );
}

// ✅ Simple loading fallback
function PageLoader() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
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

      {/* ✅ <main> landmark fixes accessibility audit */}
      <main>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </main>

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