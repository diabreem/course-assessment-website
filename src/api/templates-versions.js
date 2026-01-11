import api from "./axios"

export const getTemplates = () => {
    return api.get("/templates");
}


export const getVersions = () => {
    return api.get("/versions");
}

export const deleteTemplate = (id) => {
    return api.delete(`/templates/${id}`);
}

export const deleteVersion = (id) => {
    return api.delete(`/versions/${id}`);
}

export const createTemplate = (data) => {
    return api.post("/templates", data);
}

export const createVersion = (templateId, data) => {
  const versionData = { ...data, templateId };
  return api.post("/versions", versionData);
}

export const getLastVersionNumberofTemplate = async (templateId) => {
const res = await api.get(`/versions?templateId=${templateId}`);

    if (res.data.length === 0) return 0; 

    const maxVersion = res.data.reduce((max, v) => {
      return v.versionNumber > max ? v.versionNumber : max;
    }, 0);

    return maxVersion;
}
export const updateTemplate = (id, data) => {
    return api.put(`/templates/${id}`, data);
}

export const updateVersion = (id, data) => {
  return api.put(`/versions/${id}`, data);
};


export const getTemplateById = (id) => {
    return api.get(`/templates/${id}`);
}

export const getVersionById = (id) => {
    return api.get(`/versions/${id}`);
}
