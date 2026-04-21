import useCMS from "../hooks/useCMS";
import ProgramCard from "./ProgramCard";

function Services() {

  const { getSection } = useCMS("home");
  const cms = getSection("services");

  // ✅ YOUR ORIGINAL DATA (IMPORTANT)
  const staticData = [
    {
      title: "Speech Therapy",
      description: "Improve communication, language, and social skills through evidence-based speech development techniques tailored to each child.",
      image: "https://autism.jeevaniyam.in/wp-content/themes/jeevaniyam-landing/images/j3.webp"
    },
    {
      title: "Cognitive Therapy",
      description: "Enhance memory, attention, and problem-solving abilities with structured cognitive training programs.",
      image: "https://autism.jeevaniyam.in/wp-content/themes/jeevaniyam-landing/images/j5.webp"
    },
    {
      title: "Day Care",
      description: "A safe, nurturing, and engaging environment for learning, play, and social growth throughout the day.",
      image: "https://autism.jeevaniyam.in/wp-content/themes/jeevaniyam-landing/images/j4.webp"
    }
  ];

  // ✅ CMS override
  const data = cms?.data?.length ? cms.data : staticData;

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:bg-slate-900/50">

      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Our <span className="text-gradient">Services</span>
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto text-base leading-relaxed">
            Specialized therapy programs designed to support every child's growth,
            learning, and development journey.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {data.map((item, i) => (
            <ProgramCard key={i} {...item} />
          ))}
        </div>

      </div>

    </section>
  );
}

export default Services;