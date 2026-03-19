import axios from "axios";

// ✅ Automatically choose backend URL
const BASE_URL =
  window.location.hostname === "localhost" ? "http://127.0.0.1:8000/api/"    : "https://your-backend-url/api/";

const API = axios.create({
  baseURL: BASE_URL,
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}token/refresh/`, {
            refresh: refresh,
          });

          const newAccess = res.data.access;

         
          localStorage.setItem("token", newAccess);

         
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return API(originalRequest);

        } catch (err) {
          console.log("Refresh failed");
        }
      }
    }

    
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");

    window.location.href = "/login";

    return Promise.reject(error);
  }
);

export default API;