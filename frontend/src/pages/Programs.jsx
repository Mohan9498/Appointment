import ProgramCard from "../components/ProgramCard";
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
    <section className="min-h-screen bg-accent/5   glass border-collapse py-20">

      {/* Heading */}
      <div className="text-center mb-16 px-4">
        <h2 className="text-4xl font-semibold text-gray-900">
          Our Programs
        </h2>
        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          Carefully designed therapy programs for child development.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
        {programs.map((program, index) => (
          
          <div
            key={index}
            className="glass border-collapse border-glass-border rounded-xl shadow-sm hover:shadow-md transition duration-300"
          >
            <ProgramCard {...program} />
          </div>

        ))}
      </div>

      {/* Floating Home Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-6 right-6 glass  border-glass-border hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-md transition"
      >
        Home
      </button>

    </section>
  );
}

export default Programs;