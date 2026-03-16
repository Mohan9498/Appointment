import { Link } from "react-router-dom";

function Hero(){

return(

<section className="bg-accent">

<div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10 p-10">

<div>

<h1 className="text-5xl font-bold text-gray-800 leading-tight">

Helping Children  
Grow & Communicate Better

</h1>

<p className="mt-6 text-gray-600">

Tiny Todds Therapy Care provides specialized speech,
cognitive and developmental therapy programs designed
for children's growth.

</p>

<div className="mt-6 flex gap-4">

<Link
to="/appointment"
className="bg-primary text-white px-6 py-3 rounded-lg"
>

Book Consultation

</Link>

<Link
to="/programs"
className="border border-primary text-primary px-6 py-3 rounded-lg"
>

View Programs

</Link>

</div>

</div>

{/* <img
src="https://img.freepik.com/free-vector/child-speech-therapy-concept_23-2148655356.jpg"
className="rounded-xl shadow"
/> */}

</div>

</section>

)

}

export default Hero