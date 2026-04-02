import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-slate-900 dark:text-white">

      {/* 🌟 HERO SECTION */}
      <div className="bg-white dark:bg-slate-900 py-16 px-6">

        <div className="max-w-full mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-semibold text-black dark:text-white">
            About Tiny Todds
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Helping children grow through specialized therapy programs.
          </p>
        </div>

        {/* 🎯 Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">

          {/* Mission */}
          <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl backdrop-blur-lg border border-black/10 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition">
            <h2 className="text-xl font-semibold mb-3 text-blue-500">
              Our Mission
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-6">
              We focus on speech, cognitive, and behavioral development through
              personalized therapy programs tailored for each child.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl backdrop-blur-lg border border-black/10 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition">
            <h2 className="text-xl font-semibold mb-3 text-indigo-500">
              Our Vision
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-6">
              Every child deserves a chance to succeed, grow confidently, and
              reach their fullest potential.
            </p>
          </div>

        </div>
      </div>

      {/* 📖 CONTENT SECTION */}
      <div className="max-w-full bg-white dark:bg-slate-900 mx-auto px-10 py-16">

        <div className="bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-lg space-y-6">

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

      <Footer />
    </div>
  );
}

export default About;