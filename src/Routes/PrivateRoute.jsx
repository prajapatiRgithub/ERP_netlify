import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../Constant/common";

const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
