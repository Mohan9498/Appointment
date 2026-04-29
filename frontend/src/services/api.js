import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = "https://appointment-83q0.onrender.com/api/";

const API = axios.create({
  baseURL: BASE_URL,
});

// ✅ GLOBAL PUBLIC ROUTES
const publicRoutes = ["login", "register", "token/refresh"];

// 🔥 REQUEST INTERCEPTOR
API.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");

  const isPublic = publicRoutes.some(route =>
    config.url?.includes(route)
  );

  const isPublicContact =
    config.method === "post" &&
    config.url?.includes("contact");

  config.headers = config.headers || {};

  // ✅ Attach token only for protected routes
  if (access && !isPublic && !isPublicContact) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// 🔥 RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (!original) return Promise.reject(err);

    const isPublic = publicRoutes.some(route =>
      original.url?.includes(route)
    );

    // ✅ Do nothing for public routes
    if (isPublic) return Promise.reject(err);

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

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

        localStorage.setItem("access", newAccess);

        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccess}`;

        original.headers.Authorization = `Bearer ${newAccess}`;

        return API(original);
      } catch (e) {
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