import React, { useState, useEffect } from 'react'
import OutcomesGraph from '../../components/admin/OutcomesGraph'
import OutcomesTable from '../../components/admin/OutcomeTable'
import { getAcademicYears } from '../../api/academicYears'
import Card1 from '../../components/Card1'



const coursePerformanceData = [
  { course: "MTH207", so: "SO.1", pc: "PC1.1", prev: 69, curr: 10 },
  { course: "CSC380", so: "SO.1", pc: "PC1.2", prev: 55, curr: 75 },
  { course: "CSC322", so: "SO.2", pc: "PC2.2", prev: 83, curr: 45 },
  { course: "CSC430", so: "SO.2", pc: "PC2.3", prev: 96, curr: 90 },
  { course: "CSC490", so: "SO.3", pc: "PC3.1", prev: 71, curr: 71 },
  { course: "CSC490", so: "SO.3", pc: "PC3.2", prev: 100, curr: 55 },
  { course: "LAS204", so: "SO.4", pc: "PC4.1", prev: 86, curr: 100 },
  { course: "LAS204", so: "SO.4", pc: "PC4.2", prev: 100, curr: 99 },
  { course: "CSC375", so: "SO.5", pc: "PC5.1", prev: 20, curr: 70 },
  { course: "CSC599", so: "SO.6", pc: "PC6.3", prev: 85, curr: 89 },
  { course: "CSC123", so: "SO.6", pc: "PC6.2", prev: 69, curr: 70 },
    { course: "MTH207", so: "SO.1", pc: "PC1.1", prev: 69, curr: 10 },
  { course: "CSC380", so: "SO.1", pc: "PC1.2", prev: 55, curr: 75 },
  { course: "CSC322", so: "SO.2", pc: "PC2.2", prev: 83, curr: 45 },
  { course: "CSC430", so: "SO.2", pc: "PC2.3", prev: 96, curr: 90 },
  { course: "CSC490", so: "SO.3", pc: "PC3.1", prev: 71, curr: 71 },
  { course: "CSC490", so: "SO.3", pc: "PC3.2", prev: 100, curr: 55 },
  { course: "LAS204", so: "SO.4", pc: "PC4.1", prev: 86, curr: 100 },
  { course: "LAS204", so: "SO.4", pc: "PC4.2", prev: 100, curr: 99 },
  { course: "CSC375", so: "SO.5", pc: "PC5.1", prev: 20, curr: 70 },
  { course: "CSC599", so: "SO.6", pc: "PC6.3", prev: 85, curr: 89 },
  { course: "CSC123", so: "SO.6", pc: "PC6.2", prev: 69, curr: 70 },
]

const rarelyAchievedData = [
  { pc: "PC1.1", description: "Struggle with mathematical modeling and proofs" },
  { pc: "PC1.2", description: "Difficulty classifying formal languages (regular, context-free, recursive)" },
  { pc: "PC1.3", description: "Challenge solving recurrence relations mathematically" },
  { pc: "PC1.4", description: "Graph algorithm implementation and analysis" },
  { pc: "PC1.5", description: "Dynamic programming problem-solving" },
  { pc: "PC1.6", description: "NP-completeness proofs and reductions" },
  { pc: "PC1.7", description: "Asymptotic notation analysis and complexity calculations" },
  { pc: "PC2.1", description: "Parallel algorithm design and implementation" },
  { pc: "PC2.2", description: "Computer architecture simulation and trade-off analysis" },
  { pc: "PC2.3", description: "Network design with quality attribute trade-offs" },
  { pc: "PC2.4", description: "Database design and implementation with proper normalization" },
  { pc: "PC3.1", description: "Effective visual communication of technical concepts" },
  { pc: "PC3.2", description: "Technical writing with proper grammar and mechanics" },
  { pc: "PC3.3", description: "Audience analysis and tailored communication" },
  { pc: "PC3.4", description: "Effective multimedia presentation skills" },
  { pc: "PC4.1", description: "Understanding and application of ACM/IEEE codes of ethics" },
  { pc: "PC4.2", description: "Critiquing ethical scenarios in computing" },
  { pc: "PC4.3", description: "Articulating ethical tradeoffs in technical decisions" },
  { pc: "PC4.4", description: "Understanding societal impact and legal aspects of computing" },
  { pc: "PC5.1", description: "Project management principles application" },
  { pc: "PC5.2", description: "Group development and team dynamics" },
  { pc: "PC5.3", description: "Conflict management in team settings" },
  { pc: "PC6.1", description: "Complex software solution development" },
  { pc: "PC6.2", description: "Algorithm and data structure selection for computational problems" },
  { pc: "PC6.3", description: "Full software system design and implementation lifecycle" },
]

