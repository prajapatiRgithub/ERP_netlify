import { ADDVENDOR, EDITVENDOR, LISTOFVENDOR, VIEWVENDOR } from "./apiRoutes";
import { authData } from "./Service";

export const addVendorApi = async (data) => {
  const response = await authData.post(ADDVENDOR, data);
  return response?.data;
};
export const editVendor = async (id, data) => {
  const response = await authData.put(`${EDITVENDOR}${id}`, data);
  return response?.data;
};
export const listOfVendor = async (data) => {
  const response = await authData.post(LISTOFVENDOR, data);
  return response?.data;
};
export const viewVendor = async (id) => {
  const response = await authData.get(`${VIEWVENDOR}${id}`);
  return response?.data;
};
