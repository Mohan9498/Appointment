import { useParams, Link } from "react-router-dom";
import { Clock, Users, CheckCircle2, ArrowLeft } from "lucide-react";

const programDetails = {
  "speech-therapy": {
    title: "Speech Therapy",
    description:
      "Our Speech Therapy program is designed to improve communication, language development, and social interaction skills in children. Sessions are tailored to each child's unique needs using evidence-based techniques.",
    benefits: [
      "Improved verbal communication",
      "Enhanced language comprehension",
      "Better social interaction skills",
      "Increased confidence in self-expression",
    ],
    duration: "45–60 minutes per session",
    ageRange: "1–10 years",
    color: "blue",
  },
  "cognitive-therapy": {
    title: "Cognitive Therapy",
    description:
      "Our Cognitive Therapy program enhances memory, attention, and problem-solving abilities through structured, play-based activities that stimulate brain development.",
    benefits: [
      "Stronger memory and recall",
      "Improved focus and attention span",
      "Enhanced problem-solving skills",
      "Better academic readiness",
    ],
    duration: "45–60 minutes per session",
    ageRange: "3–15 years",
    color: "indigo",
  },
  "day-care": {
    title: "Day Care",
    description:
      "Our Day Care program provides a safe, nurturing, and engaging environment where children learn, play, and grow socially throughout the day under expert supervision.",
    benefits: [
      "Structured daily routine",
      "Social skill development",
      "Supervised play and learning",
      "Regular progress monitoring",
    ],
    duration: "Full day / Half day",
    ageRange: "2–10 years",
    color: "purple",
  },
};

import SEO from "../components/SEO";

function ProgramDetails({ onOpenModal }) {
  const { name } = useParams();
  const displayName = name.replace(/-/g, " ");
  const details = programDetails[name];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white">
      <SEO 
        title={displayName} 
        description={details ? details.description : `Learn more about our ${displayName} program.`} 
        keywords={`${displayName}, therapy, program, child development`} 
      />

      <div className="max-w-4xl mx-auto px-6 py-28 relative">

        <Link
          to="/programs"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Programs
        </Link>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 capitalize animate-fade-in-up">
          {displayName}
        </h1>

        {details ? (
          <div className="space-y-6 animate-fade-in-up-delay-1">

            {/* Description Card */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-8 shadow-sm">
              <p className="text-gray-500 dark:text-gray-400 leading-7 text-base">
                {details.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="group bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Clock size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    Session Duration
                  </p>
                </div>
                <p className="text-gray-900 dark:text-white font-bold text-lg ml-[52px]">
                  {details.duration}
                </p>
              </div>

              <div className="group bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Users size={18} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                    Age Range
                  </p>
                </div>
                <p className="text-gray-900 dark:text-white font-bold text-lg ml-[52px]">
                  {details.ageRange}
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                Key Benefits
              </h3>
              <ul className="space-y-3">
                {details.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
                    <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="text-center pt-4">
              <button
                onClick={onOpenModal}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-md hover:shadow-glow-blue hover:scale-[1.03] transition-all duration-300"
              >
                Book a Session
                <span>→</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-8 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">
              Detailed information about the{" "}
              <span className="font-medium capitalize">{displayName}</span> program is coming soon.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProgramDetails;