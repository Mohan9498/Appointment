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
    <div className="bg-white dark:bg-slate-900 text-black dark:text-white transition duration-300"> {/* ✅ UPDATED */}

      {/* <Navbar onOpenModal={() => setOpenModal(true)} /> */}

      <Hero onOpenModal={() => setOpenModal(true)} />

      <Features />

      <Gallery />

      {/* MODAL */}
      {openModal && (
        <ContactModal onClose={() => setOpenModal(false)} />
      )}

      <Footer />

    </div>
  );
}

export default Home;