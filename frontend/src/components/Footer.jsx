import { Link } from "react-router-dom";
import { MessageCircle, Instagram, Mail, Phone, MapPin } from "lucide-react";

function Footer({ onOpenModal }) {
  return (
    <footer className="bg-slate-50 dark:bg-black text-black dark:text-white pt-16 pb-6">

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="bg-slate-50 dark:bg-black text-black dark:text-white text-lg font-semibold mb-4">
            Tiny Todds Therapy
          </h2>
          <p className="text-sm leading-relaxed">
            Helping children grow with care, compassion, and expert therapy
            programs designed for a brighter future.
          </p>
        </div>

        {/* EXPLORE */}
        <div>
          <h3 className="bg-slate-50 dark:bg-black text-black dark:text-white font-semibold mb-4">Explore</h3>

          <div className="flex flex-col gap-2 text-sm">
            <Link to="/about" className="hover:text-white transition">
              About
            </Link>
            <Link to="/programs" className="hover:text-white transition">
              Programs
            </Link>

            <button
              onClick={onOpenModal}
              className=" hover:text-white transition"
            >
              Book Appointment
            </button>

            <Link to="/contact" className="hover:text-white transition">
              Contact
            </Link>
          </div>
        </div>

        {/* PROGRAMS */}
        <div>
          <h3 className="bg-slate-50 dark:bg-black text-black dark:text-white font-semibold mb-4">Programs</h3>

          <div className="flex flex-col gap-2 text-sm">
            <p className="hover:text-white cursor-pointer transition">
              Speech Therapy
            </p>
            <p className="hover:text-white cursor-pointer transition">
              Cognitive Program
            </p>
            <p className="hover:text-white cursor-pointer transition">
              Day Care
            </p>
          </div>
        </div>

        {/* CONTACT */}
        <div className=" mb-4 ">
          <h3 className="bg-slate-50 dark:bg-black text-black dark:text-white font-semibold mb-4">Contact</h3>

          <div className="text-sm  space-y-2">

            <p className="flex flex-row items-center gap-2">  <MapPin size={14} className="text-blue-500" />  <a    href="https://www.google.com/maps/search/?api=1&query=Chennai,Tamil%20Nadu"    target="_blank"    rel="noopener noreferrer"    className="hover:underline hover:text-white"  >    Chennai, Tamil Nadu  </a>  </p>

            <p className="flex flex-row items-center gap-2">  <Phone size={14} className="text-green-500" />  <a    href="tel:+919941350646"    className="hover:underline hover:text-white"  >    +91 99413 50646  </a>  </p>
      
            <p className="flex flex-row items-center gap-2">    <Mail size={14} className="text-red-500" />    <a      href="mailto:support@tinytodds.com"      className="hover:underline hover:text-white"    >      support@tinytodds.com    </a>  </p>

          </div>

          {/* SOCIAL */}
          <div className="flex gap-4 mt-5 text text-lg">

            <a href="https://wa.me/919941350646" target="_blank" rel="noreferrer">
              <MessageCircle className="hover:text-green-400 transition hover:scale-110" />
            </a>

            <a
              href="https://www.instagram.com/tinytoddstherapycentre"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram className="hover:text-pink-500 transition hover:scale-110" />
            </a>

            <a href="mailto:tinytoddstherapycare@gmail.com">
              <Mail className="hover:text-red-500 transition hover:scale-110" />
            </a>

            <a href="https://www.google.com/maps/search/?api=1&query=Chennai,Tamil%20Nadu">
              <MapPin className="hover:text-blue-500 transition hover:scale-110" />
            </a>

          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-white/10 mt-12 pt-6 text-center text-sm text-gray-500">
        © 2026 Tiny Todds Therapy. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;