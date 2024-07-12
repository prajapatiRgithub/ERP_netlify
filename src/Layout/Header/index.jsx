import React, { Fragment, useState, useLayoutEffect, useContext } from 'react';
import { AlignCenter, X } from 'react-feather';
import { Row } from 'reactstrap';
import { Image } from '../../AbstractElements';
import HeaderContain from './HeaderContain';
import SearchBar from './SearchBar';
import img from '../../assets/images/logo/logo.png';
import CheckContext from '../../_helper/customizer/index';

const Header = () => {
  const { toggleSidebar } = useContext(CheckContext);
  const [toggle, setToggle] = useState(false);
  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize(window.innerWidth);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }
  const width = useWindowSize();

  const openCloseSidebar = () => {
    setToggle(!toggle);
    toggleSidebar(toggle);
  };
  return (
    <Fragment>
      <Row className="main-header-right m-0">
        <div className="toggle-sidebar col-auto" 
          style={width > 991 ? { display: 'block' } : { display: 'none' }}
           id="sidebar-toggle">
          <Image attrImage={{ className: 'img-fluid logo-wrapper', src: `${img}`, alt: '' }} />
        </div>
        <div className='toggle-sidebar col-auto' onClick={() => openCloseSidebar()} style={width <= 991 ? { display: 'block' } : { display: 'none' }}>
          
          <i className="status_toggle middle" >
           { toggle ?  <X className="status_toggle middle sidebar-toggle" /> : 
            <AlignCenter className="status_toggle middle sidebar-toggle" />
          }
          </i>

        </div>
        <SearchBar />
        <HeaderContain />
      </Row>
    </Fragment>
  );
};
export default Header;