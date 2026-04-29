import { Link } from "react-router-dom";

function ProgramCard({ title, description, image }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-xl dark:hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">

      {/* Image */}
      <div className="overflow-hidden relative h-56">
        <img
          src={image}
          alt={title}
          width={400}
          height={250}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transform group-hover:scale-110 transition duration-700 ease-out"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x250?text=Therapy";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
      </div>

      {/* Content */}
      <div className="relative p-6">

        <h3 className="text-gray-900 dark:text-white text-xl font-bold tracking-tight">
          {title}
        </h3>

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 leading-relaxed">
          {description}
        </p>

        <Link
          to={`/programs/${title.toLowerCase().replace(/\s+/g, "-")}`}
          className="mt-5 inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-300 font-semibold group-hover:gap-2 transition-all duration-300"
        >
          Learn More
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>

      </div>

    </div>
  );
}

export default ProgramCard;