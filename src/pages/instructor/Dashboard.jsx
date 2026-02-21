import React from "react";
import { useNavigate } from 'react-router-dom'
import Card1 from "../../components/Card1";
import InstructorFormTable from "../../components/instructor/InstructorFormTable";
import Card2 from "../../components/Card2";

export function NotificationRow({ item }) {
  const diffMs = Date.now() - new Date(item.date).getTime();

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  let displayTime;
  if (diffSeconds < 60) {
    displayTime = `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""} ago`;
  } else if (diffMinutes < 60) {
    displayTime = `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    displayTime = `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays < 30) {
    displayTime = `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  } else if (diffMonths < 12) {
    displayTime = `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;
  } else {
    displayTime = `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`;
  }

  return (
    <div className="flex flex-row border rounded-lg border-gray-300 p-2 mb-2 justify-between hover:bg-gray-100">
      <div className="flex flex-col">
        <p className="text-md">{item.text}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">{displayTime}</p>
      </div>
    </div>
  );
}

export function NotificationHistory({ data }) {
  return (
    <div>
      {data.map(item => (
        <NotificationRow key={item.id} item={item} />
      ))}
    </div>
  )
}

const notifications = [
  { id: 1, text: "Form has been assigned", date: "2025-12-20T21:25:00" },
  { id: 2, text: "Don't forget to fill your forms before the deadline!", date: "2025-12-18T10:30:00" }
];

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div>
      {/* HEADER */}
      <div className="pb-4 flex flex-col gap-3">
        <p className="text-(--primary-color) text-3xl font-bold">
          Dashboard
        </p>
        <p className="text-md">
          Welcome back! Manage your assigned forms and view your progress.
        </p>
      </div>

      {/* TOP 4 CARDS */}
      <div className="w-full flex flex-wrap justify-between pt-4 gap-2">
        <Card1
          text1="Assigned Forms"
          text2="12"
          text1Color="text-white"
          text2Color="text-white"
          iconColor="text-white"
          icon="fa-solid fa-file"
          bgColor="bg-[var(--primary-color)]"
          shadow={true}
        />

        <Card1
          text1="Submitted"
          text2="5"
          icon="fa-solid fa-check"
        />

        <Card1
          text1="In Progress"
          text2="4"
          icon="fa-solid fa-clock"
        />

        <Card1
          text1="Not Started"
          text2="3"
          icon="fa-solid fa-hourglass"
        />
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
        <Card2
          title="Help"
          description="Get help with the system."
          iconClass="fa-solid fa-info"
          primaryBtnText="View Steps"
          onClick={() => navigate("/instructor/help")}
        />
        <Card2
          title="Forms"
          description="Manage your assigned forms."
          iconClass="fa-solid fa-file"
          primaryBtnText="View Forms"
          onClick={() => navigate("/instructor/forms")}
        />
        <Card2
          title="Progress"
          description="View your courses' progress"
          iconClass="fa-solid fa-chart-line"
          primaryBtnText="View Progress"
          onClick={() => navigate("/instructor/progress")}
        />
        <Card2
          title="Old Forms"
          description="View your old forms."
          iconClass="fa-solid fa-history"
          primaryBtnText="View Old Forms"
          onClick={() => navigate("/instructor/old-forms")}
        />
      </div>
      <div className="w-full flex flex-col lg:flex-row gap-4 h-[30vh]">
              <div className="flex-1 lg:flex-4 bg-white rounded-lg p-5 overflow-y-auto">
                <div className="flex justify-between items-center">
                  <p className="text-(--primary-color) font-bold text-lg mb-4">
                    Most Recent Activity
                  </p>
      
                  <button onClick={() => navigate("/admin/notifications")}
                  className="cursor-pointer hover:bg-gray-200 hover:transition-colors hover:duration-500 bg-white border p-2 border-(--primary-color) text-(--primary-color) rounded-full transition-colors duration-500 text-sm">View All</button>
      
      
                </div>
      
                <div className="mt-4">
                  <NotificationHistory data={notifications} />
                </div>
              </div>

        <div className="flex-1 lg:flex-2 flex flex-col gap-4">
          <div className="action-card group">
            <button className="action-btn">
              <span className="action-left">
                <i className="fa-solid fa-door-open"></i>
                Portal
              </span>
              <i className="fa-solid fa-angle-right"></i>
            </button>
            <span className="action-hover"></span>
          </div>
          <div className="action-card group">
            <button className="action-btn">
              <span className="action-left">
                <i className="fa-solid fa-envelope"></i>
                Outlook
              </span>
              <i className="fa-solid fa-angle-right"></i>
            </button>
            <span className="action-hover"></span>
          </div>
          <div className="action-card group">
            <button className="action-btn">
              <span className="action-left">
                <i className="fa-solid fa-user"></i>
                Account
              </span>
              <i className="fa-solid fa-angle-right"></i>
            </button>
            <span className="action-hover"></span>
          </div>

          {/* Box 3*/}


          {/* Box 4*/}

        </div>
      </div>
    </div>
  );
}

