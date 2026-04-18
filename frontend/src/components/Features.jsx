import { ShieldCheck, Heart, Brain, Clock, Users, Star } from "lucide-react";
import useCMS from "../hooks/useCms";

function Features() {

  const { getSection } = useCMS("home");
  const cms = getSection("features");

  // ✅ KEEP YOUR ORIGINAL DATA
  const staticData = [
    {
      icon: <Brain size={16} />,
      title: "Expert Therapists",
      description: "Our certified specialists bring years of experience in pediatric speech, cognitive, and behavioral therapy.",
      color: "blue",
    },
    {
      icon: <ShieldCheck size={16} />,
      title: "Safe Environment",
      description: "A fully child-proofed, nurturing space designed to make every child feel comfortable and secure.",
      color: "emerald",
    },
    {
      icon: <Heart size={16} />,
      title: "Child Friendly",
      description: "Programs are built around play-based learning so children enjoy every session and thrive.",
      color: "pink",
    },
    {
      icon: <Clock size={16} />,
      title: "Flexible Scheduling",
      description: "Morning, afternoon, and weekend slots available to fit your family's routine.",
      color: "amber",
    },
    {
      icon: <Users size={16} />,
      title: "Family Involvement",
      description: "We keep parents engaged with regular progress updates and at-home activity guides.",
      color: "indigo",
    },
    {
      icon: <Star size={16} />,
      title: "Proven Results",
      description: "Over 500 children have made meaningful developmental progress across our 15 branches.",
      color: "orange",
    },
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'group-hover:border-blue-200 dark:group-hover:border-blue-800/50' },
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'group-hover:border-emerald-200 dark:group-hover:border-emerald-800/50' },
    pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400', border: 'group-hover:border-pink-200 dark:group-hover:border-pink-800/50' },
    amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'group-hover:border-amber-200 dark:group-hover:border-amber-800/50' },
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400', border: 'group-hover:border-indigo-200 dark:group-hover:border-indigo-800/50' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', border: 'group-hover:border-orange-200 dark:group-hover:border-orange-800/50' },
  };

  // ✅ CMS override logic
  const data = cms?.data?.length ? cms.data : staticData;

  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-950 relative overflow-hidden">

      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-100/40 dark:from-blue-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">

        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
            Why Us
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Why Choose <span className="text-gradient">Tiny Todds?</span>
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            We combine clinical expertise with compassion to give every child the best possible start.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, i) => {
            const colors = colorMap[item.color] || colorMap.blue;
            return (
              <div
                key={i}
                className={`group relative bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-7 transition-all duration-500 hover:shadow-xl dark:hover:shadow-2xl hover:-translate-y-1 ${colors.border}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* ✅ ICON only for static fallback */}
                {item.icon && (
                  <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition duration-500`}>
                    <span className={colors.text}>
                      {item.icon}
                    </span>
                  </div>
                )}

                <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-2 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Features;