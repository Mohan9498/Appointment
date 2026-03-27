function Features() {
  const data = [
    { title: "Expert Therapists" },
    { title: "Safe Environment" },
    { title: "Child Friendly" },
  ];

  return (
    <section className="py-10">

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6">

        {data.map((item, i) => (
          <div
            key={i}
            className="bg-surface border border-border  rounded-xl p-6 shadow-xl hover:shadow-lg transition"
          >
            <h3 className="text-white text-2xl font-semibold">
              {item.title}
            </h3>
          </div>
        ))}

      </div>
    </section>
  );
}

export default Features;