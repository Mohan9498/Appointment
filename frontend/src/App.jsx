import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Home as HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Lazy load all pages — reduces initial JS bundle by ~756 KiB
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const About = lazy(() => import("./pages/About"));
const Programs = lazy(() => import("./pages/Programs"));
const ProgramDetails = lazy(() => import("./pages/ProgramDetails"));
const Contact = lazy(() => import("./pages/Contact"));
const AdminDashboard = lazy(() => import("./dashboards/AdminDashboard"));
const AdminAppointments = lazy(() => import("./components/AdminAppointments"));
const Register = lazy(() => import("./pages/Register"));

import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import ContactModal from "./components/ContactModal";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="text-center animate-fade-in-up">
        <div className="text-8xl font-extrabold text-gradient mb-4">404</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-sm hover:shadow-glow-blue hover:scale-[1.03] transition-all duration-300"
        >
          <HomeIcon size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// ✅ Premium loading fallback
function PageLoader() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-[3px] border-gray-200 dark:border-white/10 border-t-blue-600 rounded-full animate-spin" />
      </div>
      <p className="text-sm text-gray-400 dark:text-gray-500 font-medium animate-pulse">Loading...</p>
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {!isAdminRoute && (
        <Navbar onOpenModal={() => handleOpenModal()} />
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#1e293b',
            color: '#fff',
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        }}
      />

      {showModal && (
        <ContactModal
          onClose={handleCloseModal}
          prefill={modalPrefill}
        />
      )}

      {/* ✅ <main> landmark fixes accessibility audit */}
      <main className="pt-2">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home onOpenModal={() => handleOpenModal()} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:name" element={<ProgramDetails onOpenModal={() => handleOpenModal()} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />

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
          <Footer onOpenModal={() => handleOpenModal()} />
          <Chatbot onOpenModal={handleOpenModal} />
        </>
      )}
    </div>
  );
}

export default App;