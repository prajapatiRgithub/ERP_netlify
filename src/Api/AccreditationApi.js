import { authData } from "./Service";
import { ADDACCREDITATION, DELETEACCREDITATION, EDITACCREDITATION, LISTOFACCREDITATION, VIEWACCREDITATION } from "./apiRoutes";

export const listOfAccreditationApi = async (data) => {
  const response = await authData.post(LISTOFACCREDITATION, data);
  return response?.data;
};
export const addAccreditationApi = async (data) => {
  const response = await authData.post(ADDACCREDITATION, data);
  return response?.data;
};
export const editAccreditationApi = async (id,data) => {
  const response = await authData.put(`${EDITACCREDITATION}${id}`, data);
  return response?.data;
};
export const deleteAccreditationApi = async (id) => {
  const response = await authData.delete(`${DELETEACCREDITATION}${id}`);
  return response?.data;
};
export const viewAccreditationApi = async (id) => {
  const response = await authData.get(`${VIEWACCREDITATION}${id}`);
  return response?.data;
};