const getRarelyAchieved = (pc) => {
  const found = rarelyAchievedData.find(item => item.pc === pc)
  return found ? found.description : "No specific data available"
}

const getBadCourses = () => {
  return coursePerformanceData
    .filter(c => c.curr < 70)
    .sort((a, b) => a.curr - b.curr)
    .map(c => ({
      course: c.course,
      so: c.so,
      pc: c.pc,
      percentage: c.curr,
      rarelyAchieved: getRarelyAchieved(c.pc)
    }))
}

const getTopPerformingCourse = () => {
  const allCourses = coursePerformanceData.map(c => ({
    course: c.course,
    percentage: c.curr
  }))
  const best = allCourses.reduce((max, course) =>
    course.percentage > max.percentage ? course : max
  )
  return { course: best.course, percentage: best.percentage }
}

const getLowestPerformingCourse = () => {
  const allCourses = coursePerformanceData.map(c => ({
    course: c.course,
    percentage: c.curr
  }))
  const lowest = allCourses.reduce((min, course) =>
    course.percentage < min.percentage ? course : min
  )
  return { course: lowest.course, percentage: lowest.percentage }
}

const calculateAverageScore = () => {
  const total = coursePerformanceData.reduce((sum, course) => sum + course.curr, 0)
  return `${Math.round(total / coursePerformanceData.length)}%`
}

