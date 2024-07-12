import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Spinner } from 'reactstrap';
import classNames from 'classnames';
import baseButtonProps from '../../../src/interfaces/Base/BaseButton/baseButton'

const BaseButton = ({ type, label, color, loader, className, onClick, disabled, tooltipName, children, ...props }) => {

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipTarget, setTooltipTarget] = useState(null);

    const btnClass = classNames(
        className,
        `btn-pill btn-${color}`,
    );

    const handleClick = () => {
        if (onClick) {
            return onClick();
        }
    };

    const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

    useEffect(() => {
        if (tooltipName && label) {
            setTooltipTarget(`Tooltip-${label.replace(/\s+/g, '-')}`);
        } else if (tooltipName) {
            setTooltipTarget(`Tooltip-${Math.random().toString(36).substr(2, 9)}`);
        }
    }, [label, tooltipName]);

    return (
        <>

            <Button
                type={type}
                className={btnClass}
                disabled={disabled}
                id={tooltipTarget}
                {...props}
                onClick={handleClick}
            >
                {children}
                {label}
                <Spinner size='sm' className={loader ? `mx-2` : `d-none`} />
            </Button>
            {tooltipName && tooltipTarget && (
                <Tooltip
                    placement="top"
                    isOpen={tooltipOpen}
                    target={tooltipTarget}
                    toggle={toggleTooltip}
                >
                    {tooltipName}
                </Tooltip>
            )}
        </>
    );
};

BaseButton.propTypes = baseButtonProps;

BaseButton.defaultProps = {
    type: 'button',
    color: 'primary',
    className: '',
    disabled: false,
    tooltipName: '',
    children: null,
};

export default BaseButton;

