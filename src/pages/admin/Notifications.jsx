import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import {
  getNotificationsBySemester,
  deleteNotification,
} from "../../api/notifications";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";

const Notifications = () => {
  const { settings } = useSettings();
  const currentSemester = settings?.current_semester;

  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch notifications
  useEffect(() => {
    if (!currentSemester) return;

    const fetchNotifications = async () => {
      try {
        const res = await getNotificationsBySemester(currentSemester);
        setNotifications(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, [currentSemester]);

  // Filter by search & semester

  
const handleDelete = async (id) => {
  console.log('Attempting to delete notification with id:', id); // Add this
  try {
    await deleteNotification(id);
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
              my: 2,
            }}
          />

        
        </div>

        <div className="bg-white rounded-xl divide-y divide-gray-300">
          

          { notifications.length === 0 && (
            <p className="p-4 text-sm text-gray-500">
              No notifications for this semester.
            </p>
          )}

          {
            notifications.reverse().map((n) => (
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
