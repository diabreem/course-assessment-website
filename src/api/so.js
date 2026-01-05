import api from "./axios";

export const getSOs = () => {
  return api.get("/so");
}