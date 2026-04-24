import axios from "axios";

const authApiClient = axios.create({
  baseURL: "http://localhost:3000",
  // baseURL: "https://propnest.onrender.com",
});

export default authApiClient;

authApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authTokens");

    if( token ) {
      config.headers.Authorization = `JWT ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
)