import React, { Fragment } from 'react';
import { Nav, NavItem } from 'reactstrap';

const   NavCustomizer = ({ callbackNav, selected }) => {
    return (
        <Fragment>
            <Nav className="flex-column nac-pills" id="c-pills-tab" role="tablist" aria-orientation="vertical">
                <NavItem>
                    {/* commented because in case need in future */}
                    {/* <NavLink className={selected === 'sidebar-type' ? 'active' : ''} onClick={() => callbackNav('sidebar-type', true)}>
                        <div className="settings">
                            <SettingSVG />
                        </div>
                    </NavLink> */}
                </NavItem>
                <NavItem>
                    {/* commented because in case need in future */}
                    {/* <NavLink className={selected === 'color-picker' ? 'active' : ''} onClick={() => callbackNav('color-picker', true)}>
                        <div className="settings color-settings">
                            <ColorSVG />
                        </div>
                    </NavLink> */}
                </NavItem>
            </Nav>
        </Fragment>
    );
};

export default NavCustomizer;