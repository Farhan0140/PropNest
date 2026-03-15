import { useEffect, useState } from "react";
import apiClient from "../services/api-client";

const useAuth = () => {

  const [user, setUser] = useState(null);
  const getToken = () => {
    const token = localStorage.getItem("authTokens");
    return token ? token : null;
  }

  const [authToken, setAuthToken] = useState(getToken());

  useEffect(() => {
    if (authToken) {
      fetchUserProfile();
    }
  }, [authToken]);

  // Fetch User
  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get("/users/me", {
        headers: { Authorization: `JWT ${authToken}` },
      });
      setUser(response.data);
    } catch ( error ) {
      console.log("Fetching User Error", error);
    }
  }

  // For Register User 
  const [regLoading, setRegLoading] = useState(false);
  const registerUser = async(data) => {
    setRegLoading(true);

    try {
      await apiClient.post("/users", {
        full_name: data.full_name,
        email: data.email,
        password: data.password
      });
      return {
        success: true,
        message: "Sign-Up Successfully Complete"
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Sign-Up Failed Try Again"
      }
    } finally {
      setRegLoading(false);
    }
  }

  return {
      user,
      registerUser,
      regLoading
  };
};

export default useAuth;