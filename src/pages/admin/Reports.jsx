import React, { useState, useEffect } from 'react'
import OutcomesGraph from '../../components/admin/OutcomesGraph'
import OutcomesTable from '../../components/admin/OutcomeTable'
import { getAcademicYears } from '../../api/academicYears'

const Reports = () => {
const [academicYears, setAcademicYears] = useState([]);
const [year1, setYear1] = useState(null);


useEffect(() => {
  const fetchYears = async () => {
    try {
      // const res = await getAcademicYears();
      const res = [
        { id: 1, start_year: 2024, end_year: 2025, isGap: false },
        { id: 2, start_year: 2025, end_year: 2026, isGap: false },
        { id: 3, start_year: 2026, end_year: 2027, isGap: true },
      ];

      /**
       * We allow year1 ONLY if:
       * year1 → year2 → gap
       */
      const validYear1 = res.filter((y, index) => {
        const year2 = res[index + 1];
        const year3 = res[index + 2];

        return (
          !y.isGap &&
          year2 &&
          !year2.isGap &&
          year3 &&
          year3.isGap
        );
      });

      setAcademicYears(validYear1);
    } catch (err) {
      console.error(err);
    }
  };

  fetchYears();
}, []);


  const handleGenerate = () => {
  if (!year1) {
    alert("Please select the first academic year.");
    return;
  }

  alert(
    `Report generated for:
     ${year1.start_year}-${year1.end_year} &
     ${year1.start_year + 1}-${year1.end_year + 1}`
  );
};

  const reportData = [
    { id: 1, name: "Course Assessment Report - (2020 & 2021)", created_at: "2021-12-20T21:25:00" },
    { id: 2, name: "Course Assessment Report - (2023 & 2024)", created_at: "2024-12-20T21:25:00" }
  ]

  function ReportRow({ item }) {
    const date = new Date(item.created_at)
    const formattedDate = date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })

    return (
      <div className="flex justify-between border border-gray-300 rounded-lg p-2 mb-2 hover:bg-gray-100">
        <div className="flex flex-col">
          <p>{item.name}</p>
          <p className="text-xs text-gray-500">Generated on: {formattedDate}</p>
        </div>
        <div className="flex gap-5">
          <button><p className='text-sm bg-(--primary-color) text-white rounded-lg p-1 hover:bg-(--primary-color-hover) hover:transition-colors hover:duration-500'>Download</p></button>
          <button><p className='text-sm border border-gray-300 rounded-lg p-1 hover:bg-gray-300 hover:transition-colors hover:duration-500'>View as PDF</p></button>
        </div>
      </div>
    )
  }

  const ReportHistory = () => reportData.map(item => <ReportRow key={item.id} item={item} />)

  return (
    <div>
      <div className="pb-4 flex flex-col gap-3">
        <p className="text-(--primary-color) text-3xl font-bold">Reports</p>
        <p className="text-md">Generate and view a report accross 2 years.</p>
      </div>

      <div className="grid grid-cols-5 gap-5 mb-5">
        <div className="bg-white rounded p-4 col-span-2">
          <p className="text-lg font-semibold text-(--primary-color)">Generate a report</p>

          <p className="text-sm text-gray-500">Generate a report for two consecutive years.</p>

          <div className="my-7 flex flex-col gap-10">
<div>
  <label className="block mb-1">First Academic Year:</label>
  <select
    className="border rounded p-1 w-full"
    value={year1?.id || ""}
    onChange={(e) => {
      const selected = academicYears.find(
        y => y.id === parseInt(e.target.value)
      );
      setYear1(selected);
    }}
  >
    <option value="">Select academic year</option>
    {academicYears.map(y => (
      <option key={y.id} value={y.id}>
        {y.start_year}-{y.end_year}
      </option>
    ))}
  </select>
</div>


            {year1 && (
  <div>
    <label className="block mb-1">Second Academic Year:</label>
    <input
      type="text"
      readOnly
      className="border rounded p-1 w-full bg-gray-100"
      value={`${year1.start_year + 1}-${year1.end_year + 1}`}
    />
  </div>
)}

          </div>

          <button
            className="bg-(--primary-color) text-white hover:bg-(--primary-color-hover) hover:transition-colors hover:duration-500 rounded p-1 w-full"
            onClick={() => handleGenerate({ year1 })}
          >
            Generate
          </button>
        </div>

        <div className="bg-white rounded-lg p-5 overflow-y-scroll max-h-200 col-span-3">
          <p className="text-lg font-semibold text-(--primary-color) mb-4">Report History</p>
          <ReportHistory />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <OutcomesGraph />
        <OutcomesTable/>
      </div>
    </div>
  )
}

export default Reports