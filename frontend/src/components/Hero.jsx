import { Link } from "react-router-dom";

function Hero({ onOpenModal }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden  bg-surface border border-border">

      {/* Glow Background */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-[600px] h-[600px]   rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 py-20 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-6">

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-serif leading-none text-text-main bg-surface border rounded-3xl border-border">
            Build Better <br />
            Communication <br />
            for Your Child
          </h1>

          {/* FLOATING PARAGRAPH CARDS */}
          <div className="space-y-4">

            <div className="p-4 rounded-xl bg-surface border border-border shadow-lg hover:translate-x-2 transition duration-300">
              <h3 className="text-white font-semibold mb-1">Speech Therapy</h3>
              <p className="text-gray-300 text-sm">
                Improve communication skills with expert-guided sessions.
              </p>
            </div>

            <div className="p-4 rounded-xl shadow-lg hover:translate-x-2 transition duration-300">
              <h3 className="text-white font-semibold mb-1">Cognitive Growth</h3>
              <p className="text-gray-300 text-sm">
                Enhance thinking, memory, and learning abilities.
              </p>
            </div>

            <div className="p-4 rounded-xl shadow-lg hover:translate-x-2 transition duration-300">
              <h3 className="text-white font-semibold mb-1">Confidence Building</h3>
              <p className="text-gray-300 text-sm">
                Help children express themselves with confidence.
              </p>
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">

            <button 
            onClick={onOpenModal} className="px-7 py-3 rounded-full border border-border text-white font-medium text-xl hover:scale-105 transition duration-300"> 
            Book Session →
            </button>

            <Link
              to="/programs"
              className="px-7 py-3 rounded-full border border-gray-700 text-gray-400
              hover:bg-white hover:text-black transition duration-300"
            >
              Explore Programs
            </Link>

          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center">

          <img
            src="https://img.freepik.com/free-vector/child-therapy-concept_23-2148655382.jpg"
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