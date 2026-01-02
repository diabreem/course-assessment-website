import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import {
  getNotifications,
  deleteNotification,
  clearNotifications,
} from "../../api/notifications"; 
import { format, formatDistanceToNow, differenceInDays } from "date-fns";

const Notifications = () => {
  const { settings, loadingSettings } = useSettings();
  const currentSemester = settings?.semester;

  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  useEffect(() => {
    if (!currentSemester) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // const res = await getNotifications(currentSemester);
        const res = [
          {
            id: 1,
            text: "Instructor X submitted the form.",
            semester: "Fall 2025",
            date: "2025-12-29 09:00:00",
          },
          {
            id: 2,
            text: "Instructor Y submitted the form.",
            semester: "Fall 2025",
            date: "2025-12-29 12:30:00",
          },

        ];
        setNotifications(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentSemester]);

  // Filter by search & semester
  const filteredNotifications = notifications.filter(
    (n) =>
      n.semester === currentSemester &&
      n.text.toLowerCase().includes(search.toLowerCase())
  );

  // Clear all notifications
  const handleClearAll = async () => {
    try {
      // await clearNotifications(currentSemester);
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete single notification
  const handleDelete = async (id) => {
    try {
      // await deleteNotification(currentSemester, id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const diffDays = differenceInDays(new Date(), date);
    if (diffDays > 7) return format(date, "MMMM dd, yyyy");
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (loadingSettings) return <p>Loading...</p>;

  return (
    <div>
      <div className="pb-4 flex flex-col gap-3">
        <p className="text-(--primary-color) text-3xl font-bold">Notifications</p>
        <p className="text-md">View notifications for the current semester.</p>
      </div>

      <div className="bg-white p-4 rounded">

        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <TextField
            label="Search for an instructor"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              my: 2,}}
          />

          <button
            onClick={handleClearAll}
            className="px-4 py-2 text-sm rounded border text-red-600 hover:bg-red-50"
          >
            Clear all
          </button>
        </div>

        <div className="bg-white rounded-xl divide-y divide-gray-300">
          {loading && (
            <p className="p-4 text-sm text-gray-500">Loading notifications...</p>
          )}

          {!loading && filteredNotifications.length === 0 && (
            <p className="p-4 text-sm text-gray-500">
              No notifications for this semester.
            </p>
          )}

          {!loading &&
            filteredNotifications.map((n) => (
              <div key={n.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p>{n.text}</p>
                    <p className="text-sm text-gray-500">{formatDate(n.date)}</p>
                  </div>
                  <button onClick={() => handleDelete(n.id)}>
                    <i className="fa-solid fa-trash text-red-500"></i>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
