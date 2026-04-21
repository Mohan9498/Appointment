import Hero from "../components/Hero";
import Features from "../components/Features";
import Services from "../components/Services";
import Gallery from "../components/Gallery";


 
function Home({ onOpenModal }) {
  return (
    <div className="text-black dark:text-white transition duration-300">
      <div className="pt-0 md:pt-10">
        <Hero onOpenModal={onOpenModal} />
        <Features />
        <Services />
        <Gallery />
      </div>
    </div>
  );
}
 
export default Home;