
import axios from "axios";

const apiClient = axios.create({
  // baseURL: "https://propnest.onrender.com",
  baseURL: "http://localhost:3000",
});

export default apiClient;