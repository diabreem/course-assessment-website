import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";

/* ========================
   Utils (display only)
======================== */

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const diffDays = differenceInDays(new Date(), date);
    if (diffDays > 7) return format(date, "MMMM dd, yyyy");
    return formatDistanceToNow(date, { addSuffix: true });
}

/* ========================
   Reminder History
======================== */

function ReminderRow({ item }) {
  return (
    <div className="flex justify-between border rounded-lg p-2 mb-2 hover:bg-gray-100">
      <div>
        <p>{item.text}</p>
        <p className="text-sm text-gray-500">
          {item.recipients} recipients
        </p>
      </div>
      <p className="text-sm text-gray-500">
        {formatDate(item.sent_at)}
      </p>
    </div>
  );
}

const ReminderHistory = ({ data }) => {
  if (!data.length) {
    return (
      <p className="text-sm text-gray-500 mt-3">
        No reminders sent yet.
      </p>
    );
  }

  return data.map(item => (
    <ReminderRow key={item.id} item={item} />
  ));
};

/* ========================
   Quick Action
======================== */

const SendReminderCard = ({ pending, onSend }) => (
  <div className="bg-white p-4 rounded-lg h-full">
    <p className="text-lg font-semibold text-(--primary-color)">
      Quick Action
    </p>

    <p className="text-sm text-gray-600 mt-2">
      {pending} forms pending!<br/>Send a reminder to instructors.
    </p>

    <button
      onClick={onSend}
      className="mt-4 bg-(--primary-color) text-white py-2 rounded-lg w-full hover:bg-(--primary-color-hover) hover:transition-colors hover:duration-500"
    >
      Send Now
    </button>
  </div>
);

/* ========================
   Semester Dates (read-only)
======================== */

const SelectSemesterDatesCard = ({
  semesterStart,
  semesterEnd,
  setSemesterStart,
  setSemesterEnd,
  onSave,
}) => (
  <div className="bg-white p-4 rounded-lg h-full">
    <p className="text-lg font-semibold text-(--primary-color)">
      Select Semester Dates
    </p>

    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="mt-4 flex flex-col gap-3">
        <DatePicker
          label="Semester Start"
          value={semesterStart}
          onChange={setSemesterStart}
          renderInput={(params) => (
            <TextField {...params} size="small" fullWidth />
          )}
        />

        <DatePicker
          label="Semester End"
          value={semesterEnd}
          onChange={setSemesterEnd}
          renderInput={(params) => (
            <TextField {...params} size="small" fullWidth />
          )}
        />

        <button
          onClick={onSave}
          className="mt-2 bg-(--primary-color) text-white py-2 rounded-lg hover:bg-(--primary-color-hover) hover:transition-colors hover:duration-500"
        >
          Save Semester Dates
        </button>
      </div>
    </LocalizationProvider>
  </div>
);

/* ========================
   Toggle
======================== */

const Toggle = ({ enabled, onToggle }) => (
  <div
    onClick={onToggle}
    className={`w-11 h-5 flex items-center rounded-full cursor-pointer transition ${
      enabled ? "bg-(--primary-color)" : "bg-gray-300"
    }`}
  >
    <div
      className={`w-3 h-3 bg-white rounded-full transition-transform ml-1 ${
        enabled ? "translate-x-6" : ""
      }`}
    />
  </div>
);

/* ========================
   Automatic Reminders
======================== */

