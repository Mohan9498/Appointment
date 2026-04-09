import { useNavigate } from "react-router-dom";
import g2 from "../assets/g2.jpeg";
import g3 from "../assets/g3.jpeg";
import g4 from "../assets/g4.jpeg";

function Programs() {
  const navigate = useNavigate();

  const programs = [
    {
      title: "Speech Therapy",
      description: "Improve communication and language development skills in children.",
      image: g2
    },
    {
      title: "Cognitive Therapy",
      description: "Enhance memory, attention, and problem-solving abilities.",
      image: g3
    },
    {
      title: "Day Care",
      description: "A safe, engaging environment for learning and social growth.",
      image: g4
    }
  ];

  return (
    <section className="min-h-screen py-20 bg-slate-50 dark:bg-black text-black dark:text-white">

      {/* HEADER */}
      <div className="text-center mb-16 px-4">
        <h2 className="text-4xl md:text-5xl text-blue-500 font-bold">
          Our <span className="text-blue-600">Programs</span>
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Carefully designed therapy programs to support your child’s growth and development.
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            {/* CONTENT */}
            <div className="absolute bottom-0 p-6 text-white">
              <h3 className="text-xl font-semibold">{program.title}</h3>
              <p className="text-sm text-gray-200 mt-2">
                {program.description}
              </p>

              {/* CTA */}
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

      {/* FLOATING BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 transition"
      >
        Home
      </button>

    </section>
  );
}

export default Programs;