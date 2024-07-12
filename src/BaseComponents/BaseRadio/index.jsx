import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Label } from 'reactstrap';

const BaseRadioGroup = ({ name, options, className, optionClassName, onChange, selectedValue }) => {
    return (
        <FormGroup className={className}>
            {options?.map((option, index) => (
                <div className={`radio radio-primary ${optionClassName}`} key={index}>
                    <Input
                        id={option.id}
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={selectedValue === option.value}
                        onChange={onChange}
                    />
                    <Label for={option.id}>
                        {option.label}
                        {option.labelSuffix && <span> {option.labelSuffix}</span>}
                    </Label>
                </div>
            ))}
        </FormGroup>
    );
};

BaseRadioGroup.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            label: PropTypes.node.isRequired,
            labelSuffix: PropTypes.node,
        })
    ).isRequired,
    className: PropTypes.string,
    optionClassName: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    selectedValue: PropTypes.string,
};

BaseRadioGroup.defaultProps = {
    className: 'm-t-15 m-checkbox-inline mb-0 custom-radio-ml',
    optionClassName: '',
    selectedValue: '',
};

export default BaseRadioGroup;

