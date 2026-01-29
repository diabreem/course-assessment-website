import api from "./axios";

export const getSOs = () => {
  return api.get("/so");
}

export const getPCs = () => {
  return api.get("/pcs");
}