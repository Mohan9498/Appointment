import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Features from "../components/Features";
import Gallery from "../components/Gallery";
import ContactModal from "../components/ContactModal";

function Home() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="text-black dark:text-white transition duration-300">
      
      {/* <Navbar onOpenModal={() => setOpenModal(true)} /> */}

      <div className="pt-20"> {/* prevent navbar overlap */}
        <Hero onOpenModal={() => setOpenModal(true)} />
        <Features />
        <Gallery />
      </div>

      {openModal && (
        <ContactModal onClose={() => setOpenModal(false)} />
      )}
      
      <Footer />
      
    </div>
  );
}

export default Home;