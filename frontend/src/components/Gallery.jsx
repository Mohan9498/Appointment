import React from "react";
import g1 from "../assets/g1.jpeg";
import g2 from "../assets/g2.jpeg";
import g3 from "../assets/g3.jpeg";
import g4 from "../assets/g4.jpeg";


function Gallery() {

  const images = [g1,g2,g3,g4] 

  return (
    <section className="bg-white dark:bg-white/5 dark:bg-black text-black dark:text-white py-20">

      <h2 className="text-3xl md:text-4xl text-center font-semibold mb-12  text-black dark:text-white">
        Our Activities
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-fuchsia-300 px-6 max-w-7xl mx-auto">

        {images.map((img, i) => (
          <div key={i} className="overflow-hidden bg-surface rounded-3xl group">
            <img
              src={img}
              alt="Gallery"
              className="w-full h-40 object-cover transform group-hover:scale-110 transition duration-500"
            />
          </div>
        ))}

      </div>

    </section>
  );
}

export default Gallery;