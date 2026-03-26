import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/programs", label: "Programs" },
    { path: "/appointment", label: "Appointment" },
    { path: "/contact", label: "Contact" }
  ];

  
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 glass border-collapse border-glass-border">

      <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-semibold text-white tracking-wide">
          Tiny Todds
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">

          {navItems.map((item, i) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={i}
                to={item.path}
                className={`relative transition duration-300 ${
                  active ? "text-blue-600 font-semibold" : "hover:text-gray-900"
                }`}
              >
                {item.label}

                {/* underline */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300 ${
                    active ? "w-full" : "w-0 hover:w-full"
                  }`}
                ></span>
              </Link>
            );
          })}

          {/* CTA Button */}
          <Link
            to="/login"
            className="ml-4 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Login
          </Link>

        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-gray-900"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ${
          menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col gap-5 px-6 pb-6 bg-white border-t border-gray-200 text-gray-700">

          {navItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`transition ${
                location.pathname === item.path
                  ? "text-blue-600 font-semibold"
                  : "hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="text-center py-2 rounded-lg bg-blue-600 text-white"
          >
            Login
          </Link>

        </div>
      </div>

    </nav>
  );
}

export default Navbar;