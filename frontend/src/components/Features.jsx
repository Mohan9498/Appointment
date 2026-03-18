function Features() {
  const data = [
    { title: "Expert Therapists" },
    { title: "Safe Environment" },
    { title: "Child Friendly" },
  ];

  return (
    <section className="bg-[#0a0a0a] py-20">

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6">

        {data.map((item, i) => (
          <div
            key={i}
            className="bg-[#111] border border-gray-800 rounded-2xl p-8 text-center
            hover:border-accent hover:shadow-[0_0_30px_rgba(0,255,170,0.2)]
            transition duration-300"
          >
            <h3 className="text-white text-xl font-semibold">
              {item.title}
            </h3>
          </div>
        ))}

      </div>
    </section>
  );
}

export default Features;