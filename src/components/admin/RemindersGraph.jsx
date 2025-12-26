import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

// CSS variable color (keeps your design system)
const barsColor = getComputedStyle(document.documentElement)
  .getPropertyValue("--secondary-color")
  .trim();

const RemindersGraph = () => {
  const [chartData, setChartData] = useState(null);
  const [semester, setSemester] = useState("");

  // 🔹 MOCK API (replace later with real fetch)
  const fetchSemesterReminders = async () => {
    // Simulated API response
    return {
      semester: "Fall 2024",
      months: [
        { month: "Sep", reminders: 5 },
        { month: "Oct", reminders: 12 },
        { month: "Nov", reminders: 8 },
      ],
    };
  };

  useEffect(() => {
    const loadData = async () => {
      const response = await fetchSemesterReminders();

      setSemester(response.semester);

      setChartData({
        labels: response.months.map((item) => item.month),
        datasets: [
          {
            label: "Reminders Sent",
            data: response.months.map((item) => item.reminders),
            backgroundColor: barsColor,
            borderRadius: 6,
          },
        ],
      });
    };

    loadData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#e5e7eb",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (!chartData) return null;

  return (
    <div className="bg-white rounded-xl p-4 h-[200px]">
      <p className="text-[var(--primary-color)] font-bold text-lg mb-5">
        Reminders Overview
      </p>


      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RemindersGraph;
