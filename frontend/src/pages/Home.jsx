import Hero from "../components/Hero";
import Features from "../components/Features";
import Services from "../components/Services";
import Gallery from "../components/Gallery";


 
import SEO from "../components/SEO";

function Home({ onOpenModal }) {
  return (
    <div className="text-black dark:text-white transition duration-300">
      <SEO 
        title="Home" 
        description="Welcome to Tiny Todds Therapy Care. We offer specialized therapy programs for your child's development." 
        keywords="therapy, child development, speech therapy, cognitive therapy" 
      />
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