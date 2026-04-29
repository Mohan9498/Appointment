import { useEffect, useState } from "react";
import useCMS from "../hooks/useCMS";

import c1 from "../assets/c1.jpg";
import c2 from "../assets/c2-640.webp";
import j6 from "../assets/j6.webp";
import j7 from "../assets/j7.webp";

function Gallery() {
  const { getSection } = useCMS("home");
  const cms = getSection("gallery");

  const staticImages = [
    { src: c1, title: "Speech Activities" },
    { src: c2, title: "Learning Sessions" },
    { src: j6, title: "Cognitive Training" },
    { src: j7, title: "Play & Growth" },
  ];

  const images =
    cms && cms.data && cms.data.length ? cms.data : staticImages;

  // 🔥 BANNER STYLE STATES
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 🔄 AUTO LOOP
  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((currentSlide + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [currentSlide, images.length]);

  // 🔁 TRANSITION CONTROL (same as banner)
  const handleSlideChange = (newIndex) => {
    if (newIndex === currentSlide || isTransitioning) return;

    setNextSlide(newIndex);
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentSlide(newIndex);
      setIsTransitioning(false);
    }, 700);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white relative overflow-hidden">

      {/* HEADER */}
      <div className="text-center mb-16 px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
          Our <span className="text-gradient-warm">Activities</span>
        </h2>

        <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          A glimpse into our engaging sessions that help children grow, learn, and thrive.
        </p>
      </div>

      {/* 🔥 SLIDER AREA */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative h-[350px] md:h-[450px] overflow-hidden rounded-2xl">

          {/* CURRENT IMAGE */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${images[currentSlide].src || images[currentSlide].image})`,
              }}
            />
          </div>

          {/* NEXT IMAGE */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              isTransitioning ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${images[nextSlide].src || images[nextSlide].image})`,
              }}
            />
          </div>

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-6">
            <h3 className="text-white text-lg md:text-xl font-semibold">
              {images[currentSlide].title}
            </h3>
          </div>
        </div>
      </div>

      {/* 🔘 DOTS — accessible: aria-label + p-2 wrapper for 26px tap target */}
      <div className="flex justify-center mt-10 gap-1">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="p-2 flex items-center justify-center"
          >
            <span
              className={`h-2.5 rounded-full transition-all duration-300 block ${
                currentSlide === index && !isTransitioning
                  ? "w-8 bg-blue-500"
                  : nextSlide === index && isTransitioning
                  ? "w-8 bg-blue-500"
                  : "w-2.5 bg-gray-400 hover:bg-gray-600"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

export default Gallery;