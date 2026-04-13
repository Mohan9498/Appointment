import { Link } from "react-router-dom";

function ProgramCard({ title, description, image }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-border bg-surface shadow-md hover:shadow-xl transition-all duration-500 ease-in-out ">

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

        {/* ✅ Hover Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out"></div>
      </div>

      {/* Content */}
      <div className="relative p-6">

        <h3 className="text-white text-xl font-semibold">
          {title}
        </h3>

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
          {description}
        </p>

        <Link
          to={`/programs/${title.toLowerCase().replace(/\s+/g, "-")}`}
          className="mt-5 inline-block text-sm text-accent font-medium group-hover:translate-x-1 transition-all duration-500 ease-in-out"
        >
          Learn More →
        </Link>

      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out bg-gradient-to-r from-transparent via-accent/20 to-transparent blur-xl"></div>

    </div>
  );
}

export default ProgramCard;