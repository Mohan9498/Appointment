import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = "https://appointment-83q0.onrender.com/api/";

const API = axios.create({
  baseURL: BASE_URL,
});

// ✅ REQUEST INTERCEPTOR (Attach token safely)
API.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");

  // ✅ Only truly public routes
  const publicRoutes = ["login/", "register/"];

  const isPublicRoute = publicRoutes.includes(config.url);

  // ✅ Allow contact form without token
  const isPublicContact =
    config.method === "post" && config.url === "contact/";

  if (access && !isPublicRoute && !isPublicContact) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  config.headers["Content-Type"] = "application/json";

  return config;
});

// ✅ RESPONSE INTERCEPTOR (Handle token refresh)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔐 Handle expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      // ❌ No refresh → force logout
      if (!refresh) {
        localStorage.clear();
        window.location.replace("/login");
        return Promise.reject(error);
      }

      try {
        // 🔄 Get new access token
        const res = await axios.post(
          `${BASE_URL}token/refresh/`,
          { refresh }
        );

        const newAccess = res.data.access;

        // ✅ Save new token
        localStorage.setItem("access", newAccess);

        // ✅ Update headers globally
        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccess}`;

        // ✅ Retry original request
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newAccess}`;

        return API(originalRequest);
      } catch (err) {
        console.log("Token refresh failed");

        localStorage.clear();
        toast.error("Session expired. Please login again");

        setTimeout(() => {
          window.location.replace("/login");
        }, 1000);
      }
    }

    return Promise.reject(error);
  }
);

export default API;