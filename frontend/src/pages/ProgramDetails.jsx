import { useParams, Link } from "react-router-dom";

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
    ageRange: "1–15 years",
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
  },
};

function ProgramDetails() {
  // FIX: was `.replace("-", " ")` — only replaced the first hyphen.
  // e.g. "speech-cognitive-therapy" → "speech cognitive-therapy" (wrong)
  // Now uses regex /g flag to replace ALL hyphens.
  const { name } = useParams();
  const displayName = name.replace(/-/g, " ");
  const details = programDetails[name];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black px-6 py-16">
      <div className="max-w-3xl mx-auto">

        <Link
          to="/programs"
          className="text-sm text-blue-600 hover:underline mb-6 inline-block"
        >
          ← Back to Programs
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 capitalize">
          {displayName}
        </h1>

        {details ? (
          <div className="space-y-6">

            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
              <p className="text-gray-600 dark:text-gray-300 leading-7">
                {details.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-5">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Session Duration
                </p>
                <p className="text-gray-800 dark:text-white font-semibold">
                  {details.duration}
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-5">
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                  Age Range
                </p>
                <p className="text-gray-800 dark:text-white font-semibold">
                  {details.ageRange}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Key Benefits
              </h3>
              <ul className="space-y-2">
                {details.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                    <span className="text-green-500">✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ) : (
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">
              Detailed information about the <span className="font-medium capitalize">{displayName}</span> program is coming soon.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProgramDetails;
