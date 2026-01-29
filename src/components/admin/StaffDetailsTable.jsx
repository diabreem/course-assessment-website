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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { createStaff, deleteStaff, getStaff, updateStaff } from "../../api/staff";
import { useUniversity } from "../../context/UniversityContext";

const getRoleColor = (role) => {

  switch (role.toLowerCase()) {
    case "instructor":
      return "var(--primary-color)";
    case "coordinator":
      return "var(--secondary-color)";
    default:
      return "white";
  }
};

const emptyStaff = {
  first_name: "",
  last_name: "",
  campus: "Beirut",
  department: "Computer Science and Mathematics",
  email: "",
  role: "instructor",
};

const StaffDetailsTable = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("fullName");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");

  const [staff, setStaff] = React.useState([]);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [staffData, setStaffData] = React.useState(emptyStaff);
  const [selectedId, setSelectedId] = React.useState(null);


  const {university} = useUniversity();
  console.log(university?.id);
  // GET STAFF
  React.useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await getStaff();
        setStaff(res.data.filter(s=>s.role!="admin"));
      } catch (error) {
        console.log(error);
      }
    };
    fetchStaff();
  }, []);

  React.useEffect(() => {
    setPage(0);
  }, [search]);

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_e, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filtered = React.useMemo(() => {
    return [...staff]
      .filter((s) =>
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const aVal =
          orderBy === "fullName"
            ? `${a.first_name} ${a.last_name}`.toLowerCase()
            : a[orderBy]?.toString().toLowerCase();

        const bVal =
          orderBy === "fullName"
            ? `${b.first_name} ${b.last_name}`.toLowerCase()
            : b[orderBy]?.toString().toLowerCase();

        if (aVal < bVal) return order === "asc" ? -1 : 1;
        if (aVal > bVal) return order === "asc" ? 1 : -1;
        return 0;
      });

  }, [staff, order, orderBy, search]);

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // EDIT STAFF
  const handleUpdate = async () => {
    try {
      const res = await updateStaff(selectedId, staffData);
      setStaff((prev) =>
        prev.map((s) => (s.id === selectedId ? res.data : s))
      );
      setOpenEdit(false);
      setStaffData(emptyStaff);
    }
    catch (error) { console.log(error) }
  }

  // DELETE
  const handleDelete = async (id) => {
    try {
      const res = await deleteStaff(id);
      setStaff((prev) => prev.filter((s) => s.id != id))
    }
    catch (error) { console.log(error) }
  }
  // ADD STAFF
  const handleSaveStaff = async () => {
    try {
      const res = await createStaff(staffData);
      setStaff((prev) => [...prev, res.data]);
      setOpenAdd(false);
      setStaffData(emptyStaff);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px",
        }}
      >
        <TextField
          label="Search for a staff member"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => setOpenAdd(true)}
          className="bg-(--primary-color) px-4 py-2 text-white rounded-lg hover:bg-(--primary-color-hover) transition-colors duration-500"
        >
          Add a Member
        </button>
      </div>

      {/* ADD STAFF DIALOG */}
      <Dialog
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          setStaffData(emptyStaff);
        }}
        fullWidth
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <DialogTitle className="text-(--primary-color)">Add Staff Member</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div className="flex gap-1 justify-between">
            <label>
              First Name:<br />
              <input
                type="text"
                className="border border-gray-400 rounded p-1 w-64"
                value={staffData.first_name}
                onChange={(e) => setStaffData({ ...staffData, first_name: e.target.value })}
              />
            </label>

            <label>
              Last Name:<br />
              <input
                type="text"
                className="border border-gray-400 rounded p-1 w-64"
                value={staffData.last_name}
                onChange={(e) => setStaffData({ ...staffData, last_name: e.target.value })}
              />
            </label>
          </div>

          <div className="flex gap-1 justify-between">
            <label>
              Email:<br />
              <input
                type="email"
                className="border border-gray-400 rounded p-1 w-64"
                value={staffData.email}
                onChange={(e) => setStaffData({ ...staffData, email: e.target.value })}
              />
            </label>

            <label>
              Campus:<br />
              <select
                className="border border-gray-400 rounded p-1 w-64"
                value={staffData.campus}
                onChange={(e) => setStaffData({ ...staffData, campus: e.target.value })}
              >
                <option value="Beirut">Beirut</option>
                <option value="Byblos">Byblos</option>
              </select>
            </label>
          </div>

          <div className="flex gap-1 justify-between">
            <label>
              Role:<br />
              <select
                className="border border-gray-400 rounded p-1 w-64"
                value={staffData.role}
                onChange={(e) => setStaffData({ ...staffData, role: e.target.value })}
              >
                <option value="Instructor">Instructor</option>
                <option value="Coordinator">Coordinator</option>
              </select>
            </label>

            <label>
              Department:<br />
              <select
                className="border border-gray-400 rounded p-1 w-64"
                value={staffData.department}
                onChange={(e) => setStaffData({ ...staffData, department: e.target.value })}
              >
                <option value="Computer Science and Mathematics">
                  Computer Science and Mathematics
                </option>
                <option value="Liberal Arts and Sciences">
                  Liberal Arts and Sciences
                </option>
              </select>
            </label>
          </div>
        </DialogContent>

        <DialogActions>
          <button
            className="border border-gray-400 p-1 rounded w-16"
            onClick={() => {
              setOpenAdd(false);
              setStaffData(emptyStaff);
            }}
          >
            Cancel
          </button>

          <button
            className="bg-(--primary-color) text-white p-1 rounded w-16"
            onClick={handleSaveStaff}
          >
            Add
          </button>
        </DialogActions>
      </Dialog>

      {/* UPDATE */}
      <Dialog
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setStaffData(emptyStaff);
          setSelectedId(null);
        }}
        fullWidth
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <DialogTitle className="text-(--primary-color)">Update Details</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div className="flex gap-1 justify-between">
            <label>
              First Name:<br />
              <input
                type="text"
                className="border border-gray-400 rounded p-1 w-64"
                value={staffData.first_name}
                onChange={(e) => setStaffData({ ...staffData, first_name: e.target.value })}
              />
            </label>

            <label>
              Last Name:<br />
              <input
                type="text"
                className="border border-gray-400 rounded p-1 w-64"
                value={staffData.last_name}
                onChange={(e) => setStaffData({ ...staffData, last_name: e.target.value })}
              />
            </label>
          </div>

          <div className="flex gap-1 justify-between">
            <label>
              Email:<br />
              <input
                type="email"
                className="border border-gray-400 rounded p-1 w-64"
                value={staffData.email}
                onChange={(e) => setStaffData({ ...staffData, email: e.target.value })}
              />
            </label>

            <label>
              Campus:<br />
              <select
                className="border border-gray-400 rounded p-1 w-64"
                value={staffData.campus}
                onChange={(e) => setStaffData({ ...staffData, campus: e.target.value })}
              >
                <option value="Beirut">Beirut</option>
                <option value="Byblos">Byblos</option>
              </select>
            </label>
          </div>

          <div className="flex gap-1 justify-between">
            <label>
              Role:<br />
              <select
                className="border border-gray-400 rounded p-1 w-64"
                value={staffData.role}
                onChange={(e) => setStaffData({ ...staffData, role: e.target.value })}
              >
                <option value="Instructor">Instructor</option>
                <option value="Coordinator">Coordinator</option>
              </select>
            </label>

            <label>
              Department:<br />
              <select
                className="border border-gray-400 rounded p-1 w-64"
                value={staffData.department}
                onChange={(e) => setStaffData({ ...staffData, department: e.target.value })}
              >
                <option value="Computer Science and Mathematics">
                  Computer Science and Mathematics
                </option>
                <option value="Liberal Arts and Sciences">
                  Liberal Arts and Sciences
                </option>
              </select>
            </label>
          </div>
        </DialogContent>

        <DialogActions>
          <button
            className="border border-gray-400 p-1 rounded w-16"
            onClick={() => {
              setOpenEdit(false);
              setStaffData(emptyStaff);
              setSelectedId(null);
            }}
          >
            Cancel
          </button>

          <button
            className="bg-(--primary-color) text-white p-1 rounded w-16"
            onClick={handleUpdate}
          >
            Update
          </button>
        </DialogActions>
      </Dialog>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {["fullName", "campus", "department", "email", "role"].map((head) => (
                <TableCell key={head}>
                  <TableSortLabel
                    active={orderBy === head}
                    direction={orderBy === head ? order : "asc"}
                    onClick={(e) => handleRequestSort(e, head)}
                  >
                    {head === "fullName" ? "Name" : head.charAt(0).toUpperCase() + head.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((staff) => (
              <TableRow key={staff.id} hover className="even:bg-white odd:bg-gray-100">
                <TableCell>{staff.first_name} {staff.last_name}</TableCell>
                <TableCell>{staff.campus}</TableCell>
                <TableCell>{staff.department}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>
                  <p
                    style={{
                      backgroundColor: getRoleColor(staff.role),
                      padding: "5px 25px",
                      fontSize: "0.8rem",
                      borderRadius: "50px",
                      color: "white",
                      width: "130px",
                      textAlign: "center",
                    }}
                  >
                    {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                  </p>
                </TableCell>
                <TableCell>
                  <i className="fas fa-envelope" style={{ color: "gray", cursor: "pointer", marginRight: "12px" }} />
                  <i className="fas fa-edit" style={{ color: "var(--primary-color)", cursor: "pointer", marginRight: "12px" }} onClick={() => {
                    setSelectedId(staff.id);
                    setStaffData(staff);
                    setOpenEdit(true);
                  }}
                  />
                  <i className="fas fa-trash" style={{ cursor: "pointer" }} onClick={() => handleDelete(staff.id)} />
                </TableCell>
              </TableRow>
            ))}

            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No staff found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
