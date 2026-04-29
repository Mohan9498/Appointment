import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Heart,
  Brain,
  Clock,
  Users,
  Star,
} from "lucide-react";
import useCMS from "../hooks/useCMS";

// ✅ IMPORT LOCAL IMAGES
import therapy from "../assets/features/therapy.jpeg";
import safe from "../assets/features/safe-env.jpeg";
import play from "../assets/features/play-learning.jpeg";
import schedule from "../assets/features/schedule.png";   
import family from "../assets/features/parent.jpeg";     
import progress from "../assets/features/progress.jpeg";

function Features() {
  const { getSection } = useCMS("home");
  const cms = getSection("features");

  // ✅ STATIC DATA WITH LOCAL IMAGES
  const staticData = [
    {
      icon: <Brain size={18} />,
      title: "Expert Therapists",
      description:
        "Our certified specialists bring years of experience in pediatric speech, cognitive, and behavioral therapy.",
      image: therapy,
    },
    {
      icon: <ShieldCheck size={18} />,
      title: "Safe Environment",
      description:
        "A fully child-proofed, nurturing space designed to make every child feel comfortable and secure.",
      image: safe,
    },
    {
      icon: <Heart size={18} />,
      title: "Child Friendly",
      description:
        "Programs are built around play-based learning so children enjoy every session and thrive.",
      image: play,
    },
    {
      icon: <Clock size={18} />,
      title: "Flexible Scheduling",
      description:
        "Morning, afternoon, and weekend slots available to fit your family's routine.",
      image: schedule,
    },
    {
      icon: <Users size={18} />,
      title: "Family Involvement",
      description:
        "We keep parents engaged with regular progress updates and at-home activity guides.",
      image: family,
    },
    {
      icon: <Star size={18} />,
      title: "Proven Results",
      description:
        "Over 2850 children have made meaningful developmental progress across our 35 branches.",
      image: progress,
    },
  ];

  const data = cms?.data?.length ? cms.data : staticData;

  // 🔥 BANNER STATES
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 🔄 AUTO LOOP
  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((currentSlide + 1) % data.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [currentSlide, data.length]);

  // 🔁 TRANSITION CONTROL
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
    <section className="relative w-full min-h-[520px] overflow-hidden">

      {/* 🔥 BACKGROUND IMAGES */}
      <div className="absolute inset-0">

        {/* CURRENT */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${data[currentSlide].image})`,
            }}
          />
        </div>

        {/* NEXT */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            isTransitioning ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${data[nextSlide].image})`,
            }}
          />
        </div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex items-center justify-center text-center px-6 min-h-[520px]">
        <div className="max-w-2xl">

          <div className="mb-5 flex justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
              {data[currentSlide].icon}
            </div>
          </div>

          <h2 className="text-white text-2xl md:text-4xl font-bold mb-4">
            {data[currentSlide].title}
          </h2>

          <p className="text-white/85 text-sm md:text-base leading-relaxed">
            {data[currentSlide].description}
          </p>
        </div>
      </div>

      {/* 🔘 DOTS — accessible: aria-label + p-2 wrapper for 26px tap target */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1 z-20">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="p-2 flex items-center justify-center"
          >
            <span
              className={`h-2.5 rounded-full transition-all duration-300 block ${
                currentSlide === index && !isTransitioning
                  ? "w-8 bg-white"
                  : nextSlide === index && isTransitioning
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

export default Features;