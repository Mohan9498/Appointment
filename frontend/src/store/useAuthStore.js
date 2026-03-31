import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  login: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("is_admin", user.is_admin);

    set({ user, token });
  },

  logout: () => {
    localStorage.clear();
    set({ user: null, token: null });
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; 
  },
}));

export default useAuthStore;