import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentSettings } from "../api/settings";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getCurrentSettings();
        setSettings(res.data);
      } 

      catch (error) {
        console.error(error);
      } 
    };

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
