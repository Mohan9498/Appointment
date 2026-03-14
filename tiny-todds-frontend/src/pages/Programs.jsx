function Programs(){

const programs = [

{title:"Speech Therapy"},
{title:"Cognitive Therapy"},
{title:"Day Care Program"}

]

return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-8">Therapy Programs</h1>

<div className="grid grid-cols-3 gap-6">

{programs.map((p,i)=>(

<div key={i} className="border p-6 rounded shadow">

<h2 className="text-xl">{p.title}</h2>

</div>

))}

</div>

</div>

)

}

export default Programs