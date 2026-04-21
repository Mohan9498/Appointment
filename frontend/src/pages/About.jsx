import useCMS from "../hooks/useCMS";

function About() {

  // ✅ CMS HOOK
  const { getSection } = useCMS("about");

  // 🔥 FIX: match section correctly
  const about = getSection("about-main");

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white">

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

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="group p-8 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-5">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">
                Our Mission
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-7 text-sm md:text-base">
                We focus on speech, cognitive, and behavioral development through
                personalized therapy programs tailored for each child.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-5">
                <span className="text-2xl">🌟</span>
              </div>
              <h2 className="text-2xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">
                Our Vision
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-7 text-sm md:text-base">
                Every child deserves a chance to succeed, grow confidently, and
                reach their fullest potential.
              </p>
            </div>

          </div>

          {/* MAIN CONTENT */}
          <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-8 md:p-12 shadow-sm space-y-8">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Our Story</h2>
            </div>

            {/* ✅ FIX: CMS overrides FULL content safely */}
            {about?.description ? (
              <p className="text-gray-500 dark:text-gray-400 leading-8 text-justify text-sm md:text-base">
                {about.description}
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