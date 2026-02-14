import React, { useEffect, useState } from 'react'
import FormCompletionChart from '../../components/admin/FormCompletionChart'
import RemindersGraph from '../../components/admin/RemindersGraph'
import Card1 from '../../components/Card1'
import Card2 from '../../components/Card2'
import SemesterCountdown from '../../components/SemesterCountdown'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { differenceInDays, format, formatDistanceToNow } from 'date-fns'
import { getNotificationsBySemester } from '../../api/notifications'
import { getTotalRemindersSent } from '../../api/reminders'
import { getTotalForms } from '../../api/forms'

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
      {data.reverse().map(item => (
        <NotificationRow key={item.id} item={item} />
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [notifications, setNotifications] = useState([]);
  const [reminders, setReminders] = useState(0);
  const [forms, setForms] = useState(0);
  const { settings } = useSettings();
  const navigate = useNavigate();

   const chartData = [
    { value: 1, label: 'Submitted', labelMarkType: 'square', color: 'var(--primary-color)' },
    { value: 2, label: 'In Progress', labelMarkType: 'square', color: 'var(--secondary-color)' },
    { value: 3, label: 'Unopened', labelMarkType: 'square', color: 'gray' },
  ];


  const currentSemester = settings?.current_semester;
  const currentYear = settings?.year_number;

  useEffect(() => {
    const fetchTotalReminders = async () => {
      try {
        const res = await getTotalRemindersSent();
        setReminders(res.data.total_sent);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTotalReminders();
  }, []);

    useEffect(() => {
    const fetchTotalForms = async () => {
      try {
        const res = await getTotalForms();
        setForms(res.data.total_forms);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTotalForms();
  }, []);


  useEffect(() => {
    if (!settings) return;

    const fetchNotifications = async () => {
      try {
        const res = await getNotificationsBySemester(settings.current_semester);
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, [settings]);


  if (!settings) return <p>Loading...</p>

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
          text2={forms}
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
          text2={reminders}
          icon="fa-solid fa-bell"
        />
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-4">
        <div className="flex-1 lg:flex-2 bg-white rounded-lg w-full min-w-0">
          <RemindersGraph />
        </div>

        <div className="flex-1 lg:flex-2 bg-white rounded-lg w-full min-w-0">
          <FormCompletionChart data={chartData} />
        </div>
      </div>

      <div className="cards flex flex-wrap justify-between py-4 gap-3">
        <Card2
          title="Help"
          description="Get help with the system."
          iconClass="fa-solid fa-info"
          primaryBtnText="View Steps"
          onClick={() => navigate("/admin/help")}
        />
        <Card2
          title="Courses"
          description="Add courses and their SOs."
          iconClass="fa-solid fa-book"
          primaryBtnText="Add"
          onClick={() => navigate("/admin/courses")}
        />
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

        <Card2
          title="Forms"
          description="View and manage forms."
          iconClass="fa-solid fa-book"
          primaryBtnText="View"
          onClick={() => navigate("/admin/forms")}
        />
        <Card2
          title="Templates"
          description="Manage template and versions."
          iconClass="fa-solid fa-edit"
          primaryBtnText="Manage"
          onClick={() => navigate("/admin/forms")}
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


        <div className="flex-1 lg:flex-2 flex flex-col gap-4 h-[30vh]">
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


            {/* <div className="flex-1">
              <SemesterCountdown />
            </div> */}
          </div>

        </div>


      </div>
    </div>
  )
}
