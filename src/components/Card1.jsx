import React from "react";

const Card1 = ({ title, number, subtitle,icon, shadow = false, bgColor = "bg-white", textColor = "text-[var(--primary-color)]" }) => {
  return (
<div className={`card1 flex flex-col p-4 rounded-lg ${bgColor}`}>
  <div className="flex flex-row justify-between items-center mb-2">
    <p className={`flex-1 text-lg font-semibold ${textColor}`}>{title}</p>
    <i className={`${icon} ${textColor} text-xl ml-2`}></i>
  </div>
  <p className={`text-2xl lg:text-3xl font-bold ${textColor} ${shadow ? "shadow" : ""}`}>
    {number} 
  </p>
  {subtitle && <p className={`text-xs font-semibold ${textColor}`}>{subtitle}</p>}
</div>

  );
};

export default Card1;
