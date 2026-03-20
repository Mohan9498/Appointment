function Gallery() {

  const images = [
    "https://img.freepik.com/free-photo/child-therapy-session",
    "https://img.freepik.com/free-photo/kids-playing",
    "https://img.freepik.com/free-photo/learning-activity",
    "https://img.freepik.com/free-photo/speech-therapy"
  ];

  return (
    <section className="bg-[#a7e2d6] py-20">

      <h2 className="text-3xl md:text-4xl text-center font-semibold mb-12 text-white">
        Our Activities
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 max-w-7xl mx-auto">

        {images.map((img, i) => (
          <div key={i} className="overflow-hidden rounded-xl group">
            <img
              src={img}
              alt="Gallery"
              className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500"
            />
          </div>
        ))}

      </div>

    </section>
  );
}

export default Gallery;