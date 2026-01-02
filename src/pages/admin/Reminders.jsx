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
   Select Semester Dates
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
          minDate={semesterStart}
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

  const toggleRule = (key) => {
    if (!semesterSet) return alert("Set semester dates first.");
    setRules(prev => ({ ...prev, [key]: !prev[key] }));
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
          className="flex justify-between items-center border rounded-lg p-2 mt-2"
        >
          <p className="text-sm">{label}</p>
          <Toggle enabled={rules[key]} onToggle={() => toggleRule(key)} />
        </div>
      ))}

      <button
        onClick={() => onSave({ rules })}
        className="mt-4 bg-(--primary-color) text-white py-2 w-full rounded-lg hover:bg-(--primary-color-hover) transition"
      >
        Save Settings
      </button>
    </div>
  );
};

/* ========================
   Main Page
======================== */
export default function Reminders() {
  const [semesterStart, setSemesterStart] = useState(null);
  const [semesterEnd, setSemesterEnd] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("/api/semester")
      .then(res => res.json())
      .then(data => {
        setSemesterStart(data.start ? new Date(data.start) : null);
        setSemesterEnd(data.end ? new Date(data.end) : null);
      });

    fetch("/api/reminders/history")
      .then(res => res.json())
      .then(setHistory);
  }, []);

  const semesterSet = Boolean(semesterStart && semesterEnd);

  const saveSemesterDates = () => {
    if (!semesterStart || !semesterEnd) {
      alert("Select both semester dates.");
      return;
    }
    if (semesterEnd <= semesterStart) {
      alert("End date must be after start date.");
      return;
    }

    fetch("/api/semester", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start: semesterStart.toISOString(),
        end: semesterEnd.toISOString(),
      }),
    }).then(() => alert("Semester dates saved"));
  };

  const saveAutoReminders = (payload) => {
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
      <div className="pb-4 flex flex-col gap-2">
        <p className="text-(--primary-color) text-3xl font-bold">Reminders</p>
        <p className="text-md">Send and view reminders.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <SelectSemesterDatesCard
          semesterStart={semesterStart}
          semesterEnd={semesterEnd}
          setSemesterStart={setSemesterStart}
          setSemesterEnd={setSemesterEnd}
          onSave={saveSemesterDates}
        />

        <div className="col-span-2">
          <AutoReminders
            semesterSet={semesterSet}
            onSave={saveAutoReminders}
          />
        </div>

        <SendReminderCard pending={12} onSend={sendManualReminder} />

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
