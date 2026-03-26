import { Link } from "react-router-dom";

function ProgramCard({ title, description, image }) {
  return (
    <div className="group relative  rounded-2xl overflow-hidden border   transition duration-300">

      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-52 w-full object-cover transform group-hover:scale-110 transition duration-500"
        />

        <div className="absolute inset-0  glass border-collapse border-glass-border opacity"></div>
      </div>

      {/* Content */}
      <div className="relative p-6">

        <h3 className="text-white text-xl font-semibold">
          {title}
        </h3>

        <p className="text-gray-400 text-sm mt-3">
          {description}
        </p>

  
        <Link
          to={`/programs/${title.toLowerCase().replace(/\s+/g, "-")}`}
          className="mt-5 inline-block text-sm text-accent font-medium 
          group-hover:translate-x-1 transition"
        >
          Learn More →
        </Link>

      </div>

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-transparent via-accent/10 to-transparent blur-xl"></div>

    </div>
  );
}

export default ProgramCard;