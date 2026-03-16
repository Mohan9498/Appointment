import { Link } from "react-router-dom";

function Navbar() {

return (

<nav className="bg-white shadow-sm">

<div className="max-w-7xl mx-auto flex justify-between items-center p-4">

<h1 className="text-2xl font-bold text-primary">
Tiny Todds Therapy
</h1>

<div className="flex gap-6 font-medium">

<Link to="/">Home</Link>
<Link to="/about">About</Link>
<Link to="/programs">Programs</Link>
<Link to="/appointment">Book Appointment</Link>
<Link to="/contact">Contact</Link>

<Link
to="/login"
className="bg-primary text-white px-4 py-2 rounded"
>

Login

</Link>

</div>

</div>

</nav>

)

}

export default Navbar