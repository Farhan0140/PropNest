import { Route, Routes } from "react-router";
import UserLogin from "../pages/Auth/UserLogin";
import UserSignUp from "../pages/Auth/UserSignUp";
import PropertyFormLayout from "../pages/Layouts/propertyFormLayout";
import App from '../App.jsx'
import PropertyUserForm from "../pages/PropertyPage/PropertyUserForm.jsx";

const AppRoutes = () => {
  return (
    <Routes>

      <Route>
        <Route path="sign-up" element={<UserSignUp />} />
        <Route path="login" element={<UserLogin />} />
      </Route>

      <Route path="property" element={<PropertyFormLayout />}>
        <Route index element={<App />} />
        <Route path="form" element={<PropertyUserForm />} />
      </Route>
      
    </Routes>
  );
};

export default AppRoutes;