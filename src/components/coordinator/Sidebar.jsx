import { useState } from "react";
import NavItem from "../NavItem";
import { useNavigate } from "react-router-dom"
const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            {/* HAMBURGER BUTTON */}
            <button
                className="lg:hidden fixed top-2 left-4 z-50 text-2xl text-[var(--primary-color)] "
                onClick={() => setOpen(true)}
            >
                <i className="fa-solid fa-bars"></i>
            </button>

            {/* OVERLAY */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/25 z-40 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`fixed top-0 left-0 h-screen w-56 bg-gray-100 text-gray-500
        flex flex-col justify-between border-r border-gray-300
        transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
            >
                {/* CLOSE BUTTON */}
                <button
                    className="lg:hidden absolute top-4 right-4 text-xl"
                    onClick={() => setOpen(false)}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>

                {/* TOP SECTION */}
                <div>
                    {/* LOGO */}
                    <div className="flex flex-col items-start p-4">
                        <button className="text-xl font-bold text-black cursor-pointer" onClick={() => navigate("/coordinator")}>ACAT</button>
                        <p className="text-xs text-gray-500">ABET Course Assessment Tool</p>
                    </div>

                    <hr className="border-gray-200" />

                    {/* NAV */}
                    <ul className="flex flex-col gap-2 mt-6 px-2">
                        <p className="text-xs text-gray-400 px-3">Navigation</p>

                        <NavItem to="/coordinator" end>
                            <i className="fa-solid fa-grip"></i>
                            <span>Dashboard</span>
                        </NavItem>

                        <NavItem to="/coordinator/my-instructors">
                            <i className="fa-brands fa-wpforms"></i>
                            <span>My Instructors</span>
                        </NavItem>

                        <NavItem to="/coordinator/improvements">
                            <i className="fa-solid fa-users"></i>
                            <span>Improvements</span>
                        </NavItem>

                        


                    </ul>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
