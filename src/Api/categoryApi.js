import {
  ADDCATEGORYIMAGE,
  DELETECATEGORY,
  LISTOFADDCATEGORY,
  LISTOFCATEGORY,
} from "./apiRoutes";
import { authData } from "./Service";

export const listOfCategory = async (data) => {
  const response = await authData.post(LISTOFCATEGORY, data);
  return response?.data;
};
export const listOfAddCategory = async (data) => {
  const response = await authData.post(LISTOFADDCATEGORY, data);
  return response?.data;
};
export const addCategory = async (data) => {
  const response = await authData.post(ADDCATEGORYIMAGE, data);
  return response?.data;
};
export const deleteCategory = async (data) => {
  const response = await authData.put(DELETECATEGORY,data);
  return response?.data;
};
