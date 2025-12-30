import { useEffect, useState } from "react";

// GET courses
const fetchCourses = async () => {
  // later: return fetch("/api/courses").then(res => res.json())
  return initialCourses;
};

// POST / PUT courses
const saveCourses = async (courses) => {
  // later: return fetch("/api/courses", { method: "POST", body: JSON.stringify(courses) })
  console.log("Saving to backend:", courses);
  return { success: true };
};

const initialCourses = [
  { id: "y1-so1-1", year: 1, so: "SO1", courseName: "CSC 310", pcsAssessed: "1.3, 1.4, 1.5, 1.7", semesterByblos: "", instructorByblos: "", coordinatorByblos: "", semesterBeirut: "", instructorBeirut: "", coordinatorBeirut: "" },
  { id: "y1-so1-2", year: 1, so: "SO1", courseName: "CSC 380", pcsAssessed: "1.2, 1.6", semesterByblos: "", instructorByblos: "", coordinatorByblos: "", semesterBeirut: "", instructorBeirut: "", coordinatorBeirut: "" },
  { id: "y1-so1-3", year: 1, so: "SO1", courseName: "MTH 207", pcsAssessed: "1.1", semesterByblos: "", instructorByblos: "", coordinatorByblos: "", semesterBeirut: "", instructorBeirut: "", coordinatorBeirut: "" },

  { id: "y1-so2-1", year: 1, so: "SO2", courseName: "CSC 447", pcsAssessed: "2.1", semesterByblos: "", instructorByblos: "", coordinatorByblos: "", semesterBeirut: "", instructorBeirut: "", coordinatorBeirut: "" },
  { id: "y1-so2-2", year: 1, so: "SO2", courseName: "CSC 322", pcsAssessed: "2.2", semesterByblos: "", coordinatorByblos: "", semesterBeirut: "", instructorBeirut: "", coordinatorBeirut: "" },
  { id: "y1-so2-3", year: 1, so: "SO2", courseName: "CSC 430", pcsAssessed: "2.3", semesterByblos: "", instructorByblos: "", coordinatorByblos: "", semesterBeirut: "", instructorBeirut: "", coordinatorBeirut: "" },
  { id: "y1-so2-4", year: 1, so: "SO2", courseName: "CSC 375", pcsAssessed: "2.4", semesterByblos: "", instructorByblos: "", coordinatorByblos: "", semesterBeirut: "", instructorBeirut: "", coordinatorBeirut: "" },

  { id: "y1-so3-1", year: 1, so: "SO3", courseName: "CSC 490", pcsAssessed: "3.1, 3.2, 3.3, 3.4", semesterByblos: "", instructorByblos: "", coordinatorByblos: "", semesterBeirut: "", instructorBeirut: "", coordinatorBeirut: "" },

  { id: "y2-so4-1", year: 2, so: "SO4", courseName: "LAS 204", pcsAssessed: "4.2, 4.3", semesterByblos: "", instructorByblos: "", coordinatorByblos: "", semesterBeirut: "", instructorBeirut: "", coordinatorBeirut: "" },
  { id: "y2-so4-2", year: 2, so: "SO4", courseName: "LAS 205", pcsAssessed: "4.1, 4.4", semesterByblos: "", instructorByblos: "", coordinatorByblos: "", semesterBeirut: "", instructorBeirut: "", coordinatorBeirut: "" },

  { id: "y2-so5-1", year: 2, so: "SO5", courseName: "CSC 375", pcsAssessed: "5.1, 5.2, 5.3", semesterByblos: "", instructorByblos: "", coordinatorByblos: "", semesterBeirut: "", instructorBeirut: "", coordinatorBeirut: "" },

  { id: "y2-so6-1", year: 2, so: "SO6", courseName: "CSC 599", pcsAssessed: "6.1, 6.2, 6.3", semesterByblos: "", instructorByblos: "", coordinatorByblos: "", semesterBeirut: "", instructorBeirut: "", coordinatorBeirut: "" },
  { id: "y2-so6-2", year: 2, so: "SO6", courseName: "CSC 598", pcsAssessed: "6.1, 6.2, 6.3", semesterByblos: "", instructorByblos: "", coordinatorByblos: "", semesterBeirut: "", instructorBeirut: "", coordinatorBeirut: "" },
  { id: "y2-so6-3", year: 2, so: "SO6", courseName: "CSC 490", pcsAssessed: "6.1, 6.2, 6.3", semesterByblos: "", instructorByblos: "", coordinatorByblos: "", semesterBeirut: "", instructorBeirut: "", coordinatorBeirut: "" },
];

