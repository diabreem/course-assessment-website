import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentSettings } from "../api/settings";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getCurrentSettings();
setSettings(res.data.settings ?? res.data);
      } 

      catch (error) {
        console.error(error);
      } 
    };

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
