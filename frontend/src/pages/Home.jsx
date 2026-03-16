import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Home(){

return(

<div>

<Navbar/>

<div className="text-center mt-20">

<h1 className="text-4xl font-bold text-blue-700">
Tiny Todds Therapy Care
</h1>

<p className="mt-4 text-gray-600">
Helping children grow through specialized therapy programs
</p>

</div>
<Hero/>

<Services/>

<CTA/>

<Footer/>
</div>

)

}

export default Home;