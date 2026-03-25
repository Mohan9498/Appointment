import { useParams } from "react-router-dom";

function ProgramDetails() {
  const { name } = useParams();

  return (
    <div className="min-h-screen bg-[#9b74e4] text-white p-10">

      <h1 className="text-4xl font-bold capitalize mb-6">
        {name.replace("-", " ")}
      </h1>

      <p className="text-gray-400 max-w-xl">
        This page contains detailed information about the {name.replace("-", " ")} program.
        You can add therapy plans, duration, benefits, and booking options here.
      </p>

    </div>
  );
}

export default ProgramDetails;