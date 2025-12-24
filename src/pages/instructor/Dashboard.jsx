import React from "react";
import Card1 from "../../components/Card1";
import InstructorFormTable from "../../components/instructor/InstructorFormTable";

export function NotificationRow({ item }) {
  const diffMs = Date.now() - new Date(item.date).getTime();

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30); // approximate
  const diffYears = Math.floor(diffDays / 365); // approximate

  let displayTime;
  if (diffSeconds < 60) {
    displayTime = `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""} ago`;
  } else if (diffMinutes < 60) {
    displayTime = `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    displayTime = `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays < 30) {
    displayTime = `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  } else if (diffMonths < 12) {
    displayTime = `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;
  } else {
    displayTime = `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`;
  }

  return (
    <div className="flex flex-row border rounded-lg border-gray-300 p-2 mb-2 justify-between hover:bg-gray-100">
      <div className="flex flex-col">
        <p className="text-md">{item.text}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">{displayTime}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div>
      {/* HEADER */}
      <div className="pb-5">
        <p className="text-[var(--primary-color)] text-3xl font-bold">
            Dashboard
        </p>
        <p className="text-[var(--primary-color)] text-md">
            Welcome back! Manage your assigned forms and view your progress.
        </p>
      </div>

      {/* TOP 4 CARDS */}
      <div className="w-full flex flex-wrap justify-between py-4 gap-2">
        <Card1
          title="Assigned Forms"
          number={12}
          icon="fa-solid fa-file"
          shadow={true}
          bgColor="bg-[var(--primary-color)]"
          textColor="text-white"
        />

        <Card1
          title="Submitted"
          number={5}
          shadow={false}
          icon="fa-solid fa-check"
        />

        <Card1
          title="In Progress"
          number={4}
          shadow={false}
          icon="fa-solid fa-clock"
        />

        <Card1
          title="Pending"
          number={3}
          shadow={false}
          icon="fa-solid fa-hourglass"
        />
      </div>

      {/* FORMS TABLE */}
      <div className="bg-white rounded-lg p-4 mt-6">
        <InstructorFormTable />
      </div>
    </div>
  );
}

