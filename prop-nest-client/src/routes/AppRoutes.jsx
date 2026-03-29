import { Route, Routes } from "react-router";
import UserLogin from "../pages/Auth/UserLogin";
import UserSignUp from "../pages/Auth/UserSignUp";
import PropertyFormLayout from "../pages/Layouts/propertyFormLayout";
import PropertyUserForm from "../pages/PropertyPage/PropertyUserForm.jsx";
import PropertyListing from "../pages/PropertyPage/PropertyListing.jsx";
import Side_Bar from "../components/Admin_Dashboard/Side_Bar.jsx";
import Main_Dashboard from "../components/Admin_Dashboard/Main_Dashboard.jsx";
import App from "../App.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="test" element={<App />} />

      <Route>
        <Route path="sign-up" element={<UserSignUp />} />
        <Route path="login" element={<UserLogin />} />
      </Route>

      <Route path="property" element={<PropertyFormLayout />}>
        <Route index element={<PropertyListing />} />
        <Route path="form" element={<PropertyUserForm />} />
      </Route>

      <Route path="admin-dashboard" element={<Side_Bar />}>
        <Route index element={<Main_Dashboard />}/>
      </Route>
      
    </Routes>
  );
};

export default AppRoutes;