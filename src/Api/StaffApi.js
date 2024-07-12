import { ADDSTAFF, DELETESTAFF, EDITSTAFF, LISTOFSTAFF, VIEWSTAFF } from "./apiRoutes";
import { authData } from "./Service";

export const listOfStaffApi = async (data) => {
  const response = await authData.post(LISTOFSTAFF, data);
  return response?.data;
};
export const addStaffApi = async (data) => {
  const response = await authData.post(ADDSTAFF, data);
  return response?.data;
};
export const editStaffApi = async (id,data) => {
  const response = await authData.put(`${EDITSTAFF}${id}`, data);
  return response?.data;
};
export const deleteStaffApi = async (id) => {
  const response = await authData.delete(`${DELETESTAFF}${id}`);
  return response?.data;
};
export const viewStaffApi = async (id,data) => {
  const response = await authData.get(`${VIEWSTAFF}${id}`);
  return response?.data;
};