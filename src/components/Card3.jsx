import React from 'react';

const Card3 = ({
  bgColor = "white",
  icon,
  iconColor = "var(--primary-color)",
  title,
  titleColor = "var(--primary-color)",
  subtitle = "",
  subtitleColor = "black",
  button,
  buttonBg = "var(--primary-color)",
  buttonColor = "white"
}) => {
  return (
    <div className='card3 p-4 rounded-md shadow-md' style={{ backgroundColor: bgColor }}>
      <div className='flex items-center gap-3'>
        {icon && <i className={icon} style={{ color: iconColor }}></i>}
        {title && <p className='font-bold text-sm lg:text-lg' style={{ color: titleColor }}>{title}</p>}
      </div>
      {subtitle && <p className='pt-2 text-xs lg:text-sm' style={{ color: subtitleColor }}>{subtitle}</p>}
      {button && (
        <div className='flex flex-col pt-4 gap-2'>
          <button className='rounded-md p-1' style={{ backgroundColor: buttonBg, color: buttonColor }}>
            {button}
          </button>
        </div>
      )}
    </div>
  );
};

export default Card3;
