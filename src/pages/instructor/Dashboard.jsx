import React from "react";
import Card1 from "../../components/Card1";
import InstructorFormTable from "../../components/instructor/InstructorFormTable";

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

