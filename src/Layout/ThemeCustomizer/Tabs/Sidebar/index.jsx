import React, { Fragment } from 'react';
import SidebarType from './SidebarType';
import LayoutType from './LayoutType';
import AnimationFade from './AnimationFade';
import SideBarStyle from './SidebarStyle';
import DefaultLayout from './DefaultLayout';

const SidebarCusmizer = () => {

    return (
        <Fragment>
            <DefaultLayout />
            <LayoutType />
            <SidebarType />
            <AnimationFade />
            <SideBarStyle />
        </Fragment>
    );
};

export default SidebarCusmizer;