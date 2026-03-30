import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About(){

return(

<div className="min-h-screen bg-accent/5">

  <Navbar/>

  <div className="max-w-6xl mx-auto px-6 py-16">

    <h1 className="text-4xl font-bold text-dark mb-6">
      About Tiny Todds Therapy
    </h1>

    <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
      <p className="text-text-light leading-9 text-justify indent-20">
        Tiny Todds Therapy Care is a specialized child development center dedicated to fostering each child’s unique potential
        through evidence-based therapy and compassionate, individualized care. Recognizing that early childhood is a critical period for cognitive, emotional, and social development, we emphasize early intervention and structured programs that support communication, learning abilities, and confidence building. Our approach is rooted in a deep understanding that every child is different, and therefore requires a tailored pathway to growth. Through comprehensive assessments and continuous evaluation, our team of certified professionals develops personalized therapy plans that address specific developmental needs while ensuring steady, measurable progress. By creating a nurturing and structured environment, we help children build a strong developmental foundation that supports long-term success in both academic and social settings.
      </p>

      <p className="text-text-light leading-9 text-justify indent-20">
        At Tiny Todds, we strive to provide a safe, engaging, and supportive atmosphere where children are encouraged to explore, learn, and express themselves with confidence. Our therapy sessions integrate speech development, cognitive enhancement, and interactive learning techniques designed to promote essential life skills and emotional well-being. We strongly believe in collaborative care, working closely with parents and caregivers to ensure consistency and reinforcement beyond therapy sessions. By offering continuous guidance, progress updates, and practical strategies, we empower families to actively participate in their child’s developmental journey. Our mission extends beyond therapy, aiming to cultivate independence, confidence, and resilience in every child. Through our dedicated efforts, we seek to create meaningful and lasting transformation, enabling children to thrive in their daily lives and reach their fullest potential.
      </p>
      
    </div>

  </div>

  <Footer/>

</div>

)

}

export default About