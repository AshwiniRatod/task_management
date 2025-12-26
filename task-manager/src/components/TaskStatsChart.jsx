import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TaskStatsChart({ tasks, dueSoon }) {
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;

  const data = {
    labels: ["Completed", "Pending", "Due Soon"],
    datasets: [
      {
        data: [completed, pending, dueSoon],
        backgroundColor: [
          "#22c55e", // green
          "#f59e0b", // yellow
          "#ef4444", // red
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: "500",
          },
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>Task Overview</h3>
      <Pie data={data} options={options} />
    </div>
  );
}
