export const validationMessages = {
  required: (fieldName) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } is required.`,
  format: (fieldName) => ` ${fieldName} should be in correct format.`,
  passwordLength: (fieldName, minLength) =>
    `${fieldName} must be at least ${minLength} characters.`,
  contactLength: (fieldName, minLength) =>
    `${fieldName} must be ${minLength} digit.`,
  passwordComplexity: (fieldName) =>
    `${fieldName} must be an uppercase lowercase number and special characters.`,
  passwordsMatch: (fieldName) => `${fieldName} must match.`,
  phoneNumber: (fieldName) => `Invalid ${fieldName.toLowerCase()} format.`,
  notSameAsField: (fieldName, comparedField) =>
    `${fieldName} must be different from ${comparedField}.`,
  maxLength: (fieldName, maxLength) =>
    `${fieldName} must be at ${maxLength} characters.`,
  minLength: (fieldName, minLength) =>
    `${fieldName} must be at ${minLength} numbers.`,
  positiveNumber: (fieldName) =>
    `${fieldName} must be positive`,
  url: (field) => `${field} must be a valid URL`,
};

export const InputPlaceHolder = (fieldName) => {
  return `Enter ${fieldName?.toLowerCase()}`;
};

export const SelectPlaceHolder = (fieldName) => {
  return `Select ${fieldName?.toLowerCase()}`;
};

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}(?![^.\s])/;
export const numberRegex = /^\d{10}$/;
export const digitRegex = /^\d*$/;
export const aadharRegex = /^\d{12}$/;
export const zipcodeRegex = /^\d{6}$/;
export const GSTINRegex =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
export const bankNumberRegex = /^\d{8,17}$/;
export const ifscRegex = /^[A-Za-z]{4}\d{7}$/;
export const positiveNumberRegex = /^[+]?([1-9][0-9]*(?:[\.][0-9]*)?|0*\.0*[1-9][0-9]*)(?:[eE][+-][0-9]+)?$/;
