function ProgramCard({ title, description, image }) {

return (

<div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">

<img
src={image}
alt={title}
className="w-full h-40 object-cover rounded"
/>

<h3 className="text-xl font-semibold mt-4">
{title}
</h3>

<p className="text-gray-600 text-sm mt-2">
{description}
</p>

<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
Learn More
</button>

</div>

)

}

export default ProgramCard
