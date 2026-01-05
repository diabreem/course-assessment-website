import api from "./axios";

export const getCurrentSettings = () => {
  return api.get("/settings");
};

