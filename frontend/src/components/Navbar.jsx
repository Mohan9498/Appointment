import { useContext, useState } from "react"; // ✅ FIXED
import { ThemeContext } from "../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";
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
    { path: "/login", label: "Login" },
  ];

  return (
    <nav className="w-full bg-white dark:bg-white/5 border-b border-gray-200 dark:border-white/10 dark:border-gray-800 transition">
      
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Tiny Todds" className="h-11 object-contain" />
          <span className="text-lg md:text-xl font-semibold text-black dark:text-white">
            Tiny Todds
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 dark:text-gray-300 font-medium">

          {navItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`relative px-2 py-1 transition ${
                location.pathname === item.path
                ? "text-black dark:text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-indigo-400" 
                : "text-black dark:text-white hover:text-black"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* 🌙 DARK MODE TOGGLE */}
          <button
            onClick={() => setDark(!dark)}
            className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-sm"
          >
            {dark ?  "☀️" : "🌙"}
          </button>

          {/* Book Button */}
          <button
            onClick={onOpenModal}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full
            shadow-lg hover:scale-105 transition duration-300"
          >
            Book
          </button>
        
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-black dark:text-white text-2xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ${
        menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      } bg-white dark:bg-black/95 px-6 py-6 space-y-4`}>
        
        {navItems.map((item, i) => (
          <Link
            key={i} to={item.path}
            onClick={() => setMenuOpen(false)}
            className="block py-3 text-lg font-medium border-b border-gray-200 dark:border-white/10"
          >
            {item.label}
            
          </Link> 
        ))}
        
        <button
         onClick={() => setDark(!dark)}
         className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-700"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
        
        <button
          onClick={() => {
            setMenuOpen(false);
            onOpenModal();
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-xl"
        >
          Book Appointment
        </button>
        
      </div>
    </nav>
  );
}

export default Navbar;