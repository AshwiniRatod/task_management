import axios from "axios";

const api = axios.create({
  baseURL: "https://task-management-emc8.onrender.com/api",
  withCredentials: true, // safe to keep
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
