import g1 from "../assets/g1.jpeg";
import g2 from "../assets/g2.jpeg";
import g3 from "../assets/g3.jpeg";
import g4 from "../assets/g4.jpeg";

function Gallery() {
  const images = [
    { src: g1, title: "Speech Activities" },
    { src: g2, title: "Learning Sessions" },
    { src: g3, title: "Cognitive Training" },
    { src: g4, title: "Play & Growth" },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-black text-black dark:text-white">

      {/* HEADER */}
      <div className="text-center mb-14 px-4">
        <h2 className="text-4xl md:text-5xl font-bold">
          Our <span className="text-blue-600">Activities</span>
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          A glimpse into our engaging sessions that help children grow, learn, and thrive.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 max-w-7xl mx-auto">

        {images.map((img, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl group shadow-md hover:shadow-xl transition duration-500"
          >

            {/* IMAGE */}
            <img
              src={img.src}
              alt={img.title}
              className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
              <h3 className="text-white font-semibold text-lg">
                {img.title}
              </h3>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}

export default Gallery;