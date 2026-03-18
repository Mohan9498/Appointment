import ProgramCard from "../components/ProgramCard";

function Programs() {

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
    <section className="bg-[#0a0a0a] py-24">

      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          Our Programs
        </h2>
        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          Carefully designed therapy programs to support your child’s development journey.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">

        {programs.map((program, index) => (
          <ProgramCard
            key={index}
            title={program.title}
            description={program.description}
            image={program.image}
          />
        ))}

      </div>

    </section>
  );
}

export default Programs;