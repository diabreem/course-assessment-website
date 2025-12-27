import React from 'react'
import FormCompletionChart from '../../components/admin/FormCompletionChart'
import RemindersGraph from '../../components/admin/RemindersGraph'
import Card1 from '../../components/Card1'
import Card2 from '../../components/Card2'
import SemesterCountdown from '../../components/SemesterCountdown'

export function NotificationRow({ item }) {
  const diffMs = Date.now() - new Date(item.date).getTime();

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30); // approximate
  const diffYears = Math.floor(diffDays / 365); // approximate

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
    <div className="flex flex-row border rounded-lg border-gray-300 p-2 mb-2 justify-between hover:bg-gray-100 hover:transition-colors hover:duration-500">
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
  { id: 1, text: 'John Due submitted the form.', date: "2025-12-20T21:25:00" },
  { id: 2, text: 'Alex opened form A.', date: "2025-12-18T10:30:00" },
  { id: 3, text: 'Form A was assigned to Alex.', date: "2025-12-10T12:15:00" }
];

export default function Dashboard() {
  return (

    <div>
      <div className='pb-4 flex flex-col gap-3'>
        <p className='text-(--primary-color) text-3xl font-bold'>Dashboard</p>
        <p className="text-md">Here's an overview of your system for the current semester.
        </p>
      </div>

      <div className="w-full flex flex-wrap justify-between py-4 gap-2">
        <Card1
          text1="Total Forms"
          text2="20"
          text1Color="text-white"
          text2Color="text-white"
          iconColor="text-white"
          icon="fa-solid fa-file"
          bgColor="bg-(--primary-color)"
          shadow={true}
        />
        <Card1
          text1="Current Semester"
          text2="Fall 2024"
          icon="fa-solid fa-clock"
        />
        <Card1
          text1="Current Year"
          text2="Year 1"
          icon="fa-solid fa-clock"
        />
        <Card1
          text1="Total Reminders"
          text2="20"
          icon="fa-solid fa-bell"
        />
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-4">
        <div className="flex-1 lg:flex-3 bg-white rounded-lg w-full min-w-0">
          <RemindersGraph />
        </div>

        <div className="flex-1 lg:flex-2 bg-white rounded-lg w-full min-w-0">
          <FormCompletionChart />
        </div>
      </div>

      <div className="cards flex flex-wrap justify-between py-4">
        <Card2
          title="Setup & Assignment"
          description="Assign instructors and coordinators."
          iconClass="fa-regular fa-user"
          primaryBtnText="Assign"
          secondaryBtnText="View"
        />
        <Card2
          title="Manage Reports"
          description="Generate and view reports."
          iconClass="fa-solid fa-chart-bar"
          primaryBtnText="Generate"
          secondaryBtnText="View"
        />

        <Card2
          title="Manage Reminders"
          description="Set up and view reminders."
          iconClass="fa-solid fa-bell"
          primaryBtnText="Set Up"
          secondaryBtnText="View"
        />
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-4">
        <div className="flex-1 lg:flex-4 bg-white rounded-lg p-5 h-[40vh] overflow-y-auto">
          <div className="flex justify-between items-center">
            <p className="text-(--primary-color) font-bold text-lg mb-4">
              Most Recent Activity
            </p>


          </div>

          <div className="mt-4">
            <NotificationHistory data={notifications} />
          </div>
        </div>


        <div className="flex-1 lg:flex-2 flex flex-col gap-4 h-[40vh]">
          <div className="flex-1 lg:flex-2 flex flex-col gap-4">
            {/* Box 1*/}
            <div className="action-card group">
              <a href="https://www.lau.edu.lb/" target='_blank'>
                <button className="action-btn">
                  <span className="action-left">
                    <i className="fa-solid fa-door-open"></i>
                    Portal
                  </span>
                  <i className="fa-solid fa-angle-right"></i>
                </button>
              </a>
              <span className="action-hover"></span>
            </div>

            <div className="action-card group">
              <a href="https://www.outlook.com" target='_blank'>
                <button className="action-btn">
                  <span className="action-left">
                    <i className="fa-solid fa-envelope"></i>
                    Outlook
                  </span>
                  <i className="fa-solid fa-angle-right"></i>
                </button>
              </a>
              <span className="action-hover"></span>
            </div>

          </div>
          <SemesterCountdown />

        </div>
      </div>
    </div>
  )
}
