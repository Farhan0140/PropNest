import { Outlet } from "react-router-dom";

const PropertyFormLayout = () => {
  return (
    <div className="bg-gray-200 ">
      <Outlet />
    </div>
  );
};

export default PropertyFormLayout;