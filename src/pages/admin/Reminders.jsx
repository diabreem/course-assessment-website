import React, { useState } from 'react';
import { Switch } from '@mui/material';

const Reminders = () => {
    const [schedule, setSchedule] = useState({
        startOfSemester: true,
        midSemester: true,
        fifteenDaysBeforeEnd: true,
        weeklyReminders: false,
    });

    const toggleSchedule = (key) => {
        setSchedule((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className='pb-5'>
            <p className='text-[var(--primary-color)] text-3xl font-semibold'>Reminders</p>
            <p className="text-[var(--primary-color)] text-md pb-5">
                Configure automated reminders for instructors to complete their forms.
            </p>

            <div className='flex flex-row gap-5'>
                {/* Semester Dates Section */}
                <div className='flex-1 bg-white p-3 rounded'>
                    <p className="text-[var(--primary-color)] text-xl font-semibold">
                        <i className="fa-regular fa-calendar pr-2 text-[var(--primary-color)] text-xl"></i>
                        Semester Dates
                    </p>
                    <p className='pb-4'>Set the start and end dates for the semester to schedule reminders accordingly.</p>

                    <div className='flex flex-col pb-3'>
                        <label htmlFor="startDate" className='text-[var(--primary-color)] font-semibold'>Semester Start Date:</label>
                        <input type="date" id='startDate' className='bg-gray-100 border border-gray-200 rounded w-50 p-2' />
                    </div>

                    <div className='flex flex-col pb-3'>
                        <label htmlFor="endDate" className='text-[var(--primary-color)] font-semibold'>Semester End Date:</label>
                        <input type="date" id='endDate' className='bg-gray-100 border border-gray-200 rounded w-50 p-2' />
                    </div>

                    <div className='flex justify-center'>
                        <button className='bg-[var(--primary-color)] text-white rounded-lg mt-3 p-2 w-full'>Set Semester Dates</button>
                    </div>
                </div>

                {/* Automated Reminders Section */}
                <div className='flex-1 bg-white p-3 rounded'>
                    <p className="text-[var(--primary-color)] text-xl font-semibold">
                        <i className="fa-regular fa-clock pr-2 text-[var(--primary-color)] text-xl"></i>
                        Automated Reminders
                    </p>
                    <p className='pb-4'>Configure when automatic notifications should be sent.</p>

                    {[
                        { label: "Start of Semester", key: "startOfSemester" },
                        { label: "Mid-Semester", key: "midSemester" },
                        { label: "15 Days Before End", key: "fifteenDaysBeforeEnd" },
                        { label: "Weekly Reminders", key: "weeklyReminders" },
                    ].map((item) => (
                        <div key={item.key} className='flex justify-between items-center mb-2 border-b border-gray-300 last:border-0 pb-2'
                        >
                            <span className='text-[var(--primary-color)]'>{item.label}</span>
                            <Switch
                                checked={schedule[item.key]}
                                onChange={() => toggleSchedule(item.key)}
                                sx={{
                                    '& .MuiSwitch-thumb': { backgroundColor: 'var(--primary-color)' },
                                    '& .Mui-checked': { color: 'var(--primary-color)' },
                                    '& .Mui-checked + .MuiSwitch-track': { backgroundColor: 'rgba(0,0,0,0.2)' },
                                }}
                            />


                        </div>
                    ))}

                </div>
            </div>

            <div className='bg-white p-3 rounded mt-5 w-full'>
            <p className="text-[var(--primary-color)] text-xl font-semibold flex items-center">
                <i className="fa-regular fa-bell pr-2 text-[var(--primary-color)] text-xl"></i>
                Send Manual Notification
            </p>
            <p className='pb-4'>Send a notification immediately to instructors.</p>
            <div className='flex justify-start'>
                <button className='bg-[var(--primary-color)] text-white rounded-lg p-2'>
                <i className="fa-regular fa-bell pr-2"></i>Send Reminder Now
                </button>
            </div>
            </div>
    <div className='bg-white p-3 rounded mt-5 w-full'>
  <p className="text-[var(--primary-color)] text-xl font-semibold">Notification History</p>
  <p className='pb-4'>View previously sent notifications.</p>

  {[
    { date: "2024-11-01", type: "Start of Semester", status: "sent" },
    { date: "2024-10-15", type: "Mid-Semester Reminder", status: "sent" },
    { date: "2024-09-30", type: "Manual Reminder", status: "sent" },
    { date: undefined, type: undefined, status: undefined }, // example undefined entry
  ].map((n, idx) => (
    <div
      key={idx}
      className='flex justify-between items-center p-3 mb-2 border-b border-gray-300 last:border-0 rounded'
    >
      <div className='flex items-center gap-2'>
        {n?.status === "sent" ? (
          <i className="fa-regular fa-circle-check text-green-500"></i>
        ) : (
          <i className="fa-regular fa-circle-exclamation text-yellow-500"></i>
        )}
        <span className='text-[var(--primary-color)]'>{n?.type || "Undefined"}</span>
      </div>
      <span className='text-gray-500 text-sm'>
        {n?.date ? new Date(n.date).toLocaleDateString() : "Undefined Date"}
      </span>
    </div>
  ))}
</div>

        </div>
    );
};

export default Reminders;
