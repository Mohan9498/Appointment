import { ShieldCheck, Heart, Brain, Clock, Users, Star } from "lucide-react";
import useCMS from "../hooks/useCMS";

function Features() {

  const { getSection } = useCMS("home");
  const cms = getSection("features");

  // ✅ KEEP YOUR ORIGINAL DATA
  const staticData = [
    {
      icon: <Brain size={28} className="text-blue-600" />,
      title: "Expert Therapists",
      description: "Our certified specialists bring years of experience in pediatric speech, cognitive, and behavioral therapy.",
    },
    {
      icon: <ShieldCheck size={28} className="text-green-500" />,
      title: "Safe Environment",
      description: "A fully child-proofed, nurturing space designed to make every child feel comfortable and secure.",
    },
    {
      icon: <Heart size={28} className="text-pink-500" />,
      title: "Child Friendly",
      description: "Programs are built around play-based learning so children enjoy every session and thrive.",
    },
    {
      icon: <Clock size={28} className="text-yellow-500" />,
      title: "Flexible Scheduling",
      description: "Morning, afternoon, and weekend slots available to fit your family's routine.",
    },
    {
      icon: <Users size={28} className="text-indigo-500" />,
      title: "Family Involvement",
      description: "We keep parents engaged with regular progress updates and at-home activity guides.",
    },
    {
      icon: <Star size={28} className="text-orange-500" />,
      title: "Proven Results",
      description: "Over 500 children have made meaningful developmental progress across our 15 branches.",
    },
  ];

  // ✅ CMS override logic
  const data = cms?.data?.length ? cms.data : staticData;

  return (
    <section className="py-16 px-6 bg-slate-50 dark:bg-black">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
            Why Choose <span className="text-blue-600">Tiny Todds?</span>
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm">
            We combine clinical expertise with compassion to give every child the best possible start.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {data.map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm hover:shadow-2xl transition duration-300 group"
            >
              {/* ✅ ICON only for static fallback */}
              {item.icon && (
                <div className="mb-4 group-hover:scale-110 transition duration-300 inline-block">
                  {item.icon}
                </div>
              )}

              <h3 className="text-black dark:text-white text-lg font-semibold mb-2">
                {item.title}
              </h3>

              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;