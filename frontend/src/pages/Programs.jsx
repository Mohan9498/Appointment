import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useCms from "../hooks/useCms.js";

function Programs({ onOpenModal }) {

  const { get } = useCms("programs");

  const programs = get("cards");

  return (
    <div>

      <Navbar onOpenModal={onOpenModal} />

      <section className="pt-24 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          {programs?.title}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {programs?.data?.map((p, i) => (
            <div key={i}>
              <img src={p.image} />
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer onOpenModal={onOpenModal} />
    </div>
  );
}

export default Programs;