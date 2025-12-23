import React, { useState } from 'react'
import InstructorFormsTable from '../../components/admin/InstructorFormsOverviewTable';

const Reports = () => {

  const [year1, setYear1] = useState();
  const [year2, setYear2] = useState();

  const handleGenerate = ({ year1 }) => {
    if (year1 < 2025) {
      alert("Year should be greater or equal than 2025.");
      return;
    }
    alert("Report generated and added to report history.")
  }

  const reportData = [
    {
      id: 1,
      name: "Course Assessment Report - (2020 & 2021)",
      created_at: "2021-12-20T21:25:00"
    },
    {
      id: 2,
      name: "Course Assessment Report - (2023 & 2024)",
      created_at: "2024-12-20T21:25:00"
    }
  ];

  function ReportRow({ item }) {
    const date = new Date(item.created_at);

    const formattedDate = date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    return (
      <div className="flex justify-between border rounded-lg p-2 mb-2 hover:bg-gray-100">
        <div className='flex flex-col'>
          <p>{item.name}</p>
          <p className="text-xs text-gray-500">Generated on: {formattedDate}</p>
        </div>

        <div className='flex gap-5'>
          <button><i className="fa-solid fa-download text-(--primary-color) text-lg"></i></button>
          <button><i className="fa-solid fa-eye text-lg"></i></button>
        </div>



      </div>
    );
  }

  const ReportHistory = () =>
    reportData.map(item => <ReportRow key={item.id} item={item} />);


  return (
    <div>

      <div className='pb-5'>
        <p className='text-[var(--primary-color)] text-3xl font-semibold'>Reports</p>
        <p className="text-[var(--primary-color)] text-md">Generate and view anual reports.</p>
      </div>

      <div className="grid grid-cols-2 gap-5 max-h-200 mb-5">

        <div className="flex flex-col gap-5">

          {/* BOX 1 */}
          <div className='bg-white rounded p-5'>
            <div className='flex flex-row items-center gap-2'>
              <div className="bg-[var(--icon-bg)] p-1 rounded">
                <i className="fa-regular fa-chart-bar"></i>
              </div>
              <p className="text-lg font-semibold text-(--primary-color)">
                Generate a report
              </p>
            </div>

            <p className='text-sm text-gray-500'>
              Generate a report for two consecutive years.
            </p>

            <div className='my-7 flex flex-row gap-10'>
              <div>
                <label htmlFor="year1">Year 1: </label>
                <input
                  id='year1'
                  type="number"
                  className='border rounded p-1 w-25 h-6'
                  placeholder='eg. 2025'
                  value={year1}
                  onChange={e => {
                    setYear1(e.target.value);
                    setYear2(parseInt(e.target.value) + 1);
                  }}
                />
              </div>

              <div>
                <label htmlFor="year2">Year 2: </label>
                <input
                  id='year2'
                  type="number"
                  className='border rounded p-1 w-25 h-6'
                  readOnly
                  value={year1 ? parseInt(year1) + 1 : ""}
                />
              </div>
            </div>

            <button
              className='bg-(--primary-color) text-white rounded p-1 w-full'
              onClick={e => handleGenerate({ year1 })}
            >
              Generate
            </button>
          </div>

          {/* BOX 2 */}
          <div className="bg-white rounded p-5">
            <p className="text-lg font-semibold text-(--primary-color)">
              Table
            </p>
            <p>table: outcome values from last 2 reports + improvement or no, wait for pdf</p>
          </div>

        </div>

        {/* RIGHT COLUMN*/}
        <div className="bg-white rounded-lg p-5 overflow-y-scroll max-h-200">
          <p className="text-lg font-semibold text-(--primary-color) mb-4">
            Report History
          </p>
          <ReportHistory />
        </div>

      </div>

      <div className='bg-white rounded p-5'>
        <div className='flex flex-row items-center gap-2'>
          <div className="bg-[var(--icon-bg)] p-1 rounded">
            <i className="fa-regular fa-chart-bar"></i>
          </div>
          <p className="text-lg font-semibold text-(--primary-color)">
            Graph
          </p>
        </div>
        <p>Graph with many years but without the middle years to see if improvement increases as years pass</p>

      </div>
    </div>


  )
}

export default Reports
