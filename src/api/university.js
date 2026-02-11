import api from "./axios";

export const getUniversityById = (id) => {
  return api.get(`/universities/${id}`);
}

export const getCampusesByUniversityId = (id) => {
  return api.get(`/campuses?university_id=${id}`);
}

export const getDepartmentsByUniversityId = (id) => {
  return api.get(`/departments?university_id=${id}`);
}