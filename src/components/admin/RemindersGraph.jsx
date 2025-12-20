import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
const barsColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--secondary-color')
    .trim();
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);
const RemindersGraph = () => {
    const labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    const data = {
        labels,
        datasets: [
            {
                label: "Reminders Sent",
                data: [1, 2, 3, 4, 5, 6, 3, 20, 4, 10, 5, 7],

                backgroundColor: [
                    [barsColor],

                ],
                borderRadius: 6,
            },
        ],
    };

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

    return (
        <div className="bg-white rounded-xl p-4  h-[200px]">
            <p className="text-[var(--primary-color)] font-bold text-lg mb-4">
                Reminders Overview
            </p>

            <Bar data={data} options={options} />
        </div>
    );
};

export default RemindersGraph;
