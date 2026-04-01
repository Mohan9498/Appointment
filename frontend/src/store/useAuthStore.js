import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("access") || null,

  login: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access", token);

    set({ user, token });
  },

  logout: () => {
    
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("is_admin");

    //  Reset state
    set({ user: null, token: null });

    //  Remove axios auth header
    delete API.defaults.headers.common["Authorization"];
  },
}));

export default useAuthStore;