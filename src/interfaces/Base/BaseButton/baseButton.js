import PropTypes from 'prop-types';

const baseButtonProps = {
    type: PropTypes.string,
    label: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    tooltipName: PropTypes.string,
    children: PropTypes.node,
};

export default baseButtonProps;
