import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Features from "../components/Features";
import Services from "../components/Services";
import Gallery from "../components/Gallery";
 
function Home({ onOpenModal }) {
  return (
    <div className="text-black dark:text-white transition duration-300">
      {/* <Navbar onOpenModal={onOpenModal} /> */}
 
      <div className="pt-0 md:pt-10">
        <Hero onOpenModal={onOpenModal} />
        <Features />
        <Services />
        <Gallery />
      </div>
 
      <Footer onOpenModal={onOpenModal} />
    </div>
  );
}
 
export default Home;