import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact(){

const [name,setName] = useState("")
const [message,setMessage] = useState("")

const submit = () => {
alert("Message sent successfully")
}

return(

<div>

<Navbar/>

<div className="max-w-xl mx-auto p-10">

<h1 className="text-3xl font-bold mb-6">
Contact Us
</h1>

<input
className="border p-2 w-full mb-4"
placeholder="Your Name"
onChange={(e)=>setName(e.target.value)}
/>

<textarea
className="border p-2 w-full mb-4"
placeholder="Your Message"
onChange={(e)=>setMessage(e.target.value)}
/>

<button
onClick={submit}
className="bg-blue-600 text-white px-6 py-2 rounded"
>

Send Message

</button>

</div>

<Footer/>

</div>

)

}

export default Contact