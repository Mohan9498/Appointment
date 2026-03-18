import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className=" top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-bold tracking-wide text-gray-900">
          Tiny Todds
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center text-gray-700 font-medium">

          <Link className="hover:text-black transition duration-300" to="/">Home</Link>
          <Link className="hover:text-black transition duration-300" to="/about">About</Link>
          <Link className="hover:text-black transition duration-300" to="/programs">Programs</Link>
          <Link className="hover:text-black transition duration-300" to="/appointment">Appointment</Link>
          <Link className="hover:text-black transition duration-300" to="/contact">Contact</Link>

          {/* Premium Button */}
          <Link
            to="/login"
            className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition duration-300"
          >
            Login
          </Link>

        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      }`}>

        <div className="flex flex-col gap-5 px-6 pb-6 text-gray-700 font-medium">

          <Link onClick={()=>setMenuOpen(false)} to="/">Home</Link>
          <Link onClick={()=>setMenuOpen(false)} to="/about">About</Link>
          <Link onClick={()=>setMenuOpen(false)} to="/programs">Programs</Link>
          <Link onClick={()=>setMenuOpen(false)} to="/appointment">Appointment</Link>
          <Link onClick={()=>setMenuOpen(false)} to="/contact">Contact</Link>

          <Link
            to="/login"
            onClick={()=>setMenuOpen(false)}
            className="bg-black text-white px-5 py-2 rounded-full text-center"
          >
            Login
          </Link>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;