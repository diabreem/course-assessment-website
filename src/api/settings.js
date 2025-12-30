import api from "./axios";

/**
 * Get current semester settings
 * GET /api/settings/current
 */
export const getCurrentSettings = () => {
  return api.get("/settings/current");
};


// {
//   "semester": "Fall 2025",
//   "start_date": "2025-09-01",
//   "end_date": "2025-12-15",
//   "year": 1
// }
