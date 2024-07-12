import React, { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "./Routes";
import Layout from "../Layout/Layout";
import { Outlet } from "react-router-dom";
import NotFound from "../Pages/NotFound";

const LayoutRoutes = () => {
  return (
    <Fragment>
      <Outlet />
      <Routes>
        {routes?.map(({ path, Component }, i) => (
          <Route element={<Layout />} key={i}>
            <Route path={path} element={Component} />
          </Route>
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Fragment>
  );
};

export default LayoutRoutes;
