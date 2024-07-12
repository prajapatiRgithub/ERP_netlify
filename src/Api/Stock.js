import { ADDSTOCK, DELETESTOCK, EDITSTOCK, LISTOFSTOCK } from "./apiRoutes";
import { authData } from "./Service";

export const addStock = async (data) => {
  const response = await authData.post(ADDSTOCK, data);
  return response?.data;
};
export const listStock = async (data) => {
  const response = await authData.post(LISTOFSTOCK, data);
  return response?.data;
};
export const editStock = async (id, data) => {
  const response = await authData.put(`${EDITSTOCK}${id}`, data);
  return response?.data;
};
export const deleteStock = async (id) => {
  const response = await authData.delete(`${DELETESTOCK}${id}`);
  return response?.data;
};
