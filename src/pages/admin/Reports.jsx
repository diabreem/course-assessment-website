import React, { useState } from 'react'
import DownloadIcon from '@mui/icons-material/Download';
import OutcomesGraph from '../../components/admin/OutcomesGraph'
import OutcomesTable from '../../components/admin/OutcomeTable'

const Reports = () => {
  const [year1, setYear1] = useState()
  const [year2, setYear2] = useState()

  const handleGenerate = ({ year1 }) => {
    if (!year1) {
      alert("Please enter the first academic year.")
      return
    }
    if (year1 < 2025) {
      alert("First year should be greater or equal than 2025.")
      return
    }
    alert("Report generated and added to report history.")
  }

  const reportData = [
    { id: 1, name: "Course Assessment Report - (2019 - 2021)", created_at: "2021-12-20T21:25:00" },
    { id: 2, name: "Course Assessment Report - (2023 - 2025)", created_at: "2025-12-20T21:25:00" }
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
      <div className="flex justify-between border border-gray-300 rounded-lg p-4 mb-2 hover:bg-gray-100">
        <div className="flex flex-col">
          <p>{item.name}</p>
          <p className="text-xs text-gray-500">Generated on: {formattedDate}</p>
        </div>
        <div className="flex gap-5">
      <button className="flex items-center gap-1 text-sm bg-(--primary-color) text-white rounded-lg p-1 hover:bg-(--primary-color-hover) hover:transition-colors hover:duration-500">
        <DownloadIcon fontSize="small" /> Download
      </button>
      <button className="text-sm border border-gray-300 rounded-lg p-1 hover:bg-gray-300 hover:transition-colors hover:duration-500">
        View as PDF
      </button>
      </div>
    )
  }

  const ReportHistory = () => 
    reportData.map(item => <ReportRow key={item.id} item={item} />)

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
            {/* First Academic Year */}
            <div>
              <label htmlFor="year1" className="mr-2">First Academic Year: </label>
              <select
                id="year1"
                className="border rounded p-1 w-60 h-8"
                value={year1}
                onChange={e => {
                  const startYear = parseInt(e.target.value);
                  setYear1(startYear);
                  setYear2(startYear + 1); // default for second year
                }}
              >
                <option value="">Select Year</option>
                <option value="2025">Academic Year 2025-2026</option>
                <option value="2026">Academic Year 2026-2027</option>
                <option value="2027">Academic Year 2027-2028</option>
            </select>
            </div>

            {/* Second Academic Year */}
            <div>
              <label htmlFor="year2" className="mr-2">Second Academic Year: </label>
              <select
                id="year2"
                className="border rounded p-1 w-60 h-8"
                value={year2 ? `Academic Year ${year1}-${year2}` : ""}
                onChange={e => {
                  const selected = e.target.value.split(' ')[2].split('-')[1]; // extract end year
                  setYear2(parseInt(selected));
                }}
              >
                {/* Default automated option */}
                {year1 && (
                  <option value={`${year1 + 1}-${year1 + 2}`}>
                    Academic Year {year1 + 1}-{year1 + 2}
                  </option>
                )}
                {/* Extra selectable options */}
                <option value={`${year1}-${year1 + 2}`}>Academic Year {year1 + 1}-{year1 + 2}</option>
                <option value={`${year1}-${year1 + 3}`}>Academic Year {year1 + 2}-{year1 + 3}</option>
              </select>
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
