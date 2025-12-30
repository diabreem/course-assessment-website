import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentSettings } from "../api/settings";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
    //   try {
    //     const response = await getCurrentSettings();
    //     setSettings(response.data);
    //   } 

    try {
      // TEMP: mock data until backend exists
      const mockSettings = {
        semester: "Fall 2025",
        start_date: "2025-09-01",
        end_date: "2025-12-15",
        year: 1,
      };
    setSettings(mockSettings)}
      
      catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
