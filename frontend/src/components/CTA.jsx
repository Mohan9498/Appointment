import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="relative bg py-28 text-center overflow-hidden">

      {/* Glow Background */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[500px] h-[500px] bg-accent/20 blur-[140px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Start Your Child's Therapy Journey
        </h2>

        {/* Subtitle */}
        <p className="mt-5 text-gray-100 text-lg">
          Book a consultation today and take the first step toward growth and confidence.
        </p> <br />

        {/* Button */}
        <Link
          to="/appointment"
          className="bg text-white px-5 py-2 rounded-lg hover:bg-primary-hover transition"
        >
          Book Appointment →
        </Link>

      </div>

    </section>
  );
}

export default CTA;