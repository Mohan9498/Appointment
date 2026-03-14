import { Link } from "react-router-dom";

function CTA(){

return(

<section className="bg-primary text-white text-center py-16">

<h2 className="text-3xl font-bold">

Schedule Your Child's Therapy Session Today

</h2>

<p className="mt-4">

Book an appointment with our certified therapists.

</p>

<Link
to="/appointment"
className="mt-6 inline-block bg-white text-primary px-6 py-3 rounded-lg"
>

Book Appointment

</Link>

</section>

)

}

export default CTA