import axios from "axios";

// ✅ BASE URL
const BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000/api/"
    : "http://10.60.184.164:8000/api/";

// ✅ Create instance
const API = axios.create({
  baseURL: BASE_URL,
});

// ✅ Attach access token (FIXED)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // ❌ DO NOT attach token for login/register
  if (
    token &&
    !config.url.includes("login") &&
    !config.url.includes("register")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Handle refresh token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("login")
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}token/refresh/`, {
            refresh,
          });

          const newAccess = res.data.access;

          localStorage.setItem("token", newAccess);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return API(originalRequest);

        } catch {
          console.log("❌ Refresh expired");
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;