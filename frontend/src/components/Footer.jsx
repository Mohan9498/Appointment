import { Link } from "react-router-dom";
import { MessageCircle, Instagram, Mail, Phone, MapPin } from "lucide-react";

function Footer({ onOpenModal }) {
  return (
    <footer className="bg-gray-50 dark:bg-slate-950 text-black dark:text-white pt-20 pb-8 border-t border-gray-200/50 dark:border-white/[0.06]">

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

        {/* BRAND */}
        <div>
          <h2 className="text-lg font-bold mb-4 tracking-tight text-gray-900 dark:text-white">
            Tiny Todds Therapy
          </h2>
          <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Helping children grow with care, compassion, and expert therapy
            programs designed for a brighter future.
          </p>

          {/* SOCIAL */}
          <div className="flex gap-3 mt-6">
            {[
              { href: "https://wa.me/919941350646", icon: <MessageCircle size={18} />, hoverColor: "hover:bg-green-500 hover:border-green-500" },
              { href: "https://www.instagram.com/tinytoddstherapycentre", icon: <Instagram size={18} />, hoverColor: "hover:bg-pink-500 hover:border-pink-500", label: "Follow us on Instagram" },
              { href: "mailto:tinytoddstherapycare@gmail.com", icon: <Mail size={18} />, hoverColor: "hover:bg-red-500 hover:border-red-500" },
              { href: "https://www.google.com/maps/search/?api=1&query=26Q9%2B8W%20Chennai%2C%20Tamil%20Nadu", icon: <MapPin size={18} />, hoverColor: "hover:bg-blue-600 hover:border-blue-600" },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label || ""}
                className={`w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-white transition-all duration-300 ${social.hoverColor}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* EXPLORE */}
        <div>
          <h3 className="font-bold mb-4 text-gray-900 dark:text-white text-sm uppercase tracking-wider">Explore</h3>

          <div className="flex flex-col justify-center items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
              About
            </Link>
            <Link to="/programs" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
              Programs
            </Link>
            <button
              onClick={() => onOpenModal && onOpenModal()}
              className=" hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Book Appointment
            </button>
            <Link to="/contact" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
              Contact
            </Link>
          </div>
        </div>

        {/* PROGRAMS */}
        <div>
          <h3 className="font-bold mb-4 text-gray-900 dark:text-white text-sm uppercase tracking-wider">Programs</h3>

          <div className="flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/programs/speech-therapy" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
              Speech Therapy
            </Link>
            <Link to="/programs/cognitive-therapy" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
              Cognitive Program
            </Link>
            <Link to="/programs/day-care" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
              Day Care
            </Link>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-bold mb-4 text-gray-900 dark:text-white text-sm uppercase tracking-wider">Contact</h3>

          <div className="text-sm space-y-3 text-gray-500 dark:text-gray-400">

            <p className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <MapPin size={14} className="text-blue-600 dark:text-blue-400" />
              </span>
              <a
                href="https://www.google.com/maps/search/?api=1&query=26Q9%2B8W%20Chennai%2C%20Tamil%20Nadu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Chennai, Tamil Nadu
              </a>
            </p>

            <p className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Phone size={14} className="text-green-600 dark:text-green-400" />
              </span>
              <a
                href="tel:+919941350646"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                +91 99413 50646
              </a>
            </p>

            <p className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-red-600 dark:text-red-400" />
              </span>
              <a
                href="mailto:support@tinytodds.com"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                support@tinytodds.com
              </a>
            </p>

          </div>
        </div>

      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-200/50 dark:border-white/[0.06] mt-16 pt-8 text-center text-sm text-gray-400 dark:text-gray-500">
        © 2026 Tiny Todds Therapy Care. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;