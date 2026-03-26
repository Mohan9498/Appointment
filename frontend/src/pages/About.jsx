import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About(){

return(

<div className="min-h-screen bg-background">

  <Navbar/>

  <div className="max-w-6xl mx-auto px-6 py-16">

    <h1 className="text-4xl font-bold text-dark mb-6">
      About Tiny Todds Therapy
    </h1>

    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
      <p className="text-text-light leading-7">
        Tiny Todds Therapy Care is dedicated to supporting children with
        developmental challenges.
      </p>

      <p className="text-text-light leading-7">
        Our certified therapists provide personalized treatment plans
        for each child to ensure the best developmental outcomes.
      </p>
    </div>

  </div>

  <Footer/>

</div>

)

}

export default About