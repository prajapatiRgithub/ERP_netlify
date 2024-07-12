import React, { Fragment, useState } from "react";
import { LogIn, MoreHorizontal } from "react-feather";
import { Media } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { Image, LI, UL } from "../../AbstractElements";
import { clearItem } from "../../Constant/common";
import { LogOut } from "../../Constant";
import profileImage from "../../assets/images/avtar/3.jpg";
import Notification from "../Header/Notification/index";
const HeaderContain = () => {
  const [open, setOpen] = useState(false);
  const onAdd = () => {
    setOpen(!open);
  };
  const history = useNavigate();

  const Logout = () => {
    clearItem();
    history("/login");
  };
  return (
    <Fragment>
      <div className="nav-right col pull-right right-menu">
        <UL
          attrUL={{
            className: `simple-list d-flex flex-row nav-menus ${
              open ? "open" : ""
            }`,
          }}
        >
          <LI attrLI={{ className: "onhover-dropdown" }}>
            <Notification />
          </LI>
          <LI attrLI={{ className: "onhover-dropdown pe-0" }}>
            <Media className="profile-media align-items-center">
              <Image
                attrImage={{
                  className: "rounded-circle border border-3 border-dark",
                  src: profileImage,
                  alt: "profile",
                }}
              />
            </Media>
            <UL
              attrUL={{
                className: "simple-list profile-dropdown onhover-show-div",
              }}
            >
              <LI attrLI={{ onClick: Logout }}>
                <Link to={`/login`} className="text-dark">
                  <LogIn /> {LogOut}
                </Link>
              </LI>
            </UL>
          </LI>
        </UL>
      </div>
      <div
        className="d-lg-none col mobile-toggle pull-right"
        onClick={() => onAdd()}
      >
        <i>
          {" "}
          <MoreHorizontal />
        </i>
      </div>
    </Fragment>
  );
};
export default HeaderContain;
