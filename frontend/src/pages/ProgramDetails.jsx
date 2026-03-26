import { useParams } from "react-router-dom";

function ProgramDetails() {
  const { name } = useParams();

  return (
    <div className="min-h-screen bg-background px-6 py-16">

      <h1 className="text-4xl font-bold text-dark mb-6">
        {name.replace("-", " ")}
      </h1>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <p className="text-text-light">
          This page contains detailed information about the{" "}
          {name.replace("-", " ")} program. You can add therapy plans,
          duration, benefits, and booking options here.
        </p>
      </div>

    </div>
  );
}

export default ProgramDetails;