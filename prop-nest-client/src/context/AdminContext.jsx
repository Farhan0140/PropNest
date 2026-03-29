import { createContext } from "react";
import useAdmin from "../hooks/Admin/useAdmin";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  
  const allContext = useAdmin();

  return (
    <AdminContext.Provider value={allContext}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;