import React, { useState } from "react";

/* ================= REMINDER HISTORY ================= */
export function ReminderRow({ item }) {
  const diffMs = Date.now() - new Date(item.date).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const displayTime =
    diffMinutes < 60
      ? `${diffMinutes}m ago`
      : diffHours < 24
        ? `${diffHours}h ago`
        : `${diffDays}d ago`;

  return (
    <div className="flex justify-between border rounded-lg p-2 mb-2 hover:bg-gray-100">
      <div>
        <p>{item.text}</p>
        <p className="text-sm text-gray-500">
          {item.recipients} recipients
        </p>
      </div>
      <p className="text-sm text-gray-500">{displayTime}</p>
    </div>
  );
}

export const ReminderHistory = ({ data }) =>
  data.map(item => <ReminderRow key={item.id} item={item} />);

/* ================= SEND REMINDER CARD ================= */
const SendReminderCard = ({ pending }) => {
  const handleSendNow = () => {
    alert(`Reminder sent to ${pending} pending instructors!`);
  };

  return (
    <div className="bg-white p-4 rounded-lg h-full">
      <div className='flex flex-row items-center gap-2'>
        <div className="bg-[var(--icon-bg)] p-1 rounded">
          <i className="fa-solid fa-bolt"></i>
        </div>
        <p className="text-lg font-semibold text-(--primary-color)">
          Quick Action
        </p>

      </div>
      <p className="text-sm text-gray-600 mt-2">
        {pending} forms pending! Send a reminder to them.
      </p>
      <button
        className="mt-4 bg-(--primary-color) text-white py-2 rounded-lg w-full"
        onClick={handleSendNow}
      >
        Send Now
      </button>
    </div>
  );
};

