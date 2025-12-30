import api from "./axios";

export const getNotifications = (semester) => {
    return api.get("/notifications", {params: {semester}});
}

export const deleteNotification = (semester, notificationID) => {
    return api.delete(`/notifications/${notificationID}`, {params: {semester}});
}
export const clearNotifications = (semester) => {
    return api.delete("/notifications/clear", {params: {semester}});
}
