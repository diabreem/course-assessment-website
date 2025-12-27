import React, { useState, useRef, useEffect } from "react";
import profilePic from "../../assets/profile.png";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const Header = ({ user }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Instructor X submitted the form.",
      date: "2025-01-20T10:30:00Z",
    },
    {
      id: 2,
      message: "Report generated.",
      date: "2025-01-19T18:45:00Z",
    }
  ]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full">
      <div className="flex lg:justify-between items-center justify-center sm:gap-5">
        <div className="hidden md:flex">
          <p className="text-xl">
            Hello,
            <span className="text-xl text-(--primary-color) font-bold pl-1">
              {user?.name || "User"}!
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 bg-white rounded-full px-2 py-1 hover:bg-gray-300 hover:transition-colors hover:duration-500"
            onClick={handleOpen}
          >
            <i className="fa-solid fa-bell text-sm"></i>
            Notifications
          </button>

          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src={profilePic}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              <div className="flex flex-col text-sm">
                <span className="font-semibold">Admin</span>
                <span className="text-gray-500 text-xs truncate">
                  {user?.email || "email@lau.edu.lb"}
                </span>
              </div>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                <ul>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                    onClick={() => navigate("/logout")}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        hideBackdrop
        PaperProps={{
          className: "h-screen w-full sm:w-[380px] rounded-none ml-auto",
        }}
        sx={{
          "& .MuiDialog-container": {
            justifyContent: "flex-end",
            alignItems: "stretch",
          },
        }}
      >
        <DialogTitle className="border-b">Notifications</DialogTitle>

        <DialogContent dividers className="p-4">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-600">No notifications.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {notifications.map((notif) => {
                const dateObj = new Date(notif.date);
                const date = dateObj.toLocaleDateString();
                const time = dateObj.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <li
                    key={notif.id}
                    className={`p-3 rounded border border-gray-300 hover:bg-gray-100 hover:transition-colors hover:duration-500`}
                  >
                    <p className="text-md text-gray-800">{notif.message}</p>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {date} · {time}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </DialogContent>

        <DialogActions className="border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-(--primary-color) text-white rounded hover:bg-(--primary-color-hover) hover: transition-colors hover: duration-500"
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
    </header>
  );
};

export default Header;
