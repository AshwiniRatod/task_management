import axios from "axios";

const api = axios.create({
  baseURL: "https://task-management-emc8.onrender.com",
});

export default api;
