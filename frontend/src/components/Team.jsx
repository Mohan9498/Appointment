function Team() {

  const team = ["Therapist 1", "Therapist 2", "Therapist 3"];

  return (
    <section className="bg  border-collapse py-20 ">

      <h2 className="text-3xl font-bold text-center mb-10">
        Our Therapists
      </h2>

      <div className="grid md:grid-cols-3 gap-6 w-full px-6">

        {team.map((t, i) => (
          <div key={i} className="bg-surface text-text-main p-6 rounded-2xl shadow text-center">
            <img
              src="https://img.freepik.com/free-vector/doctor"
              className="rounded-full w-24 mx-auto"
            />        
            <h3 className="mt-4 font-bold">{t}</h3>
          </div>
        ))}

      </div>

    </section>
  );
  // we can remove the image later and add count of skill staff and student counts and staff counts
}

export default Team;

