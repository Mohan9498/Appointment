import useCMS from "../hooks/useCMS";
import c1 from "../assets/c1.jpg";
import c2 from "../assets/c2.jpg";
import j6 from "../assets/j6.webp";
import j7 from "../assets/j7.webp";

function Gallery() {

  // ✅ CMS HOOK
  const { getSection } = useCMS("home");
  const cms = getSection("gallery");

  // ✅ STATIC FALLBACK (your existing data)
  const staticImages = [
    { src: c1, title: "Speech Activities" },
    { src: c2, title: "Learning Sessions" },
    { src: j6, title: "Cognitive Training" },
    { src: j7, title: "Play & Growth" },
  ];

  // ✅ CMS + FALLBACK LOGIC (your requirement)
  const images = cms?.data?.length ? cms.data : staticImages;

  return (
    <section className="py-20 bg-slate-50 dark:bg-black text-black dark:text-white">

      {/* HEADER */}
      <div className="text-center mb-14 px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
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
            className="relative overflow-hidden rounded-2xl group shadow-md hover:shadow-xl transition-all duration-500 ease-in-out"
          >

            {/* IMAGE */}
            <img
              src={img.src || img.image} // ✅ supports CMS image field
              alt={img.title}
              className="w-full h-48 object-cover group-hover:scale-110 transition-all duration-500 ease-in-out"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out flex items-center justify-center">
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