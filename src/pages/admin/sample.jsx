import React from "react";

// -------------------- ReminderHistoryRow --------------------
export function ReminderHistoryRow({ item }) {
  const statusColors = {
    sent: "bg-green-100 text-green-600",
    failed: "bg-red-100 text-red-600",
    pending: "bg-yellow-100 text-yellow-600"
  };

  return (
    <div
      className="flex justify-between items-center border p-4 rounded-lg mb-2 hover:bg-gray-50 transition"
      style={{ animation: "slideIn 0.3s ease-in-out" }}
    >
      <div>
        <p className="text-sm font-medium">{item.date} at {item.time}</p>
        <p className="text-xs text-gray-500">{item.recipients} recipients</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 border rounded-full capitalize">{item.type}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[item.status]} capitalize`}>
          {item.status}
        </span>
      </div>
    </div>
  );
}

// -------------------- ReminderHistory --------------------
export function ReminderHistory({ data }) {
  return (
    <div className="shadow-card hover:shadow-elevated rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4 border-b pb-2">
        <i className="fa-solid fa-history text-blue-500"></i>
        <h3 className="text-lg font-semibold">Reminder History</h3>
      </div>
      {data.map(item => (
        <ReminderHistoryRow key={item.id} item={item} />
      ))}
    </div>
  );
}
