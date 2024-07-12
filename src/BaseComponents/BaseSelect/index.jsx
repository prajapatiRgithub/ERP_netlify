import React from 'react';
import { FormFeedback, Label } from 'reactstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';

const BaseSelect = ({
    label,
    name,
    className,
    options,
    placeholder,
    handleChange,
    handleBlur,
    value,
    touched,
    error,
    isDisabled
}) => {
    const selectedValue = options?.find(option => option.value === value) || null;

    const handleChangeWrapper = (selectedOption) => {
        handleChange(name, selectedOption ? selectedOption.value : '');
    };

    return (
        <div className="mb-3">
            {label && (
                <Label htmlFor={name} className="form-label">
                    {label}
                </Label>
            )}
            <Select
                name={name}
                className={className ? className : "select-border"}
                options={options}
                placeholder={placeholder}
                value={selectedValue}
                onChange={handleChangeWrapper}
                onBlur={handleBlur}
                isDisabled={isDisabled}
                classNamePrefix={touched && error ? 'is-invalid react-select' : 'react-select'}
            />
            {touched && error ? (
                <FormFeedback className="d-block">{error}</FormFeedback>
            ) : null}
        </div>
    );
};

BaseSelect.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    options: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func,
    value: PropTypes.string,
    touched: PropTypes.bool,
    error: PropTypes.string,
    isDisabled: PropTypes.bool
};

export default BaseSelect;
