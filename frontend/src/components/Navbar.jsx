import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/navbar_logo_tiny_todds.png";

function Navbar({ onOpenModal = () => {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { dark, setDark } = useContext(ThemeContext);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/programs", label: "Programs" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/70 dark:bg-black/40 border-b border-gray-200 dark:border-white/10 transition-all duration-300">

      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">

        <Link to="/" className="flex items-center gap-2">
          {/* ✅ Explicit width/height prevents layout shift (CLS fix) */}
          <img
            src={logo}
            alt="Tiny Todds Therapy Care logo"
            width={56}
            height={56}
            className="h-14 w-auto object-contain mix-blend-multiply dark:mix-blend-screen"
          />
          <span className="text-lg md:text-xl font-semibold text-black dark:text-white">
            Tiny Todds Therapy Care
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 font-medium">

          {navItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`relative transition ${
                location.pathname === item.path
                  ? "text-blue-600 dark:text-blue-400 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-blue-600"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/login"
            className={`transition ${
              location.pathname === "/login"
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600"
            }`}
          >
            Admin
          </Link>

          {/* ✅ aria-label added — fixes "Buttons do not have an accessible name" audit */}
          <button
            onClick={() => setDark(!dark)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-sm"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          <button
            onClick={onOpenModal}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition"
          >
            Book Appointment
          </button>
        </div>

        {/* MOBILE MENU BUTTON — aria-label already present ✅ */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-black dark:text-white p-1"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden transition-all duration-300 ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        } bg-white dark:bg-black px-6 py-4 space-y-4`}
      >
        {navItems.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            onClick={() => setMenuOpen(false)}
            className="block text-lg font-medium text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-white/10 pb-2"
          >
            {item.label}
          </Link>
        ))}

        <Link
          to="/login"
          onClick={() => setMenuOpen(false)}
          className="block text-lg font-medium text-blue-600 border-b border-gray-100 dark:border-white/10 pb-2"
        >
          Admin Login
        </Link>

        {/* ✅ aria-label on mobile dark mode toggle too */}
        <button
          onClick={() => setDark(!dark)}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="w-full py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
        >
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button
          onClick={() => {
            setMenuOpen(false);
            onOpenModal();
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Book Appointment
        </button>
      </div>
    </nav>
  );
}

export default Navbar;