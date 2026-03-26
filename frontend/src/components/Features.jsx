function Features() {
  const data = [
    { title: "Expert Therapists" },
    { title: "Safe Environment" },
    { title: "Child Friendly" },
  ];

  return (
    <section className="bg-transparent py-20">

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6">

        {data.map((item, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-dark text-2xl font-semibold">
              {item.title}
            </h3>
          </div>
        ))}

      </div>
    </section>
  );
}

export default Features;