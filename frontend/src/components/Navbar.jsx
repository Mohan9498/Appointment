import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/navbar_logo_tiny_todds.png";

function Navbar({ onOpenModal = () => {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/programs", label: "Programs" },
    { path: "/contact", label: "Contact" },
    { path: "/login", label: "Login" },
  ];

  return (
    <nav className="w-full bg-black/90 border-b border-gray-800">
      
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Tiny Todds" className="h-11 object-contain" />
          <span className="text-lg md:text-xl font-semibold text-white">
            Tiny Todds
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-300 font-medium">

          {navItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`transition ${
                location.pathname === item.path
                  ? "text-white"
                  : "hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}

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
          className="md:hidden text-white text-2xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${menuOpen ? "block" : "hidden"} bg-black/90 px-6 py-6`}>
            
        {navItems.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-gray-300 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
    
        <button
          onClick={() => {
            setMenuOpen(false);
            onOpenModal();
          }}
          className="mt-4 w-6/12 bg-primary text-white py-2 rounded-3xl"
        >
          Book Appointment
        </button>
        
      </div>
    </nav>
  );
}

export default Navbar;