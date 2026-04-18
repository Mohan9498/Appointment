import useCMS from "../hooks/useCms";
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
    <section className="py-24 bg-white dark:bg-slate-950 text-black dark:text-white relative overflow-hidden">

      {/* Background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-blue-100/30 dark:from-blue-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* HEADER */}
      <div className="text-center mb-16 px-4 relative">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4">
          Gallery
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Our <span className="text-gradient-warm">Activities</span>
        </h2>
        <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
          A glimpse into our engaging sessions that help children grow, learn, and thrive.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 px-6 max-w-7xl mx-auto relative">

        {images.map((img, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl group shadow-sm hover:shadow-xl transition-all duration-500 ease-out aspect-[4/3]"
          >

            {/* IMAGE */}
            <img
              src={img.src || img.image} // ✅ supports CMS image field
              alt={img.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-5">
              <h3 className="text-white font-semibold text-sm md:text-base transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
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