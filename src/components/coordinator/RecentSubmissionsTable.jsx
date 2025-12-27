import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// ----------------------
// SAMPLE DATA (DB-LIKE)
// improvements: "" | null | "text..."
// ----------------------
const dashboardData = [
  {
    id: 1,
    instructor: "John Doe",
    course: "CSC567",
    form: "Fall 2024 Evaluation",
    submitted: "12/10/2024",
    improvements: "Needs better pacing and more examples",
  },
  {
    id: 2,
    instructor: "Bill Smith",
    course: "CSC310",
    form: "Spring 2024 Evaluation",
    submitted: "03/05/2024",
    improvements: "", // EMPTY → None
  },
  {
    id: 3,
    instructor: "Adam Johnson",
    course: "CSC220",
    form: "Fall 2024 Evaluation",
    submitted: "15/10/2024",
    improvements: null, // NULL → None
  },
];

// ----------------------
// BADGE COLOR
// ----------------------
const getBadgeColor = (hasImprovements) =>
  hasImprovements
    ? "var(--secondary-color)"
    : "var(--primary-color)";

const RecentSubmissionsTable = () => {
  const navigate = useNavigate();

  const [order, setOrder] = React.useState("asc");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [data] = React.useState(dashboardData);

  React.useEffect(() => {
    setPage(0);
  }, [search]);

  // ----------------------
  // SORT BY INSTRUCTOR
  // ----------------------
  const handleRequestSort = () => {
    setOrder(order === "asc" ? "desc" : "asc");
  };

  // ----------------------
  // PAGINATION
  // ----------------------
  const handleChangePage = (_e, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ----------------------
  // FILTER + SORT
  // ----------------------
  const filtered = React.useMemo(() => {
    return [...data]
      .filter((row) =>
        row.instructor.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (a.instructor.toLowerCase() < b.instructor.toLowerCase())
          return order === "asc" ? -1 : 1;
        if (a.instructor.toLowerCase() > b.instructor.toLowerCase())
          return order === "asc" ? 1 : -1;
        return 0;
      });
  }, [data, order, search]);

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: "100%" }}>
      <div className="flex flex-row justify-between">
<p className="text-xl pb-2 font-semibold text-(--primary-color)">
        Recent Submissions
      </p>
       <button className=' text-[var(--primary-color)] border h-10' onClick={()=> navigate("/coordinator/improvements")}>View all Improvements</button>
      </div>
      

      {/* SEARCH */}
      <TextField
        label="Search by instructor"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ m: 1 }}
      />

      {/* TABLE */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active
                  direction={order}
                  onClick={handleRequestSort}
                >
                  Instructor
                </TableSortLabel>
              </TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Form</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Improvements</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((row, index) => {
              const hasImprovements =
                row.improvements && row.improvements.trim() !== "";

              return (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    backgroundColor:
                      index % 2 === 0 ? "#ffffff" : "#f2f2f2",
                  }}
                >
                  <TableCell>{row.instructor}</TableCell>
                  <TableCell>{row.course}</TableCell>
                  <TableCell>{row.form}</TableCell>
                  <TableCell>{row.submitted}</TableCell>

                  {/* IMPROVEMENTS BADGE */}
                  <TableCell>
                    <span
                      style={{
                        backgroundColor: getBadgeColor(hasImprovements),
                        color: "white",
                        padding: "4px 14px",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        display: "inline-block",
                      }}
                    >
                      {hasImprovements ? "Has Improvements" : "None"}
                    </span>
                  </TableCell>

                  {/* ACTION */}
                  <TableCell>
                   
                    <button className="cursor-pointer" onClick={() =>
                        navigate(
                          `/coordinator/improvements/${row.id}`
                        )
                      }><i className="fa-solid fa-eye text-lg" ></i></button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default RecentSubmissionsTable;
