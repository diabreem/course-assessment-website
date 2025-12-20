import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Switch,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import {
  Notifications,
  Event,
  Send as SendIcon,
  Schedule,
  CheckCircle,
  ErrorOutline,
} from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

const Reminders = () => {
  const [semesterStart, setSemesterStart] = useState(undefined);
  const [semesterEnd, setSemesterEnd] = useState(undefined);
  const [schedule, setSchedule] = useState({
    startOfSemester: true,
    midSemester: true,
    fifteenDaysBeforeEnd: true,
    weeklyReminders: false,
  });
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: undefined,
    severity: "success",
  });

  const notificationHistory = [
    { date: "2024-11-01", type: "Start of Semester", recipients: 8, status: "sent" },
    { date: "2024-10-15", type: "Mid-Semester Reminder", recipients: 5, status: "sent" },
    { date: "2024-09-30", type: "Manual Reminder", recipients: 8, status: "sent" },
    { date: undefined, type: undefined, recipients: undefined, status: undefined }, // Example undefined entry
  ];

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveSettings = () => {
    if (!semesterStart || !semesterEnd) {
      showSnackbar("Please select both semester start and end dates.", "error");
      return;
    }
    if (semesterStart >= semesterEnd) {
      showSnackbar("Semester end date must be after start date.", "error");
      return;
    }
    showSnackbar("Notification schedule has been updated successfully.");
  };

  const toggleSchedule = (key) => {
    setSchedule((prev) => ({ ...prev, [key]: !prev?.[key] }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ minHeight: "100vh", p: 4, bgcolor: "#fafafa" }}>
      <Typography variant="h4" gutterBottom>
        Notifications Management
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        Configure automated reminders for instructors
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 3,
        }}
      >
        <Card>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Event fontSize="small" />
                <Typography>Semester Dates</Typography>
              </Box>
            }
            subheader="Set semester start and end dates"
          />
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Semester Start"
                value={semesterStart || null}
                onChange={setSemesterStart}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DatePicker
                label="Semester End"
                value={semesterEnd || null}
                onChange={setSemesterEnd}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <Button variant="contained" onClick={handleSaveSettings}>
              Save Semester Dates
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Schedule fontSize="small" />
                <Typography>Automated Reminders</Typography>
              </Box>
            }
          />
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { label: "Start of Semester", key: "startOfSemester" },
              { label: "Mid-Semester", key: "midSemester" },
              { label: "15 Days Before End", key: "fifteenDaysBeforeEnd" },
              { label: "Weekly Reminders", key: "weeklyReminders" },
            ].map((item) => (
              <Box
                key={item.key}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography variant="body2">{item.label}</Typography>
                <Switch
                  checked={schedule?.[item.key] || false}
                  onChange={() => toggleSchedule(item.key)}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ mt: 3 }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SendIcon fontSize="small" />
              <Typography>Send Manual Notification</Typography>
            </Box>
          }
        />
        <CardContent>
          <Button
            variant="outlined"
            startIcon={<Notifications />}
            onClick={() => setSendDialogOpen(true)}
          >
            Send Reminder Now
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardHeader title="Notification History" />
        <CardContent>
          {notificationHistory.map((n, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                mb: 1,
                border: "1px solid #ddd",
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {n?.status === "sent" ? (
                  <CheckCircle color="success" />
                ) : (
                  <ErrorOutline color="warning" />
                )}
                <Typography>{n?.type || "Undefined"}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {n?.date ? new Date(n.date).toLocaleDateString() : "Undefined Date"}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar?.open || false}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar?.severity || "info"}
          sx={{ width: "100%" }}
        >
          {snackbar?.message || "Undefined message"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reminders;
