import ProgramCard from "../components/ProgramCard";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Programs() {

  const navigate = useNavigate();

  const programs = [
    {
      title: "Speech Therapy",
      description: "Improve communication and language development skills in children.",
      image: "https://img.freepik.com/free-photo/speech-therapy-child"
    },
    {
      title: "Cognitive Therapy",
      description: "Enhance memory, attention, and problem-solving abilities.",
      image: "https://img.freepik.com/free-vector/brain-training-concept"
    },
    {
      title: "Day Care",
      description: "A safe, engaging environment for learning and social growth.",
      image: "https://img.freepik.com/free-vector/kids-playing-daycare"
    }
  ];

  return (
    <section className="bg-gradient-to-r from-indigo-700 via-purple-900 to-pink-900 py-24 min-h-screen ">

      {/* Back Button */}
      {/* <div className="max-w-7xl mx-auto px-6 mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>
      </div> */}

      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
          Our Programs
        </h2>
        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          Carefully designed therapy programs to support your child’s development journey.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8 px-6 text- max-w-7xl mx-auto">
        {programs.map((program, index) => (
          <ProgramCard
            key={index}
            title={program.title}
            description={program.description}
            image={program.image}
          />
        ))}
      </div>

      {/* Floating Home Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-6 right-6 bg-blue-300 hover:bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg transition"
      >
        Home
      </button>

    </section>
  );
}

export default Programs;