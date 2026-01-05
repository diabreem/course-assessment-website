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
// SAMPLE TEST DATA
// ----------------------
const data = [
  {
    instructor: "John Due",
    forms: [
      { formName: "CA Form - Fall 2024 - CSC123", status: "Submitted" },
      { formName: "CA Form - Fall 2024 - CSC321", status: "In Progress" },
    ],
  },
  {
    instructor: "Bill Smith",
    forms: [
      { formName: "CA Form - Fall 2024 - CSC999", status: "Submitted" },
      { formName: "CA Form - Fall 2024 - CSC888", status: "In Progress" },
    ],
  },
  {
    instructor: "Alex",
    forms: [{ formName: "CA Form - Fall 2024 - CSC444", status: "Not Opened" }],
  }
];

// ----------------------
// STATUS COLOR FUNCTION
// ----------------------
const getStatusColor = (status) => {
  switch (status) {
    case "Submitted":
      return "var(--primary-color)";
    case "In Progress":
      return "var(--secondary-color)";
    case "Not Opened":
      return "gray";
    default:
      return "white";
  }
};

export default function InstructorFormsTable() {
  const [order, setOrder] = React.useState("asc"); // Sorting order
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    setPage(0);
  }, [search]);

  // Toggle sorting by instructor
  const handleRequestSort = () => {
    setOrder(order === "asc" ? "desc" : "asc");
  };

  const handleChangePage = (_e, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter and sort instructors
  const filtered = React.useMemo(() => {
    return [...data]
      .filter((inst) =>
        inst.instructor.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (a.instructor.toLowerCase() < b.instructor.toLowerCase())
          return order === "asc" ? -1 : 1;
        if (a.instructor.toLowerCase() > b.instructor.toLowerCase())
          return order === "asc" ? 1 : -1;
        return 0;
      });
  }, [order, search]);

  // Pagination at instructor level
  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: "100%" }}>
      {/* Search bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px' }}>
        <TextField
          label="Search for an instructor"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
         
        />
      </div>

      <TableContainer>
        <Table>
          {/* Table Header */}
          <TableHead>
            <TableRow>
              {/* Instructor — only sortable column */}
              <TableCell>
                <TableSortLabel
                  active={true}
                  direction={order}
                  onClick={handleRequestSort}
                >
                  Instructor
                </TableSortLabel>
              </TableCell>

              <TableCell>Form Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {paginated.map((inst, groupIndex) =>
              inst.forms.map((form, formIndex) => (
                <TableRow 
                  key={`${inst.instructor}-${formIndex}-${form.formName}`}
                  hover
                  sx={{
                    backgroundColor: groupIndex % 2 !== 0 ? "#ffffff" : "#f2f2f2",
                  }}
                >
                  {/* Instructor cell once with rowspan */}
                  {formIndex === 0 && (
                    <TableCell rowSpan={inst.forms.length}>
                      {inst.instructor}
                    </TableCell>
                  )}

                  {/* Form Name */}
                  <TableCell>{form.formName}</TableCell>

                  {/* Status Pill */}
                  <TableCell>
                    <p
                      style={{
                        backgroundColor: getStatusColor(form.status),
                        padding: "5px 25px",
                        fontSize: "0.8rem",
                        borderRadius: "50px",
                        display: "inline-block",
                        color: "white",
                        width: "130px",
                        textAlign: "center",
                      }}
                    >
                      {form.status}
                    </p>
                  </TableCell>

                  {/* View Column */}
                  <TableCell>
                    {form.status === "Submitted" ? (
                      <a
                        href={`/files/${form.formName}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fa-solid fa-eye text-(--primary-color)"></i>
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </TableContainer>

      {/* Pagination */}
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
}
