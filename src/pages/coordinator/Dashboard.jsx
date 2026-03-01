import React from 'react'
import Card1 from '../../components/Card1'
import RecentSubmissionsTable from '../../components/coordinator/RecentSubmissionsTable'
import { useNavigate } from 'react-router-dom'
import { useSettings } from "../../context/SettingsContext";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationItem from "../../components/notification/NotificationItem";
import QuickActions from '../../components/QuickActions';

const Dashboard = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const currentSemester = settings?.current_semester;
  const { notifications } = useNotifications(currentSemester);

  return (
    <div>
      <div className='pb-5'>
        <p className='text-[var(--primary-color)] text-3xl font-bold'>Dashboard</p>
        <p className="text-[var(--primary-color)] text-md">Here's an overview of your system.
        </p>
      </div>

      <div className="w-full flex flex-wrap justify-between py-4 gap-2">
        <Card1
          text1="Form Submissions"
          text2={24}
          icon="fa-solid fa-file"
          shadow={true}
          bgColor="bg-[var(--primary-color)]"
          text1Color="text-white"
          text2Color="text-white"
          iconColor="text-white"
        />
        <Card1
          text1="My Instructors"
          text2={4}
          icon="fa-solid fa-users"
          shadow={false}
        />
        <Card1
          text1="Tracked Improvements"
          text2={10}
          icon="fa-solid fa-check"
          shadow={false}
        />
        <Card1
          text1="Untracked Improvements"
          text2={10}
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
            <button
              onClick={() => navigate("/coordinator/notifications")}
              className='text-[var(--primary-color)] text-xs lg:text-sm lg:border flex flex-row items-center lg:rounded-full lg:px-1'
            >
              More Notifications
              <i className="fa-solid fa-angle-right pl-2 text-sm"></i>
            </button>
          </div>
          {[...notifications]
            .reverse()
            .slice(0, 5)
            .map((n) => (
              <NotificationItem key={n.id} notification={n} variant="compact" />
            ))}
        </div>

        <div className="flex-1 lg:flex-2 flex flex-col gap-4">
         <QuickActions/>

        </div>
      </div>


    </div>
  )
}

export default Dashboard
