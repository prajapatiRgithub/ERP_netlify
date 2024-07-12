import React, { Fragment, useContext } from 'react';
import CustomContext from '../../../../_helper/customizer';
import { H6, LI, UL } from '../../../../AbstractElements';
import CommenUL from './CommenUL';

const SideBarStyle = () => {
    const { addSidebarSettings, settings } = useContext(CustomContext);

    const handleSidebarSetting = (e, data) => {
        e.preventDefault();
        document.querySelectorAll('.sidebar-setting li').forEach((item) => {
            item.classList.remove('active');
        });
        document
            .querySelector('.main-nav').setAttribute('sidebar-layout', data);
        e.currentTarget.classList.add('active');
        addSidebarSettings(settings);
    };
    return (
        <Fragment>
            <H6>Sidebar settings</H6>
            <UL attrUL={{ className: 'simple-list sidebar-setting layout-grid flex-row' }}>
                <LI attrLI={{ dataattr: 'default-sidebar', onClick: (e) => handleSidebarSetting(e, 'default-sidebar') }}>
                    <div className="header bg-light">
                        <CommenUL />
                    </div>
                    <div className="body bg-light">
                        <span className="badge badge-primary">Default</span>
                    </div>
                </LI>
                <LI attrLI={{ dataattr: 'border-sidebar', onClick: (e) => handleSidebarSetting(e, 'border-sidebar') }}>
                    <div className="header bg-light">
                        <CommenUL />
                    </div>
                    <div className="body bg-light">
                        <span className="badge badge-primary">Border</span>
                    </div>
                </LI>
                <LI attrLI={{
                    dataattr: 'iconcolor-sidebar', onClick: (e) =>
                        handleSidebarSetting(e, 'iconcolor-sidebar')
                }}>
                    <div className="header bg-light">
                        <CommenUL />
                    </div>
                    <div className="body bg-light">
                        <span className="badge badge-primary">icon Color</span>
                    </div>
                </LI>
            </UL>
        </Fragment>
    );
};
export default SideBarStyle;