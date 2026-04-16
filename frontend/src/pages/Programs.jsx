import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import g2 from "../assets/g2.jpeg";
import g3 from "../assets/g3.jpeg";
import g4 from "../assets/g4.jpeg";

function Programs({ onOpenModal }) {
  const navigate = useNavigate();

  const programs = [
    {
      title: "Speech Therapy",
      description: "Improve communication and language development skills in children.",
      image: g2,
    },
    {
      title: "Cognitive Therapy",
      description: "Enhance memory, attention, and problem-solving abilities.",
      image: g3,
    },
    {
      title: "Day Care",
      description: "A safe, engaging environment for learning and social growth.",
      image: g4,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-black dark:text-white">

      {/* FIX: Navbar was missing — added so users can navigate from this page */}
      <Navbar onOpenModal={onOpenModal} />

      <section className="py-24">

        {/* HEADER */}
        <div className="text-center mb-16 px-4">
          {/* FIX: was text-blue-600 outer + text-blue-600 span — near-identical shades */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Our <span className="text-blue-600">Programs</span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Carefully designed therapy programs to support your child's growth and development.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">

          {programs.map((program, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500"
            >

              {/* IMAGE */}
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* CONTENT */}
              <div className="absolute bottom-0 p-6 text-white">
                <h3 className="text-xl font-semibold">{program.title}</h3>
                <p className="text-sm text-gray-200 mt-2">{program.description}</p>

                {/* CTA — navigates to contact instead of just navigating to '/' */}
                <button
                  onClick={() => navigate("/contact")}
                  className="mt-4 px-4 py-2 bg-blue-600 rounded-full text-sm hover:bg-blue-700 transition"
                >
                  Enroll Now
                </button>
              </div>

            </div>
          ))}

        </div>

      </section>

      {/* FIX: removed fixed floating "Home" button that overlapped the chatbot widget */}
      <Footer onOpenModal={onOpenModal} />

    </div>
  );
}

export default Programs;