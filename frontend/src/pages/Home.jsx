import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Features from "../components/Features";
import Gallery from "../components/Gallery";

function Home({ onOpenModal }) {
  return (
    <div className="text-black dark:text-white transition duration-300">
      
      <div className="pt-0 md:pt-18">
        {/* ✅ Use modal from App */}
        <Hero onOpenModal={onOpenModal} />
        <Features />
        <Gallery />
      </div>

      {/* ✅ Pass modal trigger to footer */}
      <Footer onOpenModal={onOpenModal} />

    </div>
  );
}

export default Home;