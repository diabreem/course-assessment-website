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
                    <div className="flex items-center gap-4 p-4 h-16">
                        <button className="text-2xl font-bold text-[var(--primary-color)] cursor-pointer" onClick={() => navigate("/")}>assessly</button>
                    </div>

                    <hr className="border-gray-200" />

                    {/* NAV */}
                    <ul className="flex flex-col gap-2 mt-6 px-2">
                        <p className="text-xs text-gray-400 px-3">Navigation</p>

                        <NavItem to="/">
                            <i className="fa-solid fa-grip"></i>
                            <span>Dashboard</span>
                        </NavItem>

                        <NavItem to="/forms">
                            <i className="fa-brands fa-wpforms"></i>
                            <span>Forms</span>
                        </NavItem>

                        <NavItem to="/staff">
                            <i className="fa-solid fa-users"></i>
                            <span>Staff</span>
                        </NavItem>

                        <NavItem to="/reports">
                            <i className="fa-solid fa-file-invoice"></i>
                            <span>Reports</span>
                        </NavItem>

                        <NavItem to="/reminders">
                            <i className="fa-solid fa-clock"></i>
                            <span>Reminders</span>
                        </NavItem>


                    </ul>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
