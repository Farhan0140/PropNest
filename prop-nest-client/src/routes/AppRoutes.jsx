import { Route, Routes } from "react-router";
import UserLogin from "../pages/Auth/UserLogin";
import UserSignUp from "../pages/Auth/UserSignUp";
import PropertyFormLayout from "../pages/Layouts/propertyFormLayout";
import PropertyUserForm from "../pages/PropertyPage/PropertyUserForm.jsx";
import PropertyListing from "../pages/PropertyPage/PropertyListing.jsx";

const AppRoutes = () => {
  return (
    <Routes>

      <Route>
        <Route path="sign-up" element={<UserSignUp />} />
        <Route path="login" element={<UserLogin />} />
      </Route>

      <Route path="property" element={<PropertyFormLayout />}>
        <Route index element={<PropertyListing />} />
        <Route path="form" element={<PropertyUserForm />} />
      </Route>
      
    </Routes>
  );
};

export default AppRoutes;