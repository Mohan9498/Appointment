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
  const total    = appointments.length;
  const pending  = appointments.filter((a) => a.status === "pending").length;
  const approved = appointments.filter((a) => a.status === "approved").length;
  const rejected = appointments.filter((a) => a.status === "rejected").length;

  const byDateMap = appointments.reduce((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + 1;
    return acc;
  }, {});

  // FIX: datasets had no colors — charts rendered as black/grey by default
  const barData = {
    labels: Object.keys(byDateMap),
    datasets: [
      {
        label: "Appointments",
        data: Object.values(byDateMap),
        backgroundColor: "rgba(37, 99, 235, 0.6)",  // blue-600/60
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        data: [pending, approved, rejected],
        backgroundColor: [
          "rgba(234, 179, 8, 0.7)",   // yellow
          "rgba(34, 197, 94, 0.7)",   // green
          "rgba(239, 68, 68, 0.7)",   // red
        ],
        borderColor: [
          "rgba(234, 179, 8, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 mb-8">

      {/* Bar Chart */}
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm hover:shadow-md transition">
        <h2 className="text-gray-900 dark:text-white text-xl font-semibold mb-4">
          Appointments by Date
        </h2>
        <Bar data={barData} options={barOptions} />
      </div>

      {/* Status Overview */}
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
        <h2 className="text-gray-900 dark:text-white text-xl font-semibold mb-4">
          Status Overview
        </h2>

        <div className="max-w-xs mx-auto">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
          <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-lg text-gray-700 dark:text-gray-300">
            Total: <span className="font-semibold">{total}</span>
          </div>
          <div className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 p-4 rounded-lg">
            Pending: <span className="font-semibold">{pending}</span>
          </div>
          <div className="bg-green-500/10 text-green-700 dark:text-green-300 p-4 rounded-lg">
            Approved: <span className="font-semibold">{approved}</span>
          </div>
          <div className="bg-red-500/10 text-red-700 dark:text-red-300 p-4 rounded-lg">
            Rejected: <span className="font-semibold">{rejected}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminAnalytics;
