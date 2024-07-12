import React, { Fragment, useContext } from "react";
import Slider from "react-slick";
import { H6, Image, LI } from "../../../../AbstractElements";
import CustomContext from "../../../../_helper/customizer";

const DefaultLayout = () => {
    const { addSidebarSettings } = useContext(CustomContext);
    var images = require.context('../../../../assets/images/landing/demo/', true);
    const dynamicImage = (image) => {
        return images(`./${image}`);
    };
    const handleSttings = (sidebar_Settings) => {
        addSidebarSettings(sidebar_Settings);
    };
    var settings = {
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true
    };
    return (
        <Fragment>
            <Slider {...settings}>
                <LI attrLI={{ dataattr: 'defaul-layout' }} >
                    <div className="layout-img text-center" onClick={() => handleSttings()}>
                        <Image attrImage={{ className: 'img-fluid', src: `${dynamicImage('1.jpg')}`, alt: '' }} />
                        <H6 attrH6={{ className: "title-wrraper pt-2" }}>Default layout</H6>
                    </div>
                </LI>
                <LI attrLI={{ dataattr: 'compact-layout' }} >
                    <div className="layout-img text-center" onClick={() => handleSttings('compact-sidebar')}>
                        <Image attrImage={{ className: 'img-fluid', src: `${dynamicImage('2.jpg')}`, alt: '' }} />
                        <H6 attrH6={{ className: "title-wrraper pt-2" }}>Compact layout</H6>
                    </div>
                </LI>
                <LI attrLI={{ dataattr: 'modern-layout' }}>
                    <div className="layout-img text-center" onClick={() => handleSttings('material-type')}>
                        <Image attrImage={{ className: 'img-fluid', src: `${dynamicImage('3.jpg')}`, alt: '' }} />
                        <H6 attrH6={{ className: "title-wrraper pt-2" }}>Modern layout</H6>
                    </div>
                </LI>
            </Slider>
        </Fragment>
    )
}
export default DefaultLayout