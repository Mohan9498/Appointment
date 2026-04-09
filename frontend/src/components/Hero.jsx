import { Link } from "react-router-dom";
import g1 from "../assets/g1.jpeg";

function Hero({ onOpenModal }) {
  return (
    <section className="relative pt-24 min-h-screen flex items-center overflow-hidden">

      {/* 🔥 GRADIENT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br bg-white/10  opacity-90"></div>

      {/* 🔥 SOFT GLOW */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-[500px] h-[500px] bg-white/10 blur-3xl rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 py-20 items-center text-white">

        {/* LEFT */}
        <div className="space-y-6 text-center md:text-left">

          <h1 className="text-4xl  dark:bg-white/0 dark:bg-black dark:text-white text-black/50 md:text-6xl font-bold leading-tight">
            Empowering <span className="text-yellow-300">Little Minds</span>
          </h1>

          <p className="text-lg  dark:text-white text-black/50  max-w-lg mx-auto md:mx-0">
            Professional therapy & development programs designed to help your child grow with confidence, communication, and care.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">

            <button
              onClick={onOpenModal}
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition"
            >
              Book Appointment
            </button>

            <Link
              to="/programs"
              className="border border-white px-6 py-3 rounded-full  dark:text-white text-black/70 hover:bg-white hover:text-blue-600 transition"
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
            className="w-[90%] md:w-full rounded-2xl shadow-2xl animate-zoom"
          />

          {/* Glow */}
          <div className="absolute inset-0 rounded-2xl bg-white/20 blur-2xl opacity-30"></div>

        </div>

      </div>
    </section>
  );
}

export default Hero;