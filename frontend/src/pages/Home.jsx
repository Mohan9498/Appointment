import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Features from "../components/Features";
import Gallery from "../components/Gallery";
import ContactModal from "../components/ContactModal";

function Home({onOpenModal}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="text-black dark:text-white transition duration-300">
      
      <div className="pt-0 md:pt-18"> {/* prevent navbar overlap */}
        <Hero onOpenModal={() => setOpenModal(true)} />
        <Features />
        <Gallery />
      </div>

      {/* <button onClick={onOpenModal}>  Book Appointment </button> */}

      {openModal && (
        <ContactModal onClose={() => setOpenModal(false)} />
      )}
      
      <Footer onOpenModal={onOpenModal} />
      
    </div>
  );
}

export default Home;