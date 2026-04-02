import { create } from "zustand";
import API from "../services/api"; 

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("access") || null,

  login: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access", token);

    set({ user, token });
  },

  logout: () => {
    //  Clear storage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("is_admin");

    // ✅ Reset Zustand state
    set({ user: null, token: null });

    //  Remove axios auth header safely
    if (API?.defaults?.headers?.common?.Authorization) {
      delete API.defaults.headers.common["Authorization"];
    }
  },
}));

export default useAuthStore;