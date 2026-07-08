import useCMS from "../hooks/useCMS";
import {
  Target,
  Sparkles,
  HeartPulse,
  ShieldCheck,
  Users,
  Star,
  Lightbulb,
  Award,
  GraduationCap,
  Smile,
} from "lucide-react";

import SEO from "../components/SEO";

// Same icon keys the admin dashboard's MissionVisionEditor picker uses
// (ICON_LIST in AdminDashboard.jsx) — kept in sync so any icon chosen there
// renders correctly here.
const ICON_MAP = {
  Target, Sparkles, HeartPulse, ShieldCheck, Users, Star, Lightbulb, Award,
  GraduationCap, Smile,
};

const CARD_STYLES = [
  { iconBg: "bg-blue-100 dark:bg-blue-900/30", emoji: "🎯" },
  { iconBg: "bg-indigo-100 dark:bg-indigo-900/30", emoji: "🌟" },
];

function About() {

  // ✅ CMS HOOK — reads the two sections actually registered for the About
  // page in the admin dashboard (see PAGE_SECTIONS.about in AdminDashboard.jsx)
  const { getSection } = useCMS("about");
  const missionVision = getSection("about-mission-vision");
  const story = getSection("about-story");

  // Falls back to the original static Mission/Vision copy whenever the CMS
  // section hasn't been configured yet, so the page never looks empty.
  const staticCards = [
    { title: "Our Mission", description: "We focus on speech, cognitive, and behavioral development through personalized therapy programs tailored for each child.", icon: "" },
    { title: "Our Vision", description: "Every child deserves a chance to succeed, grow confidently, and reach their fullest potential.", icon: "" },
  ];
  const cards = missionVision?.data?.length ? missionVision.data : staticCards;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white">
      <SEO 
        title="About Us" 
        description="Learn about Tiny Todds Therapy Care's mission and vision to help children grow through specialized therapy programs." 
        keywords="about us, child therapy, mission, vision" 
      />

      {/* HERO SECTION */}
      <section className="relative py-32 px-6 overflow-hidden">

        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pointer-events-none" />
        <div className="absolute top-10 right-20 w-72 h-72 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 animate-fade-in-up">
            About Us
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 animate-fade-in-up-delay-1">
            About <span className="text-gradient">Tiny Todds</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delay-2">
            Helping children grow through specialized therapy programs.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* ✅ CMS Mission & Vision — rendered as separate cards, same as before,
              but the title/description/icon of each card now comes from the
              admin dashboard's "Mission & Vision" section instead of being
              hardcoded. Each entry in `data` becomes its own card. */}
          <div className="grid md:grid-cols-2 gap-6">
            {cards.map((card, i) => {
              const style = CARD_STYLES[i % CARD_STYLES.length];
              const Icon = ICON_MAP[card.icon];
              return (
                <div
                  key={i}
                  className="group p-8 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center mb-5`}>
                    {Icon ? <Icon size={22} className="text-blue-600 dark:text-blue-400" /> : <span className="text-2xl">{style.emoji}</span>}
                  </div>
                  <h2 className="text-2xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">
                    {card.title || "—"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 leading-7 text-sm md:text-base">
                    {card.description || ""}
                  </p>
                </div>
              );
            })}
          </div>

          {/* MAIN CONTENT */}
          <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-8 md:p-12 shadow-sm space-y-8">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {story?.title || "Our Story"}
              </h2>
            </div>

            {/* ✅ CMS overrides FULL content safely — reads from the
                "Our Story" section (type: text) in the admin dashboard */}
            {story?.description ? (
              <p className="text-gray-500 dark:text-gray-400 leading-8 text-justify text-sm md:text-base whitespace-pre-line">
                {story.description}
              </p>
            ) : (
              <>
                <p className="text-gray-500 dark:text-gray-400 leading-8 text-justify text-sm md:text-base">
                  Tiny Todds Therapy Care is a specialized child development center dedicated to fostering each child's unique potential
                  through evidence-based therapy and compassionate, individualized care. Recognizing that early childhood is a critical period
                  for cognitive, emotional, and social development, we emphasize early intervention and structured programs that support communication,
                  learning abilities, and confidence building. Our approach is rooted in a deep understanding that every child is different,
                  and therefore requires a tailored pathway to growth.
                </p>

                <p className="text-gray-500 dark:text-gray-400 leading-8 text-justify text-sm md:text-base">
                  At Tiny Todds, we strive to provide a safe, engaging, and supportive atmosphere where children are encouraged to explore,
                  learn, and express themselves with confidence. Our therapy sessions integrate speech development, cognitive enhancement,
                  and interactive learning techniques designed to promote essential life skills and emotional well-being.
                </p>
              </>
            )}

          </div>

        </div>
      </section>
    </div>
  );
}

export default About;