import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useCms from "../hooks/useCms.js";

function About({ onOpenModal }) {

  const { get } = useCms("about");

  const hero = get("hero");
  const mission = get("mission");
  const vision = get("vision");
  const content = get("content");

  return (
    <div>

      <Navbar onOpenModal={onOpenModal} />

      <section className="pt-24 text-center">
        <h1>{hero?.title}</h1>
        <p>{hero?.description}</p>
      </section>

      <section className="grid md:grid-cols-2 gap-6 p-10">
        <div>
          <h2>{mission?.title}</h2>
          <p>{mission?.description}</p>
        </div>

        <div>
          <h2>{vision?.title}</h2>
          <p>{vision?.description}</p>
        </div>
      </section>

      <section className="p-10">
        <p>{content?.description}</p>
      </section>

      <Footer onOpenModal={onOpenModal} />
    </div>
  );
}

export default About;