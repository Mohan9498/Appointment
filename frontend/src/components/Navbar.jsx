import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/navbar_logo_tiny_todds.webp";

function Navbar({ onOpenModal = () => {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { dark, setDark } = useContext(ThemeContext);

  // ✅ Detect scroll for enhanced navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/programs", label: "Programs" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`fixed  top-0 w-full  z-50 transition-all duration-500  
      ${
      scrolled
        ? 'bg-white/80 dark:bg-black/60 backdrop-blur-lg border-b shadow-sm'
        : 'bg-white/70 dark:bg-black/50 backdrop-blur-md border-b'
      }` 
    }>

      <div className="max-w-full mx-auto px-4 h-20 flex justify-between items-center">

        <Link to="/" className="flex  items-center gap-2.5 group">     
          <img
            src={logo}
            alt="Tiny Todds Therapy Care logo"
            width={72}
            height={48}
            decoding="async"
            className="h-18  w-auto object-contain mix-blend-multiply dark:mix-blend-screen group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Tiny Todds
            <span className="hidden sm:inline text-gray-500 dark:text-gray-400 font-medium ml-1">Therapy</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-1 font-medium">

          {navItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`relative ml-3 px-5 py-2 rounded-xl text-sm transition-all duration-300 ${
                location.pathname === item.path
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-semibold"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/login"
            className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
              location.pathname === "/login"
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-semibold"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-white/5"
            }`}
          >
            Admin
          </Link>

          {/* ✅ Dark mode toggle with smooth transition */}
          <button
            onClick={() => setDark(!dark)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="ml-2 p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300 text-sm"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          <button
            onClick={onOpenModal}
            className="ml-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md hover:shadow-glow-blue hover:scale-[1.03] transition-all duration-300"
          >
            Book Appointment
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 dark:text-white p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden transition-all duration-300 ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        } bg-transparent dark:bg-slate-900/95 backdrop-blur-xl px-6 py-4 space-y-2 border-t border-gray-100 dark:border-white/5`}
      >
        {navItems.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            onClick={() => setMenuOpen(false)}
            className={`block text-base font-medium px-4 py-3 rounded-xl transition-all duration-200 ${
              location.pathname === item.path
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            {item.label}
          </Link>
        ))}

        <Link
          to="/login"
          onClick={() => setMenuOpen(false)}
          className="block text-base font-medium text-blue-600 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
        >
          Admin Login
        </Link>

        <div className="pt-2 space-y-2">
          <button
            onClick={() => setDark(!dark)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="w-full py-3 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white font-medium text-sm transition hover:bg-gray-200 dark:hover:bg-white/20"
          >
            {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
            onClick={() => {
              setMenuOpen(false);
              onOpenModal();
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold text-sm transition hover:shadow-glow-blue"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
