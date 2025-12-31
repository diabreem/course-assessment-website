const Card2 = ({
  bgColor = "bg-white",
  title,
  description,
  iconClass = "",
  iconColor = "text-(--primary-color)", 
  titleColor = "text-(--primary-color)",
  primaryBtnText = "",
  primaryBtnBg = "bg-(--primary-color)",
}) => {
  return (
    <div className={`${bgColor} card2 p-4 rounded-lg`}>
      <div className="flex items-center gap-3">

        <i className={`${iconClass} ${iconColor} text-lg`}></i>
        <p className={`${titleColor} font-bold text-sm lg:text-lg`}>
          {title}
        </p>
      </div>

      <p className="pt-2 text-xs lg:text-sm">
        {description}
      </p>

      <div className="flex flex-col pt-4 gap-2">
        <button className={`py-2 rounded ${primaryBtnBg} text-white hover:bg-(--primary-color-hover) hover:transition-colors hover:duration-500`}>
          {primaryBtnText}
        </button>
      </div>
    </div>
  );
};

export default Card2;
