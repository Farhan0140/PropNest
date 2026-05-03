import { Route, Routes } from "react-router-dom";
import UserLogin from "../pages/Auth/UserLogin";
import UserSignUp from "../pages/Auth/UserSignUp";
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
import ProtectedRoute from "./ProtectedRoute.jsx";
import NotFoundOrError from "../components/Message/NotFoundOrError.jsx";
import LoadingAnimation from "../components/Message/LoadingAnimation.jsx";
import Bills_Dashboard from "../components/Admin_Dashboard/Bills_Dashboard.jsx";
import Renter_Side_Bar from "../components/Renter_Dashboard/Renter_Side_Bar.jsx";
import Renter_Main_Dashboard from "../components/Renter_Dashboard/Renter_Main_Dashboard.jsx";
import Payment_Dashboard from "../components/Admin_Dashboard/Payment_Dashboard.jsx";
import Maintenance_Dashboard from "../components/Admin_Dashboard/Maintenance_Dashboard.jsx";
import Invoice_Page from "../components/Admin_Dashboard/Invoice_Page.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="test" element={<App />} />

      <Route>
        <Route path="sign-up" element={<UserSignUp />} />
        <Route path="login" element={<UserLogin />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="admin-dashboard" element={<Side_Bar />}>
          <Route index element={<Main_Dashboard />}/>
          <Route path="property-dashboard" element={<Property_Dashboard />} />
          <Route path="unit-dashboard" element={<Unit_Dashboard />} />
          <Route path="renter-dashboard" element={<Renter_Dashboard />} />
          <Route path="current-renter-dashboard" element={<Current_Renter_Dashboard />} />
          <Route path="previous-renter-dashboard" element={<Previous_Renter_Dashboard />} />
          <Route path="rent-management-dashboard" element={<Rent_Management_Dashboard />} />
          <Route path="electricity-dashboard" element={<Electricity_Bill_Dashboard />} />
          <Route path="bills-dashboard" element={<Bills_Dashboard />} />
          <Route path="payment-dashboard" element={<Payment_Dashboard />} />
          <Route path="maintenance-dashboard" element={<Maintenance_Dashboard />} />
          <Route path="invoice/:id" element={<Invoice_Page />} />
        </Route>
      </Route>

      <Route path="renter-dashboard" >
        <Route index element={<Renter_Main_Dashboard />} />
      </Route>

      <Route>
        <Route path="/unauthorized" element={<NotFoundOrError />} />
        <Route path="/is-loading" element={<LoadingAnimation />} />
      </Route>
      
    </Routes>
  );
};

export default AppRoutes;