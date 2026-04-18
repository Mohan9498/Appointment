import { Link } from "react-router-dom";
import useCMS from "../hooks/useCms";
import g1 from "../assets/j-1.webp";

function Hero({ onOpenModal }) {

  // ✅ CMS HOOK
  const { getSection } = useCMS("home");
  const hero = getSection("hero");

  return (
    <section className="relative pt-20 min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/15 dark:bg-purple-700/10 rounded-full blur-3xl" />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle, #6366F1 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 py-20 items-center">

        {/* LEFT */}
        <div className="space-y-6 text-center md:text-left">

          {/* Badge */}
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/30 backdrop-blur-sm">
              ✨ Professional Child Therapy
            </span>
          </div>

          {/* ✅ CMS TITLE */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-gray-900 dark:text-white animate-fade-in-up-delay-1">
            {hero?.title ? (
              <>
                {hero.title.split("Little Minds")[0]}
                <span className="text-gradient">
                  Little Minds
                </span>
              </>
            ) : (
              <>
                Empowering{" "}
                <span className="text-gradient">
                  Little Minds
                </span>
              </>
            )}
          </h1>

          {/* ✅ CMS DESCRIPTION */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto md:mx-0 leading-relaxed animate-fade-in-up-delay-2">
            {hero?.description ||
              "Professional therapy & development programs designed to help your child grow with confidence, communication, and care."}
          </p>

          {/* CTA */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8 animate-fade-in-up-delay-3">

            <button
              onClick={onOpenModal}
              className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold shadow-glow-blue hover:shadow-glow-indigo hover:scale-[1.03] transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Book Appointment</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <Link
              to="/programs"
              className="group border-2 border-gray-300 dark:border-white/20 text-gray-700 dark:text-white px-8 py-4 rounded-full font-semibold hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-300 hover:shadow-lg"
            >
              Explore Programs
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>

          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-10 pt-8 border-t border-gray-200/50 dark:border-white/10 animate-fade-in-up-delay-3">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">700+</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Children Helped</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">35+</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Branches</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">98%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Parent Satisfaction</p>
            </div>
          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center animate-fade-in-up-delay-2">

          {/* Decorative ring */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-2xl animate-glow-pulse -z-10" />

          {/* ✅ CMS IMAGE */}
          <img
            src={hero?.image || g1}
            alt="Child Therapy"
            className="w-[90%] md:w-full rounded-3xl shadow-premium dark:shadow-premium-dark animate-float ring-1 ring-black/5 dark:ring-white/10"
          />

        </div>

      </div>
    </section>
  );
}

export default Hero;