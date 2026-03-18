function ProgramCard({ title, description, image }) {
  return (
    <div className="group relative bg-[#111] rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-600 transition duration-300">

      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={image}
          className="h-52 w-full object-cover transform group-hover:scale-110 transition duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative p-6">

        <h3 className="text-white text-xl font-semibold tracking-wide">
          {title}
        </h3>

        <p className="text-gray-400 text-sm mt-3 leading-relaxed">
          {description}
        </p>

        {/* Button */}
        <button className="mt-5 text-sm text-accent font-medium group-hover:translate-x-1 transition flex items-center gap-1">
          Learn More →
        </button>

      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-transparent via-accent/10 to-transparent blur-xl"></div>

    </div>
  );
}

export default ProgramCard;