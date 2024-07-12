import React from 'react';

const Spinner = (props) => (
    <div className="loader-overlay">
        <div className='loader-box'>
            <div {...props.attrSpinner} />
        </div>
    </div>
);

export default Spinner;