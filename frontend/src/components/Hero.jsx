import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#d8d2d2bd] overflow-hidden">

      {/* Glow Background */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-[600px] h-[600px] bg-accent/20 blur-[160px] rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 py-20 items-center">

        {/* Left Content */}
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-blue-500   via-purple-200 to-green-300 bg-clip-text text-transparent">
            Build Better <br />
            Communication <br />
            for Your Child
          </h1>

          <p className="mt-6 text-violet-700 text-base md:text-lg max-w-lg leading-relaxed">
            Advanced therapy programs designed to help children grow,
            learn, and communicate effectively with confidence.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              to="/appointment"
              className="px-7 py-3 rounded-full bg-accent text-amber-700 font-medium text-sm tracking-wide
              hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,170,0.4)] transition duration-300"
            >
              Book Session →
            </Link>

            <Link
              to="/programs"
              className="px-7 py-3 rounded-full border border-gray-700 text-gray-500
              hover:bg-white hover:shadow-[0_0_30px_rgba(0,255,170,0.4)] hover:text-black transition duration-300"
            >
              Explore Programs
            </Link>

          </div>
        </div>

        {/* Right Image */}
        <div className="relative">
          <img
            src="https://img.freepik.com/free-vector/child-therapy-concept_23-2148655382.jpg"
            alt="Child Therapy"
            className="rounded-2xl shadow-2xl transform hover:scale-105 transition duration-500"
          />

          {/* Image Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-accent/20 to-transparent blur-xl opacity-40"></div>
        </div>

      </div>
    </section>
  );
}

export default Hero;