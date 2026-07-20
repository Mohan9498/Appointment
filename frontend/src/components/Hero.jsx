import { Link } from "react-router-dom";
import useCMS from "../hooks/useCMS";
import g1 from "../assets/j-1.webp";
import { resolveImageUrl } from "../services/resolveImageUrl";

function Hero({ onOpenModal }) {

  // ✅ CMS HOOK
  const { getSection } = useCMS("home");
  const hero = getSection("hero");
  const heroStats = getSection("hero-stats");

  const stats = heroStats?.data?.length ? heroStats.data : [
    { title: "Children Helped", description: "700+" },
    { title: "Branches", description: "35+" },
    { title: "Parent Satisfaction", description: "98%" },
  ];

  // Badge text and the highlighted (accent-colored) line of the heading are
  // stored as two entries in hero.data, using the same {title, description}
  // shape every other CMS section's data array uses (stats, cards,
  // mission-vision) — the backend's serializer rejected a custom shape.
  const heroData = Array.isArray(hero?.data) ? hero.data : [];
  const badgeText = heroData.find((d) => d?.title === "badge")?.description || "✨ Professional Child Therapy";
  const highlightText = heroData.find((d) => d?.title === "highlight")?.description || "Little Minds";
  const headingLine1 = hero?.title || "Empowering";

  // Uploaded images come back as relative backend paths (e.g. "/media/..."),
  // same as in the admin dashboard preview — needs the API origin prefixed,
  // or the <img> 404s and silently falls back to nothing.
  const heroImage = hero?.image ? resolveImageUrl(hero.image) : g1;

  return (
    <section className="relative pt-16 md:pt-20 md:min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

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

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-6 md:gap-12 px-4 md:px-6 py-10 md:py-20 items-center">

        {/* LEFT */}
        <div className="space-y-4 md:space-y-6 text-center md:text-left">

          {/* Badge */}
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/30 backdrop-blur-sm">
              {badgeText}
            </span>
          </div>

          {/* ✅ CMS TITLE — first line comes from `title`, second (accent) line
              from `data[0].highlight`. Both are editable independently in the
              admin dashboard, so there's no brittle string-splitting here. */}
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-extrabold leading-[1.15] md:leading-[1.1] tracking-tight text-gray-900 dark:text-white animate-fade-in-up-delay-1">
            {headingLine1}{" "}
            <span className="text-gradient">
              {highlightText}
            </span>
          </h1>

          {/* ✅ CMS DESCRIPTION */}
          <p className="text-sm md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto md:mx-0 leading-relaxed animate-fade-in-up-delay-2">
            {hero?.description ||
              "Professional therapy & development programs designed to help your child grow with confidence, communication, and care."}
          </p>

          {/* CTA */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 mt-4 md:mt-8 animate-fade-in-up-delay-3">

            <button
              onClick={onOpenModal}
              className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 md:px-8 md:py-4 rounded-full text-sm md:text-base font-semibold shadow-glow-blue hover:shadow-glow-indigo hover:scale-[1.03] transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Book Appointment</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <Link
              to="/programs"
              className="group border-2 border-gray-300 dark:border-white/20 text-gray-700 dark:text-white px-5 py-2.5 md:px-8 md:py-4 rounded-full text-sm md:text-base font-semibold hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-300 hover:shadow-lg"
            >
              Explore Programs
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>

          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 mt-5 md:mt-10 pt-4 md:pt-8 border-t border-gray-200/50 dark:border-white/10 animate-fade-in-up-delay-3">
            {stats.map((stat, i) => (
              <div key={i}>
                <p className="text-lg md:text-3xl font-bold text-gray-900 dark:text-white">{stat.description}</p>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center animate-fade-in-up-delay-2">

          {/* Decorative ring */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-2xl animate-glow-pulse -z-10" />

          {/* ✅ CMS IMAGE */}
          <img
            src={heroImage}
            alt="Child Therapy"
            width={400}
            height={300}
            fetchPriority="high"
            decoding="async"
            className="w-[85%] md:w-full rounded-2xl md:rounded-3xl shadow-premium dark:shadow-premium-dark animate-float ring-1 ring-black/5 dark:ring-white/10"
          />

        </div>

      </div>
    </section>
  );
}

export default Hero;