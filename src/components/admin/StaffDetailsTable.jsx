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
import { getCampusesByUniversityId, getDepartmentsByUniversityId } from "../../api/university";

const getRoleColor = (role) => {
  if (role === "coordinator") return "var(--secondary-color)";
  if (role === "instructor") return "var(--primary-color)";
  return "gray";
};


const emptyStaff = {
  first_name: "",
  last_name: "",
  campus: "Beirut",
  department: "Computer Science and Mathematics",
  email: "",
  role: [],
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

  const [campuses, setCampuses] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);



  // GET STAFF
  React.useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await getStaff();
        setStaff(
          res.data.filter(
            (s) =>
              s.role?.includes("instructor") ||
              s.role?.includes("coordinator")
          )
        );           
      } catch (error) {
        console.log(error);
      }
    };

    
    fetchStaff();

    const fetchCampuses = async () => {
      try {
        const res = await getCampusesByUniversityId(1);
        setCampuses(res.data);  
      } catch (error) {
        console.log(error);
      }
    };

    fetchCampuses();

    const fetchDepartments = async () => {
      try {
        const res = await getDepartmentsByUniversityId(1);
        setDepartments(res.data);  
      } catch (error) {
        console.log(error);
      }
    };

    fetchDepartments();
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
                {
                  campuses.map((campus)=> {
                    return <option key={campus.id} value={campus.name}>{campus.name}</option>
                  })
                }
                
              </select>
            </label>
          </div>

          <div className="flex gap-1 justify-between">
          <label>
            Role:<br />
            <div className="flex gap-4 mt-1">

              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={staffData.role.includes("instructor")}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setStaffData((prev) => ({
                      ...prev,
                      role: checked
                        ? [...prev.role, "instructor"]
                        : prev.role.filter((r) => r !== "instructor"),
                    }));
                  }}
                />
                Instructor
              </label>

              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={staffData.role.includes("coordinator")}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setStaffData((prev) => ({
                      ...prev,
                      role: checked
                        ? [...prev.role, "coordinator"]
                        : prev.role.filter((r) => r !== "coordinator"),
                    }));
                  }}
                />
                Coordinator
              </label>
            </div>
          </label>

            <label>
              Department:<br />
              <select
                className="border border-gray-400 rounded p-1 w-64"
                value={staffData.department}
                onChange={(e) => setStaffData({ ...staffData, department: e.target.value })}
              >
                {departments.map((department)=> {
                  return <option key={department.id} value={department.name}>{department.name}</option>
                })}
               
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
              <div className="flex gap-4 mt-1">
                {/* Instructor */}
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={staffData.role?.includes("instructor")}
                    onChange={(e) => {
                      const checked = e.target.checked;

                      setStaffData((prev) => ({
                        ...prev,
                        role: checked
                          ? Array.from(new Set([...prev.role, "instructor"]))
                          : prev.role.filter((r) => r !== "instructor"),
                      }));
                    }}
                  />
                  Instructor
                </label>

                {/* Coordinator */}
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={staffData.role?.includes("coordinator")}
                    onChange={(e) => {
                      const checked = e.target.checked;

                      setStaffData((prev) => ({
                        ...prev,
                        role: checked
                          ? Array.from(new Set([...prev.role, "coordinator"]))
                          : prev.role.filter((r) => r !== "coordinator"),
                      }));
                    }}
                  />
                  Coordinator
                </label>
              </div>
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
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {staff.role
                    .filter((r) => r !== "admin")
                    .map((r) => (
                      <p
                        key={r}
                        style={{
                          backgroundColor: getRoleColor(r),
                          padding: "5px 25px",
                          fontSize: "0.8rem",
                          borderRadius: "50px",
                          color: "white",
                          width: "130px",
                          textAlign: "center",
                          margin: 0,
                        }}
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </p>
                    ))}
                  </div>
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
