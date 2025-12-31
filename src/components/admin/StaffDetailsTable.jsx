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
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";

// ----------------------
// SAMPLE STAFF DATA
// ----------------------
const staffData = [
  {
    id: 1,
    name: "John Doe",
    department: "CS and Math",
    campus: "Beirut",
    email: "john.doe@example.com",
    role: "Instructor",
  },
  {
    id: 2,
    name: "Bill Smith",
    department: "CS and Math",
    campus: "Byblos",
    email: "bill.smith@example.com",
    role: "Instructor",
  },
  {
    id: 3,
    name: "Adam Johnson",
    department: "CS and Math",
    campus: "Beirut",
    email: "adam.johnson@example.com",
    role: "Coordinator",
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
  const [orderBy, setOrderBy] = React.useState("name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState(staffData); 

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  const [openForm, setOpenForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [formData, setFormData] = React.useState({ name: '', email: '', role: 'Instructor', department: '', campus: '' });

  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

    React.useEffect(() => {
      setPage(0);
    }, [search]);

  // ----------------------
  // SORTING BY NAME
  // ----------------------
  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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
  // DELETE STAFF
  // ----------------------
  const handleOpenDeleteDialog = (id) => { setSelectedId(id); setDeleteDialogOpen(true); };
  const handleCloseDeleteDialog = () => { setDeleteDialogOpen(false); setSelectedId(null); };
  const handleConfirmDelete = () => {
    const deletedName = data.find(d => d.id === selectedId)?.name;
    setData(prev => prev.filter(d => d.id !== selectedId));
    handleCloseDeleteDialog();
    showSnackbar(`${deletedName} has been removed successfully`, 'success');
  };

  const handleOpenForm = (row = null) => {
    if (row) {
      setEditingId(row.id);
      setFormData({ name: row.name, email: row.email, role: row.role, department: row.department, campus: row.campus });
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', role: 'Instructor', department: '', campus: '' });
    }
    setOpenForm(true);
  };
  const handleCloseForm = () => { setOpenForm(false); setEditingId(null); };
  const handleFormChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleFormSubmit = () => {
    if (editingId !== null) {
      setData(prev => prev.map(d => d.id === editingId ? { ...d, ...formData } : d));
      showSnackbar(`${formData.name} has been updated successfully`, 'success');
    } else {
      const newId = data.length ? Math.max(...data.map(d => d.id)) + 1 : 1;
      setData(prev => [...prev, { id: newId, ...formData }]);
      showSnackbar(`${formData.name} has been added successfully`, 'success');
    }
    handleCloseForm();
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
      <div className="flex justify-between p-3">
        {/* SEARCH BAR */}
      <TextField
        label="Search for a staff member"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ m:1}}
      />

      <button className=' text-(--primary-color) border h-10'>Add a Member</button>

      </div>

      
      {/* TABLE */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {['name','campus','department','email','role'].map(head => (
                <TableCell key={head}>
                  <TableSortLabel
                    active={orderBy === head}
                    direction={orderBy === head ? order : 'asc'}
                    onClick={(e) => handleRequestSort(e, head)}
                  >
                    {head.charAt(0).toUpperCase() + head.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((staff) => (
              <TableRow key={staff.id} hover>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.campus}</TableCell>
                <TableCell>{staff.department}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>
                  <Box sx={{ backgroundColor: getRoleColor(staff.role), color: 'white', borderRadius: '50px', padding: '5px 15px', display: 'inline-block', fontSize: '0.8rem' }}>
                    {staff.role}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenForm(staff)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleOpenDeleteDialog(staff.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No staff found</TableCell>
              </TableRow>
            )}
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

      {/* DELETE DIALOG */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove <strong>{data.find(d => d.id === selectedId)?.name || 'this staff member'}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* ADD/EDIT FORM DIALOG */}
      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>{editingId !== null ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Full Name" margin="dense" value={formData.name} onChange={e => handleFormChange('name', e.target.value)} />
          <TextField fullWidth label="Email" margin="dense" value={formData.email} onChange={e => handleFormChange('email', e.target.value)} />
          <TextField fullWidth label="Department" margin="dense" value={formData.department} onChange={e => handleFormChange('department', e.target.value)} />
          <TextField fullWidth label="Campus" margin="dense" value={formData.campus} onChange={e => handleFormChange('campus', e.target.value)} />
          <TextField fullWidth label="Role" margin="dense" value={formData.role} onChange={e => handleFormChange('role', e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button variant="contained" onClick={handleFormSubmit}>{editingId !== null ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical:'bottom', horizontal:'right' }}>
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</MuiAlert>
      </Snackbar>
   
    </Box>
  );
};

export default StaffDetailsTable;
