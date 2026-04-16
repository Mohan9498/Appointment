import { Link } from "react-router-dom";

function ProgramCard({ title, description, image }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-md hover:shadow-xl transition-all duration-500 ease-in-out">

      {/* Image */}
      <div className="overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="h-52 w-full object-cover transform group-hover:scale-110 transition duration-500"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x250?text=Therapy";
          }}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
      </div>

      {/* Content */}
      <div className="relative p-6">

        {/* FIX: was text-white — invisible on light card background */}
        <h3 className="text-gray-900 dark:text-white text-xl font-semibold">
          {title}
        </h3>

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
          {description}
        </p>

        {/* FIX: was text-accent (undefined var) — replaced with real Tailwind class */}
        <button
          to={`/programs/${title.toLowerCase().replace(/\s+/g, "-")}`}
          className="mt-5 inline-block text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-all duration-500 ease-in-out cursor-pointer"
        >
          Learn More →
        </button>

      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out bg-gradient-to-r from-transparent via-blue-600/20 to-transparent blur-xl" />

    </div>
  );
}

export default ProgramCard;