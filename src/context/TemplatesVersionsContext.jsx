import React, { createContext, useContext, useEffect, useState } from "react";
import { getTemplates, getVersions } from "../api/templates-versions";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [tRes, vRes] = await Promise.all([
        getTemplates(),
        getVersions(),
      ]);
      setTemplates(tRes.data);
      setVersions(vRes.data);
    };
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ templates, versions, setTemplates, setVersions }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
