import React from 'react'
import Card1 from '../../components/Card1'
import RecentSubmissionsTable from '../../components/coordinator/RecentSubmissionsTable'

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
  { id: 1, text: 'John Due submitted the form.', date: "2025-12-20T21:25:00" },
  { id: 2, text: 'Alex opened form A.', date: "2025-12-18T10:30:00" }

];

const Dashboard = () => {
  return (
    <div>
      <div className='pb-5'>
        <p className='text-[var(--primary-color)] text-3xl font-bold'>Dashboard</p>
        <p className="text-[var(--primary-color)] text-md">Here's an overview of your system.
        </p>
      </div>

      <div className="w-full flex flex-wrap justify-between py-4 gap-2">
        <Card1
          title="Form Submissions"
          number={24}
          icon="fa-solid fa-file"
          shadow={true}
          bgColor="bg-[var(--primary-color)]"
          textColor="text-white"
        />
        <Card1
          title="Pending Submissions"
          number={10}
          icon="fa-solid fa-users"
          shadow={false}
        />
        <Card1
          title="Tracked Improvements"
          number={10}
          icon="fa-solid fa-check"
          shadow={false}
        />
        <Card1
          title="Untracked Improvements"
          number={10}
          icon="fa-solid fa-x"
          shadow={false}
        />

      </div>

      <div className='flex w-full bg-white rounded p-5'>
        <RecentSubmissionsTable />
              
      </div>

            <div className="w-full flex flex-col lg:flex-row gap-4 mt-5">
              <div className="flex-1 lg:flex-4 bg-white rounded-lg p-5 h-70 overflow-y-scroll">
                <div className='flex justify-between '>
                  <p className="text-[var(--primary-color)] font-bold text-lg mb-4">Recent Activity</p>
                  <button className='text-[var(--primary-color)]  text-xs lg:text-sm lg:border flex flex-row items-center  lg:rounded-full lg:px-1'>More Notifications<i className="fa-solid fa-angle-right pl-2 text-sm"></i></button></div>
                <div className='mt-4'>
                  <NotificationHistory data={notifications} />
                </div>
              </div>
      
              <div className="flex-1 lg:flex-2 flex flex-col gap-4">
                {/* Box 1*/}
                <div className="action-card group">
                  <button className="action-btn">
                    <span className="action-left">
                      <i className="fa-solid fa-gear"></i>
                      Settings
                    </span>
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                  <span className="action-hover"></span>
                </div>
      
      
                {/* Box 2*/}
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
      
                {/* Box 4*/}
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
      
      
              </div>
              </div>


    </div>
  )
}

export default Dashboard
