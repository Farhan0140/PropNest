import { Route, Routes } from "react-router-dom";
import UserLogin from "../pages/Auth/UserLogin";
import UserSignUp from "../pages/Auth/UserSignUp";
import PropertyFormLayout from "../pages/Layouts/PropertyFormLayout";
import PropertyUserForm from "../pages/PropertyPage/PropertyUserForm.jsx";
import PropertyListing from "../pages/PropertyPage/PropertyListing.jsx";
import Side_Bar from "../components/Admin_Dashboard/Side_Bar.jsx";
import Main_Dashboard from "../components/Admin_Dashboard/Main_Dashboard.jsx";
import App from "../App.jsx";
import Property_Dashboard from "../components/Admin_Dashboard/Property_Dashboard.jsx";
import Unit_Dashboard from "../components/Admin_Dashboard/Unit_Dashboard.jsx";
import Renter_Dashboard from "../components/Admin_Dashboard/Renter_Dashboard.jsx";
import Current_Renter_Dashboard from "../components/Admin_Dashboard/Current_Renter_Dashboard.jsx";
import Previous_Renter_Dashboard from "../components/Admin_Dashboard/Previous_Renter_Dashboard.jsx";
import Rent_Management_Dashboard from "../components/Admin_Dashboard/Rent_Management_Dashboard.jsx";
import Electricity_Bill_Dashboard from "../components/Bills_Dashboard/Electricity_Bill_Dashboard.jsx";

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
        <Route path="property-dashboard" element={<Property_Dashboard />} />
        <Route path="unit-dashboard" element={<Unit_Dashboard />} />
        <Route path="renter-dashboard" element={<Renter_Dashboard />} />
        <Route path="current-renter-dashboard" element={<Current_Renter_Dashboard />} />
        <Route path="previous-renter-dashboard" element={<Previous_Renter_Dashboard />} />
        <Route path="rent-management-dashboard" element={<Rent_Management_Dashboard />} />
        <Route path="electricity-dashboard" element={<Electricity_Bill_Dashboard />} />
      </Route>
      
    </Routes>
  );
};

export default AppRoutes;