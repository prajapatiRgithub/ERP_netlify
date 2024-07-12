import React from "react";
import "../../../src/hr.css";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useState } from "react";
import {
  action,
  active,
  Attendance,
  DeActive,
  DeleteStaff,
  Profile,
  SalaryOverView,
  SalaryStructure,
} from "../../Constant/hrLayout";
import { Link } from "react-router-dom";
import { StaffId } from "../../Constant/HR/salaryOverView";

const HrLayout = ({ component }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const menuItems = [
    { id: 1, title: Profile, link: "/", ariaSelected: true },
    { id: 2, title: Attendance, link: "/", ariaSelected: false },
    {
      id: 3,
      title: SalaryOverView,
      link: "/salaryOverview",
      ariaSelected: false,
    },
    { id: 4, title: SalaryStructure, link: "/", ariaSelected: false },
  ];

  return (
    <>
      <header>
        <div
          className="tab-pane fade active show"
          id="pills-created"
          role="tabpanel"
          aria-labelledby="pills-created-tab"
        >
          <div className="card shadow bg-color mb-0 border p-2">
            <div className="row">
              <h5 className="mb-0 ml-6">
                <div className="post-header">
                  <div className="row">
                    <div className="media col-9">
                      <img
                        className="img-thumbnail rounded-circle me-3"
                        src="/assets/images/avtar/7.jpg"
                        alt="profile"
                      />
                      <div className="media-body align-self-center">
                        <a>
                          <h5 className="user-name text-dark">Amit Sharma</h5>
                        </a>
                        <h6>{StaffId}</h6>
                      </div>
                    </div>
                    <div className="media col-3 justify-content-end gap-2 mt-3">
                      <Dropdown
                        isOpen={dropdownOpen}
                        toggle={toggleDropdown}
                        className="text-end rounded"
                      >
                        <DropdownToggle caret className="rounded-pill">
                          {action}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>{active}</DropdownItem>
                          <DropdownItem>{DeActive}</DropdownItem>
                          <DropdownItem>{DeleteStaff}</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              </h5>
            </div>
          </div>
        </div>
      </header>

      <div className="container-fluid mt-1">
        <div className="row">
          <nav
            id="sidebar"
            className="col-xl-2 col-lg-3 col-md-4 col-12 d-md-block sidebar"
          >
            <div className="email-wrap bookmark-wrap">
              <div className="row">
                <div className="col-12">
                  <div className="md-sidebar-aside">
                    <div className="card">
                      <div className="card-body hr-sidebar">
                        <div className="email-app-sidebar left-bookmark">
                          <ul className="nav main-menu" role="tablist">
                            {menuItems?.map((item) => (
                              <li key={item.id}>
                                <Link
                                  to={item.link}
                                  aria-selected={item.ariaSelected.toString()}
                                >
                                  <span className="title">{item.title}</span>
                                </Link>
                              </li>
                            ))}
                            <li>
                              <hr />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <main className="col-xl-10 col-lg-8 col-md-8 col-sm-12">
            {component}
          </main>
        </div>
      </div>
    </>
  );
};

export default HrLayout;
