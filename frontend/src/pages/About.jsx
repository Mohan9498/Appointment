import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-black dark:text-white">

      <Navbar />

      {/* 🌟 HERO SECTION */}
      <section className="relative py-20 px-6  bg-slate-50 dark:bg-black/25 text-black dark:text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-green-600 tracking-tight mb-4">
            About Tiny Todds
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Helping children grow through specialized therapy programs.
          </p>
        </div>
      </section>

      {/* 🎯 MISSION & VISION SECTION */}
      <section className="px-6 py-20 border border-gray-700 bg-slate-50 dark:bg-black/25 text-black dark:text-white">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* 🔷 TOP: Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* Mission */}
            <div className="p-8 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-md hover:shadow-xl transition duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-blue-500">
                Our Mission
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-7 text-sm md:text-base">
                We focus on speech, cognitive, and behavioral development through
                personalized therapy programs tailored for each child.
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-md hover:shadow-xl transition duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-500">
                Our Vision
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-7 text-sm md:text-base">
                Every child deserves a chance to succeed, grow confidently, and
                reach their fullest potential.
              </p>
            </div>

          </div>

          {/* 📖 CONTENT BELOW */}
          <div className="bg-white/80 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-xl shadow-lg space-y-8">

            <p className="text-gray-700 dark:text-gray-300 leading-8 text-justify indent-10 text-sm md:text-base">
              Tiny Todds Therapy Care is a specialized child development center dedicated to fostering each child’s unique potential
              through evidence-based therapy and compassionate, individualized care. Recognizing that early childhood is a critical period
              for cognitive, emotional, and social development, we emphasize early intervention and structured programs that support communication,
              learning abilities, and confidence building. Our approach is rooted in a deep understanding that every child is different,
              and therefore requires a tailored pathway to growth.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-8 text-justify indent-10 text-sm md:text-base">
              At Tiny Todds, we strive to provide a safe, engaging, and supportive atmosphere where children are encouraged to explore,
              learn, and express themselves with confidence. Our therapy sessions integrate speech development, cognitive enhancement,
              and interactive learning techniques designed to promote essential life skills and emotional well-being.
            </p>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;