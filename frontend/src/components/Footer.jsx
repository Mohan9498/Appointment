import { Link } from "react-router-dom";
import { MessageCircle, Instagram, Mail, Chrome } from "lucide-react";

function Footer() {
  return (
    <footer className="text-gray-500 dark:text-gray-400 pt-16 pb-6">

      <div className="w-full px-6 grid md:grid-cols-4 gap-12">

        {/* Brand */}
        <div>
          <h2 className="text-white text-2xl font-semibold tracking-wide">
            Tiny Todds Therapy
          </h2>

          <p className="mt-4 text-sm leading-relaxed">
            Helping children grow with care, compassion, and expert therapy
            programs designed for a brighter future.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white mb-4 text-sm uppercase tracking-wider">
            Explore
          </h3>

          <div className="flex flex-col gap-2 text-sm">
            <Link to="/about" className="hover:text-white transition">
              About
            </Link>
            <Link to="/programs" className="hover:text-white transition">
              Programs
            </Link>
            <Link to="/appointment" className="hover:text-white transition">
              Book Appointment
            </Link>
            <Link to="/contact" className="hover:text-white transition">
              Contact
            </Link>
          </div>
        </div>

        {/* Programs */}
        <div>
          <h3 className="text-white mb-4 text-sm uppercase tracking-wider">
            Programs
          </h3>

          <div className="flex flex-col gap-2 text-sm">
            <p className="hover:text-white transition cursor-pointer">
              Speech Therapy
            </p>
            <p className="hover:text-white transition cursor-pointer">
              Cognitive Program
            </p>
            <p className="hover:text-white transition cursor-pointer">
              Day Care
            </p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white mb-4 text-sm uppercase tracking-wider">
            Contact
          </h3>

          <div className="text-sm space-y-2">
            <p>Chennai, India</p>
            <p>+91 9876543210</p>
            <p>support@tinytodds.com</p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-5">

            {/* WhatsApp */}
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
              <MessageCircle className="cursor-pointer hover:text-green-400" />
            </a>

            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <Instagram className="cursor-pointer hover:text-pink-500" />
            </a>

            {/* Gmail */}
            <a href="mailto:support@tinytodds.com">
              <Mail className="cursor-pointer hover:text-red-500" />
            </a>

            {/* Google */}
            <a href="https://google.com" target="_blank" rel="noreferrer">
              <Chrome className="cursor-pointer hover:text-blue-500" />
            </a>

          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
        © 2026 Tiny Todds Therapy. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;