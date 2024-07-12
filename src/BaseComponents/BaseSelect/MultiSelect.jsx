import Select from "react-select";
import { FormFeedback, Label } from 'reactstrap';

const MultiSelect = ({
  value,
  onChange,
  options,
  styles,
  touched,
  error,
  name,
  placeholder,
  label,
  handleBlur,
  className,
  isDisabled,
}) => {
  return (
    <>
      <div className="mb-3">
        {label && (
          <Label htmlFor={name} className="form-label">
            {label}
          </Label>
        )}
        <Select
          value={value}
          className={className ? className : "select-border"}
          isMulti={true}
          onChange={onChange}
          options={options}
          styles={styles}
          name={name}
          placeholder={placeholder}
          onBlur={handleBlur}
          isInvalid={!!(touched && error)}
          isDisabled={isDisabled}
        />
        {touched && error ? (
          <FormFeedback className="d-block">{error}</FormFeedback>
        ) : null}
      </div>
    </>
  );
};

export default MultiSelect;
