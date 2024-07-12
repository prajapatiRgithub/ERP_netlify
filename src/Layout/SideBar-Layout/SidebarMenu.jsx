import React, { Fragment, useEffect, useState } from 'react';
import SidebarMenuItems from './SidebarMenuItems';
import { ArrowLeft, ArrowRight } from 'react-feather';

const SidebarMenu = ({ setMainMenu, props, sidebartoogle, setNavActive, width }) => {
  const [rightArrow, setRightArrow] = useState(false);
  const [leftArrow, setLeftArrow] = useState(false);
  const [margin, setMargin] = useState(0);
  useEffect(() => {
    setLeftArrow(true);
  }, []);
  const scrollToRight = () => {
    if (margin <= -2598 || margin <= -2034) {
      if (width === 492) {
        setMargin(-3570);
      } else {
        setMargin(-3690);
      }
      setRightArrow(true);
      setLeftArrow(false);
    } else {
      setLeftArrow(false);
      setMargin((margin) => (margin += -width));
    }
  };

  const scrollToLeft = () => {
    if (margin >= -width) {
      setMargin(0);
      setLeftArrow(true);
      setRightArrow(false);
    } else {
      setMargin((margin) => (margin += width));
      setRightArrow(false);
    }
  };

  return (
    <Fragment>
      <nav>
        <div className="main-navbar" >
          <div className={`left-arrow ${leftArrow ? 'd-none' : ''}`} id="left-arrow" onClick={scrollToLeft}>
            <ArrowLeft />
          </div>
          <div id="sidebar-menu"
          >
            <SidebarMenuItems setMainMenu={setMainMenu} props={props} sidebartoogle={sidebartoogle} setNavActive={setNavActive} />
          </div>
          <div className={`right-arrow ${rightArrow ? 'd-none' : ''}`} onClick={scrollToRight}>
            <ArrowRight />
          </div>
        </div>
      </nav>
    </Fragment>

  );

};

export default SidebarMenu;