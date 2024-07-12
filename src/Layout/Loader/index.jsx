import React, { Fragment, useEffect, useState } from 'react';

const Loader = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const timeout = setTimeout(() => {
      setShow(false);
    }, 1000);

    return () => {
      // eslint-disable-next-line no-undef
      clearTimeout(timeout);
    };
  }, [show]);
  return (
    <Fragment>
      <div className={`loader-wrapper ${show ? '' : 'loderhide'}`}>
        <div className="main-loader">
          <div className="bar-0"></div>
          <div className="bar-1"></div>
          <div className="bar-2"></div>
          <div className="bar-3"></div>
          <div className="bar-4"></div>
        </div>
        <div className="loading">Loading...    </div>
      </div>
    </Fragment>
  );
};
export default Loader;