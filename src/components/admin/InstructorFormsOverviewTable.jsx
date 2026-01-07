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
import { getDetails } from "../../api/forms";
import { useSettings } from "../../context/SettingsContext";

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

export default function InstructorFormsOverviewTable() {
  const { settings } = useSettings();
  const current_semester = settings?.current_semester;
  console.log("Current Semester in InstructorFormsTable:", current_semester);

  const [order, setOrder] = React.useState("asc"); 
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [details, setDetails] = React.useState([]);

  // Fetch forms (frontend-only or backend-ready)
  React.useEffect(() => {
          if (!current_semester) return;
    const fetchDetails = async () => {
      // Pass semester param now; backend can use it later
       try {
      const res = await getDetails(settings.current_semester);
      setDetails(res.data);
    } catch (err) {
      console.error(err);
    } 
    };
    fetchDetails();
  }, [current_semester]);

  // --- Frontend semester filter (REMOVE THIS WHEN BACKEND FILTERS) ---
  const filteredBySemester = React.useMemo(() => {
    return details.filter((d) => d.semester === current_semester);
  }, [details, current_semester]);

  // Sorting and search
  const filtered = React.useMemo(() => {
    return filteredBySemester
      .filter((d) =>
        d.instructor_name?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const aName = a.instructor_name?.toLowerCase() || "";
        const bName = b.instructor_name?.toLowerCase() || "";
        if (aName < bName) return order === "asc" ? -1 : 1;
        if (aName > bName) return order === "asc" ? 1 : -1;
        return 0;
      });
  }, [filteredBySemester, search, order]);

  // Pagination (per form)
  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Group forms by instructor for rowspan.
  // In backend, use details instead of filtered.
  const grouped = React.useMemo(() => {
    const map = {};
    filtered.forEach((form) => {
      const instructor = form.instructor_name;
      if (!map[instructor]) map[instructor] = [];
      map[instructor].push(form);
    });
    return Object.entries(map);
  }, [filtered]);

  // Toggle sorting order
  const handleRequestSort = () => {
    setOrder(order === "asc" ? "desc" : "asc");
  };

  const handleChangePage = (_e, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
              <TableCell>Form Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {grouped.map(([instructor, forms]) =>
              forms.map((form, index) => (
                <TableRow key={form.id} hover>
                  {/* Instructor cell only on first row of group */}
                  {index === 0 && (
                    <TableCell rowSpan={forms.length}>
                      {instructor}
                    </TableCell>
                  )}

                  <TableCell>{form.form_name}</TableCell>

                  <TableCell>
                    <p
                      style={{
                        backgroundColor: getStatusColor(form.status),
                        padding: "5px 25px",
                        fontSize: "0.8rem",
                        borderRadius: "50px",
                        color: "white",
                        width: "130px",
                        textAlign: "center",
                      }}
                    >
                      {form.status}
                    </p>
                  </TableCell>

                  <TableCell>
                    {form.status === "Submitted" ? (
                      <a href={form.document} target="_blank" rel="noopener noreferrer">
                        <i className="fas fa-eye text-(--primary-color) cursor-pointer"></i>
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
