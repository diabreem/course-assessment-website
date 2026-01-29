import api from "./axios";

export const getUniversityById = (id) => {
  return api.get(`/universities/${id}`);
}