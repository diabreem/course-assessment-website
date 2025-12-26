const Card2 = ({
  bgColor = "bg-white",
  title,
  description,
  iconClass = "",
  iconColor = "text-[var(--primary-color)]", 
  titleColor = "text-[var(--primary-color)]",
  primaryBtnText = "",
  secondaryBtnText = "",
  primaryBtnBg = "bg-[var(--primary-color)]",
  secondaryBtnBg = "bg-white",
}) => {
  return (
    <div className={`${bgColor} card2 p-4 rounded-lg`}>
      <div className="flex items-center gap-3">
            <div className="bg-(--icon-bg) p-2 rounded">

        <i className={`${iconClass} ${iconColor} text-lg`}></i>
</div>
        <p className={`${titleColor} font-bold text-sm lg:text-lg`}>
          {title}
        </p>
      </div>

      <p className="pt-2 text-xs lg:text-sm">
        {description}
      </p>

      <div className="flex flex-col pt-4 gap-2">
        <button className={`py-2 rounded ${primaryBtnBg} text-white hover:bg-[var(--primary-color-hover)] transition-colors duration-100`}>
          {primaryBtnText}
        </button>

        <button className={`py-2 rounded ${secondaryBtnBg} transition-colors duration-100`}>
          {secondaryBtnText}
        </button>
      </div>
    </div>
  );
};

export default Card2;
