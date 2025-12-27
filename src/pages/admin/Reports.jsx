import React, { useState } from 'react'
import OutcomesGraph from '../../components/admin/OutcomesGraph'
import OutcomesTable from '../../components/admin/OutcomeTable'

const Reports = () => {
  const [year1, setYear1] = useState()
  const [year2, setYear2] = useState()

  const handleGenerate = ({ year1 }) => {
    if (!year1) {
      alert("Please enter the first year.")
      return
    }
    if (year1 < 2025) {
      alert("First year should be greater or equal than 2025.")
      return
    }
    alert("Report generated and added to report history.")
  }

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

          <div className="my-7 flex flex-row gap-10">
            <div>
              <label htmlFor="year1">First Year: </label>
              <input
                id="year1"
                type="number"
                className="border rounded p-1 w-25 h-6"
                placeholder="eg. 2025"
                value={year1}
                onChange={e => {
                  setYear1(e.target.value)
                  setYear2(parseInt(e.target.value) + 1)
                }}
              />
            </div>

            <div>
              <label htmlFor="year2">Second Year: </label>
              <input
                id="year2"
                type="number"
                className="border rounded p-1 w-25 h-6"
                readOnly
                value={year1 ? parseInt(year1) + 1 : ""}
              />
            </div>
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
