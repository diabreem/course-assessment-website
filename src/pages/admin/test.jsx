import React, { useState } from "react";

/* ================= REMINDER HISTORY ================= */
export function ReminderRow({ item }) {
  const diffMs = Date.now() - new Date(item.date).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const displayTime =
    diffMinutes < 60 ? `${diffMinutes}m ago` :
    diffHours < 24 ? `${diffHours}h ago` :
    `${diffDays}d ago`;

  return (
    <div className="flex justify-between border rounded-lg p-2 mb-2 hover:bg-gray-100">
      <div>
        <p>{item.text}</p>
        <p className="text-sm text-gray-500">{item.recipients} recipients</p>
      </div>
      <p className="text-sm text-gray-500">{displayTime}</p>
    </div>
  );
}

export const ReminderHistory = ({ data }) =>
  data.map(i => <ReminderRow key={i.id} item={i} />);

/* ================= SEND REMINDER + SEMESTER ================= */
const SendReminderAndSemester = ({
  pending,
  semesterStart,
  semesterEnd,
  setStart,
  setEnd,
}) => {
  const handleSendNow = () => {

    alert(`Reminder sent to ${pending} pending instructors!`);
  };

  const handleSaveSemester = () => {
    if (!semesterStart || !semesterEnd) {
      alert("Please set both start and end dates.");
      return;
    }
    if (new Date(semesterEnd) < new Date(semesterStart)) {
      alert("End date cannot be before start date!");
      return;
    }
    alert(`Semester saved from ${semesterStart} to ${semesterEnd}`);
  };

 return (
  <div className="flex flex-col space-y-4 h-full justify-between">
    {/* Quick Action */}
    <div className="bg-white p-4 rounded shadow-card">
      <p className="text-lg font-semibold text-(--primary-color)">Quick Action</p>
      <p className="text-sm text-gray-600 mt-2">{pending} instructors pending! Send a reminder to them.</p>
      <button
        className="mt-4 bg-(--primary-color) text-white py-2 px-4 rounded-lg w-full"
        onClick={handleSendNow}
      >
        <i className="fa-solid fa-paper-plane mr-2"></i> Send Now
      </button>
    </div>

    {/* Semester Dates */}
    <div className="bg-white p-4 rounded shadow-card">
      <p className="text-lg font-semibold text-(--primary-color)">Semester Dates</p>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <label className="text-sm text-gray-600">Start Date</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={semesterStart}
            onChange={e => setStart(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">End Date</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={semesterEnd}
            onChange={e => setEnd(e.target.value)}
          />
        </div>
      </div>
      <button
        className="w-full bg-(--primary-color) text-white py-2 mt-4 rounded-lg"
        onClick={handleSaveSemester}
      >
        Save Semester
      </button>
    </div>
  </div>
);

};

/* ================= AUTOMATIC REMINDERS ================= */
const AutoReminders = ({ semesterSet }) => {
  const [toggles, setToggles] = useState({ first: false, middle: false, end: false });
  const [customPeriod, setCustomPeriod] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [emailsPerDay, setEmailsPerDay] = useState("1");

  const toggleSwitch = key => {
    if (!semesterSet) {
      alert("Please set semester dates before enabling automatic reminders.");
      return;
    }
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-lg shadow-card p-4 h-full flex flex-col justify-between space-y-4">
      <div>
        <p className="text-lg font-semibold text-(--primary-color)">Automatic Reminders</p>

        {[
          ["first", "First Day of Semester"],
          ["middle", "Middle of Semester"],
          ["end", "End of Semester"],
        ].map(([key, label]) => (
          <div key={key} className="flex justify-between items-center border rounded-lg p-3 mt-2">
            <p>{label}</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={toggles[key]}
                onChange={() => toggleSwitch(key)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-(--primary-color) rounded-full peer peer-checked:bg-(--primary-color)"></div>
              <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${toggles[key] ? "translate-x-5" : ""}`} />
            </label>
          </div>
        ))}

        {/* Custom period */}
        <div className="border rounded-lg p-3 mt-3 space-y-2">
          <div className="flex justify-between items-center">
            <p>Custom Period</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={customPeriod}
                onChange={() => {
                  if (!semesterSet) {
                    alert("Please set semester dates before enabling custom period.");
                    return;
                  }
                  setCustomPeriod(!customPeriod);
                }}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-(--primary-color) rounded-full peer peer-checked:bg-(--primary-color)"></div>
              <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${customPeriod ? "translate-x-5" : ""}`} />
            </label>
          </div>

          {customPeriod && (
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={customStart}
                onChange={e => setCustomStart(e.target.value)}
              />
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={customEnd}
                onChange={e => setCustomEnd(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <label className="text-sm text-gray-600">Emails per day</label>
            <select
              className="border rounded p-2"
              value={emailsPerDay}
              onChange={e => setEmailsPerDay(e.target.value)}
              disabled={!customPeriod}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <button
            className="w-full bg-(--primary-color) text-white py-2 rounded-lg mt-2"
            onClick={() => {
             
              if (!semesterSet) {
                alert("Set semester dates first.");
                return;
              }
            // handleSaveSemester();

              alert("Automatic reminders settings saved!");

            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= PAGE ================= */
export default function Reminders() {
  const [semesterStart, setSemesterStart] = useState("");
  const [semesterEnd, setSemesterEnd] = useState("");

  const semesterSet = semesterStart && semesterEnd;

  const mockReminders = [
    { id: 1, text: "Reminder sent for Form A", date: "2025-12-20T21:25:00", recipients: 5 },
    { id: 2, text: "Reminder sent for Form B", date: "2025-12-18T10:30:00", recipients: 3 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <p className="text-3xl font-semibold text-(--primary-color)">Reminders</p>
        <p className="text-(--primary-color)">Configure automated reminders for instructors</p>
      </div>

      {/* ROW 1: Send Reminder + Semester + Automatic Reminders */}
      <div className="grid md:grid-cols-2 gap-4">
        <SendReminderAndSemester
          pending={12}
          semesterStart={semesterStart}
          semesterEnd={semesterEnd}
          setStart={setSemesterStart}
          setEnd={setSemesterEnd}
        />
        <AutoReminders semesterSet={semesterSet} />
      </div>

      {/* ROW 2: Reminder History */}
      <div className="bg-white rounded-lg p-5 h-70 overflow-y-scroll">
        <p className="text-lg font-semibold text-(--primary-color) mb-4">Reminder History</p>
        <ReminderHistory data={mockReminders} />
      </div>
    </div>
  );
}