const soRowSpans = { SO1: 3, SO2: 4, SO3: 1, SO4: 2, SO5: 1, SO6: 3 };

const isFirstRowOfSO = (courses, index) =>
  index === 0 || courses[index].so !== courses[index - 1].so;

const isFirstRowOfYear = (courses, index) =>
  index === 0 || courses[index].year !== courses[index - 1].year;

const getYearRowSpan = (year) =>
  year === 1 ? 8 : year === 2 ? 6 : 1;

export default function Setup() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState(1);
  const [collapsedYears, setCollapsedYears] = useState({});

  useEffect(() => {
    fetchCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  const toggleYearCollapse = (year) => {
    setCollapsedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  const updateCourseField = (id, field, value) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    );
  };

  const handleSubmit = async () => {
    const res = await saveCourses(courses);
    if (res.success) {
      alert("Saved successfully!");
    }
  };

  const exportToPDF = () => {
    window.print();
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-full">
      <style>{`
        @media print {
          button { display: none; }
          body { margin: 0; }
          .no-print { display: none; }
        }
      `}</style>

      <div className="flex justify-between items-center mb-4 no-print">
        <p></p>
        <div className="flex gap-2">
          <button 
            onClick={handleSubmit}
            className="px-3 py-2 border border-gray-400 rounded-lg text-black hover:bg-gray-300 transition-colors duration-500"
          >
            Save
          </button>
          <button 
            onClick={exportToPDF}
            className="px-4 py-2 bg-(--primary-color) text-white rounded-lg hover:bg-(--primary-color-hover) transition-colors duration-500"
          >
            Export to PDF
          </button>
        </div>
      </div>

      <div className="w-full " id="print-area">
        <table className="w-full border-collapse text-xs" >
          <thead>
            <tr className="bg-(--primary-color) text-white">
              <th className="border border-white px-2 py-2 text-left font-semibold" rowSpan={2}>
                Year
              </th>
              <th className="border border-white px-2 py-2 text-left font-semibold" rowSpan={2}>
                Outcomes
              </th>
              <th className="border border-white px-2 py-2 text-left font-semibold" rowSpan={2}>
                Course
              </th>
              <th className="border border-white px-2 py-2 text-left font-semibold" rowSpan={2}>
                PCs
              </th>
              <th className="border border-white px-2 py-2 text-center font-semibold" colSpan={3}>
                Byblos Campus
              </th>
              <th className="border border-white px-2 py-2 text-center font-semibold" colSpan={3}>
                Beirut Campus
              </th>
            </tr>
            <tr className="bg-(--secondary-color) text-white">
              <th className="border border-white px-1 py-1 text-left font-medium">Semester</th>
              <th className="border border-white px-1 py-1 text-left font-medium">Instructor</th>
              <th className="border border-white px-1 py-1 text-left font-medium">Coordinator</th>
              <th className="border border-white px-1 py-1 text-left font-medium">Semester</th>
              <th className="border border-white px-1 py-1 text-left font-medium">Instructor</th>
              <th className="border border-white px-1 py-1 text-left font-medium">Coordinator</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => {
              const isEditable = course.year === activeYear;
              const showYearCell = isFirstRowOfYear(courses, index);
              const showSOCell = isFirstRowOfSO(courses, index);
              const yearRowSpan = getYearRowSpan(course.year);
              const soRowSpan = soRowSpans[course.so] || 1;
              const isYearCollapsed = collapsedYears[course.year];
              
              // Check if this is the first row of Year 2 to add black border
              const isFirstYear2Row = course.year === 2 && showYearCell;

              // If year is collapsed and this is the first row, show only year cell
              if (isYearCollapsed && showYearCell) {
                return (
                  <tr key={`collapsed-${course.year}`}>
                    <td
                      className={`px-2 py-1 font-semibold bg-white align-middle text-center cursor-pointer hover:bg-gray-100 transition-colors text-black ${
                        isFirstYear2Row ? 'border border-gray-400' : 'border border-gray-400'
                      }`}
                      onClick={() => toggleYearCollapse(course.year)}
                      title="Click to expand"
                      colSpan={10}
                    >
                      Year {course.year} (Click to expand)
                    </td>
                  </tr>
                );
              }

              // If year is collapsed and not first row, skip
              if (isYearCollapsed) {
                return null;
              }

              return (
                <tr key={course.id}>
                  {showYearCell && (
                    <td
  className="px-2 py-1 font-semibold bg-white align-middle text-center cursor-pointer hover:bg-gray-100 transition-colors text-black border border-gray-400"
  rowSpan={yearRowSpan}
  onClick={() => toggleYearCollapse(course.year)}
  title="Click to collapse"
>

                      Year {course.year}
                    </td>
                  )}
                  
                  {showSOCell && (
                    <td 
                      className="border border-gray-400 px-2 py-1 font-medium bg-white align-middle text-center text-black"
                      rowSpan={soRowSpan}
                    >
                      {course.so}
                    </td>
                  )}
                  
                  <td className="border border-gray-400 px-2 py-1 font-medium bg-white text-black">
                    {course.courseName}
                  </td>
                  
                  <td className="border border-gray-400 px-2 py-1 bg-white text-black">
                    {course.pcsAssessed}
                  </td>
                  
                  {/* Byblos - Semester */}
                  <td className="border border-gray-400 px-1 py-1">
                    <input
                      value={course.semesterByblos}
                      onChange={(e) => updateCourseField(course.id, "semesterByblos", e.target.value)}
                      placeholder="e.g. Fall 2024"
                      disabled={!isEditable}
                      className="w-full h-6 px-1 text-xs border-0 outline-none bg-gray-100 text-black"
                    />
                  </td>
                  
                  {/* Byblos - Instructor */}
                  <td className="border border-gray-400 px-1 py-1">
                    <input
                      value={course.instructorByblos}
                      onChange={(e) => updateCourseField(course.id, "instructorByblos", e.target.value)}
                      placeholder="Instructor"
                      disabled={!isEditable}
                      className="w-full h-6 px-1 text-xs border-0 outline-none bg-gray-100 text-black"
                    />
                  </td>
                  
                  {/* Byblos - Coordinator */}
                  <td className="border border-gray-400 px-1 py-1">
                    <input
                      value={course.coordinatorByblos}
                      onChange={(e) => updateCourseField(course.id, "coordinatorByblos", e.target.value)}
                      placeholder="Coordinator"
                      disabled={!isEditable}
                      className="w-full h-6 px-1 text-xs border-0 outline-none bg-gray-100 text-black"
                    />
                  </td>
                  
                  {/* Beirut - Semester */}
                  <td className="border border-gray-400 px-1 py-1">
                    <input
                      value={course.semesterBeirut}
                      onChange={(e) => updateCourseField(course.id, "semesterBeirut", e.target.value)}
                      placeholder="e.g. Fall 2024"
                      disabled={!isEditable}
                      className="w-full h-6 px-1 text-xs border-0 outline-none bg-gray-100 text-black"
                    />
                  </td>
                  
                  {/* Beirut - Instructor */}
                  <td className="border border-gray-400 px-1 py-1">
                    <input
                      value={course.instructorBeirut}
                      onChange={(e) => updateCourseField(course.id, "instructorBeirut", e.target.value)}
                      placeholder="Instructor"
                      disabled={!isEditable}
                      className="w-full h-6 px-1 text-xs border-0 outline-none bg-gray-100 text-black"
                    />
                  </td>
                  
                  {/* Beirut - Coordinator */}
                  <td className="border border-gray-400 px-1 py-1">
                    <input
                      value={course.coordinatorBeirut}
                      onChange={(e) => updateCourseField(course.id, "coordinatorBeirut", e.target.value)}
                      placeholder="Coordinator"
                      disabled={!isEditable}
                      className="w-full h-6 px-1 text-xs border-0 outline-none bg-gray-100 text-black"
                    />
                  </td>
                </tr>
              );
            })}
            
            {/* Year 3 */}
            <tr className="bg-white">
              <td 
                className="border border-gray-400 px-2 py-3 font-semibold text-center cursor-pointer hover:bg-gray-100 transition-colors text-black"
                onClick={() => toggleYearCollapse(3)}
                title="Click to collapse/expand"
              >
                Year 3
              </td>
              {!collapsedYears[3] && (
                <td className="border border-gray-400 px-2 py-3 text-center italic text-black" colSpan={9}>
                  Analysis Only
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}