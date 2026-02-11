import api from "./axios"

export const getVersions = () => {
    return api.get("/versions");
}

export const getVersionById = (id) => {
    return api.get(`/versions/${id}`);
}

export const deleteVersion = (id) => {
    return api.delete(`/versions/${id}`);
}

export const createVersion = (data) => {
    return api.post("/versions", data);
}

export const updateVersion = (id, data) => {
    return api.put(`/versions/${id}`, data);
}

export const getLastVersionNumber = () => {
    return api.get("/versions?_sort=-versionNumber&_limit=1");
}

export const getActiveVersion = () => {
    return api.get("/versions?isActive=true");
}