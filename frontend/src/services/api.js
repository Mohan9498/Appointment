import axios from "axios";

// ✅ Auto detect environment
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000/api/"
    : "https://your-backend-url/api/";

// ✅ Create instance
const API = axios.create({
  baseURL: BASE_URL,
});

// ✅ Attach access token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Handle refresh + errors safely
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔁 Try refresh ONLY once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("login") &&
      !originalRequest.url.includes("register")
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}token/refresh/`, {
            refresh: refresh,
          });

          const newAccess = res.data.access;

          // ✅ Save new token
          localStorage.setItem("token", newAccess);

          // ✅ Retry request
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return API(originalRequest);

        } catch (err) {
          console.log("❌ Refresh token expired");
        }
      }
    }

    // ❌ Logout ONLY if truly unauthorized (not login/register)
    if (
      error.response?.status === 401 &&
      !originalRequest.url.includes("login") &&
      !originalRequest.url.includes("register")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;