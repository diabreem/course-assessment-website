import * as React from "react";
import {
    TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
    Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem,
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    OutlinedInput, Chip, FormHelperText,
    IconButton, 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import InsightsIcon from '@mui/icons-material/Insights';
import { getCourses } from "../../api/courses";
import { getSOs, getPCs } from "../../api/so";
import { getStaff } from "../../api/staff";
import { useSettings } from "../../context/SettingsContext";
import { getAssignments, addAssignment, updateAssignmentById, deleteAssignmentById } from "../../api/assignment";

const YEAR_SO_MAPPING = {
    1: [1, 2, 3],  // Year 1: SO1, SO2, SO3
    2: [4, 5, 6],  // Year 2: SO4, SO5, SO6
    3: [],         // Year 3: no SOs
};
const SEMESTERS = ["Fall", "Spring"];

const CAMPUS_MAPPING = {
    "cmps1": "Byblos",
    "cmps2": "Beirut"
};

const AssignmentsTable = () => {
    const [assignments, setAssignments] = React.useState([]);
    const [courses, setCourses] = React.useState([]);
    const [SOs, setSOs] = React.useState([]);
    const [PCs, setPCs] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    const { settings } = useSettings();

    const emptyAssignment = {
        id: "",
        year: 1,
        academic_year: settings?.academic_year || "",
        so_id: "",
        course_id: "",
        pc_ids: [],
        semester_cmps1: "", // Byblos
        semester_cmps2: "",  // Beirut
        instructor_id_cmps1: "",  // Byblos
        instructor_id_cmps2: "",   // Beirut
     
    };
    
    const [selectedProcess, setSelectedProcess] = React.useState("");
    const [availableProcesses, setAvailableProcesses] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState(null);
    const [dialogYear, setDialogYear] = React.useState(1);
    const [assignmentData, setAssignmentData] = React.useState(emptyAssignment);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        fetchAllData();
          console.log(SOs);
    }, []);
  

    React.useEffect(() => {
        if (settings && settings.academic_year && settings.year_number) {
            const processes = generateProcesses();
            setAvailableProcesses(processes);
            
            if (processes.length > 0 && !selectedProcess) {
                const currentProcess = processes.find(p => p.includes("(Current)")) || processes[0];
                setSelectedProcess(currentProcess);
            }
        }
    }, [settings]);

    const generateProcesses = () => {
        const processes = [];
        
        if (!settings?.academic_year || !settings?.year_number) {
            return processes;
        }
        
        try {
            const academicStart = parseInt(settings.academic_year.split("-")[0], 10);
            const yearNumber = settings.year_number;

            const processStart = academicStart - (yearNumber - 1);
            const processEnd = processStart + 3;

            processes.push(`${processStart}-${processEnd} (Current)`);

            for (let i = 1; i <= 2; i++) {
                const prevStart = processStart - 3 * i;
                const prevEnd = prevStart + 3;
                processes.push(`${prevStart}-${prevEnd}`);
            }

            return processes;
        } catch (error) {
            console.error("Error generating processes:", error);
            return processes;
        }
    };

    const getAcademicYearsForProcess = () => {
        if (!selectedProcess) return [];

        const match = selectedProcess.match(/(\d{4})-(\d{4})/);
        if (!match) return [];

        const startYear = parseInt(match[1]);
        return [
            `${startYear}-${startYear + 1}`,
            `${startYear + 1}-${startYear + 2}`,
            `${startYear + 2}-${startYear + 3}`
        ];
    };

    const getCurrentYearNumber = () => {
        return settings?.year_number;
    };

    const isCurrentProcess = () => {
        return selectedProcess && selectedProcess.includes("(Current)");
    };

    const isYearEditable = (yearNumber) => {
        return isCurrentProcess() && 
               yearNumber === getCurrentYearNumber() && 
               yearNumber !== 3;
    };

    const fetchAllData = async () => {
        try {
            setIsLoading(true);
            const [coursesRes, soRes, pcRes, usersRes, assignmentsRes] = await Promise.all([
                getCourses(),
                getSOs(),
                getPCs(),
                getStaff(),
                getAssignments()
            ]);

            setCourses(coursesRes.data);
            setSOs(soRes.data);
            setPCs(pcRes.data);
            setUsers(usersRes.data);
            setAssignments(assignmentsRes.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        }
    };

    const getSOsForYear = (yearNumber) => {
        const soIds = YEAR_SO_MAPPING[yearNumber] || [];
        // return SOs.filter(so => soIds.includes(so.id));
            return SOs.filter(so => soIds.includes(parseInt(so.id))); 

    };

    const getAssignmentsForYear = (yearNumber, academicYear) => {
        if (!academicYear) return [];

        return assignments.filter(assignment =>
            assignment.year === yearNumber &&
            assignment.academic_year === academicYear
        );
    };

    const getGroupedAssignments = (yearNumber, academicYear) => {
        const yearAssignments = getAssignmentsForYear(yearNumber, academicYear);
        const soList = getSOsForYear(yearNumber);

        return soList.map(so => {
            const courseAssignments = {};
            yearAssignments
                .filter(a => a.so_id === so.id)
                .forEach(assignment => {
                    const key = `${assignment.course_id}-${assignment.so_id}`;
                    if (!courseAssignments[key]) {
                        courseAssignments[key] = {
                            course_id: assignment.course_id,
                            so_id: assignment.so_id,
                            cmps1: null,  // Byblos
                            cmps2: null,  // Beirut
                            pc_ids: []
                        };
                    }
                    
                    if (assignment.campus === "cmps1") {
                        courseAssignments[key].cmps1 = assignment;
                    } else if (assignment.campus === "cmps2") {
                        courseAssignments[key].cmps2 = assignment;
                    }
                    
                    // Combine PC IDs from both campuses
                    if (assignment.pc_ids) {
                        courseAssignments[key].pc_ids = [
                            ...new Set([...courseAssignments[key].pc_ids, ...assignment.pc_ids])
                        ];
                    }
                });

            // Convert to courseRows format
            const courseRows = Object.values(courseAssignments).map(data => {
                const course = courses.find(c => c.id === data.course_id);
                
                return {
                    course,
                    cmps1Assignment: data.cmps1,  // Byblos
                    cmps2Assignment: data.cmps2,  // Beirut
                    pc_ids: data.pc_ids
                };
            });

            return {
                so,
                courseRows
            };
        });
    };

    const getCoursesBySO = (soId) => {
        if (!soId) return [];
        return courses.filter(course => course.so_ids?.includes(parseInt(soId)));
    };

    const getPCsBySO = (soId) => {
        if (!soId) return [];
        return PCs.filter(pc => pc.so_id === parseInt(soId));
    };

    const filterInstructors = (campusDbName) => {
        // Convert database campus name to frontend display name for filtering
        const frontendCampusName = CAMPUS_MAPPING[campusDbName] || campusDbName;
        
        return users.filter((user) =>
            Array.isArray(user.role) &&
            user.role.includes("instructor") &&
            (
            (user.campus === frontendCampusName || 
             user.campus === "NULL" || 
             !user.campus || 
             user.campus === "")
            )
        );
    };



    const getUserName = (id) => {
        if (!id) return "";
        const user = users.find(u => u.id.toString() === id.toString());
        return user ? `${user.first_name} ${user.last_name}` : "";
    };

    const getCurrentSemesterOptions = () => {
        const academicYears = getAcademicYearsForProcess();
        const academicYear = academicYears[dialogYear - 1];
        if (!academicYear) return [];
        
        const yearPart = academicYear.split("-")[0];
        const currentSemester = settings?.current_semester || "";
        
        // Only enable the current semester if this is the editable year
        const isEditableYear = isYearEditable(dialogYear);
        
        return SEMESTERS.map(sem => {
            const fullSemester = `${sem} ${yearPart}`;
            return {
                value: fullSemester,
                label: fullSemester,
                disabled: isEditableYear ? fullSemester !== currentSemester : true
            };
        });
    };

    const handleFieldChange = (field, value) => {
        const newData = { ...assignmentData, [field]: value };

        if (field === 'so_id') {
            newData.course_id = "";
            newData.pc_ids = [];
        }

        setAssignmentData(newData);
    };

    const handlePCChange = (e) => {
        const selectedPCIds = e.target.value;
        setAssignmentData(prev => ({
            ...prev,
            pc_ids: selectedPCIds
        }));
    };

    const handleAdd = async () => {
        if (!validateForm()) return;

        try {
            const academicYears = getAcademicYearsForProcess();
            const academicYear = academicYears[dialogYear - 1];

            // Create separate assignments for cmps1 (Byblos) and cmps2 (Beirut)
            const assignmentsToSave = [];

            // cmps1 (Byblos) assignment
            if (assignmentData.semester_cmps1 && assignmentData.instructor_id_cmps1) {
                assignmentsToSave.push({
                    course_id: parseInt(assignmentData.course_id),
                    so_id: parseInt(assignmentData.so_id),
                    instructor_id: assignmentData.instructor_id_cmps1 || null,
                    pc_ids: assignmentData.pc_ids.map(id => parseInt(id)),
                    year: dialogYear,
                    academic_year: academicYear,
                    semester: assignmentData.semester_cmps1,
                    campus: "cmps1",  // Byblos
                    created_at: new Date().toISOString()
                });
            }

            // cmps2 (Beirut) assignment
            if (assignmentData.semester_cmps2 && assignmentData.instructor_id_cmps2) {
                assignmentsToSave.push({
                    course_id: parseInt(assignmentData.course_id),
                    so_id: parseInt(assignmentData.so_id),
                    instructor_id: assignmentData.instructor_id_cmps2 || null,
                    pc_ids: assignmentData.pc_ids.map(id => parseInt(id)),
                    year: dialogYear,
                    academic_year: academicYear,
                    semester: assignmentData.semester_cmps2,
                    campus: "cmps2",  // Beirut
                    created_at: new Date().toISOString()
                });
            }

            // Save all assignments
            const savedAssignments = [];
            for (const data of assignmentsToSave) {
                const res = await addAssignment(data);
                savedAssignments.push(res.data);
            }

            setAssignments(prev => [...prev, ...savedAssignments]);
            setOpenDialog(false);
            resetForm();
        } catch (error) {
            console.error("Error creating assignments:", error);
        }
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;

        try {
            const academicYears = getAcademicYearsForProcess();
            const academicYear = academicYears[dialogYear - 1];

            // For update, we need to handle both campuses
            // First, get existing assignments for this course+SO+year
            const existingAssignments = assignments.filter(a => 
                a.course_id === parseInt(assignmentData.course_id) &&
                a.so_id === parseInt(assignmentData.so_id) &&
                a.year === dialogYear &&
                a.academic_year === academicYear
            );

            // Update or create assignments
            const updates = [];

            // cmps1 (Byblos)
            const cmps1Assignment = existingAssignments.find(a => a.campus === "cmps1");
            if (assignmentData.semester_cmps1 && assignmentData.instructor_id_cmps1) {
                const cmps1Data = {
                    course_id: parseInt(assignmentData.course_id),
                    so_id: parseInt(assignmentData.so_id),
                    instructor_id: assignmentData.instructor_id_cmps1 || null,
                    pc_ids: assignmentData.pc_ids.map(id => parseInt(id)),
                    semester: assignmentData.semester_cmps1,
                    campus: "cmps1"
                };
                
                if (cmps1Assignment) {
                    updates.push(updateAssignmentById(cmps1Assignment.id, cmps1Data));
                } else {
                    updates.push(addAssignment({
                        ...cmps1Data,
                        year: dialogYear,
                        academic_year: academicYear,
                        created_at: new Date().toISOString()
                    }));
                }
            } else if (cmps1Assignment) {
                // Delete if no longer needed
                updates.push(deleteAssignmentById(cmps1Assignment.id).then(() => null));
            }

            // cmps2 (Beirut)
            const cmps2Assignment = existingAssignments.find(a => a.campus === "cmps2");
            if (assignmentData.semester_cmps2 && assignmentData.instructor_id_cmps2) {
                const cmps2Data = {
                    course_id: parseInt(assignmentData.course_id),
                    so_id: parseInt(assignmentData.so_id),
                    instructor_id: assignmentData.instructor_id_cmps2 || null,
                    pc_ids: assignmentData.pc_ids.map(id => parseInt(id)),
                    semester: assignmentData.semester_cmps2,
                    campus: "cmps2"
                };
                
                if (cmps2Assignment) {
                    updates.push(updateAssignmentById(cmps2Assignment.id, cmps2Data));
                } else {
                    updates.push(addAssignment({
                        ...cmps2Data,
                        year: dialogYear,
                        academic_year: academicYear,
                        created_at: new Date().toISOString()
                    }));
                }
            } else if (cmps2Assignment) {
                // Delete if no longer needed
                updates.push(deleteAssignmentById(cmps2Assignment.id).then(() => null));
            }

            // Execute all updates
            const results = await Promise.all(updates);
            
            // Refresh data
            fetchAllData();
            
            setOpenDialog(false);
            resetForm();
        } catch (error) {
            console.error("Error updating assignments:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this assignment?")) return;

        try {
            await deleteAssignmentById(id);
            setAssignments(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error("Error deleting assignment:", error);
        }
    };

    const validateForm = () => {
        if (!assignmentData.course_id) return false;
        if (!assignmentData.so_id) return false;
        if (!assignmentData.pc_ids.length) return false;
        
        // At least one campus should have semester and instructor
        const hasCmps1 = assignmentData.semester_cmps1 && assignmentData.instructor_id_cmps1;
        const hasCmps2 = assignmentData.semester_cmps2 && assignmentData.instructor_id_cmps2;
        
        if (!hasCmps1 && !hasCmps2) return false;
        
        return true;
    };

    const resetForm = () => {
        const academicYears = getAcademicYearsForProcess();
        if (!academicYears || academicYears.length === 0) return;
        
        const academicYear = academicYears[dialogYear - 1];
        if (!academicYear) return;

        setAssignmentData({
            ...emptyAssignment,
            year: dialogYear,
            academic_year: academicYear,
            semester_cmps1: "",
            semester_cmps2: ""
        });
        setSelectedId(null);
    };

    const openAddDialog = (so, yearNumber) => {
        // Don't open if not editable
        if (!isYearEditable(yearNumber)) return;
        
        setDialogYear(yearNumber);
        const academicYears = getAcademicYearsForProcess();
        if (!academicYears || academicYears.length === 0) return;
        
        const academicYear = academicYears[yearNumber - 1];
        if (!academicYear) return;

        const semesterOptions = getCurrentSemesterOptions();
        const currentSemester = semesterOptions.find(opt => !opt.disabled)?.value || "";

        setAssignmentData({
            ...emptyAssignment,
            so_id: so.id.toString(),
            year: yearNumber,
            academic_year: academicYear,
            semester_cmps1: currentSemester,
            semester_cmps2: currentSemester,
            pc_ids: []
        });
        setOpenDialog(true);
    };

    const openEditDialog = (cmps1Assignment, cmps2Assignment, yearNumber) => {
        // Don't open if not editable
        if (!isYearEditable(yearNumber)) return;
        
        setDialogYear(yearNumber);
        
        // Get course and SO from either assignment
        const assignment = cmps1Assignment || cmps2Assignment;
        setSelectedId(assignment.id);
        
        const academicYears = getAcademicYearsForProcess();
        if (!academicYears || academicYears.length === 0) return;
        
        const academicYear = academicYears[yearNumber - 1];

        // Combine PC IDs from both assignments
        const allPCIds = [
            ...(cmps1Assignment?.pc_ids || []),
            ...(cmps2Assignment?.pc_ids || [])
        ].map(id => id.toString());
        const uniquePCIds = [...new Set(allPCIds)];

        setAssignmentData({
            course_id: assignment.course_id?.toString() || "",
            so_id: assignment.so_id?.toString() || "",
            year: yearNumber,
            academic_year: academicYear || "",
            semester_cmps1: cmps1Assignment?.semester || "",
            semester_cmps2: cmps2Assignment?.semester || "",
            instructor_id_cmps1: cmps1Assignment?.instructor_id?.toString() || "",
            instructor_id_cmps2: cmps2Assignment?.instructor_id?.toString() || "",
          
            pc_ids: uniquePCIds
        });
        setOpenDialog(true);
    };

    const getPCCodes = (pcIds) => {
        if (!pcIds || !Array.isArray(pcIds)) return "";
        return pcIds.map(id => {
            const pc = PCs.find(p => p.id === parseInt(id));
            return pc ? pc.pc_code : "";
        }).filter(code => code).join(", ");
    };

    if (isLoading) {
        return (
            <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
                <Typography>Loading assignments data...</Typography>
            </Box>
        );
    }

    const academicYears = getAcademicYearsForProcess();
    const currentYearNumber = getCurrentYearNumber();

    if (!selectedProcess && availableProcesses.length > 0) {
        setSelectedProcess(availableProcesses[0]);
    }

    return (
        <Box sx={{ width: "100%" }}>
            {/* Header Section */}
            <Box className="mb-2 rounded-lg">
                <Box className="">
                    <Box className="flex items-center justify-between gap-4 ">

                        
                     
                        
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>View Assignment Tables</InputLabel>
                            <Select
                                value={selectedProcess}
                                onChange={(e) => setSelectedProcess(e.target.value)}
                                label="View Assignment Tables"
                                size="small"
                            >
                                {availableProcesses.map(process => (
                                    <MenuItem key={process} value={process}>
                                        {process}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <button className="bg-(--primary-color) px-3 py-2 text-white rounded-lg hover:bg-(--primary-color-hover) transition-colors duration-500 text-sm"

                        >Send Assignment to Staff</button>
                    </Box>
                    
                   
                </Box>
            </Box>

            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    resetForm();
                }}
                fullWidth
                maxWidth="md"
                PaperProps={{ sx: { borderRadius: "10px" } }}
            >
                <DialogTitle className="text-(--primary-color)">
                    {selectedId ? "Edit Course Assignment" : `Add Course to SO - Year ${dialogYear}`}
                </DialogTitle>
                <DialogContent>
                    <Box className="flex flex-col gap-4 pt-4">
                        {/* SO Display */}
                        <FormControl fullWidth>
                            <TextField
                                label="Student Outcome"
                                value={SOs.find(s => parseInt(s.id) === parseInt(assignmentData.so_id))?.so_code || ""}
                                InputProps={{ readOnly: true }}
                                variant="filled"
                            />
                        </FormControl>

                        {/* Course Selection */}
                        <FormControl fullWidth>
                            <InputLabel id="course-select-label">Course *</InputLabel>
                            <Select
                                labelId="course-select-label"
                                value={assignmentData.course_id || ""}
                                onChange={(e) => handleFieldChange("course_id", e.target.value)}
                                label="Course *"
                            >
                                <MenuItem value="">Select Course</MenuItem>
                                {getCoursesBySO(assignmentData.so_id).map(course => (
                                    <MenuItem key={course.id} value={course.id.toString()}>
                                        {course.course_code}: {course.course_title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* PC Selection */}
                        {assignmentData.so_id && (
                            <FormControl fullWidth>
                                <InputLabel id="pc-select-label">Performance Criteria *</InputLabel>
                                <Select
                                    labelId="pc-select-label"
                                    multiple
                                    value={assignmentData.pc_ids || []}
                                    onChange={handlePCChange}
                                    input={<OutlinedInput label="Performance Criteria *" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((id) => {
                                                const pc = PCs.find(p => p.id === parseInt(id));
                                                return pc ? (
                                                    <Chip key={id} label={pc.pc_code} size="small" />
                                                ) : null;
                                            })}
                                        </Box>
                                    )}
                                >
                                    {getPCsBySO(assignmentData.so_id).map(pc => (
                                        <MenuItem key={pc.id} value={pc.id.toString()}>
                                            {pc.pc_code}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>
                                    Select Performance Criteria for {SOs.find(s => s.id === parseInt(assignmentData.so_id))?.so_code}
                                </FormHelperText>
                            </FormControl>
                        )}

                        {/* cmps1 (Byblos) Section */}
                        <Box className="border p-4 rounded-lg">
                            <Typography variant="h6" className="mb-3 pb-5">Byblos Campus</Typography>
                            <Box className="grid grid-cols-3 gap-4">
                                <FormControl fullWidth>
                                    <InputLabel id="semester-cmps1-label">Semester (Byblos)</InputLabel>
                                    <Select
                                        labelId="semester-cmps1-label"
                                        value={assignmentData.semester_cmps1 || ""}
                                        onChange={(e) => handleFieldChange("semester_cmps1", e.target.value)}
                                        label="Semester (Byblos)"
                                    >
                                        <MenuItem value="">Select Semester</MenuItem>
                                        {getCurrentSemesterOptions().map(option => (
                                            <MenuItem 
                                                key={option.value} 
                                                value={option.value}
                                                disabled={option.disabled}
                                            >
                                                {option.label} {option.disabled ? "(Not Current)" : ""}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel id="instructor-cmps1-label">Instructor (Byblos)</InputLabel>
                                    <Select
                                        labelId="instructor-cmps1-label"
                                        value={assignmentData.instructor_id_cmps1 || ""}
                                        onChange={(e) => handleFieldChange("instructor_id_cmps1", e.target.value)}
                                        label="Instructor (Byblos)"
                                    >
                                        <MenuItem value="">Select Instructor</MenuItem>
                                        {filterInstructors("cmps1").map(user => (
                                            <MenuItem key={user.id} value={user.id.toString()}>
                                                {user.first_name} {user.last_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                
                            </Box>
                        </Box>

                        {/* cmps2 (Beirut) Section */}
                        <Box className="border p-4 rounded-lg">
                            <Typography variant="h6" className="mb-3 pb-5">Beirut Campus</Typography>
                            <Box className="grid grid-cols-3 gap-4">
                                <FormControl fullWidth>
                                    <InputLabel id="semester-cmps2-label">Semester (Beirut)</InputLabel>
                                    <Select
                                        labelId="semester-cmps2-label"
                                        value={assignmentData.semester_cmps2 || ""}
                                        onChange={(e) => handleFieldChange("semester_cmps2", e.target.value)}
                                        label="Semester (Beirut)"
                                    >
                                        <MenuItem value="">Select Semester</MenuItem>
                                        {getCurrentSemesterOptions().map(option => (
                                            <MenuItem 
                                                key={option.value} 
                                                value={option.value}
                                                disabled={option.disabled}
                                            >
                                                {option.label} {option.disabled ? "(Not Current)" : ""}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel id="instructor-cmps2-label">Instructor (Beirut)</InputLabel>
                                    <Select
                                        labelId="instructor-cmps2-label"
                                        value={assignmentData.instructor_id_cmps2 || ""}
                                        onChange={(e) => handleFieldChange("instructor_id_cmps2", e.target.value)}
                                        label="Instructor (Beirut)"
                                    >
                                        <MenuItem value="">Select Instructor</MenuItem>
                                        {filterInstructors("cmps2").map(user => (
                                            <MenuItem key={user.id} value={user.id.toString()}>
                                                {user.first_name} {user.last_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                
                            </Box>
                        </Box>

                        <Typography variant="body2" color="textSecondary">
                            Note: For the current year, only the current semester ({settings?.current_semester}) is available. Other semesters are disabled.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                  
                    <button
            className="border border-gray-400 p-1 rounded w-16"
            onClick={() => {
                            setOpenDialog(false);
                            resetForm();
                        }}
          >
            Cancel
          </button>
                    <button
                        onClick={selectedId ? handleUpdate : handleAdd}
className="bg-(--primary-color) text-white p-1 rounded w-16"                    >
                        {selectedId ? "Update" : "Add"}
                    </button>
                </DialogActions>
            </Dialog>

            {/* Display all 3 years in sequence */}
            {[1, 2, 3].map(yearNumber => {
                const academicYear = academicYears[yearNumber - 1];
                const isEditable = isYearEditable(yearNumber);
                const groupedAssignments = getGroupedAssignments(yearNumber, academicYear);

                if (!academicYear) return null;

                return (
                    <Box key={`year-${yearNumber}`} className="mb-8">
                        {/* Year Header */}
                        <Box className={`p-3 rounded-lg  ${yearNumber === 3 ? 'bg-yellow-50' : isEditable ? 'bg-(--primary-color) text-white' : 'bg-(--secondary-color)'}`}>
                            <Box className="flex items-center justify-between">
                                <Typography variant="h6" className={yearNumber === 3 ? 'text-yellow-800' : ''}>
                                    Year {yearNumber}: {academicYear}
                                </Typography>

                                {yearNumber === 3 && (
                                    <Box className="flex items-center gap-1 text-black">
                                        <InsightsIcon fontSize="small" />
                                        <Typography variant="body2">Analysis Period</Typography>
                                    </Box>
                                )}

                                {!isCurrentProcess() && yearNumber !== 3 && (
                                    <Box className="flex items-center gap-1 text-black">
                                        <LockIcon fontSize="small" />
                                        <Typography variant="body2">View Only</Typography>
                                    </Box>
                                )}

                                {isCurrentProcess() && !isEditable && yearNumber !== 3 && (
                                    <Box className="flex items-center gap-1 text-black">
                                        <LockIcon fontSize="small" />
                                        <Typography variant="body2">View Only</Typography>
                                    </Box>
                                )}

                                {isEditable && (
                                    <Box className="flex items-center gap-1 text-white">
                                        <LockOpenIcon fontSize="small" />
                                        <Typography variant="body2">Editable</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* Year 3 Analysis Message */}
                        {yearNumber === 3 ? (
                            <Box className="p-2 text-start rounded bg-white">
                                <Typography variant="body2" color="textSecondary">
                                   Analyze data collected during the assessment cycle, including data collected from the program's constituencies. Recommend possible changes to the department. Review and refine courses and or the program.

                                </Typography>
                            </Box>
                        ) : (
                            /* Years 1-2 Table */
                            <Box sx={{ width: '100%' }}>
                                <TableContainer>
                                    <Table sx={{ width: '100%' }}>
                                        <TableHead>
                                            <TableRow className="bg-gray-100">
                                                <TableCell rowSpan={2} sx={{ 
                                                    width: '15%', 
                                                    borderRight: '1px solid #e0e0e0',
                                                    p: 1
                                                }}>
                                                    Outcomes
                                                </TableCell>
                                                <TableCell rowSpan={2} sx={{ 
                                                    width: '10%', 
                                                    borderRight: '1px solid #e0e0e0',
                                                    p: 1
                                                }}>
                                                    Course
                                                </TableCell>
                                                <TableCell rowSpan={2} sx={{ 
                                                    width: '12%', 
                                                    borderRight: '1px solid #e0e0e0',
                                                    p: 1
                                                }}>
                                                    PCs
                                                </TableCell>
                                                <TableCell colSpan={2} align="center" sx={{ 
                                                    width: '36%', 
                                                    borderRight: '1px solid #e0e0e0',
                                                    p: 1
                                                }}>
                                                    Byblos 
                                                </TableCell>
                                                <TableCell colSpan={2} align="center" sx={{ 
                                                    width: '36%',
                                                    p: 1
                                                }}>
                                                    Beirut 
                                                </TableCell>
                                                {isEditable && (
                                                    <TableCell rowSpan={2} sx={{ 
                                                        width: '7%',
                                                        p: 1
                                                    }}>Actions</TableCell>
                                                )}
                                            </TableRow>
                                            <TableRow className="bg-gray-100">
                                                <TableCell sx={{ 
                                                    borderRight: '1px solid #e0e0e0',
                                                    p: 1,
                                                    fontSize: '0.75rem'
                                                }}>Semester</TableCell>
                                                <TableCell sx={{ 
                                                    borderRight: '1px solid #e0e0e0',
                                                    p: 1,
                                                    fontSize: '0.75rem'
                                                }}>Instructor</TableCell>
                                                
                                                <TableCell sx={{ p: 1, fontSize: '0.75rem' }}>Semester</TableCell>
                                                <TableCell sx={{ p: 1, fontSize: '0.75rem' }}>Instructor</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {groupedAssignments.map((group) => (
                                                <React.Fragment key={`${yearNumber}-${group.so.id}`}>
                                                    {/* SO Header Row */}
                                                    <TableRow className="bg-gray-200">
                                                        <TableCell colSpan={isEditable ? 10 : 9}>
                                                            <Box className="flex items-center justify-between">
                                                                <Typography variant="subtitle1" className="font-semibold" sx={{ fontSize: '0.875rem' }}>
                                                                    {group.so.so_code}: {group.so.definition}
                                                                </Typography>
                                                                {isEditable && (
                                                                    <button
                                                                        className="bg-(--primary-color) px-3 py-1 text-white rounded-lg hover:bg-(--primary-color-hover) transition-colors duration-500 text-sm"
                                                                        onClick={() => openAddDialog(group.so, yearNumber)}
                                                                    >
                                                                        Add Course
                                                                    </button>
                                                                )}
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>

                                                    {/* Course Rows */}
                                                    {group.courseRows.map((row, rowIndex) => (
                                                        <TableRow
                                                            key={`${yearNumber}-${group.so.id}-${row.course?.id || rowIndex}`}
                                                            className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                                        >
                                                            {/* Empty SO cell for subsequent rows */}
                                                            {rowIndex === 0 ? (
                                                                <TableCell rowSpan={group.courseRows.length} sx={{ 
                                                                    borderRight: '1px solid #e0e0e0',
                                                                    p: 1
                                                                }}>
                                                                    {/* Leave empty, SO is in header row */}
                                                                </TableCell>
                                                            ) : null}

                                                            {/* Course Code */}
                                                            <TableCell sx={{ 
                                                                borderRight: '1px solid #e0e0e0',
                                                                p: 1
                                                            }}>
                                                                <Typography variant="body2" className="font-medium" sx={{ fontSize: '0.75rem' }}>
                                                                    {row.course?.course_code || ""}
                                                                </Typography>
                                                            </TableCell>

                                                            {/* PCs Assessed */}
                                                            <TableCell sx={{ 
                                                                borderRight: '1px solid #e0e0e0',
                                                                p: 1
                                                            }}>
                                                                <Box className="flex flex-wrap gap-0.5">
                                                                    {getPCCodes(row.pc_ids || []).split(", ").map((pc, idx) => (
                                                                        pc ? (
                                                                            <Chip
                                                                                key={idx}
                                                                                label={pc}
                                                                                size="small"
                                                                                sx={{ 
                                                                                    fontSize: '0.6rem',
                                                                                    height: '20px',
                                                                                    p: 0.2
                                                                                }}
                                                                            />
                                                                        ) : null
                                                                    ))}
                                                                </Box>
                                                            </TableCell>

                                                            {/* Byblos  Columns */}
                                                            <TableCell sx={{ 
                                                                borderRight: '1px solid #e0e0e0',
                                                                p: 1
                                                            }}>
                                                                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                                                    {row.cmps1Assignment?.semester || ""}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ 
                                                                borderRight: '1px solid #e0e0e0',
                                                                p: 1
                                                            }}>
                                                                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                                                    {getUserName(row.cmps1Assignment?.instructor_id)}
                                                                </Typography>
                                                            </TableCell>
                                                        

                                                            {/* Beirut  Columns */}
                                                            <TableCell sx={{ p: 1 }}>
                                                                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                                                    {row.cmps2Assignment?.semester || ""}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ p: 1 }}>
                                                                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                                                    {getUserName(row.cmps2Assignment?.instructor_id)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ p: 1 }}>
                                                                
                                                            </TableCell>

                                                            {/* Actions (only for editable years) */}
                                                            {isEditable && (
                                                                <TableCell sx={{ p: 1 }}>
                                                                    <Box className="flex gap-0.5">
                                                                        <IconButton
                                                                            size="small"
                                                                            sx={{ p: 0.5 }}
                                                                            onClick={() => openEditDialog(row.cmps1Assignment, row.cmps2Assignment, yearNumber)}
                                                                            title="Edit assignment"
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                        <IconButton
                                                                            size="small"
                                                                            sx={{ p: 0.5 }}
                                                                            onClick={() => {
                                                                                // Delete both assignments
                                                                                if (row.cmps1Assignment) handleDelete(row.cmps1Assignment.id);
                                                                                if (row.cmps2Assignment) handleDelete(row.cmps2Assignment.id);
                                                                            }}
                                                                            title="Delete assignment"
                                                                            color="error"
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Box>
                                                                </TableCell>
                                                            )}
                                                        </TableRow>
                                                    ))}

                                                    {/* Empty state for SO with no courses */}
                                                    {group.courseRows.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={isEditable ? 10 : 9} align="center" className="py-4 bg-white" sx={{ p: 2 }}>
                                                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                                                    No courses assigned
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </React.Fragment>
                                            ))}

                                            {groupedAssignments.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={isEditable ? 10 : 9} align="center" className="py-8" sx={{ p: 2 }}>
                                                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                                                            No assignments found
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
};

export default AssignmentsTable;