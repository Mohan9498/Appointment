import { Link } from "react-router-dom";
import g1 from "../assets/g1.jpeg";

function Hero({ onOpenModal }) {
  return (
    <section className="relative min-h-screen flex items-center bg-white dark:bg-white/5">

      {/* Glow Background */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-[600px] h-[600px]   rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 py-20 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-6">

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-indigo-400 leading-tight">
            Build Better Communication
            <span className="text-indigo-400"> for Your Child</span>
          </h1>

          {/* FLOATING PARAGRAPH CARDS */}
          <div className="space-y-4">

            <div className="p-4 rounded-xl bg-white dark:bg-white/5 dark:bg-black text-black dark:text-white border border-border shadow-lg hover:translate-x-2 transition duration-300">
              <h3 className=" font-sans  mb-1  text-black dark:text-white">Speech Therapy</h3>
              <p className="text-gray-00 text-sm">
                Improve communication skills with expert-guided sessions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-white/5 dark:bg-black text-black dark:text-white border border-border shadow-lg hover:translate-x-2 transition duration-300">
              <h3 className=" text-black dark:text-white font-sans mb-1">Cognitive Growth</h3>
              <p className="text-gray-00 text-sm">
                Enhance thinking, memory, and learning abilities.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-white/5 dark:bg-black text-black dark:text-white border border-border shadow-lg hover:translate-x-2 transition duration-300">
              <h3 className="t text-black dark:text-white font-sans mb-1">Confidence Building</h3>
              <p className="text-gray-00 text-sm">
                Help children express themselves with confidence.
              </p>
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">

            <button 
            onClick={onOpenModal} className="px-7 py-3 rounded-full border border-border bg-white dark:bg-white/5 dark:bg-black text-black dark:text-white font-medium text-xl hover:scale-105 transition duration-300"> 
            Book Session →
            </button>

            <Link
              to="/programs"
              className="px-7 py-3 rounded-full border border-gray-700 text-gray-00 
              hover:bg-white  hover:text-black transition duration-300"
            >
              Explore Programs
            </Link>

          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center">

          <img 
            src={g1}
            alt="Child Therapy"
            className="rounded-2xl shadow-2xl bg-surface border border-border animate-zoom"
            />

          {/* Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-accent/20 to-transparent blur-xl opacity-40"></div>

        </div>

      </div>
    </section>
  );
}

export default Hero;