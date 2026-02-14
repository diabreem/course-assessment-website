
import React, { useEffect, useState } from 'react'
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
        <p className='text-(--primary-color) text-3xl font-bold'>Progress</p>
        <p className="text-md">Track the progress of your courses over multiple semesters.
        </p>
      </div>


       <div className="w-full flex flex-col lg:flex-row gap-4">
        <div className="flex-1 lg:flex-3 bg-white rounded-lg w-full min-w-0">
          <CoursePerformanceGraph />
        </div>

       
      </div>


    </div>
  )
}
export default Progress