import api from "./axios";

export const getDetails =  (current_semester) => {
    return api.get("/forms", {
        params: { semester: current_semester }
    });
}

