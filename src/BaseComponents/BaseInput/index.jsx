import React, { useState } from "react";
import { Label, Input, FormFeedback } from "reactstrap";

const BaseInput = ({
  label,
  name,
  type,
  className,
  placeholder,
  handleChange,
  handleBlur,
  value,
  touched,
  ref,
  error,
  step,
  maxLength,
  icon,
  disabled,
  accept,
}) => {
  const [passwordShow, setPasswordShow] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShow(!passwordShow);
  };

  const handleKeyInput = (event) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Tab",
    ];
    if (type === "number" && ["e", "E", "+", "-"].includes(event.key)) {
      event.preventDefault();
    }
    if (type === "number" && event.code === "Space") {
      event.preventDefault();
    }
    if (type === "email" && event.code === "Space") {
      event.preventDefault();
    }
    if (
      type === "number" &&
      !allowedKeys.includes(event.key) &&
      !event.key.match(/^[0-9]$/)
    ) {
      event.preventDefault();
    }
  };

  return (
    <>
      {label && <Label htmlFor={name}>{label}</Label>}
      {type === "file" ? (
        <Input
          name={name}
          type={type}
          className={className ? className : "form-control"}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={disabled}
          ref={ref}
          accept={accept}
          invalid={!!(touched && error)}
        />
      ) : type !== "password" ? (
        <>
          {icon && <div className="input-group-text">{icon}</div>}
          <Input
            name={name}
            type={type}
            className={className ? className : "form-control"}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            value={value || ""}
            onKeyDown={handleKeyInput}
            min={0}
            step={step}
            invalid={!!(touched && error)}
            maxLength={maxLength}
          />
        </>
      ) : (
        <div className="position-relative mb-3 input-wrapper">
          <div className="input-group">
            <div className="input-group-text">{icon}</div>
            <Input
              name={name}
              value={value || ""}
              type={passwordShow ? "text" : "password"}
              className="form-control"
              placeholder={placeholder}
              onChange={handleChange}
              onBlur={handleBlur}
              invalid={!!(touched && error)}
            />
            <div
              className="input-group-text"
              onClick={togglePasswordVisibility}
            >
              {passwordShow ? (
                <i className="fa fa-eye"></i>
              ) : (
                <i className="fa fa-eye-slash"></i>
              )}
            </div>
            {touched && error && (
              <FormFeedback type="invalid" id="baseInput-err">
                {error}
              </FormFeedback>
            )}
          </div>
        </div>
      )}
      {touched && error && <FormFeedback type="invalid">{error}</FormFeedback>}
    </>
  );
};

export default BaseInput;
