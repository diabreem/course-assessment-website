import React from "react";
import { getUniversityById } from "../api/university";

const UniversityContext = React.createContext();

export const UniversityProvider = ({ children }) => {
  const [university, setUniversity] = React.useState(null);
  
  const fetchUniversity = async () => {
    try {
      const res = await getUniversityById(1);
      setUniversity(res.data);
    } catch (error) {
      console.error("Error fetching university:", error);
    } 
  };
  
  return (
    <UniversityContext.Provider value={{ university, fetchUniversity }}>
      {children}
    </UniversityContext.Provider>
  );
};

export const useUniversity = () => React.useContext(UniversityContext);