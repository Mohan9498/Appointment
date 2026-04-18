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
    <section className="relative py-24 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />

      <div className="relative w-full px-6">

        {/* Heading — FIX: was "1sams"; also fixed invisible white→gray gradient on light bg */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white">
            Our <span className="text-blue-600 dark:text-blue-400">Services</span>
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto text-sm">
            Specialized therapy programs designed to support every child's growth,
            learning, and development journey.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {data.map((item, i) => (
            <ProgramCard key={i} {...item} />
          ))}
        </div>

      </div>

    </section>
  );
}

export default Services;