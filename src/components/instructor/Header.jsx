import React, { useState, useRef, useEffect } from "react";
import profilePic from "../../assets/profile.png";
import { useNavigate } from "react-router-dom";

const Header = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();


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
          <p className="text-md md:text-xl">
            Hello,
            <span className="text-(--primary-color) font-bold text-md md:text-xl pl-1">
              {user?.name || "User"}!
            </span>
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <button className="flex  cursor-pointer gap-2">
            <i className="fa-solid fa-bell text-sm"></i>
            <span className="hidden md:inline text-sm ">Notifications</span>
          </button>


          {/* ACCOUNT */}
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
                <span className="font-semibold text-sm">Admin</span>
                <span className="text-gray-500 text-xs truncate">
                  {user?.email || "email@lau.edu.lb"}
                </span>
              </div>
            </div>

            {/* DROPDOWN */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                <ul className="flex flex-col">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                    onClick={()=>navigate("/logout")}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
