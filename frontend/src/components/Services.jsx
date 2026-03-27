import ProgramCard from "./ProgramCard";

function Services() {

  const data = [
    {
      title: "Speech Therapy",
      description: "Improve communication skills",
      image: "https://img.freepik.com/free-vector/speech-therapy-concept_23-2148655407.jpg"
    },
    {
      title: "Cognitive Therapy",
      description: "Enhance thinking ability",
      image: "https://img.freepik.com/free-vector/brain-development-concept_23-2148655412.jpg"
    },
    {
      title: "Day Care",
      description: "Safe learning environment",
      image: "https://img.freepik.com/free-vector/daycare-concept_23-2148655383.jpg"
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-primary/10  rounded-full"></div>

      <div className="relative w-full px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Our Programs
          </h2>

          <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm">
            Specialized therapy programs designed to support every child’s growth,
            learning, and development journey.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {data.map((item, i) => (
            <ProgramCard key={i} {...item} />
          ))}
        </div>

      </div>

    </section>
  );
}

export default Services;