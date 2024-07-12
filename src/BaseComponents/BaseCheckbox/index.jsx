import React from 'react';
import PropTypes from 'prop-types';
import { Input, Label } from 'reactstrap';

const BaseCheckbox = ({ id, label, checked, onChange, className, labelClassName, ...props }) => {
    return (
        <div className={`checkbox checkbox-primary ${className}`}>
            <Input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                {...props}
            />
            <Label className={`mb-0 ${labelClassName}`} for={id}>
                {label}
            </Label>
        </div>
    );
};

BaseCheckbox.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string,
    labelClassName: PropTypes.string,
};

BaseCheckbox.defaultProps = {
    checked: false,
    onChange: () => {},
    className: '',
    labelClassName: '',
};

export default BaseCheckbox;
