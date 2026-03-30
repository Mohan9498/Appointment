import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Features from "../components/Features";
import Gallery from "../components/Gallery";
import ContactModal from "../components/ContactModal";

function Home() {
  const [openModal, setOpenModal] = useState(false);

  // ✅ AUTO POPUP (ONLY ONCE)
  useEffect(() => {
    const alreadyShown = localStorage.getItem("popupShown");

    if (!alreadyShown) {
      const timer = setTimeout(() => {
        setOpenModal(true);
        localStorage.setItem("popupShown", "true");
      }, 1000); // ⏱️ 1 second delay

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div>

      {/* <Navbar onOpenModal={() => setOpenModal(true)} /> */}

      <Hero onOpenModal={() => setOpenModal(true)} />

      <Features />

      <Gallery />

      

      {/* ✅ MODAL */}
      {openModal && (
        <ContactModal onClose={() => setOpenModal(false)} />
      )}

      <Footer />

    </div>
  );
}

export default Home;