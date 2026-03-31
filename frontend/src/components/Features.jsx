function Features() {
  const data = [
    { title: "Expert Therapists" },
    { title: "Safe Environment" },
    { title: "Child Friendly" },
  ];

  return (
    <section className="py-10 px-10 bg-white dark:bg-white/5 border border-gray-800" >

      <div className="max-w-7xl mx-auto  grid md:grid-cols-3 gap-8 px-6">

        {data.map((item, i) => (
          <div
            key={i}
            className="bg-white dark:bg-white/5 border border-border  rounded-xl p-6 shadow-xl hover:shadow-lg transition"
          >
            <h3 className="text-black dark:text-white  text-2xl font-semibold">
              {item.title}
            </h3>
          </div>
        ))}

      </div>
    </section>
  );
}

export default Features;