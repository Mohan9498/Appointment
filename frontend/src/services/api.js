import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = "https://appointment-83q0.onrender.com/api/";

const API = axios.create({
  baseURL: BASE_URL,
});

// 🔥 REQUEST INTERCEPTOR (YOUR LOGIC PRESERVED)
API.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");

  const publicRoutes = ["login", "register"];

  const isPublicRoute = publicRoutes.some((route) =>
    config.url?.includes(route)
  );

  const isPublicContact =
    config.method === "post" &&
    config.url?.includes("contact");

  // ✅ Ensure headers exist
  config.headers = config.headers || {};

  if (access && !isPublicRoute && !isPublicContact) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// 🔥 RESPONSE INTERCEPTOR (AUTO REFRESH — IMPROVED)
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // ❌ If no config → reject
    if (!original) return Promise.reject(err);

    const publicRoutes = ["login", "register", "contact", "token/refresh"];
    const isPublicRoute = publicRoutes.some((route) =>
      original.url?.includes(route)
    );

    if (isPublicRoute) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        // ❌ No refresh token → logout
        if (!refresh) {
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(err);
        }

        const res = await axios.post(
          `${BASE_URL}token/refresh/`,
          { refresh }
        );

        const newAccess = res.data.access;

        // ✅ Save token
        localStorage.setItem("access", newAccess);

        // ✅ Update global header
        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccess}`;

        // ✅ Retry original request
        original.headers.Authorization = `Bearer ${newAccess}`;

        return API(original);
      } catch (e) {
        // 🔥 Clean logout
        localStorage.clear();

        toast.error("Session expired. Please login again");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    }

    return Promise.reject(err);
  }
);

export default API;
