import React from "react";
import { useNavigate } from 'react-router-dom'
import Card1 from "../../components/Card1";
import Card2 from "../../components/Card2";
import { useSettings } from "../../context/SettingsContext";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationItem from "../../components/notification/NotificationItem";
import QuickActions from "../../components/QuickActions";

export default function Dashboard() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const currentSemester = settings?.current_semester;
  const { notifications } = useNotifications(currentSemester);

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
          title="Old Forms"
          description="View your old forms."
          iconClass="fa-solid fa-history"
          primaryBtnText="View Old Forms"
          onClick={() => navigate("/instructor/forms#old-forms")}
        />
        <Card2
          title="Have Questions?"
          description="Get in touch with your coordinator."
          iconClass="fa-solid fa-chart-line"
          primaryBtnText="Contact"
          onClick={() => navigate("/instructor/contact")}
        />
      </div>
      <div className="w-full flex flex-col lg:flex-row gap-4 h-[30vh]">
        <div className="flex-1 lg:flex-4 bg-white rounded-lg p-5 overflow-y-auto">
          <div className="flex justify-between items-center">
            <p className="text-(--primary-color) font-bold text-lg mb-4">
              Most Recent Activity
            </p>

            <button onClick={() => navigate("/instructor/notifications")}
              className="cursor-pointer soft-hover bg-white border p-2 border-(--primary-color) text-(--primary-color) rounded-full transition-colors duration-500 text-sm">View All</button>


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
  );
}