const BadPerformanceCard = () => {
  const badCourses = getBadCourses()
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <i className="fa-solid fa-circle-exclamation text-(--primary-color) text-xl"></i>
        <h3 className="text-lg font-semibold ">Courses Below Expectations</h3>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-scroll">
        {badCourses.map((c, i) => (
          <div key={i} className="bg-red-100 border border-gray-300 rounded-md px-4 py-3">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <span className="font-semibold text-sm">{c.course}</span>
                <span className="text-xs  ml-2">{c.so} - {c.pc}</span>
              </div>
              <div>
                <span className=" text-xs font-bold px-2.5 py-1 rounded-full">
                  {c.percentage}%
                </span>
              </div>
            </div>
            <p className="text-xs ">
              <span className="font-medium">Rarely achieved:</span> {c.rarelyAchieved}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

const ImprovedCoursesCard = () => {
  const improved = coursePerformanceData
    .filter((d) => d.prev < 70 && d.curr >= 70)
    .sort((a, b) => (b.curr - b.prev) - (a.curr - a.prev))

  if (improved.length === 0) return null

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <i className="fa-solid fa-arrow-up text-(--primary-color) text-xl"></i>
        <h3 className="text-lg font-semibold ">Recovered Courses</h3>
      </div>
      
      <p className="text-xs  mb-4">
        Courses that didn't meet expectations in previous semester but improved to meet them in current semester.
      </p>

      <div className="space-y-2 max-h-64 overflow-y-scroll">
        {improved.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between  border border-gray-300 rounded-md px-4 py-3"
          >
            <div>
              <span className="font-semibold text-sm ">{c.course}</span>
              <span className="text-xs  ml-2">{c.so} - {c.pc}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-red-600 font-medium line-through">{c.prev}%</span>
              <span className="text-sm font-bold text-success">{c.curr}%</span>
              <span className="bg-success text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">
                +{c.curr - c.prev}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ImprovementTimeline = () => {
  const sorted = [...coursePerformanceData]
    .map((d) => ({
      ...d,
      change: d.curr - d.prev,
    }))
    .sort((a, b) => b.change - a.change)

  return (
<div className="bg-white rounded-lg p-6 shadow-sm h-[500px] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <i className="fa-solid fa-arrows-rotate text-(--primary-color) text-xl"></i>
        <h3 className="text-lg font-semibold ">Semester-over-Semester Change</h3>
      </div>
      
      <p className="text-xs  mb-4">Previous → Current semester improvement ranking</p>
      
  <div className="space-y-2 overflow-y-auto flex-1">
       {sorted.map((d, i) => {
          const isUp = d.change > 0
          const isDown = d.change < 0
          
          return (
            <div
              key={i}
              className="flex border border-gray-300 items-center justify-between rounded-md px-4 py-2.5"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold  w-5 text-right">{i + 1}</span>
                <div>
                  <span className="font-semibold text-sm ">{d.course}</span>
                  <span className="text-xs  ml-2">{d.so} - {d.pc}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                {isUp ? (
                  <i className="fa-solid fa-arrow-trend-up text-green-600 text-sm"></i>
                ) : isDown ? (
                  <i className="fa-solid fa-arrow-trend-down text-red-600 text-sm"></i>
                ) : (
                  <i className="fa-solid fa-minus  text-sm"></i>
                )}
                <span
                  className={`text-sm font-bold ${
                    isUp ? "text-green-600" : isDown ? "text-red-600" : "text-black"
                  }`}
                >
                  {isUp ? "+" : ""}{d.change}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const Reports = () => {
const [academicYears, setAcademicYears] = useState([]);
const [year1, setYear1] = useState(null);
const bestCourse = getTopPerformingCourse()
const lowestCourse = getLowestPerformingCourse()

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
    { id: 2, name: "Course Assessment Report - (2023 & 2024)", created_at: "2024-12-20T21:25:00" },
       
        
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
        <p className="text-(--primary-color) text-3xl font-bold">Reports and Statistics</p>
        <p className="text-md">Generate and view a report accross 2 years. View courses' statistics.</p>
      </div>
<div className="w-full flex flex-wrap justify-between py-4 gap-2">
              <Card1
                text1="Total Courses"
                text2={coursePerformanceData.length.toString()}
                text1Color="text-white"
                text2Color="text-white"
                iconColor="text-white"
                icon="fa-solid fa-book"
                bgColor="bg-(--primary-color)"
                shadow={true}
              />
              
              <Card1
                text1="Average Score"
                text2={calculateAverageScore()}
                icon="fa-solid fa-percent"
              />
              
              <Card1
                text1="Best Performing Course"
                text2={`${bestCourse.course} - ${bestCourse.percentage}%`}
                icon="fa-solid fa-trophy"
              />
              
              <Card1
                text1="Least Performing Course"
                text2={`${lowestCourse.course} - ${lowestCourse.percentage}%`}
                icon="fa-solid fa-face-frown"
              />
            </div>
      <div className="grid grid-cols-5 gap-5 mb-5 h-[250px]">
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

        <div className="bg-white rounded-lg p-5 overflow-y-scroll h-[250px] col-span-3">
          <p className="text-lg font-semibold text-(--primary-color) mb-4">Report History</p>
          <ReportHistory />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <OutcomesGraph />
        <ImprovementTimeline />
        {/* <OutcomesTable/> */}
      </div>

            
      
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
              <BadPerformanceCard />
              <ImprovedCoursesCard />
            </div>
      
            {/* <ImprovementTimeline /> */}
    </div>
  )
}

export default Reports