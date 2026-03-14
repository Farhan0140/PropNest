import { Route, Routes } from "react-router";
import UserLogin from "../pages/Auth/UserLogin";
import UserSignUp from "../pages/Auth/UserSignUp";

const AppRoutes = () => {
  return (
    <Routes>

      <Route>
        <Route path="sign-up" element={<UserSignUp />} />
        <Route path="login" element={<UserLogin />} />
      </Route>
      
    </Routes>
  );
};

export default AppRoutes;