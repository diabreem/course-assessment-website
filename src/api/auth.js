import api from "./axios";

const USE_FAKE = true; //set later to false

const fakeUser = {
  id: 1,
  first_name: "Bill",
  last_name: "Smith",
  role: "admin",
  email: "bill.smith@gmail.com"
};

export const login = async (email, password) => {
  if (USE_FAKE) {
    return new Promise(resolve => {
      setTimeout(() => resolve({ data: { message: "Login successful", user: fakeUser } }), 500);
    });
  }

  await api.get("/sanctum/csrf-cookie");
  return api.post("/api/login", { email, password });
};

export const getUser = async () => {
  if (USE_FAKE) {
    return new Promise(resolve => {
      setTimeout(() => resolve({ data: fakeUser }), 300);
    });
  }

  return api.get("/api/user");
};

export const logout = async () => {
  if (USE_FAKE) {
    return new Promise(resolve => {
      setTimeout(() => resolve({ data: { message: "Logged out" } }), 300);
    });
  }

  return api.post("/api/logout");
};

export const updatePassword = async (currentPassword, newPassword) => {
  if (USE_FAKE) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (currentPassword === "123456") {
          resolve({ data: { message: "Password updated successfully" } });
        } else {
          reject({ response: { data: { message: "Current password incorrect" } } });
        }
      }, 500);
    });
  }

  // return api.post("/api/user/update-password", { currentPassword, newPassword });
};

export const resetPassword = async (email) => {
  if (USE_FAKE) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: { message: `Password reset link sent to ${email}` } }), 500);
    });
  }

  // return api.post("/api/password/reset", { email });
};