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
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h2 className="text-white text-xl font-semibold mb-4">Appointments by Date</h2>
        <Bar data={barData} />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h2 className="text-white text-xl font-semibold mb-4">Status Overview</h2>
        <div className="max-w-xs mx-auto">
          <Doughnut data={doughnutData} />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
          <div className="rounded-2xl bg-white/5 p-4 text-white">Total: {total}</div>
          <div className="rounded-2xl bg-white/5 p-4 text-yellow-300">Pending: {pending}</div>
          <div className="rounded-2xl bg-white/5 p-4 text-green-300">Approved: {approved}</div>
          <div className="rounded-2xl bg-white/5 p-4 text-red-300">Rejected: {rejected}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;