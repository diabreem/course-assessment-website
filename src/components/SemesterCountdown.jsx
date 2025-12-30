import { useEffect, useState } from "react";

const SemesterCountdown = () => {
    const [semesterEndDate, setSemesterEndDate] = useState(null);
    const [daysLeft, setDaysLeft] = useState(null);

    const fetchSemesterEndDate = async () => {

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ semesterEndDate: "2025-12-30" });
            }, 500);
        });
    };

    const calculateDaysLeft = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
    };

    useEffect(() => {
        const loadDate = async () => {
            const response = await fetchSemesterEndDate();
            setSemesterEndDate(response.semesterEndDate);
            setDaysLeft(calculateDaysLeft(response.semesterEndDate));
        };

        loadDate();
    }, []);

    useEffect(() => {
        if (!semesterEndDate) return;

        const interval = setInterval(() => {
            setDaysLeft(calculateDaysLeft(semesterEndDate));
        }, 1000 * 60 * 60);

        return () => clearInterval(interval);
    }, [semesterEndDate]);

    return (
        <div className="flex items-center justify-center bg-(--primary-color) rounded-lg text-white p-6 text-center">
            {daysLeft === null ? (
                <p className="text-sm opacity-80">Loading semester info...</p>
            ) : (
                <div>
                    <p className="text-md uppercase tracking-wide opacity-90">
                        Semester ends in
                    </p>
                    <p className="text-5xl font-bold mt-2">
                        {daysLeft} <span className="text-xl">days</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default SemesterCountdown;
