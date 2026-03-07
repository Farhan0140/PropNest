import { Route, Routes } from "react-router";
import Authentication from "../pages/Auth/Authentication";

const AppRoutes = () => {
  return (
    <Routes>

      <Route>
        <Route path="sign-up" element={<Authentication flipped={true} />} />
        <Route path="login" element={<Authentication flipped={false} />} />
      </Route>
      
    </Routes>
  );
};

export default AppRoutes;