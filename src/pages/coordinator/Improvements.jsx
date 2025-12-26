import React from "react";

const improvementsData = [
  {
    id: 1,
    instructorName: "John Doe",
    courseName: "Course A",
    formName: "Course Assessment Form",
    semester: "Fall",
    year: 2024,
    improvementText: "Improve clarity of examples in lecture slides.",
  },
  {
    id: 2,
    instructorName: "John Doe",
    courseName: "Course B",
    formName: "Course Assessment Form",
    semester: "Spring",
    year: 2024,
    improvementText: "Add more practice exercises for students.",
  },
  {
    id: 3,
    instructorName: "Bill Smith",
    courseName: "Course C",
    formName: "Course Assessment Form",
    semester: "Fall",
    year: 2025,
    improvementText: "Provide additional resources on assignment topics.",
  },
];

const Improvements = () => {
  const [viewMode, setViewMode] = React.useState("instructor");
  const [search, setSearch] = React.useState("");
  const [selectedTerm, setSelectedTerm] = React.useState("Fall 2025");

  const terms = [...new Set(
    improvementsData.map(i => `${i.semester} ${i.year}`)
  )];

  const filtered = improvementsData.filter((imp) => {
    const matchesSearch = `${imp.instructorName} ${imp.courseName}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesTerm = `${imp.semester} ${imp.year}` === selectedTerm;

    return matchesSearch && matchesTerm;
  });

  const grouped = React.useMemo(() => {
    const g = {};
    filtered.forEach((imp) => {
      const key =
        viewMode === "instructor" ? imp.instructorName : imp.courseName;
      if (!g[key]) g[key] = [];
      g[key].push(imp);
    });
    return g;
  }, [filtered, viewMode]);

  return (
    <div className="p-6 bg-white rounded-lg">
      {/* ROW 1 */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by course or instructor"
          className="border rounded px-3 py-2 w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex items-center gap-3">
          <select
            className="border rounded px-3 py-2 text-sm"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            {terms.map(term => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>

          <button
            className={`px-3 py-1 rounded ${
              viewMode === "instructor"
                ? "bg-[var(--primary-color)] text-white"
                : "border"
            }`}
            onClick={() => setViewMode("instructor")}
          >
            View by Instructor
          </button>

          <button
            className={`px-3 py-1 rounded ${
              viewMode === "course"
                ? "bg-[var(--primary-color)] text-white"
                : "border"
            }`}
            onClick={() => setViewMode("course")}
          >
            View by Course
          </button>
        </div>
      </div>

      {/* DATA */}
      {Object.keys(grouped).length === 0 && (
        <p className="text-gray-500">No improvements for this semester.</p>
      )}

      {Object.keys(grouped).map((group) => (
        <div key={group} className="mb-6">
          <p className="font-bold text-[var(--primary-color)] mb-3">
            {viewMode === "instructor"
              ? `Instructor: ${group}`
              : `Course: ${group}`}
          </p>

          {grouped[group].map((imp) => (
            <div
              key={imp.id}
              className="border rounded p-3 mb-2 hover:bg-gray-50"
            >
              <p className="text-sm font-semibold mb-1">
                {viewMode === "instructor"
                  ? `${imp.courseName} | ${imp.formName}`
                  : `Instructor: ${imp.instructorName}`}
              </p>

              <p className="text-sm text-gray-700">
                {imp.improvementText}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Improvements;