/* ================= SEMESTER DATES CARD ================= */
const SemesterDatesCard = ({
  semesterStart,
  semesterEnd,
  setStart,
  setEnd,
}) => {
  const handleSaveSemester = () => {
    if (!semesterStart || !semesterEnd) {
      alert("Please set both start and end dates.");
      return;
    }
    if (new Date(semesterEnd) < new Date(semesterStart)) {
      alert("End date cannot be before start date.");
      return;
    }
    alert(`Semester saved from ${semesterStart} to ${semesterEnd}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg h-full">
      <div className='flex flex-row items-center gap-2'>
        <div className="bg-[var(--icon-bg)] p-1 rounded">
          <i className="fa-solid fa-calendar"></i>
        </div>
        <p className="text-lg font-semibold text-(--primary-color)">
          Semester Dates
        </p>

      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>


          <label htmlFor="start">Start: </label>
          <input
            id="start"
            type="date"
            className="border p-2 rounded"
            value={semesterStart}
            onChange={e => setStart(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="end">End: </label>
          <input
            id="end"
            type="date"
            className="border p-2 rounded"
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
  );
};

/* ================= TOGGLE ================= */
const Toggle = ({ enabled, onToggle }) => (
  <div
    onClick={onToggle}
    className={`w-12 h-6 flex items-center rounded-full cursor-pointer transition ${enabled ? "bg-(--primary-color)" : "bg-gray-300"
      }`}
  >
    <div
      className={`w-4 h-4 bg-white rounded-full transition-transform ml-1 ${enabled ? "translate-x-6" : ""
        }`}
    />
  </div>
);

/* ================= AUTOMATIC REMINDERS ================= */
const AutoReminders = ({ semesterSet }) => {
  const [toggles, setToggles] = useState({
    first: false,
    middle: false,
    end: false,
  });

  const [customPeriod, setCustomPeriod] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [emailsPerDay, setEmailsPerDay] = useState("1");

  const toggleHandler = key => {
    if (!semesterSet) {
      alert("Set semester dates first.");
      return;
    }
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = () => {
    if (!semesterSet) {
      alert("Set semester dates first.");
      return;
    }

    if (customPeriod) {
      if (!customStart || !customEnd) {
        alert("Please set both custom start and end dates.");
        return;
      }
      if (new Date(customEnd) < new Date(customStart)) {
        alert("Custom end date cannot be before start date.");
        return;
      }
    }

    const summary = `
Automatic Reminders Saved:
First Day: ${toggles.first ? "Yes" : "No"}
Middle: ${toggles.middle ? "Yes" : "No"}
End: ${toggles.end ? "Yes" : "No"}
Custom: ${customPeriod ? `Yes (${customStart} to ${customEnd}, ${emailsPerDay} emails/day)` : "No"}
    `;

    alert(summary);
  };

  return (
    <div className="bg-white rounded-lg p-4 h-full flex flex-col justify-between">
      <div>
        <div className='flex flex-row items-center gap-2'>
          <div className="bg-[var(--icon-bg)] p-1 rounded">
            <i className="fa-solid fa-alarm-clock"></i>
          </div>
          <p className="text-lg font-semibold text-(--primary-color)">
            Automatic Reminders
          </p>

        </div>

        {[
          ["first", "First Day of Semester"],
          ["middle", "Middle of Semester"],
          ["end", "End of Semester"],
        ].map(([key, label]) => (
          <div
            key={key}
            className="flex justify-between items-center border rounded-lg p-3 mt-2"
          >
            <p>{label}</p>
            <Toggle
              enabled={toggles[key]}
              onToggle={() => toggleHandler(key)}
            />
          </div>
        ))}

        {/* Custom Period */}
        <div className="border rounded-lg p-3 mt-3 space-y-2">
          <div className="flex justify-between items-center">
            <p>Custom Period</p>
            <Toggle
              enabled={customPeriod}
              onToggle={() => {
                if (!semesterSet) {
                  alert("Set semester dates first.");
                  return;
                }
                setCustomPeriod(!customPeriod);
              }}
            />
          </div>

          {customPeriod && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={customStart}
                  onChange={e => setCustomStart(e.target.value)}
                />
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={customEnd}
                  onChange={e => {
                    if (
                      customStart &&
                      new Date(e.target.value) < new Date(customStart)
                    ) {
                      alert("End date cannot be before start date.");
                      return;
                    }
                    setCustomEnd(e.target.value);
                  }}
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <label className="text-sm text-gray-600">Emails per day</label>
                <select
                  className="border rounded p-2"
                  value={emailsPerDay}
                  onChange={e => setEmailsPerDay(e.target.value)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </>
          )}

          <button
            className="w-full bg-(--primary-color) text-white py-2 rounded-lg mt-2"
            onClick={handleSaveSettings}
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

  const semesterSet = Boolean(semesterStart && semesterEnd);

  const mockReminders = [
    {
      id: 1,
      text: "Reminder sent for 12 instructors.",
      date: "2025-12-20T21:25:00",
      recipients: 5,
    },
    {
      id: 2,
      text: "Reminder sent for Form B",
      date: "2025-12-18T10:30:00",
      recipients: 3,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-3xl font-semibold text-(--primary-color)">
          Reminders
        </p>
        <p className="text-(--primary-color)">
          Configure automated reminders for instructors
        </p>
      </div>

      {/* ROW 1 */}
      <div className="grid md:grid-cols-2 gap-4 items-stretch">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4 h-full">
          <SendReminderCard pending={12} />
          <SemesterDatesCard
            semesterStart={semesterStart}
            semesterEnd={semesterEnd}
            setStart={setSemesterStart}
            setEnd={setSemesterEnd}
          />
        </div>

        {/* RIGHT COLUMN */}
        <AutoReminders semesterSet={semesterSet} />
      </div>

      {/* ROW 2 */}
      <div className="bg-white rounded-lg p-5 max-h-72 overflow-y-auto">
        <div className='flex flex-row items-center gap-2 mb-2'>
          <div className="bg-[var(--icon-bg)] p-1 rounded">
            <i className="fa-solid fa-book"></i>
          </div>
          <p className="text-lg font-semibold text-(--primary-color)">
            Reminder History
          </p>

        </div>
        <ReminderHistory data={mockReminders} />
      </div>
    </div>
  );
}
