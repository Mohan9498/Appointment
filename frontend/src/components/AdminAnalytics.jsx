import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function AdminAnalytics({ appointments }) {
  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === "pending").length;
  const approved = appointments.filter((a) => a.status === "approved").length;
  const rejected = appointments.filter((a) => a.status === "rejected").length;

  const byDateMap = appointments.reduce((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(byDateMap),
    datasets: [
      {
        label: "Appointments",
        data: Object.values(byDateMap),
      },
    ],
  };

  const doughnutData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        data: [pending, approved, rejected],
      },
    ],
  };

  return (
  <div className="grid gap-6 lg:grid-cols-2 mb-8">
    
    {/* Chart Card */}
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <h2 className="text-dark text-xl font-semibold mb-4">
        Appointments by Date
      </h2>
      
      <Bar data={barData} />
    </div>

    {/* Status Card */}
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h2 className="text-dark text-xl font-semibold mb-4">
        Status Overview
      </h2>

      {/* Doughnut */}
      <div className="max-w-xs mx-auto">
        <Doughnut data={doughnutData} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-6 text-sm">

        <div className="bg-muted p-4 rounded-lg text-dark">
          Total: {total}
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg text-yellow-600">
          Pending: {pending}
        </div>

        <div className="bg-green-50 p-4 rounded-lg text-green-600">
          Approved: {approved}
        </div>

        <div className="bg-red-50 p-4 rounded-lg text-red-600">
          Rejected: {rejected}
        </div>
  
      </div>
  
    </div>
  </div>
  
);
}

export default AdminAnalytics;