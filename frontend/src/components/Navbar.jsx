import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">

      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">

        {/* Logo */}
        <h1 className="text-2xl font-bold text-primary">
          Tiny Todds Therapy
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 font-medium items-center">

          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/programs">Programs</Link>
          <Link to="/appointment">Book Appointment</Link>
          <Link to="/contact">Contact</Link>

          <Link
            to="/login"
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Login
          </Link>

        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 p-4 border-t">

          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/programs" onClick={() => setMenuOpen(false)}>Programs</Link>
          <Link to="/appointment" onClick={() => setMenuOpen(false)}>Book Appointment</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

          <Link
            to="/login"
            className="bg-primary text-white px-4 py-2 rounded text-center"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>

        </div>
      )}

    </nav>
  );
}

export default Navbar;