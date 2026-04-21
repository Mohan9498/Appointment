import { useNavigate } from "react-router-dom";
import useCMS from "../hooks/useCMS";
import j3 from "../assets/j3.webp";
import j5 from "../assets/j5.webp";
import j4 from "../assets/j4.webp";

function Programs() {
  const navigate = useNavigate();

  // ✅ CMS HOOK
  const { getSection } = useCMS("programs");
  const cms = getSection("programs");

  // ✅ STATIC (your existing content)
  const staticPrograms = [
    {
      title: "Speech Therapy",
      description: "Improve communication and language development skills in children through personalized, evidence-based sessions.",
      image: j3,
    },
    {
      title: "Cognitive Therapy",
      description: "Enhance memory, attention, and problem-solving abilities with structured cognitive training programs.",
      image: j5,
    },
    {
      title: "Day Care",
      description: "A safe, engaging environment for learning and social growth with expert supervision throughout the day.",
      image: j4,
    },
  ];

  // ✅ CMS + FALLBACK (your requirement)
  const programs = cms?.data?.length ? cms.data : staticPrograms;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white">

      <section className="py-28 relative overflow-hidden">

        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-white dark:from-slate-900/50 dark:to-slate-950 pointer-events-none" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* HEADER */}
        <div className="text-center mb-16 px-4 relative">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 animate-fade-in-up">
            Programs
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white animate-fade-in-up-delay-1">
            Our <span className="text-gradient">Programs</span>
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base leading-relaxed animate-fade-in-up-delay-2">
            Carefully designed therapy programs to support your child's growth and development.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto relative">

          {programs.map((program, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] hover:-translate-y-1"
            >

              {/* IMAGE */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={program.image || program.src} // ✅ supports CMS image
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Title on Image */}
                <div className="absolute bottom-4 left-5">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">{program.title}</h3>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">{program.description}</p>

                <button
                  onClick={() => navigate(`/programs/${program.title.toLowerCase().replace(/\s+/g, "-")}`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-sm text-white font-semibold hover:shadow-glow-blue hover:scale-[1.03] transition-all duration-300"
                >
                  Learn More
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </div>

            </div>
          ))}

        </div>

      </section>
    </div>
  );
}

export default Programs;