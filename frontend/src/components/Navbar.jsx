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
      <div className={`md:hidden ${menuOpen ? "block" : "hidden"} bg-white dark:bg-black/90 px-6 py-6`}>
            
        {navItems.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            {item.label}
          </Link>
        ))}

        {/* 🌙 TOGGLE IN MOBILE */}
        <button
          onClick={() => setDark(!dark)}
          className="mt-3 px-6 py-2 bg-white dark:bg-gray-700 rounded-2xl"
        >
          {dark ?  "☀️" : "🌙"}
        </button>
    
        <button
          onClick={() => {
            setMenuOpen(false);
            onOpenModal();
          }}
          className="mt-4 w-48 bg-primary text-black dark:text-white py-2 rounded-3xl"
        >
          Book 
        </button>
        
      </div>
    </nav>
  );
}

export default Navbar;