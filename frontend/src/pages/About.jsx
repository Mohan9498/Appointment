import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About(){

return(

<div>

<Navbar/>

<div className="max-w-6xl mx-auto p-10">

<h1 className="text-3xl font-bold text-blue-700 mb-6">
About Tiny Todds Therapy
</h1>

<p className="text-gray-700 leading-7">
Tiny Todds Therapy Care is dedicated to supporting children with
developmental challenges. Our therapy programs help improve
communication, cognitive development and social interaction.
</p>

<p className="text-gray-700 leading-7 mt-4">
Our certified therapists provide personalized treatment plans
for each child to ensure the best developmental outcomes.
</p>

</div>

<Footer/>

</div>

)

}

export default About