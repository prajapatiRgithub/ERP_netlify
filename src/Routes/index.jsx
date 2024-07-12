import React, { Fragment, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LayoutRoutes from "./LayoutRoutes";
import PrivateRoute from "./PrivateRoute";
import { ToastContainer } from "react-toastify";
import Login from "../Pages/Authentication/Login";

const Routers = () => {
  return (
    <Fragment>
      <BrowserRouter basename={"/"}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Suspense>
          <Routes>
            <Route path={"/"} element={<PrivateRoute />}>
              <Route exact path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/*" element={<LayoutRoutes />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Fragment>
  );
};
export default Routers;
