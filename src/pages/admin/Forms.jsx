import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { getDetails } from "../../api/forms";
import { useSettings } from "../../context/SettingsContext";
import { getVersions, deleteVersion, createVersion, updateVersion, getLastVersionNumber } from "../../api/versions";
import { Typography } from '@mui/material';

const VersionsTable = () => {
  const getStatusColor = (isActive) =>
    isActive ? "var(--primary-color)" : "gray";
  
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [versions, setVersions] = useState([]);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [requestData, setRequestData] = useState({
    subject: "",
    description: ""
  });

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const res = await getVersions();
        setVersions(res.data);
      } catch (error) {
        console.error("Error fetching versions:", error);
      }
    };
    fetchVersions();

    
  }, []);

  const handleDeleteVersion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this version?")) return;
    try {
      await deleteVersion(id);
      setVersions(prev => prev.filter(v => v.id !== id));
    } catch (error) {
      console.error("Error deleting version:", error);
    }
  };

  const handleActivate = async (version) => {
    // Deactivate all other versions
    const allVersions = [...versions];
    const updatedVersions = allVersions.map(v => ({
      ...v,
      isActive: v.id === version.id
    }));
    
    // Update in state first 
    setVersions(updatedVersions);
    
    // Update in backend
    try {
      // Deactivate all versions
      await Promise.all(
        allVersions
          .filter(v => v.isActive && v.id !== version.id)
          .map(v => updateVersion(v.id, { ...v, isActive: false }))
      );
      
      // Activate selected version
      await updateVersion(version.id, { ...version, isActive: true });
      
      // Refresh versions
      const res = await getVersions();
      setVersions(res.data);
    } catch (error) {
      console.error("Error activating version:", error);
      // Revert on error
      const res = await getVersions();
      setVersions(res.data);
    }
  };

  const handleRequestVersion = async () => {
    if (!requestData.subject.trim()) {
      alert("Please enter a subject");
      return;
    }
    
    try {
      // Get the last version number
      const lastVersionRes = await getLastVersionNumber();
      const lastVersionNumber = lastVersionRes.data[0].versionNumber;
      const newVersionNumber = lastVersionNumber + 1;
      
      const newVersion = {
        versionNumber: newVersionNumber,
        subject: requestData.subject,
        description: requestData.description,
        isActive: false,
        created_at: new Date().toISOString(),
        requested_date: new Date().toISOString(),
        status: "requested" //  requested, in_development, ready
      };
      
      const res = await createVersion(newVersion);
      setVersions(prev => [...prev, res.data]);
      setOpenRequestDialog(false);
      setRequestData({ subject: "", description: "" });
      
      alert(`Version v${newVersionNumber} requested successfully!`);
    } catch (error) {
      console.error("Error requesting version:", error);
      alert("Failed to request version");
    }
  };

  // Sorting
  const sortedVersions = [...versions].sort((a, b) => {
    const aNum = a.versionNumber || 0;
    const bNum = b.versionNumber || 0;
    return order === "asc" ? aNum - bNum : bNum - aNum;
  });

  // Pagination
  const paginatedVersions = sortedVersions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
      {/* Header with Request Button */}
      <Box className="flex justify-between items-center mb-4 p-4">
        <p className="text-(--primary-color) font-bold text-lg">Form Versions</p>
        <button
          className="bg-(--primary-color) px-4 py-2 text-white rounded-lg hover:bg-(--primary-color-hover) transition-colors duration-500"
          onClick={() => setOpenRequestDialog(true)}
        >
          <i className="fas fa-plus mr-2"></i>
          Request New Version
        </button>
      </Box>

      {/* Request Version Dialog */}
      <Dialog
        open={openRequestDialog}
        onClose={() => setOpenRequestDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <DialogTitle className="text-(--primary-color)">
          Request New Version from Developer
        </DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-4 pt-4">
            <div className='flex flex-col'>
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                value={requestData.subject}
                onChange={(e) => setRequestData({...requestData, subject: e.target.value})}
                className='border rounded p-2 border-gray-400'
                placeholder="Describe what needs to be changed/added"
                required
              />
            </div>
            <div className='flex flex-col'>
              <label htmlFor="description">Detailed Description</label>
              <textarea
                id="description"
                value={requestData.description}
                onChange={(e) => setRequestData({...requestData, description: e.target.value})}
                className='border rounded p-2 border-gray-400'
                placeholder="Provide detailed description of required changes..."
                rows={4}
              />
            </div>
            <Typography variant="body2" color="textSecondary">
              Note: The new version number will be automatically generated as v{(() => {
                const lastVersion = versions.length > 0 
                  ? Math.max(...versions.map(v => v.versionNumber || 0))
                  : 0;
                return lastVersion + 1;
              })()}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <button
            className="border border-gray-400 p-2 rounded w-20"
            onClick={() => setOpenRequestDialog(false)}
          >
            Cancel
          </button>
          <button
            className="bg-(--primary-color) text-white p-2 rounded w-20"
            onClick={handleRequestVersion}
          >
            Request
          </button>
        </DialogActions>
      </Dialog>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell>
                <TableSortLabel
                  active
                  direction={order}
                  onClick={handleRequestSort}
                >
                  Version
                </TableSortLabel>
              </TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedVersions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" className="py-8">
                  No versions found. Request your first version!
                </TableCell>
              </TableRow>
            ) : paginatedVersions.map((version) => (
              <TableRow key={version.id} hover>
                <TableCell>
                  <span className="font-bold">v{version.versionNumber}</span>
                </TableCell>
                <TableCell>
                  <div>
                    <p >{version.subject || "No subject provided"}</p>
                    {version.description && (
                      <p className="text-sm text-gray-600 mt-1">{version.description}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {version.created_at 
                    ? new Date(version.created_at).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    {version.status =="ready" && 
                    <button
                      onClick={version.isActive ? undefined : () => handleActivate(version)}
                      style={{
                        backgroundColor: getStatusColor(version.isActive),
                        padding: "5px 10px",
                        fontSize: "0.75rem",
                        borderRadius: "50px",
                        color: "white",
                        width: "140px",
                        textAlign: "center",
                        cursor: version.isActive ? "default" : "pointer",
                        opacity: version.isActive ? 1 : 0.9
                      }}
                    >
                      {version.isActive ? "Currently Active" : "Click to Activate"}
                    </button> }
                    
                    {/* Version development status */}
                    {version.status && version.status !== "ready" && (
                      <span 
                      style={{
                        backgroundColor: version.status=="requested" ? "var(--shadow-color)" : version.status=="in_development" ? "black" : "gray",
                        padding: "5px 10px",
                        fontSize: "0.75rem",
                        borderRadius: "50px",
                        color: "white",
                        width: "140px",
                        textAlign: "center",
                        cursor: version.isActive ? "default" : "pointer",
                        opacity: version.isActive ? 1 : 0.9
                      }}
                      >
                        {version.status === "requested" ? "Requested" :
                         version.status === "in_development" ? "In Development" : 
                         version.status}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-3 items-center">
                    {/* View icon - can be used to preview version details */}
                    <i className="fas fa-eye cursor-pointer text-gray-600 hover:text-(--primary-color)" 
                       title="View version details"></i>
                    
                    {/* Delete icon */}
                    <button
                      onClick={() => handleDeleteVersion(version.id)}
                      className="text-gray-600 hover:text-red-600"
                      title="Delete version"
                      disabled={version.isActive}
                    >
                      <i className="fas fa-trash cursor-pointer"></i>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedVersions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

// Instructor Forms Overview Table Component
const InstructorFormsOverviewTable = () => {
  const { settings } = useSettings();
  const current_semester = settings?.current_semester;
  
  const [order, setOrder] = useState("asc"); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [details, setDetails] = useState([]);
  const [versions, setVersions] = useState([]);

  // Fetch forms data
  useEffect(() => {
    if (!current_semester) return;
    
    
    const fetchData = async () => {
      try {
        const [formsRes, versionsRes] = await Promise.all([
          getDetails(settings.current_semester),
          getVersions()
        ]);
        setDetails(formsRes.data);
        setVersions(versionsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [current_semester]);


  // Filter by current semester
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

  // Group forms by instructor for rowspan
  const grouped = React.useMemo(() => {
    const map = {};
    filtered.forEach((form) => {
      const instructor = form.instructor_name;
      if (!map[instructor]) map[instructor] = [];
      map[instructor].push(form);
    });
    return Object.entries(map);
  }, [filtered]);

  // Get status color
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
      {/* Header */}
      <div className="p-4 flex justify-between">
        <p className="text-(--primary-color) font-bold mb-4 text-lg">Instructor Forms Overview</p>
        
        {/* Search bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px' }}>
          <TextField
            label="Search for an instructor"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: '300px' }}
          />
        </div>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
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
              <TableCell>Form Version</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {grouped.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" className="py-8">
                  No forms found for the current semester.
                </TableCell>
              </TableRow>
            ) : grouped.map(([instructor, forms]) =>
              forms.map((form, index) => {
                
                return (
                  <TableRow key={form.id} hover>
                    {/* Instructor cell only on first row of group */}
                    {index === 0 && (
                      <TableCell rowSpan={forms.length}>
                        {instructor}
                      </TableCell>
                    )}

                    <TableCell>
                      <div>
                        <p >{form.course_code || form.form_name}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            v{form.versionNumber || "N/A"}
                          </span>
                         
                        </div>
                                        
                    </TableCell>

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
                      {form.status === "Submitted" && form.document ? (
                        <a href={form.document} target="_blank" rel="noopener noreferrer">
                          <i className="fas fa-eye text-(--primary-color) cursor-pointer text-lg"></i>
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
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
};

// Main Forms Component
export default function Forms() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header Section */}
      <div className='pb-4 flex flex-col gap-3'>
        <p className='text-(--primary-color) text-3xl font-bold'>Forms Management</p>
        <p className="text-md">
          Manage Course Assessment Form versions and view instructor submissions.
          Request new versions from developers and activate versions for use.
        </p>
      </div>

      {/* Versions Management Section */}
      <div className='w-full bg-white rounded-lg shadow-sm mb-6 p-1'>
        <VersionsTable />
      </div>

      {/* Instructor Forms Section */}
      <div className='w-full bg-white rounded-lg shadow-sm p-1'>
        <InstructorFormsOverviewTable />
      </div>
    </div>
  );
}