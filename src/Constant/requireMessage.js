export const RequiredField = (field) => {
  return `${field} is required.`;
};

export const PlaceHolderFormat = (fieldName) => {
  return `Enter ${fieldName.toLowerCase()}`;
};

export const isInvalid = (validation, fieldName) => {
  return validation.touched[fieldName] && validation.errors[fieldName];
};
