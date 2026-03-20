import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="relative bg-[#bb94ce] py-28 text-center overflow-hidden">

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
        <p className="mt-5 text-gray-500 text-lg">
          Book a consultation today and take the first step toward growth and confidence.
        </p>

        {/* Button */}
        <Link
          to="/appointment"
          className="mt-10 inline-block px-8 py-3 rounded-full bg-accent text-amber-100 font-medium text-sm tracking-wide 
          hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,170,0.4)] transition duration-300"
        >
          Book Appointment →
        </Link>

      </div>

    </section>
  );
}

export default CTA;