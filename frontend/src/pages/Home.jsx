import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useCms from "../hooks/useCms.js";

function Home({ onOpenModal }) {

  const { get } = useCms("home");

  const hero = get("hero");
  const features = get("features");
  const services = get("services");

  return (
    <div className="text-black dark:text-white">

      <Navbar onOpenModal={onOpenModal} />

      {/* HERO */}
      <section className="pt-24 text-center">
        <h1 className="text-4xl font-bold">{hero?.title}</h1>
        <p className="mt-4">{hero?.description}</p>
        {hero?.image && <img src={hero.image} className="mx-auto mt-6" />}
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6">
        <h2 className="text-2xl font-bold mb-6">{features?.title}</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {features?.data?.map((item, i) => (
            <div key={i} className="p-5 border rounded-xl">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 px-6">
        <h2 className="text-2xl font-bold mb-6">{services?.title}</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {services?.data?.map((item, i) => (
            <div key={i}>
              <img src={item.image} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer onOpenModal={onOpenModal} />
    </div>
  );
}

export default Home;