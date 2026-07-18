import Hero from "../components/Hero";
import Features from "../components/Features";
import Services from "../components/Services";
import Gallery from "../components/Gallery";


 
import SEO from "../components/SEO";

function Home({ onOpenModal }) {
  return (
    <div className="bg-hero-gradient min-h-screen text-black dark:text-white transition duration-300">

      <SEO 
        title="Home" 
        description="Welcome to Tiny Todds Therapy Care." 
      />

      <div className="max-w-full mx-auto px-3 sm:px-6 lg:px-10 space-y-4 sm:space-y-8 lg:space-y-10 py-4 sm:py-8 lg:py-10">

        <div className="glass-card-hover rounded-xl sm:rounded-3xl overflow-hidden">
          <Hero onOpenModal={onOpenModal} />
        </div>

        <div className="glass-card-hover rounded-xl sm:rounded-3xl p-3 sm:p-6">
          <Features />
        </div>

        <div className="glass-card-hover rounded-xl sm:rounded-3xl p-3 sm:p-6">
          <Services />
        </div>

        <div className="glass-card-hover rounded-xl sm:rounded-3xl p-3 sm:p-6">
          <Gallery />
        </div>

      </div>
    </div>
  );
}
 
export default Home;