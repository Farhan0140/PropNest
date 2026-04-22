import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";

const useAuth = () => {

  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState(null);
  const getToken = () => {
    const token = localStorage.getItem("authTokens");
    return token ? token : null;
  }

  const [authToken, setAuthToken] = useState(getToken());

  // useEffect(() => {
  //   if (authToken) {
  //     fetchUserProfile();
  //   }
  // }, [authToken]);

  // // Fetch User
  // const fetchUserProfile = async () => {
  //   try {
  //     const response = await apiClient.get("/users/me", {
  //       headers: { Authorization: `JWT ${authToken}` },
  //     });
  //     setUser(response.data);
  //     console.log("User ", user);
  //   } catch ( error ) {
  //     console.log("Fetching User Error", error);
  //   }
  // }
  useEffect(() => {
    const initAuth = async () => {
      if (!authToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get("/users/me", {
          headers: { Authorization: `JWT ${authToken}` },
        });

        setUser(response.data);
      } catch (error) {
        console.log("Fetching User Error", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [authToken]);

  // For Register User 
  const [regLoading, setRegLoading] = useState(false);
  const registerUser = async(data) => {
    setRegLoading(true);

    try {
      await apiClient.post("/users", {
        full_name: data.full_name,
        email_or_nid: data.email_or_nid,
        password: data.password
      });
      return {
        success: true,
        message: "Sign-Up Successfully Complete"
      }
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.error ||
        error.response?.data ||
        "Sign-Up Failed Try Again";
      return {
        success: false,
        message: message
      }
    } finally {
      setRegLoading(false);
    }
  }

  // For Login
  const [loginLoading, setLoginLoading] = useState(false);
  const loginUser = async(data) => {
    setLoginLoading(true);

    try {

      const response = await apiClient.post("/users/login", {
        email_or_nid: data.email_or_nid,
        password: data.password
      });
      setAuthToken(response?.data);
      localStorage.setItem("authTokens", response?.data)
      return {
        success: true,
      }

    } catch (error) {

      console.log(error);
      console.log(error.response);
      return {
        success: false,
      }

    } finally {
      setLoginLoading(false);
    }
  }

  return {
      authToken,
      
      user,
      registerUser,
      regLoading,
      loginUser,
      loginLoading,

      isLoading
  };
};

export default useAuth;