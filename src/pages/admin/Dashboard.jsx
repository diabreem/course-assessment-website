import React from 'react'
import FormCompletionChart from '../../components/admin/FormCompletionChart'
import RemindersGraph from '../../components/admin/RemindersGraph'
import Card1 from '../../components/Card1'
import Card2 from '../../components/Card2'

export default function Dashboard() {
  return (

    <div>
      <div className='pb-5'>
        <p className='text-[var(--primary-color)] text-3xl font-bold'>Dashboard</p>
        <p className="text-[var(--primary-color)] text-md">Here's an overview of your system.
        </p>
      </div>

      <div className="w-full flex flex-wrap justify-between py-4 gap-2">
        <Card1
          title="Total Forms"
          number={24}
          icon="fa-solid fa-file"
          shadow={true}
          bgColor="bg-[var(--primary-color)]"
          textColor="text-white"
        />
        <Card1
          title="Current Staff"
          number={10}
          icon="fa-solid fa-users"
          shadow={false}
        />
        <Card1
          title="Total Reminders"
          number={10}
          icon="fa-solid fa-clock"
          shadow={false}
        />
        <Card1
          title="Notifications"
          number={10}
          icon="fa-solid fa-bell"
          shadow={false}
        />
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-4">
        <div className="flex-1 lg:flex-3 bg-white rounded-lg p-4 w-full min-w-0">
          <RemindersGraph />
        </div>

        <div className="flex-1 lg:flex-2 bg-white rounded-lg p-4 w-full min-w-0">
          <FormCompletionChart />
        </div>
      </div>

      <div className="cards flex flex-wrap justify-between py-4">
        <Card2
          title="Manage Forms"
          description="Create, edit, and view forms."
          iconClass="fa-regular fa-file"
          primaryBtnText="Edit Form"
          secondaryBtnText="View Forms"
        />
        <Card2
          title="Manage Instructors"
          description="Add and remove members."
          iconClass="fa-solid fa-users"
          primaryBtnText="Add Instructor"
          secondaryBtnText="View Instructors"
        />

        <Card2
          title="Manage Reports"
          description="Export and view reports."
          iconClass="fa-solid fa-chart-bar"
          primaryBtnText="Generate Report"
          secondaryBtnText="View Reports"
        />

        <Card2
          title="Manage Reminders"
          description="Set up reminders."
          iconClass="fa-solid fa-clock"
          primaryBtnText="Set Up Reminders"
          secondaryBtnText="Manage Reminders"
        />
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-4">
        <div className="flex-1 lg:flex-4 bg-white rounded-lg p-5">
          <div className='flex justify-between'>
            <p className="text-[var(--primary-color)] font-bold text-lg mb-4">Recent Activity</p>
            <button className='text-[var(--primary-color)]  text-xs lg:text-sm lg:border flex flex-row items-center btn1 lg:rounded-full lg:px-1'>More Notifications<i class="fa-solid fa-angle-right pl-2 text-sm"></i></button></div>
          <div className="flex flex-row pb-5">
            <div>
              <i class="fa-regular fa-circle-check text-[var(--primary-color)] pr-1"></i>
            </div>
            <div>
              <p className='text'>John Doe completed form submission</p>
              <p className='text-xs'>2 hours ago</p></div>
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