const AutoReminders = ({ semesterSet, onSave }) => {
  const [rules, setRules] = useState({
    first: false,
    middle: false,
    end: false,
  });

  const [customEnabled, setCustomEnabled] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [emailsPerDay, setEmailsPerDay] = useState(1);

  const toggleRule = key => {
    if (!semesterSet) return alert("Set semester dates first.");
    setRules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = () => {
    if (customEnabled) {
      if (!customStart || !customEnd) {
        return alert("Select start and end dates.");
      }

      if (new Date(customEnd) < new Date(customStart)) {
        return alert("End date cannot be before start date.");
      }
    }

    onSave({
      rules,
      custom: customEnabled
        ? {
            start: customStart,
            end: customEnd,
            emails_per_day: emailsPerDay,
          }
        : null,
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <p className="text-lg font-semibold text-(--primary-color)">
        Automatic Reminders
      </p>

      {[
        ["first", "First Day of Semester"],
        ["middle", "Middle of Semester"],
        ["end", "End of Semester"],
      ].map(([key, label]) => (
        <div
          key={key}
          className="flex justify-between items-center border border-gray-400 rounded-lg p-2 mt-2"
        >
          <p className="text-sm">{label}</p>
          <Toggle
            enabled={rules[key]}
            onToggle={() => toggleRule(key)}
          />
        </div>
      ))}

      <div className="border border-gray-400 rounded-lg p-3 mt-3 space-y-2 relative">
        <div className="flex justify-between items-center">
          <p className="text-sm">Custom Period</p>
          <Toggle
            enabled={customEnabled}
            onToggle={() => {
              if (!semesterSet) return alert("Set semester dates first.");
              setCustomEnabled(!customEnabled);
            }}
          />
        </div>

 {customEnabled && (
  <>
    <div className="grid grid-cols-2 gap-2">
      <input
        type="date"
        className="border rounded text-sm p-1"
        value={customStart}
        onChange={e => setCustomStart(e.target.value)}
      />
      <input
        type="date"
        className="border rounded text-sm p-1"
        value={customEnd}
        onChange={e => setCustomEnd(e.target.value)}
      />
    </div>

    <div className="flex items-center gap-2 mt-2">
      <label className="text-sm text-gray-600">Emails per day</label>
      <select
        className="border rounded p-1 text-sm"
        value={emailsPerDay}
        onChange={e => setEmailsPerDay(Number(e.target.value))}
      >
        {[1, 2, 3, 4, 5].map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>

    {/* Right-aligned button */}
    <div className="flex justify-end mt-3">
      <button
        onClick={saveSettings}
        className="bg-(--primary-color) text-white py-2 px-4 rounded-lg hover:bg-(--primary-color-hover) hover:transition-colors hover:duration-500"
      >
        Save Settings
      </button>
    </div>
  </>
)}

       
      </div>
    </div>
  );
};

/* ========================
   Main Page
======================== */

export default function Reminders() {
  const [semesterStart, setSemesterStart] = useState(null);
  const [semesterEnd, setSemesterEnd] = useState(null);
  const [loading, setLoading] = useState(true);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("/api/semester")
      .then(res => res.json())
      .then(data => {
        setSemesterStart(data.start);
        setSemesterEnd(data.end);
      })
      .finally(() => setLoading(false));

    fetch("/api/reminders/history")
      .then(res => res.json())
      .then(setHistory);
  }, []);

  const semesterSet = Boolean(semesterStart && semesterEnd);

  const saveAutoReminders = payload => {
    fetch("/api/auto-reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(() => alert("Settings saved"));
  };

  const sendManualReminder = () => {
    fetch("/api/reminders/send", { method: "POST" })
      .then(() => alert("Reminder sent"));
  };

  return (
    <div>
       <div className='pb-4 flex flex-col gap-3'>
        <p className='text-(--primary-color) text-3xl font-bold'>Reminders</p>
        <p className="text-md">Send and view reminders.
        </p>
      </div>
       
      <div className="grid grid-cols-3 gap-4">
         <div className="col-span-1">
         <SelectSemesterDatesCard
            semesterStart={semesterStart}
            semesterEnd={semesterEnd}
            setSemesterStart={setSemesterStart}
            setSemesterEnd={setSemesterEnd}
            onSave={saveSemesterDates}
         />
      </div>

      <div className="col-span-2">
        <AutoReminders
          semesterSet={semesterSet}
          onSave={saveAutoReminders}
        />
      </div>

      <div className="col-span-1">
        <div className="col-span-1">
          <SendReminderCard pending={12} onSend={sendManualReminder} />
      </div>

      <div className="col-span-2 bg-white rounded-lg p-5 max-h-72 overflow-y-auto">
        <p className="text-lg font-semibold text-(--primary-color)">
          Reminder History
        </p>
        <ReminderHistory data={history} />
      </div>
     </div>
    </div>
  );
}
