import * as React from "react";
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

// ----------------------
// SAMPLE STAFF DATA
// ----------------------
const staffData = [
  {
    id: 1,
    name: "John Doe",
    department: "CS and Math",
    campus: "Beirut",
    email: "email@example.com",
    role: "Instructor",
    courses: ["Course C", "Course D"],
  },
  {
    id: 2,
    name: "Bill Smith",
    department: "CS and Math",
    campus: "Byblos",
    email: "email@example.com",
    role: "Instructor",
    courses: ["Course A"],
  },
  {
    id: 3,
    name: "Adam Johnson",
    department: "CS and Math",
    campus: "Beirut",
    email: "email@example.com",
    role: "Coordinator",
    courses: ["Course A", "Course B"],
  },
];

// ----------------------
// ROLE COLOR HELPER
// ----------------------
const getRoleColor = (role) => {
  switch (role) {
    case "Instructor":
      return "var(--primary-color)";
    case "Coordinator":
      return "var(--secondary-color)";
    default:
      return "gray";
  }
};

const StaffDetailsTable = () => {
  const [order, setOrder] = React.useState("asc");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState(staffData); // state to handle deletion

  // ----------------------
  // SORTING BY NAME
  // ----------------------
  const handleRequestSort = () => {
    setOrder(order === "asc" ? "desc" : "asc");
  };

  // ----------------------
  // DELETE STAFF
  // ----------------------
  const handleDeleteStaff = (id) => {
    setData((prev) => prev.filter((staff) => staff.id !== id));
  };

  // ----------------------
  // PAGINATION HANDLERS
  // ----------------------
  const handleChangePage = (_e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ----------------------
  // FILTER + SORT DATA
  // ----------------------
  const filtered = React.useMemo(() => {
    return [...data]
      .filter((staff) =>
        staff.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase())
          return order === "asc" ? -1 : 1;
        if (a.name.toLowerCase() > b.name.toLowerCase())
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
      {/* SEARCH BAR */}
      <TextField
        label="Search for a staff member"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ m:1}}
      />

      {/* TABLE */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={true}
                  direction={order}
                  onClick={handleRequestSort}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Campus</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((staff, index) => (
              <TableRow key={staff.id} hover sx={{backgroundColor: index % 2 === 0 ? "#ffffff" : "#f2f2f2"}}>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.campus}</TableCell>
                <TableCell>{staff.department}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>
                  <span
                    style={{
                      backgroundColor: getRoleColor(staff.role),
                      color: "white",
                      width: "90px",
                      textAlign: "center",
                      padding: "2px 10px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      display: "block"
                      
                    }}
                  >
                    {staff.role}
                  </span>
                </TableCell>
                <TableCell>{staff.courses.map((course, i) => {
                  return <span
                  key={i}
                  style={{
                    border: "1px solid gray",
                    borderRadius: "12px",
                    padding: "3px",
                    marginRight: "5px",
                    color: "black",
                    fontSize: "0.8rem"
                  }}>
                  <i className="fa-solid fa-book text-sm pr-1"></i>{course}
                  </span>
                }) }</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleDeleteStaff(staff.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      
                      cursor: "pointer",
                      fontSize: "1.2rem",
                    }}
                    title="Delete Staff"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </TableCell>
              </TableRow>
            ))}
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

export default StaffDetailsTable;
