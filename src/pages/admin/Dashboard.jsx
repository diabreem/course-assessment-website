import React, { useEffect, useState } from 'react'
import FormCompletionChart from '../../components/admin/FormCompletionChart'
import RemindersGraph from '../../components/admin/RemindersGraph'
import Card1 from '../../components/Card1'
import Card2 from '../../components/Card2'
import SemesterCountdown from '../../components/SemesterCountdown'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { differenceInDays, format, formatDistanceToNow } from 'date-fns'

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const diffDays = differenceInDays(new Date(), date);
  if (diffDays > 7) return format(date, "MMMM dd, yyyy");
  return formatDistanceToNow(date, { addSuffix: true });
}
export function NotificationRow({ item }) {


  return (
    <div className="flex flex-row border rounded-lg border-gray-300 p-2 mb-2 justify-between hover:bg-gray-100 hover:transition-colors hover:duration-500">
      <div className="flex flex-col">
        <p className="text-md">{item.text}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">{formatDate(item.date)}</p>
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

export default function Dashboard() {
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const { settings, loading } = useSettings();
  const navigate = useNavigate();


  const currentSemester = settings?.semester;
  const currentYear = settings?.year;

  // Fetch notifications
  useEffect(() => {
    if (!currentSemester) return; // Don't fetch if no semester available

    const fetchNotifications = async () => {
      setNotificationsLoading(true);
      try {
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
        setNotificationsLoading(false);
      }
    };

    fetchNotifications();
  }, [currentSemester]); // Now using currentSemester which is safely accessed with ?.

  // Check for loading/settings after all hooks
  if (!settings || loading) return <p>Loading...</p>

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
          text2={currentSemester}
          icon="fa-solid fa-clock"
        />
        <Card1
          text1="Current Year"
          text2={currentYear}
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
          title="Staff"
          description="Add and remove staff."
          iconClass="fa-regular fa-user"
          primaryBtnText="Assign"
          onClick={() => navigate("/admin/staff")}
        />
        <Card2
          title="Assignment"
          description="Assign staff to courses."
          iconClass="fa-regular fa-user"
          primaryBtnText="Assign"
          onClick={() => navigate("/admin/assignment")}
        />
        <Card2
          title="Reports"
          description="Generate and view reports."
          iconClass="fa-solid fa-chart-bar"
          primaryBtnText="Generate"
          onClick={() => navigate("/admin/reports")}
        />

        <Card2
          title="Reminders"
          description="Set up and view reminders."
          iconClass="fa-solid fa-bell"
          primaryBtnText="Set Up"
          onClick={() => navigate("/admin/reminders")}
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


        <div className="flex-1 lg:flex-2 flex flex-col gap-4">
          <div className="flex flex-col gap-4 h-full">
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

            <div className="action-card group">
              <button className="action-btn" onClick={() => navigate("/admin/account")}>
                <span className="action-left">
                  <i className="fa-solid fa-door-open"></i>
                  Account
                </span>
                <i className="fa-solid fa-angle-right"></i>
              </button>
              <span className="action-hover"></span>
            </div>


            <div className="flex-1">
              <SemesterCountdown />
            </div>
          </div>

        </div>


      </div>
    </div>
  )
}
