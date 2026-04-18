import { Link } from "react-router-dom";
import useCMS from "../hooks/useCMS";
import g1 from "../assets/j-1.webp";

function Hero({ onOpenModal }) {

  // ✅ CMS HOOK
  const { getSection } = useCMS("home");
  const hero = getSection("hero");

  return (
    <section className="relative pt-20 min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-black">

      {/* Soft Glow */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-blue-200/30 dark:bg-blue-900/20 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 py-20 items-center">

        {/* LEFT */}
        <div className="space-y-6 text-center md:text-left">

          {/* ✅ CMS TITLE */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
            {hero?.title ? (
              <>
                {hero.title.split("Little Minds")[0]}
                <span className="text-purple-600 dark:text-purple-400">
                  Little Minds
                </span>
              </>
            ) : (
              <>
                Empowering{" "}
                <span className="text-purple-600 dark:text-purple-400">
                  Little Minds
                </span>
              </>
            )}
          </h1>

          {/* ✅ CMS DESCRIPTION */}
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto md:mx-0">
            {hero?.description ||
              "Professional therapy & development programs designed to help your child grow with confidence, communication, and care."}
          </p>

          {/* CTA */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">

            <button
              onClick={onOpenModal}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition"
            >
              Book Appointment
            </button>

            <Link
              to="/programs"
              className="border-2 border-blue-600 text-blue-600 dark:border-white dark:text-white px-6 py-3 rounded-full hover:bg-blue-600 hover:text-white dark:hover:bg-white dark:hover:text-blue-600 transition"
            >
              Explore Programs
            </Link>

          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center">

          {/* ✅ CMS IMAGE */}
          <img
            src={hero?.image || g1}
            alt="Child Therapy"
            className="w-[90%] md:w-full rounded-2xl shadow-2xl animate-zoom"
          />

          {/* Subtle glow ring */}
          <div className="absolute -inset-4 rounded-2xl bg-blue-400/20 blur-2xl opacity-50 -z-10" />

        </div>

      </div>
    </section>
  );
}

export default Hero;