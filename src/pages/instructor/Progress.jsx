
import React, { useEffect, useState } from 'react'
import InstructorFormCompletionOverview from '../../components/instructor/InstructorFormCompletionOverview'
import CoursePerformanceGraph from '../../components/instructor/CoursePerformanceGraph';
import Card1 from '../../components/Card1'
import Card2 from '../../components/Card2'
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

 export function Progress() {
  const [forms, setForms] = useState([]);
  const [submittedForms, setSubmittedForms] = useState(0);
  const [pendingForms, setPendingForms] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const { settings, loading } = useSettings();
  const navigate = useNavigate();

  
  const currentSemester = settings?.current_semester;
  const currentYear = settings?.year_number;

  // Fetch notifications
  useEffect(() => {
    if (!currentSemester) return; // Don't fetch if no semester available
    
    const fetchNotifications = async () => {
      setNotificationsLoading(true);
      try {
        const res = [
          {
            id: 1,
            text: "CSC243 FCAR has been uploaded.",
            semester: "Fall 2025",
            date: "2025-12-29 09:00:00",
          },
          {
            id: 2,
            text: "Please fill your forms before the deadline.",
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

  useEffect(() => {
    const fetchFormsData = async () => {
      // Mock data (replace later with API)
      const response = [
        { id: 1, status: "submitted" },
        { id: 2, status: "submitted" },
        { id: 3, status: "pending" },
        { id: 4, status: "pending" },
        { id: 5, status: "pending" },
      ];
  
      setForms(response);
    };
  
    fetchFormsData();
  }, []);

  useEffect(() => {
    if (!forms.length) return;
  
    const submitted = forms.filter(f => f.status === "submitted").length;
    const pending = forms.filter(f => f.status === "pending").length;
    const total = forms.length;
  
    setSubmittedForms(submitted);
    setPendingForms(pending);
    setProgressPercentage(Math.round((submitted / total) * 100));
  }, [forms]);


  // Check for loading/settings after all hooks
  if (!settings || loading) return <p>Loading...</p>

  return (

    <div>
      <div className='pb-4 flex flex-col gap-3'>
        <p className='text-(--primary-color) text-3xl font-bold'>Progress Reports</p>
        <p className="text-md">Track your form submissions and performance.
        </p>
      </div>

      <div className="w-full flex flex-wrap justify-between py-4 gap-2">
        <Card1
          text1="Overall Progress"
          text2={`${progressPercentage}%`}
          text1Color="text-white"
          text2Color="text-white"
          iconColor="text-white"
          icon="fa-solid fa-chart-line"
          bgColor="bg-(--primary-color)"
          shadow={true}
        />
        <Card1
          text1="Submitted Forms"
          text2={submittedForms}
          icon="fa-solid fa-check"
        />
        <Card1
          text1="Pending Forms"
          text2={pendingForms}
          icon="fa-solid fa-clock"
        />
        <Card1
          text1="Courses"
          text2="3"
          icon="fa-solid fa-book"
        />
      </div>

       <div className="w-full flex flex-col lg:flex-row gap-4">
        <div className="flex-1 lg:flex-3 bg-white rounded-lg w-full min-w-0">
          <CoursePerformanceGraph />
        </div>

        <div className="flex-1 lg:flex-2 bg-white rounded-lg w-full min-w-0">
          <InstructorFormCompletionOverview />
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-4 mt-4">
        <div className="flex-1 lg:flex-4 bg-white rounded-lg p-5 h-[40vh] overflow-y-auto">
          <div className="flex justify-between items-center">
            <p className="text-(--primary-color) font-bold text-lg mb-4">
              Recent Submissions
            </p>

          </div>

          <div className="mt-4">
            <NotificationHistory data={notifications} />
          </div>
        </div>


        <div className="flex-1 lg:flex-2 flex flex-col gap-4 h-[40vh] justify-start">
          <div className="flex-1 lg:flex-2 flex flex-col gap-4">
            {/* Box 1 */}
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
                <i className="fa-solid fa-user"></i>
              </button>
              <span className="action-hover"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Progress