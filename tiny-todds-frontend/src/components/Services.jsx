import ProgramCard from "./ProgramCard";

function Services(){

const programs = [

{
title:"Speech Therapy",
description:"Helping children improve communication skills.",
image:"https://img.freepik.com/free-vector/speech-therapy-concept_23-2148655407.jpg"
},

{
title:"Cognitive Therapy",
description:"Developing thinking and problem solving abilities.",
image:"https://img.freepik.com/free-vector/brain-development-concept_23-2148655412.jpg"
},

{
title:"Day Care Program",
description:"Structured learning and care environment for children.",
image:"https://img.freepik.com/free-vector/daycare-concept_23-2148655383.jpg"
}

]

return(

<section className="max-w-7xl mx-auto p-10">

<h2 className="text-3xl font-bold text-center mb-10">

Our Therapy Programs

</h2>

<div className="grid md:grid-cols-3 gap-8">

{programs.map((p,i)=>(
<ProgramCard key={i} {...p}/>
))}

</div>

</section>

)

}

export default Services