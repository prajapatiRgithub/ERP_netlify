import React, { Fragment, useContext, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Footer from "./Footer/index";
import TapTop from "./TapTop/index";
import Header from "./Header";
import SideBarLayout from "./SideBar-Layout";
import Themecustomizer from "./ThemeCustomizer";
import CheckContext from "../_helper/customizer";
import AnimationThemeContext from "../_helper/AnimationTheme";

const Layout = ({ children, classNames, ...rest }) => {
  const { settings, setIconShow, toggleIcon, setToggleIcon, setDefaultClass } =
    useContext(CheckContext);
  const settings1 = localStorage.getItem("sidebar_Settings") || settings;
  const location = useLocation();
  let [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { animation } = useContext(AnimationThemeContext);
  const animationTheme = localStorage.getItem("animation") || animation;

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 991) {
      setToggleIcon(true);
      setDefaultClass(true);
    } else {
      setToggleIcon(false);
      setDefaultClass(false);
    }
    if (window.innerWidth <= 575) {
      setIconShow(true);
    } else {
      setIconShow(false);
    }

    if (window.innerWidth <= 992) {
      setDefaultClass(true);
    } else setDefaultClass(false);

    setWindowWidth(window.innerWidth);
  });

  return (
    <Fragment>
      <TapTop />
      <div
        className={`page-wrapper ${
          windowWidth > 991 ? "horizontal-wrapper" : "compact-wrapper"
        } ${settings1}`}
        id="pageWrapper"
      >
        <div className={`page-main-header ${toggleIcon ? "close_icon" : ""}`}>
          <Header />
        </div>
        <div className="page-body-wrapper horizontal-menu">
          <header className={`main-nav ${toggleIcon ? "close_icon" : ""}`}>
            <SideBarLayout />
          </header>
          <div className="page-body">
            <TransitionGroup {...rest}>
              <CSSTransition
                key={location.key}
                timeout={100}
                classNames={animationTheme}
                unmountOnExit
              >
                <div>
                  <Outlet />
                </div>
              </CSSTransition>
            </TransitionGroup>
          </div>
          <Footer />
        </div>
      </div>
      <Themecustomizer />
    </Fragment>
  );
};
export default Layout;
